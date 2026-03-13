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
import { computed } from 'vue'
import { getConsumptionRecordsApi } from '@/api/modules/user/consumption'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import RecordItem from './components/RecordItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { hasVideoDevice, hasDryerDevice } = useDeviceType()
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

const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
  query,
  onRefreshList,
})

/** 内容区域高度 */
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

/** 登录成功处理 */
async function onLoginSuccess() {
  applyFiltersToQuery()
  batchRequestHandler([onRefreshList()])
}

const showDeviceType = computed(() => {
  const count = Number(hasVideoDevice.value) + Number(hasDryerDevice.value)
  return count > 1
})
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
        <RecordItem
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          :show-device-type="showDeviceType"
        />
      </view>
    </RefreshList>
  </Page>
</template>
