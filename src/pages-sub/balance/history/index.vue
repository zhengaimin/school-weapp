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
// #region 导入
import type { Payment } from '@/api/interface/modules/payment'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getPaymentRecordsApi } from '@/api/modules/payment'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL } from '@/constant/modules/common'
import { PAYMENT_STATUS } from '@/constant/modules/payment'
import { BALANCE_RECHARGE_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useBalanceEmitter } from '@/utils/emit/balance'
import RecordItem from './components/RecordItem.vue'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()
const { axiosPostPayApi, axiosPostCancelPaymentRecordApi, cancelLoading } = usePayment()
const { onRechargeSuccess, emitRechargeSuccess } = useBalanceEmitter()

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
// #endregion

// #region 定义响应式数据
// 筛选条件 - 日期范围筛选使用时间戳数组
const filters = ref<Array<[number, number] | string | number>>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
])
// #endregion

// #region 定义计算属性
// 筛选器配置
const filterConfigs = computed<FilterConfig[]>(() => [
  {
    key: 'daterange',
    title: '选择时间范围',
    type: 'daterange',
    concise: false,
    options: [],
  },
])

// 内容区域样式
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})
// #endregion

// #region 事件处理函数
// 筛选条件变化
function onFilterChange(key: string, value: [number, number]) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]

    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  }

  // 根据筛选条件添加参数
  if (filters.value[1] !== ALL) {
    query.value.status = Number(filters.value[1])
  }

  onRefreshList()
}

// 跳转到充值记录详情
function goToRechargeDetail(record: Payment.Order.IPaymentRecordVo) {
  uni.navigateTo({
    url: `${BALANCE_RECHARGE_RESULT_PATH}?orderId=${record.id}`,
  })
}

// 取消订单
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

// 支付订单
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
// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  if (Array.isArray(daterange) && daterange.length === 2) {
    const [startTime, endTime] = daterange
    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  }

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
// #endregion
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
          :cancel-loading="cancelLoading"
          @detail="goToRechargeDetail(record)"
          @cancel="handleCancelOrder(record)"
          @pay="handlePayOrder(record)"
        />
      </view>
    </RefreshList>
  </Page>
</template>
