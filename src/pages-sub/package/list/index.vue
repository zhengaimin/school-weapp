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
import type { ActivePackage, AvailablePackage, PackageListStatusTab } from './types'
import { computed, ref, unref } from 'vue'
import { getStudentPackagesApi } from '@/api/modules/package'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import { PACKAGE_BUY_STATUS } from '@/constant/modules'
import {
  PACKAGE_DETAIL_PATH,
  PACKAGE_HISTORY_PATH,
  PACKAGE_HISTORY_RESULT_PATH,
  PACKAGE_REFUND_HISTORY_PATH,
} from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { usePackageEmitter } from '@/utils/emit/package'
import { usePackage } from '../hooks/usePackage'
import ActivePackageCard from './components/ActivePackageCard.vue'
import PackageCard from './components/PackageCard.vue'
import PackageTabs from './components/PackageTabs.vue'
import { STATUS_OPTIONS, STATUS_TAB } from './constants'
import { useAvailablePackages } from './hooks/useAvailablePackages'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight }
  = usePage()
const { onPackageRefund, onPackageTransaction } = usePackageEmitter()
const {
  hasPendingRefund,
  pendingPayment,
  axiosGetCheckPendingApi,
  axiosGetPendingPaymentApi,
} = usePackage()
const {
  loading,
  refreshLoading,
  loaded,
  displayEmpty: availableEmpty,
  displayList: availableList,
  onRefreshList,
  onLoadMore,
} = useAvailablePackages()

/** 生效中套餐的加载状态 */
const activeLoading = ref(false)
const activeRefreshLoading = ref(false)
const activeTabIndex = ref(0)
// 状态 Tab 样式风格: 'segmented' | 'pill' | 'tag' | 'underline'
const tabVariant = ref<'segmented' | 'pill' | 'tag' | 'underline'>('segmented')
/** 生效中套餐列表 */
const activePackages = ref<ActivePackage[]>([])
const activePage = ref(1)
const activeLoaded = ref(false)

const activeListBusy = computed(() => activeLoading.value || activeRefreshLoading.value)
const tabOptions = computed(() => STATUS_OPTIONS)
const purchasedPackageIds = computed(
  () => new Set(activePackages.value.map(item => item.packageId)),
)
const currentStatus = computed<PackageListStatusTab>(() => {
  return STATUS_OPTIONS[activeTabIndex.value]?.value ?? STATUS_TAB.AVAILABLE
})
/** 内容区域高度：扣除底部按钮区域 padding(24rpx * 2) + 按钮(44px ≈ 88rpx) + 顶部边框(2rpx) ≈ 140rpx */
const contentStyle = computed(() => getContentHeight('140rpx'))
/** 是否显示待支付订单 */
const hasPendingPayment = computed(() => pendingPayment.value?.hasPending)
/** 生效中套餐是否为空 */
const activeEmpty = computed(
  () => (activePackages.value?.length ?? 0) === 0 && !activeListBusy.value,
)
/** 获取生效中套餐 */
async function fetchActivePackages(isRefresh = false) {
  if (isRefresh) {
    activeRefreshLoading.value = true
  } else {
    activeLoading.value = true
  }
  try {
    const activeResult = await getStudentPackagesApi({
      page: 1,
      pageSize: 20,
      status: PACKAGE_BUY_STATUS.ACTIVE,
    })
    if (activeResult.code === 0 && activeResult.data) {
      activePackages.value = activeResult.data.packages || []
      activePage.value = 1
      activeLoaded.value = activePackages.value.length >= activeResult.data.total
    }
    return activeResult
  } finally {
    activeRefreshLoading.value = false
    activeLoading.value = false
  }
}

/** 加载更多生效中套餐 */
async function handleLoadMoreActivePackages() {
  if (activeLoaded.value || activeListBusy.value) return

  activeLoading.value = true
  const page = activePage.value + 1
  try {
    const result = await getStudentPackagesApi({
      page,
      pageSize: 20,
      status: PACKAGE_BUY_STATUS.ACTIVE,
    })
    if (result.code !== 0) return result

    const list = result.data?.packages || []
    activePackages.value.push(...list)
    activePage.value = page
    activeLoaded.value = activePackages.value.length >= (result.data?.total ?? 0)
    return result
  } finally {
    activeLoading.value = false
  }
}

/** 刷新生效中套餐 */
function handleRefreshActivePackages() {
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
function handleGoToPackageDetail(pkg: AvailablePackage) {
  uni.navigateTo({
    url: `${PACKAGE_DETAIL_PATH}?id=${pkg.id}&type=available&packageKind=${pkg.packageKind}`,
  })
}
/** 跳转到套餐购买结果页 */
function handleGoToPackageResult(orderNo: string) {
  uni.navigateTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?type=purchase&orderNo=${orderNo}` })
}
/** Tab 切换处理：切换到对应 Tab 时刷新对应列表接口 */
function handleTabChange(index: number) {
  const status = STATUS_OPTIONS[index]?.value ?? STATUS_TAB.AVAILABLE
  if (status === STATUS_TAB.ACTIVE) {
    // 生效中列表可能因购买/退费变化，切换时拉取最新数据
    fetchActivePackages(false)
  } else {
    // 可购买列表仅在登录成功时加载，切换时确保展示最新套餐
    onRefreshList()
  }
}
/** 状态 Tab 变化处理 */
function handleActiveTabChange(index: number) {
  activeTabIndex.value = index
}
/** 可购买列表下拉刷新 */
function handleRefreshAvailablePackages() {
  return onRefreshList()
}
/** 可购买列表加载更多 */
function handleLoadMoreAvailablePackages() {
  return onLoadMore()
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([
    onRefreshList(),
    fetchActivePackages(false),
    axiosGetPendingPaymentApi(null),
    axiosGetCheckPendingApi(),
  ])
}
/** 页面显示时刷新生效数据 */
onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([
      fetchActivePackages(false),
      axiosGetCheckPendingApi(),
      axiosGetPendingPaymentApi(null),
    ])
  }
})
/** 监听退费事件后刷新数据 */
onPackageRefund(() => {
  batchRequestHandler([
    fetchActivePackages(false),
    axiosGetCheckPendingApi(),
  ])
})
/** 监听交易事件后刷新数据 */
onPackageTransaction(() => {
  batchRequestHandler([
    fetchActivePackages(false),
    axiosGetPendingPaymentApi(null),
  ])
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

      <!-- 状态 Tab -->
      <PackageTabs
        :tabs="tabOptions"
        :active-tab="activeTabIndex"
        :variant="tabVariant"
        @update:active-tab="handleActiveTabChange"
        @tab-change="handleTabChange"
      />

      <!-- 内容区域 -->
      <view relative w-full flex-1 overflow-hidden>
        <!-- 生效中 -->
        <RefreshList
          v-if="currentStatus === STATUS_TAB.ACTIVE"
          :loaded="activeLoaded"
          :loading="activeLoading"
          :refresh-loading="activeRefreshLoading"
          :empty="activeEmpty"
          @refresh="handleRefreshActivePackages"
          @loadmore="handleLoadMoreActivePackages"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <ActivePackageCard
              v-for="item in activePackages"
              :key="item.id"
              :package="item"
              @click="handleGoToPackageResult"
            />
            <StatusTip v-if="activeEmpty" image="content" />
          </view>
        </RefreshList>

        <!-- 可购买 -->
        <RefreshList
          v-if="currentStatus === STATUS_TAB.AVAILABLE"
          :loading="loading"
          :refresh-loading="refreshLoading"
          :loaded="loaded"
          :empty="availableEmpty"
          @refresh="handleRefreshAvailablePackages"
          @loadmore="handleLoadMoreAvailablePackages"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <PackageCard
              v-for="pkg in availableList"
              :key="pkg.id"
              :package="pkg"
              :is-purchased="purchasedPackageIds.has(pkg.id)"
              @click="handleGoToPackageDetail(pkg)"
            />
            <StatusTip v-if="availableEmpty" image="content" />
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
