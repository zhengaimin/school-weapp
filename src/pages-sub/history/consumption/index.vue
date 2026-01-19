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
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import RecordItem from './components/RecordItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const currentStudentStore = useCurrentStudentStore()
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: recordsList,
  onRefreshList,
  onLoadMore,
  query,
} = useRefresh<User.Consumption.IConsumptionRecordVo>({
  get: getConsumptionRecordsApi,
  immediate: false,
  listField: 'records',
})

/** 筛选条件 - 默认选中一年数据 */
const now = new Date()
const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
const filters = ref([[oneYearAgo.getTime(), now.getTime()]])

/** 筛选配置 */
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

/** 内容区域高度 */
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

/** 筛选条件变更处理 */
function onFilterChange(key: string, value: string | number | number[] | [number, number]) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]

    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  }

  onRefreshList()
}

/** 登录成功处理 */
async function onLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.deviceType = currentStudentStore.deviceType
  query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
  query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')

  batchRequestHandler([onRefreshList()])
}
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
