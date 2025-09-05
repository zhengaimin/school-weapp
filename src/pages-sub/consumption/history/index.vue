<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "消费记录"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { User } from '@/api/interface/modules/user'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getConsumptionRecordsApi } from '@/api/modules/user/consumption'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import RecordItem from './components/RecordItem.vue'
// #endregion

// #region 组件选项
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: recordsList,
  onRefreshList,
  onLoadMore,
  query,
} = useRefresh<User.Consumption.ConsumptionRecord>({
  get: getConsumptionRecordsApi,
  immediate: false,
  listField: 'records',
})
// #endregion

// #region 数据
// 筛选条件 - 使用日期范围筛选，默认选中一年数据
const now = new Date()
const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
const filters = ref([[oneYearAgo.getTime(), now.getTime()]])
// #endregion

// #region 计算属性
const filterConfigs = computed(
  () =>
    [
      {
        key: 'daterange',
        title: '选择时间范围',
        type: 'daterange' as const,
        concise: false,
        options: [],
      },
    ] as FilterConfig[],
)

const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})
// #endregion
// #region 事件处理
function onFilterChange(key: string, value: string | number | number[] | [number, number]) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]

    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  }

  onRefreshList()
}
// #endregion

// #region 生命周期
async function onLoginSuccess() {
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
    title="消费记录"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 筛选器 -->
    <view p="x-4 t-2 b-4">
      <FilterGroup v-model="filters" :filters="filterConfigs" @change="onFilterChange" />
    </view>

    <!-- 消费记录列表 -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :style="contentStyle"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view flex="~ col" gap="3" p="x-4">
        <RecordItem v-for="record in recordsList" :key="record.id" :record="record" />
      </view>
    </RefreshList>
  </Page>
</template>
