<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐列表"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import SimpleTabs from '@/components/common/simple-tabs/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import {
  PACKAGE_DETAIL_PATH,
  PACKAGE_HISTORY_PATH,
  PACKAGE_REFUND_HISTORY_PATH,
} from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { usePackageEmitter } from '@/utils/emit/package'
import { usePackage } from '../hooks/usePackage'
import ActivePackageCard from './components/ActivePackageCard.vue'
import PackageCard from './components/PackageCard.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight }
  = usePage()
const currentStudentStore = useCurrentStudentStore()
const { deviceType } = storeToRefs(currentStudentStore)

/** Tab 状态 */
const currentTab = ref(0)
const tabs = ['生效中', '待生效', '可购买']

/** 生效中/待生效套餐的加载状态 */
const activeLoading = ref(false)
const activeRefreshLoading = ref(false)
const activeListBusy = computed(() => activeLoading.value || activeRefreshLoading.value)

const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: availableList,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IPackage>({
  get: params => getAvailablePackagesApi({ ...params, deviceType: deviceType.value }),
  immediate: false,
  listField: 'packages',
})

const { onPackageRefund, onPackageTransaction } = usePackageEmitter()
const {
  hasPendingRefund,
  pendingPayment,
  purchasedPackageIds,
  axiosGetCheckPendingApi,
  axiosGetPendingPaymentApi,
  axiosGetStudentActivePackageApi,
} = usePackage()

/** 生效中套餐列表 */
const activePackages = ref<Pkg.Query.IStudentActivePackageVo[]>([])
/** 待生效套餐列表 */
const waitingPackages = ref<Pkg.Query.IStudentActivePackageVo[]>([])

const contentStyle = computed(() => getContentHeight('164rpx'))

/** 是否显示待支付订单 */
const hasPendingPayment = computed(() => pendingPayment.value?.hasPending)

/** 生效中套餐是否为空 */
const activeEmpty = computed(
  () => (activePackages.value?.length ?? 0) === 0 && !activeListBusy.value,
)

/** 待生效套餐是否为空 */
const pendingEmpty = computed(
  () => (waitingPackages.value?.length ?? 0) === 0 && !activeListBusy.value,
)

/** 获取生效/待生效套餐 */
async function fetchActivePackages(isRefresh = false) {
  if (isRefresh) {
    activeRefreshLoading.value = true
  }
  else {
    activeLoading.value = true
  }
  try {
    const result = await axiosGetStudentActivePackageApi()
    if (result.code === 0 && result.data) {
      activePackages.value = result.data?.activePackages || []
      waitingPackages.value = result.data?.waitingPackages || []
    }
    return result
  }
  finally {
    activeRefreshLoading.value = false
    activeLoading.value = false
  }
}

/** 刷新生效中/待生效套餐 */
function onRefreshActivePackages() {
  return fetchActivePackages(true)
}

/** 点击待支付通知跳转到历史页面 */
function handlePendingPaymentClick() {
  uni.navigateTo({ url: PACKAGE_HISTORY_PATH })
}

/** 跳转到退款历史页面 */
function handleGoToRefundHistory() {
  uni.navigateTo({ url: PACKAGE_REFUND_HISTORY_PATH })
}

/** 跳转到套餐详情页 */
function handleGoToPackageDetail(id: number) {
  uni.navigateTo({ url: `${PACKAGE_DETAIL_PATH}?id=${id}` })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([
    onRefreshList(),
    fetchActivePackages(),
    axiosGetPendingPaymentApi(),
    axiosGetCheckPendingApi(),
  ])
}

onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([
      fetchActivePackages(),
      axiosGetCheckPendingApi(),
      axiosGetPendingPaymentApi(),
    ])
  }
})

onPackageRefund(() => {
  batchRequestHandler([fetchActivePackages(), axiosGetCheckPendingApi()])
})

onPackageTransaction(() => {
  batchRequestHandler([fetchActivePackages(), axiosGetPendingPaymentApi()])
})
</script>

<template>
  <Page
    title="套餐列表"
    :scroll-y="false"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view flex="~ col" :style="contentStyle">
      <!-- 顶部提示 -->
      <view v-if="hasPendingRefund || hasPendingPayment" p="x-4 t-2" flex="~ col" gap="2">
        <Notice
          v-if="hasPendingRefund"
          type="warning"
          title="当前存在待审核退款申请，点击查看"
          :show-popup="false"
          @click="handleGoToRefundHistory"
        />
        <Notice
          v-if="hasPendingPayment"
          type="warning"
          :show-popup="false"
          title="当前存在待支付订单，点击查看"
          @click="handlePendingPaymentClick"
        />
      </view>

      <!-- Tab 切换 -->
      <SimpleTabs v-model="currentTab" :tabs="tabs" />

      <!-- Tab 内容区域 -->
      <view relative w-full flex-1 overflow-hidden>
        <!-- 生效中 -->
        <RefreshList
          v-if="currentTab === 0"
          loaded
          :loading="activeLoading"
          :refresh-loading="activeRefreshLoading"
          :empty="activeEmpty"
          @refresh="onRefreshActivePackages"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <ActivePackageCard v-for="item in activePackages" :key="item.id" :package="item" />
            <StatusTip v-if="activeEmpty" image="content" />
          </view>
        </RefreshList>

        <!-- 待生效 -->
        <RefreshList
          v-if="currentTab === 1"
          loaded
          :loading="activeLoading"
          :refresh-loading="activeRefreshLoading"
          :empty="pendingEmpty"
          @refresh="onRefreshActivePackages"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <ActivePackageCard v-for="item in waitingPackages" :key="item.id" :package="item" />
            <StatusTip v-if="pendingEmpty" image="content" />
          </view>
        </RefreshList>

        <!-- 可购买 -->
        <RefreshList
          v-if="currentTab === 2"
          :loading="loading"
          :refresh-loading="refreshLoading"
          :loaded="loaded"
          :empty="empty"
          @refresh="onRefreshList"
          @loadmore="onLoadMore"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <PackageCard
              v-for="pkg in availableList"
              :key="pkg.id"
              :package="pkg"
              :is-purchased="purchasedPackageIds.has(pkg.id)"
              @click="handleGoToPackageDetail(pkg.id)"
            />
            <StatusTip v-if="empty" image="content" />
          </view>
        </RefreshList>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view p="x-4 y-3" flex gap="4" border="t gray-100">
      <TButton type="primary" size="large" full flex-1 @click="handlePendingPaymentClick">
        购买历史
      </TButton>
      <TButton type="primary" size="large" full flex-1 @click="handleGoToRefundHistory">
        退费历史
      </TButton>
    </view>
  </Page>
</template>
