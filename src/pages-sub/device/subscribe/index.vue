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

/** 正在订阅的设备ID */
const subscribingId = ref<number | null>(null)

/** 内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

/** 拼接URL参数 */
function buildQueryString(params: Record<string, unknown>) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${String(v)}`)
    .join('&')
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
function handleGoToSubscribe() {
  if (isMpWeixin) {
    uni.navigateToMiniProgram({
      appId: import.meta.env.VITE_APP_VOIP_APPID,
      path: getSubscribeUrl(),
      fail(err) {
        console.error('跳转失败', err)
        toast.show('跳转失败，请稍后重试')
      },
    })
  }
  else {
    toast.show('该平台暂不支持小程序订阅')
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  await batchRequestHandler([onRefreshList()])
}

onShow(() => {
  if (unref(pageLoaded)) {
    onRefreshList()
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
      @refresh="onRefreshList"
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
