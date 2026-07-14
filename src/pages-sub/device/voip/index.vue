<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "VOIP 通话"
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
import { computed, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Loading from '@/components/common/loading/index.vue'
import { LAUNCH_PATH } from '@/constant/router'
import { useUserStore } from '@/store/user'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import {
  forceHangUpWmpfVoip,
  initWmpfVoipByCaller,
  redirectToWmpfVoipCallPage,
  WMPF_VOIP_DEVICE_SN,
  WMPF_VOIP_LISTENER_OPEN_ID,
} from '@/utils/voip'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

type TVoipQuery = Record<string, unknown>

const NESTED_QUERY_KEYS = ['query', 'q', 'params', 'param', 'data', 'extraData', 'scene']
const userStore = useUserStore()

/** 是否正在发起通话 */
const isSubmitting = ref(false)
/** 通话参数是否已触发过一次 */
const hasStarted = ref(false)
/** 错误信息 */
const errorMessage = ref('')
/** 呼叫序号 */
const callSeq = ref('')
/** 拨打方 id */
const callerId = ref('')
/** 接听方 id */
const listenerId = ref('')
/** 拨打方名称 */
const callerName = ref('')
/** 接听方名称 */
const listenerName = ref('')
/** 通话类型 */
const roomType = ref<TWmpfVoipRoomType>('voice')
/** 业务类型 */
const businessType = ref<TWmpfVoipBusinessType>(1)
/** 通话票据 */
const voipToken = ref('')
/** 接听方点击通知时打开的小程序版本 */
const miniprogramState = ref<TWmpfVoipMiniProgramState>(getDefaultMiniProgramState())
/** 通知打开小程序时附带的 query */
const customQuery = ref('')
/** 最大通话时长 */
const timeLimit = ref<number | undefined>()
/** 拨打方摄像头状态 */
const callerCameraStatus = ref<TWmpfVoipCameraStatus | undefined>()
/** 接听方摄像头状态 */
const listenerCameraStatus = ref<TWmpfVoipCameraStatus | undefined>()

/** 当前状态标题 */
const statusTitle = computed(() => {
  if (errorMessage.value) {
    return '通话发起失败'
  }
  if (isSubmitting.value) {
    return '正在发起通话'
  }
  if (hasStarted.value) {
    return '已创建通话房间'
  }
  return '等待发起通话'
})

/** 当前状态说明 */
const statusDesc = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }
  if (isSubmitting.value) {
    return '正在创建通话房间并跳转微信通话页'
  }
  if (hasStarted.value) {
    return '通话流程已进入微信插件页面'
  }
  return '请确认话机、接听方和通话参数后再发起'
})

/** 通话摘要 */
const summaryRows = computed(() => {
  return [
    { label: '拨打方', value: callerName.value || callerId.value },
    { label: '接听方', value: listenerName.value || listenerId.value },
    { label: '通话类型', value: roomType.value === 'video' ? '视频' : '语音' },
    { label: '业务类型', value: businessType.value === 1 ? '设备呼叫手机微信' : '手机微信呼叫设备' },
    { label: '呼叫序号', value: callSeq.value },
  ].filter(item => item.value)
})

/**
 * 获取默认的小程序版本。
 * 开发/体验环境分别对应 developer / trial，正式环境对应 formal。
 */
function getDefaultMiniProgramState(): TWmpfVoipMiniProgramState {
  if (!isMpWeixin) {
    return 'formal'
  }

  try {
    const { envVersion } = uni.getAccountInfoSync().miniProgram
    if (envVersion === 'develop') {
      return 'developer'
    }
    if (envVersion === 'trial') {
      return 'trial'
    }
  } catch (error) {
    console.error('getDefaultMiniProgramState:', error)
  }

  return 'formal'
}

/**
 * 从路由参数里取值。
 * @param query 路由参数
 * @param keys 候选 key
 */
function getQueryValue(query: TVoipQuery, keys: string[]) {
  for (const key of keys) {
    const rawValue = query[key]
    if (typeof rawValue === 'string') {
      const value = rawValue.trim()
      if (value) {
        return value
      }
    } else if (Array.isArray(rawValue)) {
      const firstValue = rawValue[0]
      if (typeof firstValue === 'string') {
        const value = firstValue.trim()
        if (value) {
          return value
        }
      }
    }
  }

  return ''
}

/**
 * 解码路由参数值。
 * @param value 原始参数值
 */
function decodeQueryValue(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '))
  } catch (error) {
    console.error('decodeQueryValue:', error)
    return value
  }
}

/**
 * 解析字符串格式的 query。
 * @param value 原始 query 字符串
 */
function parseQueryString(value: string): TVoipQuery {
  const decodedValue = decodeQueryValue(value.trim())
  const queryText = decodedValue.includes('?') ? decodedValue.split('?').pop() || '' : decodedValue
  if (!queryText.includes('=')) {
    return {}
  }

  return queryText.split('&').reduce<TVoipQuery>((result, item) => {
    const [rawKey, ...rawValueList] = item.split('=')
    const key = decodeQueryValue(rawKey || '').trim()
    const rawValue = rawValueList.join('=')
    const value = decodeQueryValue(rawValue || '').trim()
    if (key && value) {
      result[key] = value
    }
    return result
  }, {})
}

/**
 * 解析 JSON 格式的 query。
 * @param value 原始 query 字符串
 */
function parseJsonQuery(value: string): TVoipQuery {
  try {
    const data = JSON.parse(decodeQueryValue(value.trim()))
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as TVoipQuery
    }
  } catch {
    return {}
  }

  return {}
}

/**
 * 合并外层 query 和嵌套 query。
 * @param query 路由参数
 */
function normalizeQuery(query: TVoipQuery): TVoipQuery {
  const result: TVoipQuery = { ...query }
  for (const key of NESTED_QUERY_KEYS) {
    const value = getQueryValue(query, [key])
    if (!value) {
      continue
    }

    const parsedQuery = {
      ...parseQueryString(value),
      ...parseJsonQuery(value),
    }
    Object.entries(parsedQuery).forEach(([parsedKey, parsedValue]) => {
      if (result[parsedKey] === undefined || result[parsedKey] === '') {
        result[parsedKey] = parsedValue
      }
    })
  }

  return result
}

/**
 * 获取当前登录用户微信 openId。
 */
function getCurrentUserOpenId() {
  const wechatInfo = userStore.userInfo?.wechatInfo
  return wechatInfo?.MiniOpenID || wechatInfo?.miniOpenID || ''
}

/**
 * 将路由参数解析到页面状态。
 * @param query 路由参数
 */
function acceptParams(query: TVoipQuery) {
  const routeQuery = normalizeQuery(query)
  callSeq.value = getQueryValue(routeQuery, ['callSeq', 'call_seq'])
  callerId.value = getQueryValue(routeQuery, [
    'callerId',
    'caller_id',
    'caller',
    'callerOpenId',
    'caller_open_id',
    'from',
    'fromId',
    'from_id',
    'fromOpenId',
    'from_open_id',
    'sn',
    'SN',
    'deviceSn',
    'device_sn',
    'deviceSN',
    'deviceId',
    'device_id',
    'deviceNo',
    'device_no',
    'deviceCode',
    'device_code',
    'groupCode',
    'group_code',
    'code',
  ]) || WMPF_VOIP_DEVICE_SN
  listenerId.value = getQueryValue(routeQuery, [
    'listenerId',
    'listener_id',
    'listener',
    'listenerOpenId',
    'listener_open_id',
    'openId',
    'openid',
    'OpenID',
    'MiniOpenID',
    'miniOpenID',
    'mini_open_id',
    'wxOpenId',
    'wx_open_id',
    'calleeId',
    'callee_id',
    'callee',
    'receiverId',
    'receiver_id',
    'receiver',
    'to',
    'toId',
    'to_id',
    'toOpenId',
    'to_open_id',
  ]) || WMPF_VOIP_LISTENER_OPEN_ID || getCurrentUserOpenId()
  callerName.value = getQueryValue(routeQuery, ['callerName', 'caller_name', 'deviceName', 'device_name'])
  listenerName.value = getQueryValue(routeQuery, ['listenerName', 'listener_name', 'nickName', 'nickname'])
  const roomTypeValue = getQueryValue(routeQuery, ['roomType', 'room_type'])
  if (roomTypeValue === 'video' || roomTypeValue === 'voice') {
    roomType.value = roomTypeValue
  }
  const businessTypeValue = Number(getQueryValue(routeQuery, ['businessType', 'business_type']))
  if (businessTypeValue === 1 || businessTypeValue === 2) {
    businessType.value = businessTypeValue
  }
  voipToken.value = getQueryValue(routeQuery, ['voipToken', 'voip_token'])
  const miniProgramStateValue = getQueryValue(routeQuery, ['miniprogramState', 'miniProgramState', 'miniprogram_state'])
  if (miniProgramStateValue === 'formal' || miniProgramStateValue === 'trial' || miniProgramStateValue === 'developer') {
    miniprogramState.value = miniProgramStateValue
  }
  customQuery.value = getQueryValue(routeQuery, ['customQuery', 'custom_query'])
  const timeLimitValue = Number(getQueryValue(routeQuery, ['timeLimit', 'time_limit']))
  if (Number.isFinite(timeLimitValue) && timeLimitValue > 0) {
    timeLimit.value = timeLimitValue
  }
  const callerCameraStatusValue = Number(getQueryValue(routeQuery, ['callerCameraStatus', 'caller_camera_status']))
  if (callerCameraStatusValue === 0 || callerCameraStatusValue === 1) {
    callerCameraStatus.value = callerCameraStatusValue
  }
  const listenerCameraStatusValue = Number(getQueryValue(routeQuery, ['listenerCameraStatus', 'listener_camera_status']))
  if (listenerCameraStatusValue === 0 || listenerCameraStatusValue === 1) {
    listenerCameraStatus.value = listenerCameraStatusValue
  }
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

  if (callerName.value) {
    params.caller.name = callerName.value
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
  if (voipToken.value) {
    params.voipToken = voipToken.value
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
    errorMessage.value = '当前仅支持微信小程序环境'
    return
  }

  if (isSubmitting.value || hasStarted.value) {
    return
  }

  const params = buildVoipInitParams()
  if (!params) {
    errorMessage.value = '缺少拨打方或接听方参数'
    toast.show(errorMessage.value)
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  hasStarted.value = true

  try {
    const result = await initWmpfVoipByCaller(params)
    if (!result.isSuccess) {
      hasStarted.value = false
      errorMessage.value = result.errMsg || '发起通话失败'
      toast.show(errorMessage.value)
      return
    }

    const redirected = redirectToWmpfVoipCallPage()
    if (!redirected) {
      forceHangUpWmpfVoip(result.roomId)
      hasStarted.value = false
      errorMessage.value = '通话已创建，但无法进入插件通话页'
      toast.show(errorMessage.value)
    }
  } catch (error) {
    hasStarted.value = false
    errorMessage.value = error instanceof Error ? error.message : '发起通话失败'
    toast.show(errorMessage.value)
  } finally {
    isSubmitting.value = false
  }
}

/**
 * 重新发起通话。
 */
function handleRetry() {
  if (isSubmitting.value) {
    return
  }
  startVoipCall()
}

/**
 * 关闭当前页面。
 */
function handleBack() {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
    return
  }

  uni.reLaunch({
    url: LAUNCH_PATH,
  })
}

onLoad((query) => {
  acceptParams(query as TVoipQuery)
  startVoipCall()
})
</script>

<template>
  <view class="voip-call-page" flex="~ col items-center justify-center">
    <view class="voip-call-card" w="full" max-w="640rpx" bg="white" border="rounded-2xl" p="6">
      <view flex="~ col items-center" text="center">
        <view
          class="status-icon"
          w="16"
          h="16"
          border="rounded-full"
          flex="~ items-center justify-center"
          m="b-4"
          :class="{
            'status-icon--loading': isSubmitting,
            'status-icon--error': errorMessage,
            'status-icon--idle': !isSubmitting && !errorMessage,
          }"
        >
          <Loading v-if="isSubmitting" loading-size="72rpx" loading-color="#3269dd" />
          <text v-else-if="errorMessage" text="3xl red-500" font="bold">
            !
          </text>
          <text v-else text="sm gray-500" font="semibold">
            VOIP
          </text>
        </view>

        <text text="lg gray-900" font="semibold">
          {{ statusTitle }}
        </text>
        <text text="sm gray-500" m="t-2" style="line-height: 1.6">
          {{ statusDesc }}
        </text>
      </view>

      <view v-if="summaryRows.length" m="t-6" p="4" bg="gray-50" border="rounded-xl">
        <view v-for="item in summaryRows" :key="item.label" class="summary-row" flex="~ items-start justify-between">
          <text text="xs gray-400" m="r-4">
            {{ item.label }}
          </text>
          <text text="xs gray-700" text-right style="max-width: 70%">
            {{ item.value }}
          </text>
        </view>
      </view>

      <view v-if="errorMessage" m="t-6" flex="~ col gap-3">
        <TButton type="primary" size="large" full :loading="isSubmitting" @click="handleRetry">
          重新发起
        </TButton>
        <TButton type="default" size="large" full @click="handleBack">
          返回
        </TButton>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.voip-call-page {
  min-height: 100vh;
  padding: 32rpx;
  background: #f5f7fb;
  box-sizing: border-box;
}

.voip-call-card {
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08);
}

.status-icon {
  &--loading {
    background: rgba(50, 105, 221, 0.1);
  }

  &--error {
    background: #fef2f2;
  }

  &--idle {
    background: #eff6ff;
  }
}

.summary-row + .summary-row {
  margin-top: 12rpx;
}
</style>
