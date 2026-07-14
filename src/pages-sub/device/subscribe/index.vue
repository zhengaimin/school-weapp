<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "我的订阅"
  }
}
</route>

<script lang="ts" setup>
import type { Devices } from '@/api/interface/modules/devices'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getDeviceSubscriptionsApi } from '@/api/modules/devices/groups'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { getEnvBaseUrl } from '@/utils'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import SubscriptionItem from './components/SubscriptionItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, onLoginFail, getContentHeight, batchRequestHandler }
  = usePage()
const { loading, refreshLoading, loaded, empty, list, onRefreshList, onLoadMore }
  = useRefresh<Devices.Subscription.ISubscriptionVo>({
    get: getDeviceSubscriptionsApi,
    listField: 'subscribed',
    immediate: false,
  })

const userStore = useUserStore()
const currentStudentStore = useCurrentStudentStore()
const { userInfo } = storeToRefs(userStore)
const { contactInfo } = storeToRefs(currentStudentStore)

interface IDeviceVoipApi {
  requestDeviceVoIP: (options: {
    isGroup: true
    groupId: string
    deviceName?: string
    success?: () => void
    fail?: (error: WechatMiniprogram.GeneralCallbackResult) => void
  }) => void
}

/** 正在订阅的设备ID */
const subscribingId = ref<number | null>(null)
/** 是否正在请求设备组通话提醒授权 */
const requestingVoipPermission = ref(false)
/** 当前会话已检查过的设备组 */
const checkedVoipGroupIds = ref<Set<string>>(new Set())

/** 内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

/** 拼接URL参数 */
function buildQueryString(params: Record<string, unknown>) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

/** 获取授权设置 */
function getAuthSetting() {
  return new Promise<Record<string, boolean | undefined>>((resolve, reject) => {
    uni.getSetting({
      success(res) {
        resolve(res.authSetting as unknown as Record<string, boolean | undefined>)
      },
      fail: reject,
    })
  })
}

/** 打开授权设置页 */
function openAuthSetting() {
  return new Promise<Record<string, boolean | undefined>>((resolve, reject) => {
    uni.openSetting({
      success(res) {
        resolve(res.authSetting as unknown as Record<string, boolean | undefined>)
      },
      fail: reject,
    })
  })
}

/** 主动请求摄像头授权 */
function authorizeCamera() {
  return new Promise<void>((resolve, reject) => {
    uni.authorize({
      scope: 'scope.camera',
      success() {
        resolve()
      },
      fail: reject,
    })
  })
}

/** 确认摄像头授权 */
async function ensureCameraPermission() {
  const authSetting = await getAuthSetting()
  if (authSetting['scope.camera']) {
    return true
  }

  if (authSetting['scope.camera'] === false) {
    const modalResult = await uni.showModal({
      title: '摄像头授权',
      content: '视频通话需要使用摄像头，请在设置中允许摄像头权限。',
      confirmText: '去授权',
    })
    if (!modalResult.confirm) {
      return false
    }

    const latestSetting = await openAuthSetting()
    return latestSetting['scope.camera'] === true
  }

  try {
    await authorizeCamera()
    return true
  } catch (error) {
    console.error('authorizeCamera:', error)
    const modalResult = await uni.showModal({
      title: '摄像头授权',
      content: '视频通话需要使用摄像头，请先允许摄像头权限。',
      confirmText: '去授权',
    })
    if (!modalResult.confirm) {
      return false
    }

    const latestSetting = await openAuthSetting()
    return latestSetting['scope.camera'] === true
  }
}

/** 获取微信设备 VOIP API */
function getDeviceVoipApi() {
  if (!isMpWeixin || typeof wx === 'undefined') {
    return null
  }

  const wxApi = wx as typeof wx & Partial<IDeviceVoipApi>
  return typeof wxApi.requestDeviceVoIP === 'function' ? wxApi as typeof wx & IDeviceVoipApi : null
}

/** 获取微信 VOIP 设备组 ID */
function getDeviceVoipGroupId(device: Devices.Subscription.ISubscriptionVo) {
  return device.groupId || device.code || String(device.id || '')
}

/** 判断设备组是否需要请求通话提醒授权 */
function shouldRequestVoipPermission(device: Devices.Subscription.ISubscriptionVo) {
  const groupId = getDeviceVoipGroupId(device)
  return device.isVoipGroup && device.notificationEnabled !== true && !!groupId && !checkedVoipGroupIds.value.has(groupId)
}

/** 请求设备组语音/视频通话提醒授权 */
function requestDeviceGroupVoipPermission(device: Devices.Subscription.ISubscriptionVo) {
  const deviceVoipApi = getDeviceVoipApi()
  const groupId = getDeviceVoipGroupId(device)

  if (!deviceVoipApi || !groupId) {
    return Promise.resolve(false)
  }

  return new Promise<boolean>((resolve) => {
    deviceVoipApi.requestDeviceVoIP({
      isGroup: true,
      groupId,
      deviceName: device.name,
      success() {
        resolve(true)
      },
      fail(error) {
        console.error('requestDeviceVoIP:', error)
        resolve(false)
      },
    })
  })
}

/** 确认已订阅设备组的语音/视频通话提醒授权 */
async function ensureDeviceGroupVoipPermissions() {
  if (!isMpWeixin || requestingVoipPermission.value) {
    return
  }

  const devices = unref(list).filter(shouldRequestVoipPermission)
  if (!devices.length) {
    return
  }

  requestingVoipPermission.value = true
  let hasFailed = false

  try {
    for (const device of devices) {
      const groupId = getDeviceVoipGroupId(device)
      const granted = await requestDeviceGroupVoipPermission(device)
      checkedVoipGroupIds.value.add(groupId)
      if (!granted) {
        hasFailed = true
      }
    }
  } finally {
    requestingVoipPermission.value = false
  }

  if (hasFailed) {
    toast.show('部分设备组通话提醒未授权')
  }
}

/** 刷新订阅列表并检查通话提醒授权 */
async function refreshSubscriptions() {
  await onRefreshList()
  await ensureDeviceGroupVoipPermissions()
}

/** 获取跳转设备订阅链接 */
function getSubscribeUrl() {
  const { schoolId, schoolName, wechatInfo } = unref(userInfo) || {}
  const { id: userContactUuid } = unref(contactInfo) || {}

  const basePath = '/pages/otherGroupBind/index'
  const params = {
    serverUrl: getEnvBaseUrl(),
    bindingFlag: 'Y',
    openId: wechatInfo?.MiniOpenID || wechatInfo?.miniOpenID,
    depUuid: import.meta.env.VITE_APP_DEP_UUID,
    schoolUuid: schoolId,
    schoolName,
    userContactUuid,
    envVersion: 'release',
  }

  return `${basePath}?${buildQueryString(params)}`
}

/** 跳转到订阅设备页面 */
async function handleGoToSubscribe() {
  if (!isMpWeixin) {
    toast.show('该平台暂不支持小程序订阅')
    return
  }

  const cameraGranted = await ensureCameraPermission()
  if (!cameraGranted) {
    toast.show('请先允许摄像头权限')
    return
  }

  uni.navigateToMiniProgram({
    appId: import.meta.env.VITE_APP_VOIP_APPID,
    path: getSubscribeUrl(),
    fail(err) {
      console.error('跳转失败', err)
      toast.show('跳转失败，请稍后重试')
    },
  })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  await batchRequestHandler([onRefreshList()])
  await ensureDeviceGroupVoipPermissions()
}

onShow(() => {
  if (unref(pageLoaded)) {
    refreshSubscriptions()
  }
})
</script>

<template>
  <Page
    title="我的订阅"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 设备列表区域 -->
    <RefreshList
      :custom-style="contentHeight"
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      @refresh="refreshSubscriptions"
      @loadmore="onLoadMore"
    >
      <view p="x-4 t-2">
        <!-- 列表标题和统计 -->
        <view v-if="list.length" flex="~ items-center justify-between" m="b-4">
          <view text="lg gray-900" font="semibold">
            已订阅设备
          </view>
        </view>

        <!-- 设备列表 -->
        <view flex="~ col" gap="3">
          <SubscriptionItem
            v-for="item in list"
            :key="item.id"
            :device="item"
            :subscribing="subscribingId === item.id"
          />
        </view>
      </view>
    </RefreshList>

    <!-- 底部订阅按钮 -->
    <view p="4">
      <TButton type="primary" size="large" full @click="handleGoToSubscribe">
        订阅/取消设备组
      </TButton>
    </view>
  </Page>
</template>
