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
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRefundApplicationsApi, postCancelRefundApplicationApi } from '@/api/modules/refund'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL, REFUND_STATUS, REFUND_STATUS_I18N, REFUND_STATUS_OPTIONS } from '@/constant/modules'
import { BALANCE_REFUND_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'
import RefundRecordItem from './components/RefundRecordItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, getContentHeight, batchRequestHandler, onLoginFail } = usePage()
const message = useMessage()
const { onRefundSuccess, emitRefundSuccess } = useRefundEmitter()
const currentStudentStore = useCurrentStudentStore()

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

/** 筛选条件 */
const filters = ref<(string | number | [number, number])[]>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
  ALL,
])

/** 筛选器配置 */
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
    title: '选择退款状态',
    options: [{ label: '全部', value: ALL }, ...REFUND_STATUS_OPTIONS],
  },
])

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

/** 筛选变化处理 */
function onFilterChange(key: string, value: string | number | [number, number]) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]
    query.value.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
    query.value.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
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
  }
  catch (error) {
    console.error('取消退款申请失败:', error)
    toast.show('取消失败，请重试')
  }
  finally {
    uni.hideLoading()
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
  query.value.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')

  if (currentStudentStore.deviceType) {
    query.value.deviceType = currentStudentStore.deviceType
  }

  batchRequestHandler([onRefreshList()])
}

/** 监听 deviceType 变化，自动刷新列表 */
watch(() => currentStudentStore.deviceType, (newDeviceType) => {
  if (newDeviceType) {
    query.value.deviceType = newDeviceType
    onRefreshList()
  }
})

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
        <RefundRecordItem
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
