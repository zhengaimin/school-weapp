<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐购买记录"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import { computed, ref } from 'vue'
import { getStudentPackagesApi } from '@/api/modules/package'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import {
  ALL,
  PACKAGE_BUY_STATUS,
  PACKAGE_BUY_STATUS_I18N,
  PACKAGE_BUY_STATUS_OPTIONS,
  PAYMENT_METHOD,
} from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { usePackageEmitter } from '@/utils/emit/package'
import RefundModal from '../../components/RefundModal.vue'
import { usePayment } from '../../hooks/usePayment'
import HistoryItem from './components/HistoryItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()
const { axiosPostContinuePaymentApi, axiosPostCancelPaymentApi } = usePayment()
const { emitPackageTransaction, onPackageRefund } = usePackageEmitter()
const {
  query,
  list: recordsList,
  loading,
  refreshLoading,
  loaded,
  empty,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IStudentPackageVo>({
  get: getStudentPackagesApi,
  listField: 'packages',
  immediate: false,
})
/** 退款弹框显示状态 */
const showRefundModal = ref(false)
/** 当前退款记录ID */
const currentRefundId = ref<number>()
/** 是否有待退款订单 */
const hasPendingRefund = ref(false)

function refreshList() {
  delete query.value.deviceType
  return onRefreshList()
}

/** 内容区域样式 */
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
  query,
  onRefreshList: refreshList,
  dateRange: { enabled: false },
  deviceType: { enabled: false },
  extraFilters: [
    {
      key: 'status',
      title: '套餐购买状态',
      type: 'select',
      concise: false,
      options: [{ label: '全部', value: ALL }, ...PACKAGE_BUY_STATUS_OPTIONS],
      inDrawer: false,
      defaultValue: ALL,
      apply: (value, targetQuery) => {
        if (value !== ALL) {
          targetQuery.status = value
          return
        }

        delete targetQuery.status
      },
    },
  ],
})

/** 跳转到套餐记录详情 */
function goToPackageDetail(_event: Event, record: Pkg.Query.IStudentPackageVo) {
  const orderNo = record.paymentOrderNo || ''
  uni.navigateTo({
    url: `${PACKAGE_HISTORY_RESULT_PATH}?type=purchase&orderNo=${orderNo}`,
  })
}
/** 取消订单 */
async function handleCancelOrder(record: Pkg.Query.IStudentPackageVo) {
  await axiosPostCancelPaymentApi(
    { orderNo: String(record.paymentOrderNo) },
    {
      onSuccess: () => {
        // 发送套餐交易事件
        emitPackageTransaction()

        // 根据套餐记录 ID 更新对应套餐状态
        const index = recordsList.value.findIndex(item => item.id === record.id)
        if (index !== -1) {
          // 更新订单状态为已取消
          recordsList.value[index].status = PACKAGE_BUY_STATUS.CANCELLED
          recordsList.value[index].statusText = PACKAGE_BUY_STATUS_I18N[PACKAGE_BUY_STATUS.CANCELLED]
        }
      },
      onError: () => {
        // 发送套餐交易事件（失败情况）
        emitPackageTransaction()
      },
    },
  )
}
/** 支付订单 */
async function handlePayOrder(record: Pkg.Query.IStudentPackageVo) {
  await axiosPostContinuePaymentApi(
    { orderNo: String(record.paymentOrderNo), paymentMethod: PAYMENT_METHOD.WECHAT },
    {
      onSuccess: (orderId) => {
        emitPackageTransaction()
        uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?type=purchase&orderNo=${orderId}` })
      },
      onError: () => {
        emitPackageTransaction()
      },
    },
  )
}
/** 申请退款 */
function handleRefundRequest(record: Pkg.Query.IStudentPackageVo) {
  const packageRecordId = record.packageRecordIds?.[0]
  if (!packageRecordId) return
  currentRefundId.value = packageRecordId
  showRefundModal.value = true
}
/** 退款申请成功 */
function handleRefundSuccess(id: number) {
  hasPendingRefund.value = true
  const record = recordsList.value.find(item => item.packageRecordIds?.includes(id))
  const orderNo = record?.paymentOrderNo || ''
  uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${orderNo}` })
}

/** 登录成功处理 */
function onLoginSuccess() {
  applyFiltersToQuery()
  batchRequestHandler([refreshList()])
}

onShow(() => {
  onPackageRefund((id) => {
    hasPendingRefund.value = true
    if (id) {
      const index = recordsList.value.findIndex(item => item.packageRecordIds?.includes(id))
      if (index !== -1) {
        recordsList.value[index].status = PACKAGE_BUY_STATUS.REFUND_PENDING
        recordsList.value[index].statusText = PACKAGE_BUY_STATUS_I18N[PACKAGE_BUY_STATUS.REFUND_PENDING]
      }
    }
  })
})
</script>

<template>
  <Page
    title="套餐购买记录"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2!">
      <!-- 筛选区域 -->
      <FilterGroup v-model="filters" :filters="filterConfigs" @change="onFilterChange" />
    </view>

    <!-- 退款申请弹框 -->
    <RefundModal
      :id="currentRefundId"
      v-model:visible="showRefundModal"
      @success="handleRefundSuccess"
    />

    <!-- 套餐记录列表 -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :style="contentStyle"
      @refresh="refreshList"
      @loadmore="onLoadMore"
    >
      <view flex="~ col" p="x-4" gap="3">
        <HistoryItem
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          :has-pending-refund="hasPendingRefund"
          @click="goToPackageDetail"
          @cancel="handleCancelOrder"
          @pay="handlePayOrder"
          @refund="handleRefundRequest"
        />
      </view>
    </RefreshList>
  </Page>
</template>
