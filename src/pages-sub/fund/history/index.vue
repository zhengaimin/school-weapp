<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "资金流水"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { User } from '@/api/interface/modules/user'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getBalanceDetailsApi } from '@/api/modules/user'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL, AMOUNT_TYPE_OPTIONS } from '@/constant/modules'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
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
// #endregion

// #region 定义响应式数据
// 筛选条件：默认获取这一年的数据，金额类型为空（全部）
type FilterValue = string | number | number[] | [number, number]
const filters = ref<FilterValue[]>([[dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()], ALL])
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
    key: 'amountType',
    title: '资金类型',
    type: 'select',
    concise: true,
    options: [{ label: '全部', value: ALL }, ...AMOUNT_TYPE_OPTIONS],
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
} = useRefresh<User.Balance.IBalanceDetailRecordVo>({
  get: params => getBalanceDetailsApi(params),
  listField: 'records',
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
  else if (key === 'amountType') {
    if (value !== ALL) {
      query.value.amountType = value
    }
    else {
      delete query.value.amountType
    }
  }

  onRefreshList()
}

// 跳转到流水详情（预留）
function goToBalanceDetail(record: User.Balance.IBalanceDetailRecordVo) {
  // 预留详情页面功能
  console.log('查看详情:', record)
}
// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
  query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')

  const amountType = filters.value[1] as string
  if (amountType !== ALL) {
    query.value.amountType = amountType
  }

  batchRequestHandler([onRefreshList()])
}
// #endregion
</script>

<template>
  <Page
    title="余额明细"
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

    <!-- 资金流水列表 -->
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
          @detail="goToBalanceDetail(record)"
        />
      </view>
    </RefreshList>
  </Page>
</template>
