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
import { computed } from 'vue'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { usePage } from '@/hooks/usePage'
import RecordItem from './components/RecordItem.vue'
import { CONTENT_HEIGHT_OFFSET } from './constants'
import { useConsumptionRecords } from './hooks/useConsumptionRecords'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  recordsList,
  onRefreshList,
  onLoadMore,
  filters,
  filterConfigs,
  onFilterChange,
  applyFiltersToQuery,
  showDeviceType,
} = useConsumptionRecords()

/** 内容区域高度 */
const contentStyle = computed(() => {
  return getContentHeight(CONTENT_HEIGHT_OFFSET)
})

/** 登录成功处理 */
async function onLoginSuccess() {
  applyFiltersToQuery()
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
