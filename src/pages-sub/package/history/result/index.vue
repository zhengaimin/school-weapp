<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "操作结果"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { ResultCard, ResultItem } from '@/components/common/result-view/index.vue'
import dayjs from 'dayjs'
import { computed, ref, unref } from 'vue'
import { getPackageOrderDetailApi } from '@/api/modules/package/payment'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import ResultView from '@/components/common/result-view/index.vue'
import {
  DEVICE_TYPE,
  PACKAGE_STATUS_CONFIGS,
  PACKAGE_TYPE_I18N,
  PAYMENT_METHOD,
} from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import RefundModal from '../../components/RefundModal.vue'
import { usePackage } from '../../hooks/usePackage'
import { usePayment } from '../../hooks/usePayment'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginFail, batchRequestHandler, getContentHeight } = usePage()
const { emitPackageTransaction, emitPackageRefund } = usePackageEmitter()
const { pendingPayment, axiosGetPendingPaymentApi } = usePackage()
const { axiosPostCancelPaymentApi, axiosPostContinuePaymentApi, cancelLoading, continueLoading }
  = usePayment()

const orderDetail = ref<Pkg.Payment.ResGetOrderDetailApi | null>(null)
const refundModalVisible = ref(false)

/** 是否显示待支付订单 */
const hasPendingPayment = computed(() => {
  return Boolean(pendingPayment.value?.hasPending && pendingPayment.value?.orderNo)
})
/** 是否显示退费按钮 */
const showRefundButton = computed(() => {
  return orderDetail.value?.canRefund ?? false
})
/** 是否需要显示底部按钮区域 */
const showButtonArea = computed(() => {
  return showRefundButton.value || hasPendingPayment.value
})
/** 计算内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight(unref(showButtonArea) ? '164rpx' : '0')
})

const orderCards = computed<ResultCard[]>(() => {
  if (!orderDetail.value) return []

  const items: ResultItem[] = [
    {
      key: 'orderNo',
      label: '订单号',
      value: orderDetail.value.orderNo,
    },
    {
      key: 'status',
      label: '购买状态',
      value: PACKAGE_STATUS_CONFIGS[orderDetail.value.status].label,
    },
    {
      key: 'amount',
      label: '支付金额',
      value: `¥${orderDetail.value.amount}`,
      valueClass: 'text-base text-primary font-medium',
    },
  ]

  if (orderDetail.value.payTime) {
    items.push({
      key: 'payTime',
      label: '支付时间',
      value: formatDateTime(orderDetail.value.payTime),
    })
  }

  items.push(
    { key: 'divider-1', type: 'divider' },
    {
      key: 'studentName',
      label: '学生姓名',
      value: orderDetail.value.studentName,
    },
    {
      key: 'studentCode',
      label: '学号',
      value: orderDetail.value.studentCode,
    },
    {
      key: 'schoolName',
      label: '学校',
      value: orderDetail.value.schoolName,
    },
    {
      key: 'className',
      label: '班级',
      value: orderDetail.value.className,
    },
    { key: 'divider-2', type: 'divider' },
    {
      key: 'packageType',
      label: '套餐名称',
      value: PACKAGE_TYPE_I18N[orderDetail.value.packageType],
    },
    {
      key: 'totalMonths',
      label: '套餐时长',
      value: `${orderDetail.value.totalMonths}个月`,
    },
  )

  if (orderDetail.value.startDate && orderDetail.value.endDate) {
    items.push({
      key: 'validDate',
      label: '有效期',
      value: `${formatDate(orderDetail.value.startDate)} ~ ${formatDate(orderDetail.value.endDate)}`,
    })
  }

  if (orderDetail.value.packageContent.deviceType === DEVICE_TYPE.DRYER) {
    items.push({
      key: 'dryerMinutes',
      label: '吹风时长',
      value: `${orderDetail.value.packageContent.dryerMinutes}分钟`,
    })
  } else {
    items.push(
      {
        key: 'videoCallMinutes',
        label: '视频通话',
        value: `${orderDetail.value.packageContent.videoCallMinutes}分钟`,
      },
      {
        key: 'messageCount',
        label: '留言条数',
        value: orderDetail.value.packageContent.messageCount === -1
          ? '不限'
          : `${orderDetail.value.packageContent.messageCount}条`,
      },
    )
  }

  return [{ key: 'package', items }]
})

/** 格式化日期（只保留年月日） */
function formatDate(date: string | null) {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

/** 格式化日期时间（年月日时分秒） */
function formatDateTime(date: string | null) {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/** 获取套餐订单详情 */
async function axiosGetPackageOrderDetailApi(orderNo: string) {
  try {
    const result = await getPackageOrderDetailApi({ orderNo })
    if (result.code === 0) {
      orderDetail.value = result.data
    }
    return result
  } catch (error) {
    console.error('获取套餐订单详情失败:', error)
    throw error
  }
}

/** 申请退费 */
function handleGoToRefund() {
  if (!orderDetail.value?.packageRecordId) {
    return
  }
  refundModalVisible.value = true
}
/** 取消待支付订单 */
async function handleCancelPayment() {
  if (!pendingPayment.value?.orderNo) return

  await axiosPostCancelPaymentApi(
    { orderNo: pendingPayment.value.orderNo },
    {
      onSuccess: () => {
        emitPackageTransaction()
        refreshPageData()
      },
    },
  )
}
/** 继续支付 */
async function handleContinuePayment() {
  if (!pendingPayment.value?.orderNo) return

  await axiosPostContinuePaymentApi(
    { orderNo: pendingPayment.value.orderNo, paymentMethod: PAYMENT_METHOD.WECHAT },
    {
      onSuccess: (orderId) => {
        emitPackageTransaction()
        uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${orderId}` })
      },
    },
  )
}

/** 退款申请成功 */
function handleRefundSuccess() {
  emitPackageRefund(orderDetail.value?.packageRecordId)
  refreshPageData()
}

/** 刷新页面数据 */
function refreshPageData() {
  const { query } = currRoute()

  if (query?.orderNo) {
    batchRequestHandler([
      axiosGetPackageOrderDetailApi(query.orderNo as string),
      axiosGetPendingPaymentApi(),
    ])
  }
}

function onLoginSuccess() {
  refreshPageData()
}
</script>

<template>
  <Page
    title="套餐结果"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
      <view p="x-4 t-2 b-4" relative z-1>
        <ResultView
          v-if="orderDetail"
          :icon-name="PACKAGE_STATUS_CONFIGS[orderDetail.status].icon"
          :icon-color="PACKAGE_STATUS_CONFIGS[orderDetail.status].iconColor"
          :status-text="PACKAGE_STATUS_CONFIGS[orderDetail.status].label"
          :cards="orderCards"
        />
      </view>
    </scroll-view>

    <!-- 底部按钮区域 -->
    <view v-if="showButtonArea" p="x-4 y-3" flex gap="4" border="t gray-100">
      <!-- 取消待支付订单 -->
      <TButton
        v-if="hasPendingPayment"
        type="warning"
        size="large"
        full
        flex-1
        :loading="cancelLoading"
        @click="handleCancelPayment"
      >
        取消支付
      </TButton>
      <!-- 继续支付 -->
      <TButton
        v-if="hasPendingPayment"
        type="primary"
        size="large"
        full
        flex-1
        :loading="continueLoading"
        @click="handleContinuePayment"
      >
        继续支付
      </TButton>
      <!-- 申请退费 -->
      <TButton
        v-if="showRefundButton"
        type="primary"
        size="large"
        full
        flex-1
        @click="handleGoToRefund"
      >
        申请退费
      </TButton>
    </view>

    <!-- 退费弹窗 -->
    <RefundModal
      :id="orderDetail?.packageRecordId"
      v-model:visible="refundModalVisible"
      @success="handleRefundSuccess"
    />
  </Page>
</template>
