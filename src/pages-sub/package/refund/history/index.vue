<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "退款记录"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { Refund } from '@/api/interface/modules/refund'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getRefundApplicationsApi } from '@/api/modules/refund'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL } from '@/constant/modules/common'
import { REFUND_STATUS_OPTIONS } from '@/constant/modules/refund'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import RefundHistoryItem from './components/RefundHistoryItem.vue'
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
// #endregion

// #region 定义响应式数据
// 筛选条件：默认获取这一年的数据
type FilterValue = string | number | number[] | [number, number]
const filters = ref<FilterValue[]>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
  ALL, // 默认选择全部状态
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
    title: '退款状态',
    type: 'select',
    options: REFUND_STATUS_OPTIONS,
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
} = useRefresh<Refund.IRefundApplicationVo>({
  get: params => getRefundApplicationsApi(params),
  listField: 'list',
  immediate: false,
})
// #endregion

// #region 事件处理函数
// 筛选条件变化
function onFilterChange(key: string, value: [number, number] | string | number) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]
    query.value.startTime = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endTime = dayjs(endTime).format('YYYY-MM-DD')
  }
  else if (key === 'status') {
    query.value.status = value === ALL ? undefined : value
  }

  onRefreshList()
}

// 跳转到退款记录详情
function handleGoToRefundDetail(event: Event, record: Refund.IRefundApplicationVo) {
  // 预留详情页面功能
  console.log('查看退款详情:', record)
}
// #endregion

// #region 生命周期钩子
function handleLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.startTime = dayjs(startTime).format('YYYY-MM-DD')
  query.value.endTime = dayjs(endTime).format('YYYY-MM-DD')
  query.value.status = filters.value[1] === ALL ? undefined : filters.value[1]

  batchRequestHandler([onRefreshList()])
}
// #endregion
</script>

<template>
  <Page
    title="套餐退款记录"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="handleLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2!">
      <!-- 筛选区域 -->
      <FilterGroup v-model="filters" :filters="filterConfigs" @change="onFilterChange" />
    </view>

    <!-- 退款记录列表 -->
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
        <RefundHistoryItem
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          @click="handleGoToRefundDetail"
        />
      </view>
    </RefreshList>
  </Page>
</template>
