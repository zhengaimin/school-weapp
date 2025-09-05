<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "话机套餐购买记录"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getStudentPackagesApi } from '@/api/modules/package'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL } from '@/constant/modules/common'
import { STUDENT_PACKAGE_STATUS_OPTIONS } from '@/constant/modules/package/buy'
import { PAYMENT_METHOD } from '@/constant/modules/payment'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { usePayment } from '../hooks/usePayment'
import HistoryItem from './components/HistoryItem.vue'
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
const { axiosPostContinuePaymentApi, axiosPostCancelPaymentApi, continueLoading, cancelLoading }
  = usePayment()
// #endregion

// #region 定义响应式数据
// 筛选条件：默认获取这一年的数据
type FilterValue = string | number | number[] | [number, number]
const filters = ref<FilterValue[]>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
  ALL,
])
// #endregion

// #region 定义计算属性
// 筛选器配置
const filterConfigs = computed<FilterConfig[]>(() => [
  {
    key: 'daterange',
    title: '选择时间范围',
    type: 'daterange',
    concise: true,
    options: [],
  },
  {
    key: 'status',
    title: '套餐购买状态',
    type: 'select',
    options: STUDENT_PACKAGE_STATUS_OPTIONS,
  },
])

const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})
// #endregion

// #region 接口请求函数
// 使用 useRefresh hook
const {
  query,
  list: recordsList,
  loading,
  refreshLoading,
  loaded,
  empty,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IStudentActivePackageVo>({
  get: params => getStudentPackagesApi(params),
  listField: 'packages',
  immediate: false,
})
// #endregion

// #region 事件处理函数
// 筛选条件变化
function onFilterChange(key: string, value: [number, number] | string) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]

    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  }
  else if (key === 'status') {
    if (value !== ALL) {
      query.value.status = value
    }
    else {
      delete query.value.status
    }
  }

  onRefreshList()
}

// 跳转到套餐记录详情
function goToPackageDetail(event: Event, record: Pkg.Query.IStudentActivePackageVo) {
  // 预留详情页面功能
  console.log('查看套餐详情:', record)
}

// 取消订单
async function handleCancelOrder(record: Pkg.Query.IStudentActivePackageVo) {
  await axiosPostCancelPaymentApi(
    { orderNo: String(record.id) },
    {
      onSuccess: () => {
        onRefreshList()
      },
    },
  )
}

// 支付订单
async function handlePayOrder(record: Pkg.Query.IStudentActivePackageVo) {
  await axiosPostContinuePaymentApi(
    { orderNo: String(record.id), paymentMethod: PAYMENT_METHOD.WECHAT },
    {
      onSuccess: () => {
        onRefreshList()
      },
    },
  )
}
// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
  query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')

  batchRequestHandler([onRefreshList()])
}
// #endregion
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

    <!-- 套餐记录列表 -->
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
        <HistoryItem
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          :continue-loading="continueLoading"
          :cancel-loading="cancelLoading"
          @click="goToPackageDetail"
          @cancel="handleCancelOrder"
          @pay="handlePayOrder"
        />
      </view>
    </RefreshList>
  </Page>
</template>
