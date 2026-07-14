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
import type {
  ActivePackage,
  PackageListDeviceType,
  PackageListStatusTab,
} from './types'
import { storeToRefs } from 'pinia'
import { computed, ref, unref, watch } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import {
  PACKAGE_DETAIL_PATH,
  PACKAGE_HISTORY_PATH,
  PACKAGE_REFUND_HISTORY_PATH,
} from '@/constant/router'
import { useDeviceType } from '@/hooks/useDeviceType'
import { usePage } from '@/hooks/usePage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
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
const currentStudentStore = useCurrentStudentStore()
const { devices } = storeToRefs(currentStudentStore)
const { defaultDeviceType, deviceTypeRadioOptions } = useDeviceType()
const { onPackageRefund, onPackageTransaction } = usePackageEmitter()
const {
  hasPendingRefund,
  pendingPayment,
  purchasedPackageIds,
  axiosGetCheckPendingApi,
  axiosGetPendingPaymentApi,
  axiosGetStudentActivePackageApi,
} = usePackage()
const {
  query,
  loading,
  refreshLoading,
  loaded,
  displayEmpty: availableEmpty,
  displayList: availableList,
  onRefreshList,
  onLoadMore,
  syncAvailableFallbackDeviceType,
} = useAvailablePackages(
  computed<PackageListDeviceType>(
    () => (devices.value?.[0]?.deviceType || defaultDeviceType.value) as PackageListDeviceType,
  ),
)

/** 生效中/待生效套餐的加载状态 */
const activeLoading = ref(false)
const activeRefreshLoading = ref(false)
const activeTabIndex = ref<number>(STATUS_TAB.AVAILABLE)
const selectedDeviceType = ref<PackageListDeviceType>(
  (devices.value?.[0]?.deviceType || defaultDeviceType.value) as PackageListDeviceType,
)
const selectedDeviceIndex = ref<number>(0)
// 双 Tab 样式风格: 'segmented' | 'pill' | 'tag' | 'underline'
const tabVariant = ref<'segmented' | 'pill' | 'tag' | 'underline'>('segmented')
/** 生效中套餐列表 */
const activePackages = ref<ActivePackage[]>([])
/** 待生效套餐列表 */
const waitingPackages = ref<ActivePackage[]>([])

const activeListBusy = computed(() => activeLoading.value || activeRefreshLoading.value)
const tabOptions = computed(() => STATUS_OPTIONS)
const deviceTypeOptions = computed(() => {
  const opts = deviceTypeRadioOptions.value
  return opts?.length ? opts : []
})
const currentStatus = computed<PackageListStatusTab>(() => {
  return activeTabIndex.value as PackageListStatusTab
})
/** 筛选栏高度：根据是否有设备类型筛选动态计算 */
const filterHeight = computed(() => {
  // 有设备筛选时：(30rpx * 2) + gap(8rpx) + padding(32rpx) ≈ 100rpx
  // 无设备筛选时：30rpx + padding(32rpx) ≈ 62rpx
  return deviceTypeOptions.value.length > 1 ? '100rpx' : '62rpx'
})
const contentStyle = computed(() => getContentHeight(filterHeight.value))
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
async function fetchActivePackages(isRefresh = false, deviceType?: PackageListDeviceType) {
  if (isRefresh) {
    activeRefreshLoading.value = true
  } else {
    activeLoading.value = true
  }
  try {
    const resolvedDeviceType = deviceType ?? selectedDeviceType.value
    const result = await axiosGetStudentActivePackageApi(resolvedDeviceType)
    if (result.code === 0 && result.data) {
      activePackages.value = result.data?.activePackages || []
      waitingPackages.value = result.data?.waitingPackages || []
    }
    return result
  } finally {
    activeRefreshLoading.value = false
    activeLoading.value = false
  }
}

/** 刷新生效中/待生效套餐 */
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
function handleGoToPackageDetail(id: number) {
  uni.navigateTo({ url: `${PACKAGE_DETAIL_PATH}?id=${id}` })
}
/** 设备类型筛选变化处理 */
function handleDeviceTypeChange(index: number) {
  const deviceType = deviceTypeOptions.value[index]?.value as PackageListDeviceType
  if (!deviceType) return
  selectedDeviceType.value = deviceType
  selectedDeviceIndex.value = index
  query.value.deviceType = deviceType
  syncAvailableFallbackDeviceType(deviceType)
  batchRequestHandler([
    fetchActivePackages(false, deviceType),
    axiosGetPendingPaymentApi(deviceType),
    axiosGetCheckPendingApi(deviceType),
  ])
}
/** Tab 切换处理 */
function handleTabChange(_index: number) {
  // Tab 切换仅改变显示状态，不需要额外请求
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
  const deviceType = selectedDeviceType.value
  query.value.deviceType = deviceType
  syncAvailableFallbackDeviceType(deviceType)
  batchRequestHandler([
    onRefreshList(),
    fetchActivePackages(false, deviceType),
    axiosGetPendingPaymentApi(deviceType),
    axiosGetCheckPendingApi(deviceType),
  ])
}
/** 页面显示时刷新生效数据 */
onShow(() => {
  if (unref(pageLoaded)) {
    syncAvailableFallbackDeviceType(selectedDeviceType.value)
    batchRequestHandler([
      fetchActivePackages(false, selectedDeviceType.value),
      axiosGetCheckPendingApi(selectedDeviceType.value),
      axiosGetPendingPaymentApi(selectedDeviceType.value),
    ])
  }
})
/** 监听退费事件后刷新数据 */
onPackageRefund(() => {
  syncAvailableFallbackDeviceType(selectedDeviceType.value)
  batchRequestHandler([
    fetchActivePackages(false, selectedDeviceType.value),
    axiosGetCheckPendingApi(selectedDeviceType.value),
  ])
})
/** 监听交易事件后刷新数据 */
onPackageTransaction(() => {
  syncAvailableFallbackDeviceType(selectedDeviceType.value)
  batchRequestHandler([
    fetchActivePackages(false, selectedDeviceType.value),
    axiosGetPendingPaymentApi(selectedDeviceType.value),
  ])
})

// 初始化设备类型索引
watch(
  [deviceTypeOptions, devices, defaultDeviceType],
  ([opts, currentDevices, fallbackDeviceType]) => {
    if (opts && opts.length > 0) {
      const primary = (currentDevices?.[0]?.deviceType || fallbackDeviceType) as PackageListDeviceType
      const index = opts.findIndex((o: any) => o.value === primary)
      selectedDeviceIndex.value = index >= 0 ? index : 0
    }
  },
  { immediate: true },
)
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

      <!-- 状态 Tab + 设备类型 Tab -->
      <PackageTabs
        :tabs="tabOptions"
        :device-options="deviceTypeOptions"
        :active-tab="activeTabIndex"
        :device-index="selectedDeviceIndex"
        :variant="tabVariant"
        @update:active-tab="handleActiveTabChange"
        @update:device-index="handleDeviceTypeChange"
        @tab-change="handleTabChange"
        @device-change="handleDeviceTypeChange"
      />

      <!-- 内容区域 -->
      <view relative w-full flex-1 overflow-hidden>
        <!-- 生效中 -->
        <RefreshList
          v-if="currentStatus === STATUS_TAB.ACTIVE"
          loaded
          :loading="activeLoading"
          :refresh-loading="activeRefreshLoading"
          :empty="activeEmpty"
          @refresh="handleRefreshActivePackages"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <ActivePackageCard v-for="item in activePackages" :key="item.id" :package="item" />
            <StatusTip v-if="activeEmpty" image="content" />
          </view>
        </RefreshList>

        <!-- 待生效 -->
        <RefreshList
          v-if="currentStatus === STATUS_TAB.WAITING"
          loaded
          :loading="activeLoading"
          :refresh-loading="activeRefreshLoading"
          :empty="pendingEmpty"
          @refresh="handleRefreshActivePackages"
        >
          <view p="x-4 y-2!" flex="~ col" gap="3">
            <ActivePackageCard v-for="item in waitingPackages" :key="item.id" :package="item" />
            <StatusTip v-if="pendingEmpty" image="content" />
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
              @click="handleGoToPackageDetail(pkg.id)"
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
