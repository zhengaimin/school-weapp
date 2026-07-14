<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "充值记录"
  }
}
</route>

<script lang="ts" setup>
import type { Payment } from '@/api/interface/modules/payment'
import { computed, onMounted } from 'vue'
import { getPaymentRecordsApi } from '@/api/modules/payment'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { PAYMENT_STATUS } from '@/constant/modules'
import { BALANCE_RECHARGE_RESULT_PATH } from '@/constant/router'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useBalanceEmitter } from '@/utils/emit/balance'
import RecordItem from './components/RecordItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()
const { axiosPostPayApi, axiosPostCancelPaymentRecordApi, cancelLoading } = usePayment()
const { onRechargeSuccess, emitRechargeSuccess } = useBalanceEmitter()
const { hasVideoDevice, hasDryerDevice } = useDeviceType()
const {
  query,
  list: recordsList,
  loading,
  refreshLoading,
  loaded,
  empty,
  onRefreshList,
  onLoadMore,
} = useRefresh<Payment.Order.IPaymentRecordVo>({
  get: getPaymentRecordsApi,
  listField: 'records',
  immediate: false,
})

const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
  query,
  onRefreshList,
})

const showDeviceType = computed(() => {
  const count = Number(hasVideoDevice.value) + Number(hasDryerDevice.value)
  return count > 1
})

/** 内容区域样式 */
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

/** 跳转到充值记录详情 */
function goToRechargeDetail(record: Payment.Order.IPaymentRecordVo) {
  uni.navigateTo({
    url: `${BALANCE_RECHARGE_RESULT_PATH}?orderId=${record.id}`,
  })
}

/** 取消订单 */
async function handleCancelOrder(record: Payment.Order.IPaymentRecordVo) {
  await axiosPostCancelPaymentRecordApi(record, {
    onSuccess: () => {
      onRefreshList()
      emitRechargeSuccess({
        orderNo: record.orderNo,
        amount: Number(record.amount),
        status: PAYMENT_STATUS.CANCELLED,
      })
    },
  })
}

/** 支付订单 */
async function handlePayOrder(record: Payment.Order.IPaymentRecordVo) {
  await axiosPostPayApi(record, {
    onSuccess: () => {
      onRefreshList()
      emitRechargeSuccess({
        orderNo: record.orderNo,
        amount: Number(record.amount),
        status: PAYMENT_STATUS.SUCCESS,
      })
    },
  })
}

/** 登录成功处理 */
function onLoginSuccess() {
  applyFiltersToQuery()
  batchRequestHandler([onRefreshList()])
}

onMounted(() => {
  onRechargeSuccess(({ orderNo, status }) => {
    const index = recordsList.value.findIndex(item => item.orderNo === orderNo)
    if (recordsList.value[index]) {
      recordsList.value[index].status = status
    }
  })
})
</script>

<template>
  <Page
    title="余额充值记录"
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

    <!-- 充值记录列表 -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :style="contentStyle"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view flex="~ col" p="x-4" gap="3">
        <RecordItem
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          :show-device-type="showDeviceType"
          :cancel-loading="cancelLoading"
          @detail="goToRechargeDetail(record)"
          @cancel="handleCancelOrder(record)"
          @pay="handlePayOrder(record)"
        />
      </view>
    </RefreshList>
  </Page>
</template>
