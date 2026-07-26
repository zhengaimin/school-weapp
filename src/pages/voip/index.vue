<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "VOIP 通话",
    "disableScroll": true
  }
}
</route>

<script lang="ts" setup>
import type {
  IWmpfVoipInitByCallerParams,
  TWmpfVoipBusinessType,
  TWmpfVoipCameraStatus,
  TWmpfVoipMiniProgramState,
  TWmpfVoipRoomType,
} from '@/utils/voip'
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { currRoute } from '@/utils'
import { isMpWeixin } from '@/utils/platform'
import {
  clearVoipSession,
  CLOSE_AFTER_CALL_MS,
  ensureVoipRuntimeGuards,
  forceHangUpActiveVoip,
  guardVoipInitResult,
  initWmpfVoipByCaller,
  isVoipSessionCurrent,
  markVoipSessionActive,
  notifyAppVoipPageEvent,
  redirectToWmpfVoipCallPage,
  scheduleCloseVoipMiniProgram,
  VOIP_PAGE_VERSION,
  WMPF_VOIP_DEVICE_SN,
  WMPF_VOIP_LISTENER_OPEN_ID,
} from '@/utils/voip'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

/** 当前联调统一使用体验版，接听方打开体验版小程序 */
const VOIP_MINIPROGRAM_STATE: TWmpfVoipMiniProgramState = 'trial'
const userStore = useUserStore()

/** voip 页 url 参数：sn / openid / name / roomType / timeLimit / callSessionId */
interface IVoipRouteQuery {
  sn?: string
  openid?: string
  name?: string
  roomType?: string
  /** 宿主 App 创建的无敏感计费会话 ID */
  callSessionId?: string
  /** 宿主 App 下发的单通最大通话秒数 */
  timeLimit?: string
}

/** 是否正在发起通话 */
const isSubmitting = ref(false)
/** 通话参数是否已触发过一次 */
const hasStarted = ref(false)
/** 错误信息（页面固定错误区展示） */
const errorMessage = ref('')
/** 错误补充详情（errCode / 原始返回等） */
const errorDetail = ref('')
/** 成功后的房间号 */
const roomId = ref('')
/** 拨打方 id（设备 SN） */
const callerId = ref('')
/** 接听方 id（openId） */
const listenerId = ref('')
/** 接听方名称 */
const listenerName = ref('')
/** 通话类型 */
const roomType = ref<TWmpfVoipRoomType>('voice')
/** 业务类型 */
const businessType = ref<TWmpfVoipBusinessType>(1)
/** 接听方点击通知时打开的小程序版本（固定体验版） */
const miniprogramState = ref<TWmpfVoipMiniProgramState>(VOIP_MINIPROGRAM_STATE)
/** 通知打开小程序时附带的 query */
const customQuery = ref('')
/** 宿主 App 创建的无敏感计费会话 ID，仅透传 Android 回传诊断 */
const appCallSessionId = ref('')
/** 最大通话时长 */
const timeLimit = ref<number | undefined>()
/** 拨打方摄像头状态 */
const callerCameraStatus = ref<TWmpfVoipCameraStatus | undefined>()
/** 接听方摄像头状态 */
const listenerCameraStatus = ref<TWmpfVoipCameraStatus | undefined>()
/** 是否正跳转插件通话页（redirectTo 会销毁本页，此时勿在 onUnload 挂断） */
let isNavigatingToCallPage = false
/** 页面 onLoad 进入时间（毫秒时间戳），用于量化发起页阶段耗时。 */
let voipPageLoadedAtMs = 0

/**
 * 页面销毁兜底挂断（非跳转插件页场景）。
 * 跳转插件页后：模块级 deviceHangup / onVoipEvent / onAppHide 继续生效，勿 unbind。
 */
function hangUpOnPageUnload() {
  if (isNavigatingToCallPage) {
    return
  }
  // 启动窗口里当前页会因为 redirectTo 或插件接管发生卸载；未进入稳定通话阶段前不要误挂断。
  forceHangUpActiveVoip('pageUnload')
}

/**
 * 把未知错误序列化成可读文本。
 * @param error 异常或插件返回
 */
function stringifyErrorPayload(error: unknown) {
  if (error == null) {
    return ''
  }
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    const extra = error as Error & { errCode?: number | string, errMsg?: string }
    const parts = [error.message || extra.errMsg || '']
    if (extra.errCode != null && extra.errCode !== '') {
      parts.unshift(`errCode=${extra.errCode}`)
    }
    try {
      const json = JSON.stringify(error, Object.getOwnPropertyNames(error))
      if (json && json !== '{}') {
        parts.push(json)
      }
    } catch {
      // ignore
    }
    return parts.filter(Boolean).join('\n')
  }
  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return String(error)
  }
}

/**
 * 写入页面错误区。
 * @param message 主错误文案
 * @param detail 补充详情
 */
function setPageError(message: string, detail?: unknown) {
  errorMessage.value = message || '未知错误'
  const detailText = stringifyErrorPayload(detail)
  errorDetail.value = detailText && detailText !== message ? detailText : ''
}

/**
 * 建房失败：展示错误后立即关闭小程序。
 * @param message 主错误文案
 * @param detail 补充详情
 */
function failAndCloseMiniProgram(message: string, detail?: unknown) {
  setPageError(message, detail)
  notifyAppVoipPageEvent('create.fail', false, appCallSessionId.value)
  console.error('voip create room failed:', message, detail)
  // 建房失败稍等展示错误再关；仍通知 App 关 WMPF
  scheduleCloseVoipMiniProgram(`create_fail:${message}`, CLOSE_AFTER_CALL_MS)
}

/**
 * 从当前路由 url 取参数（sn / openid / name / roomType / callSessionId）并写入页面状态。
 * url 参数缺失时回落到环境变量，保证无参进入仍可建房。
 */
function acceptParams() {
  const { query } = currRoute()
  const routeQuery = (query || {}) as IVoipRouteQuery

  // sn → 主叫（设备 SN），缺失回落环境变量
  callerId.value = (routeQuery.sn && routeQuery.sn.trim()) || WMPF_VOIP_DEVICE_SN
  // openid → 接听方，缺失依次回落环境变量 / 当前登录用户 openId
  if (routeQuery.openid && routeQuery.openid.trim()) {
    listenerId.value = routeQuery.openid.trim()
  } else {
    const wechatInfo = userStore.userInfo?.wechatInfo
    listenerId.value = WMPF_VOIP_LISTENER_OPEN_ID || wechatInfo?.MiniOpenID || wechatInfo?.miniOpenID || ''
  }
  // name → 接听方名称
  listenerName.value = (routeQuery.name && routeQuery.name.trim()) || ''
  // roomType → 通话类型
  const roomTypeValue = (routeQuery.roomType && routeQuery.roomType.trim()) || ''
  if (roomTypeValue === 'video' || roomTypeValue === 'voice') {
    roomType.value = roomTypeValue
  }
  // 该 ID 由宿主 App 生成，只用于让 Android 将结束事件准确写回同一条本地计费记录。
  appCallSessionId.value = (routeQuery.callSessionId && routeQuery.callSessionId.trim()) || ''
  const timeLimitSec = Number(routeQuery.timeLimit)
  timeLimit.value = Number.isFinite(timeLimitSec) && timeLimitSec > 0
    ? Math.floor(timeLimitSec)
    : undefined
  // 联调阶段固定体验版
  miniprogramState.value = VOIP_MINIPROGRAM_STATE
}

/**
 * 组装插件发起通话参数。
 */
function buildVoipInitParams() {
  if (!callerId.value || !listenerId.value) {
    return null
  }

  const params: IWmpfVoipInitByCallerParams = {
    roomType: roomType.value,
    caller: {
      id: callerId.value,
    },
    listener: {
      id: listenerId.value,
    },
    businessType: businessType.value,
    miniprogramState: miniprogramState.value,
  }

  if (listenerName.value) {
    params.listener.name = listenerName.value
  }
  if (callerCameraStatus.value !== undefined) {
    params.caller.cameraStatus = callerCameraStatus.value
  }
  if (listenerCameraStatus.value !== undefined) {
    params.listener.cameraStatus = listenerCameraStatus.value
  }
  if (customQuery.value) {
    params.customQuery = customQuery.value
  }
  if (timeLimit.value !== undefined) {
    params.timeLimit = timeLimit.value
  }

  return params
}

/**
 * 发起 VOIP 通话。
 */
async function startVoipCall() {
  if (!isMpWeixin) {
    failAndCloseMiniProgram('当前仅支持微信小程序环境')
    return
  }

  if (isSubmitting.value || hasStarted.value) {
    return
  }

  const params = buildVoipInitParams()
  if (!params) {
    failAndCloseMiniProgram('缺少拨打方或接听方参数', {
      callerId: callerId.value,
      listenerId: listenerId.value,
    })
    return
  }

  /** 发起页 onLoad 至开始建房的本地耗时。 */
  const elapsedFromPageLoadMs = voipPageLoadedAtMs > 0
    ? Math.max(0, Date.now() - voipPageLoadedAtMs)
    : -1
  console.log('voip startVoipCall begin:', {
    elapsedFromPageLoadMs,
    hasAppCallSessionId: Boolean(appCallSessionId.value),
    roomType: roomType.value,
  })

  isSubmitting.value = true
  errorMessage.value = ''
  errorDetail.value = ''
  roomId.value = ''
  hasStarted.value = true
  // 先建立本地会话，确保调用插件前的首条诊断能与宿主本次拨号关联。
  const voipSessionId = markVoipSessionActive(undefined, appCallSessionId.value)
  notifyAppVoipPageEvent('initByCaller.start', false, appCallSessionId.value)

  try {
    /** initByCaller 开始时间，用于量化建房阶段耗时。 */
    const initStartedAtMs = Date.now()
    const result = await initWmpfVoipByCaller(params, appCallSessionId.value)
    const initElapsedMs = Math.max(0, Date.now() - initStartedAtMs)
    console.log('voip initByCaller resolved:', {
      initElapsedMs,
      isSuccess: result.isSuccess,
      hasRoomId: Boolean(result.roomId || result.groupId),
      errCode: result.errCode ?? '',
    })
    if (!guardVoipInitResult(voipSessionId, result)) {
      notifyAppVoipPageEvent('initByCaller.stale', false, appCallSessionId.value)
      return
    }
    if (!result.isSuccess) {
      hasStarted.value = false
      clearVoipSession()
      notifyAppVoipPageEvent('initByCaller.fail', false, appCallSessionId.value)
      const main = [
        result.errCode != null ? `errCode=${result.errCode}` : '',
        result.errMsg || '发起通话失败',
      ].filter(Boolean).join(' ')
      failAndCloseMiniProgram(main, result)
      return
    }

    // initByCaller 只建房并推送提醒；设备主叫入房需进入插件通话页
    roomId.value = result.roomId || result.groupId || ''
    markVoipSessionActive(roomId.value)
    notifyAppVoipPageEvent('initByCaller.success', false, appCallSessionId.value)
    isNavigatingToCallPage = true
    notifyAppVoipPageEvent('redirectToCallPage.start', true, appCallSessionId.value)
    /** redirectTo 插件通话页开始时间，用于量化切页耗时。 */
    const redirectStartedAtMs = Date.now()
    const redirectSucceeded = await redirectToWmpfVoipCallPage()
    console.log('voip redirectToCallPage resolved:', {
      redirectElapsedMs: Math.max(0, Date.now() - redirectStartedAtMs),
      redirectSucceeded,
      hasRoomId: Boolean(roomId.value),
    })
    if (!redirectSucceeded) {
      isNavigatingToCallPage = false
      forceHangUpActiveVoip('redirect_fail')
      clearVoipSession()
      failAndCloseMiniProgram('通话房间已创建，但跳转插件通话页失败', {
        roomId: roomId.value,
      })
    }
  } catch (error) {
    if (!isVoipSessionCurrent(voipSessionId)) {
      notifyAppVoipPageEvent('initByCaller.staleReject', false, appCallSessionId.value)
      return
    }
    hasStarted.value = false
    clearVoipSession()
    notifyAppVoipPageEvent('initByCaller.fail', false, appCallSessionId.value)
    const main = error instanceof Error
      ? (error.message || '发起通话失败')
      : '发起通话失败'
    failAndCloseMiniProgram(main, error)
  } finally {
    isSubmitting.value = false
  }
}

onLoad(() => {
  voipPageLoadedAtMs = Date.now()
  console.log('voip page onLoad:', {
    version: VOIP_PAGE_VERSION,
  })
  // 模块级守卫：deviceHangup / onVoipEvent / onAppHide（redirectTo 插件页后仍有效）
  ensureVoipRuntimeGuards()
  acceptParams()
  notifyAppVoipPageEvent('onLoad', isNavigatingToCallPage, appCallSessionId.value)
  startVoipCall()
})
onShow(() => {
  notifyAppVoipPageEvent('onShow', isNavigatingToCallPage, appCallSessionId.value)
})
onHide(() => {
  notifyAppVoipPageEvent('onHide', isNavigatingToCallPage, appCallSessionId.value, {
    preferSync: true,
  })
})
onUnload(() => {
  notifyAppVoipPageEvent('onUnload', isNavigatingToCallPage, appCallSessionId.value, {
    preferSync: true,
  })
  hangUpOnPageUnload()
})
</script>

<template>
  <view class="voip-loading-page">
    <view class="voip-loading-page__content">
      <view class="voip-loading-page__spinner" />
      <text class="voip-loading-page__text">
        loading
      </text>
    </view>

    <text class="voip-loading-page__version" user-select selectable>
      version {{ VOIP_PAGE_VERSION }}
    </text>
  </view>
</template>

<style scoped lang="scss">
.voip-loading-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48rpx 32rpx 96rpx;
  background: linear-gradient(180deg, #eff5ff 0%, #ffffff 100%);

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24rpx;
  }

  &__spinner {
    width: 72rpx;
    height: 72rpx;
    border: 6rpx solid rgba(50, 105, 221, 0.16);
    border-top-color: #3269dd;
    border-radius: 50%;
    animation: voip-loading-spin 0.8s linear infinite;
  }

  &__text {
    font-size: 28rpx;
    line-height: 1.4;
    color: #3269dd;
    font-weight: 500;
  }

  &__version {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    left: 32rpx;
    font-size: 22rpx;
    line-height: 1.4;
    color: #9ca3af;
    text-align: center;
  }
}

@keyframes voip-loading-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
