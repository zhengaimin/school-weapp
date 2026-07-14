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
import type { User } from '@/api/interface/modules/user'
import { computed } from 'vue'
import { getBalanceDetailsApi } from '@/api/modules/user'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL, AMOUNT_TYPE_OPTIONS } from '@/constant/modules'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import RecordItem from './components/RecordItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()

const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

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
  get: getBalanceDetailsApi,
  listField: 'records',
  immediate: false,
})

const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
  query,
  onRefreshList,
  extraFilters: [
    {
      key: 'amountType',
      title: '资金类型',
      type: 'select',
      concise: false,
      options: [{ label: '全部', value: ALL }, ...AMOUNT_TYPE_OPTIONS],
      inDrawer: true,
      defaultValue: ALL,
      apply: (value, targetQuery) => {
        if (value !== ALL) {
          targetQuery.amountType = value
          return
        }

        delete targetQuery.amountType
      },
    },
  ],
})

// 跳转到流水详情（预留）
function goToBalanceDetail(record: User.Balance.IBalanceDetailRecordVo) {
  // 预留详情页面功能
  console.log('查看详情:', record)
}

function onLoginSuccess() {
  applyFiltersToQuery()
  batchRequestHandler([onRefreshList()])
}
</script>

<template>
  <Page
    title="充值明细"
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

    <!-- 充值明细列表 -->
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
