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
import type { Pkg } from '@/api/interface/modules/package'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getPackageRefundListApi } from '@/api/modules/package/refund'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import {
  ALL,
  REFUND_STATUS,
  REFUND_STATUS_I18N,
  REFUND_STATUS_OPTIONS,
} from '@/constant/modules'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { usePackageEmitter } from '@/utils/emit/package'
import RefundHistoryItem from './components/RefundHistoryItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

type FilterValue = string | number | number[] | [number, number]

const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()
const { emitPackageRefund, onPackageRefund } = usePackageEmitter()
const currentStudentStore = useCurrentStudentStore()

const {
  query,
  list: recordsList,
  loading,
  refreshLoading,
  loaded,
  empty,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Refund.IRefundApplicationRecord>({
  get: params => getPackageRefundListApi({ ...params, deviceType: currentStudentStore.deviceType }),
  listField: 'list',
  immediate: false,
})

/** 筛选条件 */
const filters = ref<FilterValue[]>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
  ALL,
])

/** 筛选配置 */
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
    options: [{ label: '全部', value: ALL }, ...REFUND_STATUS_OPTIONS],
  },
])
/** 内容区域样式 */
const contentStyle = computed(() => getContentHeight('140rpx'))

/** 筛选条件变化 */
function onFilterChange(key: string, value: [number, number] | string | number) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]
    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  }
  else if (key === 'status') {
    query.value.status = value === ALL ? undefined : value
  }
  onRefreshList()
}

/** 处理取消申请成功 */
function handleCancelSuccess(record: Pkg.Refund.IRefundApplicationRecord) {
  const targetRecord = recordsList.value.find(item => item.id === record.id)
  if (targetRecord) {
    targetRecord.status = REFUND_STATUS.CANCELLED
    targetRecord.statusText = REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED]
  }
  emitPackageRefund()
}
/** 登录成功处理 */
function handleLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
  query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
  query.value.status = filters.value[1] === ALL ? undefined : filters.value[1]
  batchRequestHandler([onRefreshList()])
}

onShow(() => {
  onPackageRefund((id) => {
    if (id) {
      const index = recordsList.value.findIndex(item => item.id === id)
      if (index !== -1) {
        recordsList.value[index].status = REFUND_STATUS.CANCELLED
        recordsList.value[index].statusText = REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED]
      }
    }
  })
})
</script>

<template>
  <Page
    title="套餐退费申请记录"
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
          @cancel="handleCancelSuccess"
        />
      </view>
    </RefreshList>
  </Page>
</template>
