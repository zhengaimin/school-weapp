<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "话机套餐购买记录"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getStudentPackagesApi, postCancelPackageRefundApi } from '@/api/modules/package'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import {
  ALL,
  PACKAGE_BUY_STATUS,
  PACKAGE_BUY_STATUS_I18N,
  PACKAGE_BUY_STATUS_OPTIONS,
  PAYMENT_METHOD,
} from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'
import RefundModal from '../../components/RefundModal.vue'
import { usePackage } from '../../hooks/usePackage'
import { usePayment } from '../../hooks/usePayment'
import HistoryItem from './components/HistoryItem.vue'
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
const { axiosPostContinuePaymentApi, axiosPostCancelPaymentApi } = usePayment()
const { pendingRefundInfo } = usePackage()
const { emitPackageTransaction, emitPackageRefund } = usePackageEmitter()
// #endregion

// #region 使用 Store
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
// #endregion

// #region 定义响应式数据
// 筛选条件：默认获取这一年的数据
type FilterValue = string | number | number[] | [number, number]
const filters = ref<FilterValue[]>([
  [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()],
  ALL,
])

// 退款弹框相关
const showRefundModal = ref(false)
const currentRefundId = ref<number>()
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
    title: '套餐购买状态',
    type: 'select',
    options: [{ label: '全部', value: ALL }, ...PACKAGE_BUY_STATUS_OPTIONS],
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
} = useRefresh<Pkg.Query.IPackagePurchaseVo>({
  get: params =>
    getStudentPackagesApi({
      ...params,
      deviceType: currentStudentStore.deviceType,
    }),
  listField: 'packages',
  immediate: false,
})

// #endregion

// #region 定义计算属性
// 检查是否存在待审核的退款申请
const hasPendingRefund = computed(() => {
  return !!pendingRefundInfo.value
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

/** 跳转到套餐记录详情 */
function goToPackageDetail(_event: Event, record: Pkg.Query.IPackagePurchaseVo) {
  const orderNo = record.paymentOrderNo || ''
  const packageRecordId = record.id
  uni.navigateTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?type=purchase&orderNo=${orderNo}&packageRecordId=${packageRecordId}` })
}

/** 取消订单 */
async function handleCancelOrder(record: Pkg.Query.IPackagePurchaseVo) {
  await axiosPostCancelPaymentApi(
    { orderNo: String(record.paymentOrderNo) },
    {
      onSuccess: () => {
        // 发送套餐交易事件
        emitPackageTransaction()

        // 根据record.id更新对应item的状态
        const index = recordsList.value.findIndex(item => item.id === record.id)
        if (index !== -1) {
          // 更新订单状态为已取消
          recordsList.value[index].status = PACKAGE_BUY_STATUS.CANCELLED
          recordsList.value[index].statusText
            = PACKAGE_BUY_STATUS_I18N[PACKAGE_BUY_STATUS.CANCELLED]
        }
      },
      onError: () => {
        // 发送套餐交易事件（失败情况）
        emitPackageTransaction()
      },
    },
  )
}

/** 支付订单 */
async function handlePayOrder(record: Pkg.Query.IPackagePurchaseVo) {
  await axiosPostContinuePaymentApi(
    { orderNo: String(record.paymentOrderNo), paymentMethod: PAYMENT_METHOD.WECHAT },
    {
      onSuccess: (orderId) => {
        emitPackageTransaction()
        uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?type=purchase&orderNo=${orderId}` })
      },
      onError: () => {
        emitPackageTransaction()
      },
    },
  )
}

/** 申请退款 */
function handleRefundRequest(record: Pkg.Query.IPackagePurchaseVo) {
  currentRefundId.value = record.id
  showRefundModal.value = true
}

/** 退款申请成功 */
function handleRefundSuccess(id: number) {
  const record = recordsList.value.find(item => item.id === id)
  const packageName = record?.snapshotInfo?.packageCode || ''
  const amount = record?.purchasePrice || ''
  const query = `type=refund&amount=${amount}&packageName=${encodeURIComponent(packageName)}`
  uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?${query}` })
}

/** 取消退款申请 */
async function handleCancelRefund(record: Pkg.Query.IPackagePurchaseVo) {
  if (!pendingRefundInfo.value?.refundApplicationId) {
    toast.show('无法获取退款申请信息')
    return
  }

  try {
    const result = await postCancelPackageRefundApi(pendingRefundInfo.value.refundApplicationId)

    if (result.code === 0) {
      toast.show('取消退款申请成功')

      // 根据 record.id 更新状态
      const index = recordsList.value.findIndex(item => item.id === record.id)
      if (index !== -1) {
        // 更新记录状态为已购买（或其他适合的状态）
        recordsList.value[index].status = PACKAGE_BUY_STATUS.ACTIVE
        recordsList.value[index].statusText = PACKAGE_BUY_STATUS_I18N[PACKAGE_BUY_STATUS.ACTIVE]
      }

      // 发送套餐退款事件
      emitPackageRefund()
    }
  }
  catch (error) {
    console.error('取消退款申请失败:', error)
    toast.show('取消退款申请失败，请重试')
  }
}
// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
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
    title="套餐购买记录"
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

    <!-- 退款申请弹框 -->
    <RefundModal
      :id="currentRefundId"
      v-model:visible="showRefundModal"
      @success="handleRefundSuccess"
    />

    <!-- 套餐记录列表 -->
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
        <HistoryItem
          v-for="record in recordsList"
          :key="record.id"
          :record="record"
          :has-pending-refund="hasPendingRefund"
          @click="goToPackageDetail"
          @cancel="handleCancelOrder"
          @pay="handlePayOrder"
          @refund="handleRefundRequest"
          @cancel-refund="handleCancelRefund"
        />
      </view>
    </RefreshList>
  </Page>
</template>
