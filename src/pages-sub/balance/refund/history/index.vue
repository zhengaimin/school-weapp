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
import type { Refund } from '@/api/interface/modules/refund'
import { computed, onUnmounted } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRefundApplicationsApi, postCancelRefundApplicationApi } from '@/api/modules/refund'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL, REFUND_STATUS, REFUND_STATUS_I18N, REFUND_STATUS_OPTIONS } from '@/constant/modules'
import { BALANCE_REFUND_RESULT_PATH } from '@/constant/router'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'
import Item from './components/Item.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()
const message = useMessage()
const { onRefundSuccess, emitRefundSuccess } = useRefundEmitter()

const {
  query,
  loading,
  refreshLoading,
  loaded,
  empty,
  list: recordsList,
  onRefreshList,
  onLoadMore,
} = useRefresh<Refund.IRefundApplicationVo>({
  get: getRefundApplicationsApi,
  listField: 'list',
  immediate: false,
})

const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
  query,
  onRefreshList,
  dateRange: {
    format: 'YYYY-MM-DD HH:mm:ss',
    startField: 'startTime',
    endField: 'endTime',
  },
  extraFilters: [
    {
      key: 'status',
      title: '选择退款状态',
      options: [{ label: '全部', value: ALL }, ...REFUND_STATUS_OPTIONS],
      inDrawer: true,
      defaultValue: ALL,
      apply: (value, targetQuery) => {
        if (value !== ALL) {
          targetQuery.status = value
          return
        }

        delete targetQuery.status
      },
    },
  ],
})

/** 内容区域样式 */
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

/** 修改历史记录状态为已取消 */
function changeHistoryStatusCancelled(id: number) {
  const item = recordsList.value.find(i => i.id === id)
  if (item) {
    item.status = REFUND_STATUS.CANCELLED
    item.statusText = REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED]
  }
}

/** 跳转到退款记录详情 */
function goToRefundDetail(record: Refund.IRefundApplicationVo) {
  uni.navigateTo({
    url: `${BALANCE_REFUND_RESULT_PATH}?id=${record.id}`,
  })
}

/** 处理取消申请 */
async function handleCancelApplication(record: Refund.IRefundApplicationVo) {
  try {
    const confirm = await message.confirm({
      title: '提示',
      msg: '确定要取消该退款申请吗？',
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
    })

    if (confirm) {
      uni.showLoading({ title: '正在取消...' })

      const result = await postCancelRefundApplicationApi(record.id)
      if (result.code === 0) {
        changeHistoryStatusCancelled(record.id)
        emitRefundSuccess({
          id: record.id.toString(),
          status: 'cancelled',
          amount: Number.parseFloat(record.applyAmount),
        })
      }

      toast.show('取消成功')
    }
  } catch (error) {
    console.error('取消退款申请失败:', error)
    toast.show('取消失败，请重试')
  } finally {
    uni.hideLoading()
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  applyFiltersToQuery()
  batchRequestHandler([onRefreshList()])
}

const unsubscribeRefund = onRefundSuccess((data) => {
  console.log('退款历史页监听到退款成功事件:', data)
  changeHistoryStatusCancelled(Number(data.id))
})

onUnmounted(() => {
  unsubscribeRefund()
})
</script>

<template>
  <Page
    title="退款记录"
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
        <Item
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          @click="goToRefundDetail(record)"
          @cancel="handleCancelApplication"
        />
      </view>
    </RefreshList>
  </Page>
</template>
