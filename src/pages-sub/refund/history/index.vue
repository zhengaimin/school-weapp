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
import { computed, onUnmounted, ref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRefundApplicationsApi, postCancelRefundApplicationApi } from '@/api/modules/refund'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { ALL, REFUND_STATUS, REFUND_STATUS_I18N, REFUND_STATUS_OPTIONS } from '@/constant/modules'
import { REFUND_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'
import RefundRecordItem from './components/RefundRecordItem.vue'
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
const message = useMessage()
const { onRefundSuccess, emitRefundSuccess } = useRefundEmitter()
// 使用 useRefresh hook
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
  get: getRefundApplicationsApi as any,
  listField: 'list',
  immediate: false,
})
// #endregion

// #region 定义响应式数据
// 筛选条件
const filters = ref<(string | number | [number, number])[]>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
  ALL,
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
    title: '选择退款状态',
    options: [{ label: '全部', value: ALL }, ...REFUND_STATUS_OPTIONS],
  },
])

const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})
// #endregion

// #region 方法定义
function changeHistoryStatusCancelled(id: number) {
  const item = recordsList.value.find(i => i.id === id)
  if (item) {
    item.status = REFUND_STATUS.CANCELLED
    item.statusText = REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED]
  }
}
// #endregion

// #region 事件处理函数
// 筛选变化处理
function onFilterChange(key: string, value: string | number | [number, number]) {
  if (key === 'daterange') {
    const [startTime, endTime] = value as [number, number]

    query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
    query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')
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

// 跳转到退款记录详情
function goToRefundDetail(record: Refund.IRefundApplicationVo) {
  uni.navigateTo({
    url: `${REFUND_RESULT_PATH}?id=${record.id}`,
  })
}

// 处理取消申请
async function handleCancelApplication(record: Refund.IRefundApplicationVo) {
  try {
    // 弹出确认框
    const confirm = await message.confirm({
      title: '提示',
      msg: '确定要取消该退款申请吗？',
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
    })

    if (confirm) {
      // 显示加载中
      uni.showLoading({ title: '正在取消...' })

      // 调用取消API
      const result = await postCancelRefundApplicationApi(record.id)
      if (result.code === 0) {
        changeHistoryStatusCancelled(record.id)

        // 发送退款事件
        emitRefundSuccess({
          id: record.id.toString(),
          status: 'cancelled',
          amount: Number.parseFloat(record.applyAmount),
        })
      }

      // 取消成功提示
      toast.show('取消成功')
    }
  }
  catch (error) {
    console.error('取消退款申请失败:', error)
    toast.show('取消失败，请重试')
  }
  finally {
    // 隐藏加载中
    uni.hideLoading()
  }
}
// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  const daterange = filters.value[0] as [number, number]
  const [startTime, endTime] = daterange
  query.value.startDate = dayjs(startTime).format('YYYY-MM-DD')
  query.value.endDate = dayjs(endTime).format('YYYY-MM-DD')

  batchRequestHandler([onRefreshList()])
}

// 监听退款成功事件
const unsubscribeRefund = onRefundSuccess((data) => {
  console.log('退款历史页监听到退款成功事件:', data)
  // 根据传入的ID修改对应项目状态为取消
  changeHistoryStatusCancelled(Number(data.id))
})

// 组件卸载时取消监听
onUnmounted(() => {
  unsubscribeRefund()
})
// #endregion
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
