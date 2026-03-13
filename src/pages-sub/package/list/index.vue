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
import type { TDeviceType } from '@/constant/modules'
import type { FilterValue } from '@/hooks/useHistoryFilters'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import TButton from '@/components/common/button/index.vue'
import FilterGroup from '@/components/common/filter-group/index.vue'
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
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
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
const { devices } = storeToRefs(currentStudentStore)
const { defaultDeviceType } = useDeviceType()
const primaryDeviceType = computed(() => devices.value?.[0]?.deviceType || defaultDeviceType.value)

const STATUS_TAB = {
  ACTIVE: 0,
  WAITING: 1,
  AVAILABLE: 2,
} as const

const statusOptions = [
  { label: '生效中', value: STATUS_TAB.ACTIVE },
  { label: '待生效', value: STATUS_TAB.WAITING },
  { label: '可购买', value: STATUS_TAB.AVAILABLE },
]

/** 生效中/待生效套餐的加载状态 */
const activeLoading = ref(false)
const activeRefreshLoading = ref(false)
const activeListBusy = computed(() => activeLoading.value || activeRefreshLoading.value)

const {
  query,
  loading,
  refreshLoading,
  loaded,
  empty,
  list: availableList,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IPackage>({
  get: getAvailablePackagesApi,
  immediate: false,
  listField: 'packages',
})

const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
  query,
  onRefreshList,
  dateRange: {
    enabled: false,
  },
  deviceType: {
    includeAll: false,
  },
  extraFilters: [
    {
      key: 'status',
      title: '套餐状态',
      type: 'select',
      concise: false,
      options: statusOptions,
      inDrawer: false,
      defaultValue: STATUS_TAB.ACTIVE,
      apply: () => {},
    },
  ],
})

const currentStatus = computed(() => (filters.value[0] ?? STATUS_TAB.ACTIVE) as number)
const selectedDeviceType = computed<TDeviceType>(() => {
  return (filters.value[1] as TDeviceType | undefined)
    || (query.value.deviceType as TDeviceType | undefined)
    || primaryDeviceType.value
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
async function fetchActivePackages(isRefresh = false, deviceType?: TDeviceType) {
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

function handleFilterChange(key: string, value: FilterValue) {
  onFilterChange(key, value)

  if (key !== 'deviceType') return

  const deviceType = value as TDeviceType
  batchRequestHandler([
    fetchActivePackages(false, deviceType),
    axiosGetPendingPaymentApi(deviceType),
    axiosGetCheckPendingApi(deviceType),
  ])
}

/** 登录成功处理 */
async function onLoginSuccess() {
  applyFiltersToQuery()
  batchRequestHandler([
    onRefreshList(),
    fetchActivePackages(false, selectedDeviceType.value),
    axiosGetPendingPaymentApi(selectedDeviceType.value),
    axiosGetCheckPendingApi(selectedDeviceType.value),
  ])
}

onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([
      fetchActivePackages(false, selectedDeviceType.value),
      axiosGetCheckPendingApi(selectedDeviceType.value),
      axiosGetPendingPaymentApi(selectedDeviceType.value),
    ])
  }
})

onPackageRefund(() => {
  batchRequestHandler([
    fetchActivePackages(false, selectedDeviceType.value),
    axiosGetCheckPendingApi(selectedDeviceType.value),
  ])
})

onPackageTransaction(() => {
  batchRequestHandler([
    fetchActivePackages(false, selectedDeviceType.value),
    axiosGetPendingPaymentApi(selectedDeviceType.value),
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

      <!-- 筛选区域 -->
      <view p="4 t-2!">
        <FilterGroup v-model="filters" :filters="filterConfigs" @change="handleFilterChange" />
      </view>

      <!-- 内容区域 -->
      <view relative w-full flex-1 overflow-hidden>
        <!-- 生效中 -->
        <RefreshList
          v-if="currentStatus === STATUS_TAB.ACTIVE"
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
          v-if="currentStatus === STATUS_TAB.WAITING"
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
          v-if="currentStatus === STATUS_TAB.AVAILABLE"
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
