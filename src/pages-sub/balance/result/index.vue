<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "充值成功"
  }
}
</route>

<script lang="ts" setup>
import type { Payment } from '@/api/interface/modules/payment'
import type { ResultCard, ResultItem } from '@/components/common/result-view/index.vue'
import type { TPaymentStatus } from '@/constant/modules'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getPaymentDetailApi } from '@/api/modules/payment/order'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import ResultView from '@/components/common/result-view/index.vue'
import { DEVICE_TYPE_I18N, PAYMENT_STATUS, RECHARGE_RESULT_STATUS_CONFIG } from '@/constant/modules'
import { usePage } from '@/hooks/usePage'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useUserStore } from '@/store/user'
import { currRoute } from '@/utils'
import { useBalanceEmitter } from '@/utils/emit/balance'
import { formatTime } from '@/utils/format'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { axiosPostPayApi, axiosPostCancelPaymentRecordApi, cancelLoading } = usePayment()
const { emitRechargeSuccess } = useBalanceEmitter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

/** 充值结果信息 */
const resultInfo = ref<
  | (Omit<Payment.Order.ResGetPaymentDetailApi, 'status' | 'amount'> & {
    status: TPaymentStatus
    amount: number
  })
  | undefined
    >(undefined)

/** 根据充值状态返回对应的配置 */
const statusConfig = computed(() => {
  const { status } = unref(resultInfo) || {}
  if (status === undefined) {
    return RECHARGE_RESULT_STATUS_CONFIG[PAYMENT_STATUS.PENDING]
  }
  return RECHARGE_RESULT_STATUS_CONFIG[status]
})
/** 是否为本人操作 */
const isSelfOperation = computed(() => {
  const { userId } = unref(userInfo) || {}
  if (!resultInfo.value || !userInfo) {
    return false
  }
  return resultInfo.value.userId === userId
})
/** 是否为待支付状态 */
const isPending = computed(() => {
  return resultInfo.value?.status === PAYMENT_STATUS.PENDING
})
/** 计算内容区域高度 */
const contentHeight = computed(() => {
  const { status } = unref(resultInfo) || {}
  return getContentHeight(status === PAYMENT_STATUS.PENDING ? '164rpx' : '0')
})

const paymentCards = computed<ResultCard[]>(() => {
  if (!resultInfo.value) return []

  const items: ResultItem[] = [
    {
      key: 'orderNo',
      label: '订单号',
      value: resultInfo.value.orderNo || '-',
    },
    {
      key: 'status',
      label: '充值状态',
      value: statusConfig.value.title,
    },
    {
      key: 'amount',
      label: '充值金额',
      value: `¥${resultInfo.value.amount.toFixed(2)}`,
      valueClass: 'text-base text-primary font-medium',
    },
    {
      key: 'deviceType',
      label: '设备类型',
      value: resultInfo.value.deviceType ? DEVICE_TYPE_I18N[resultInfo.value.deviceType] : '-',
    },
  ]

  if (resultInfo.value.payTime) {
    items.push({
      key: 'payTime',
      label: '充值时间',
      value: formatTime(resultInfo.value.payTime),
    })
  } else if (resultInfo.value.createdAt) {
    items.push({
      key: 'createdAt',
      label: '创建时间',
      value: formatTime(resultInfo.value.createdAt),
    })
  }

  items.push(
    { key: 'divider-1', type: 'divider' },
    {
      key: 'studentName',
      label: '学生姓名',
      value: resultInfo.value.studentName || '-',
    },
    {
      key: 'schoolName',
      label: '学校',
      value: resultInfo.value.schoolName || '-',
    },
    {
      key: 'isSelfOperation',
      label: '是否本人操作',
      value: isSelfOperation.value ? '是' : '否',
    },
  )

  if (resultInfo.value.transactionId) {
    items.push(
      { key: 'divider-2', type: 'divider' },
      {
        key: 'transactionId',
        label: '交易流水号',
        value: resultInfo.value.transactionId,
      },
    )
  }

  return [{ key: 'payment', items }]
})

/** 获取支付详情 */
async function axiosGetPaymentDetailApi(orderId: number) {
  try {
    if (!orderId) {
      throw new Error('orderId 缺失')
    }
    const result = await getPaymentDetailApi(orderId)
    if (result.code === 0 && result.data) {
      resultInfo.value = {
        ...result.data,
        amount: +result.data.amount,
        status: result.data.status as TPaymentStatus,
      }
    }
    return result
  } catch (error) {
    console.error('获取支付详情失败:', error)
    throw error
  }
}

/** 继续支付 */
async function handleContinuePayment() {
  if (!resultInfo.value) return

  const paymentRecord: Payment.Order.IPaymentRecordVo = {
    ...resultInfo.value,
    amount: String(resultInfo.value.amount),
    userName: resultInfo.value.userName || '',
    createdAt: resultInfo.value.createdAt || '',
  }

  await axiosPostPayApi(paymentRecord, {
    onSuccess: () => {
      if (!resultInfo.value) return
      resultInfo.value.status = PAYMENT_STATUS.SUCCESS
      emitRechargeSuccess({
        orderNo: resultInfo.value.orderNo,
        amount: resultInfo.value.amount,
        status: resultInfo.value.status,
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    },
  })
}
/** 取消订单 */
async function handleCancelOrder() {
  if (!resultInfo.value) return

  const paymentRecord: Payment.Order.IPaymentRecordVo = {
    ...resultInfo.value,
    amount: String(resultInfo.value.amount),
    userName: resultInfo.value.userName || '',
    createdAt: resultInfo.value.createdAt || '',
  }

  await axiosPostCancelPaymentRecordApi(paymentRecord, {
    onSuccess: () => {
      if (!resultInfo.value) return
      resultInfo.value.status = PAYMENT_STATUS.CANCELLED
      emitRechargeSuccess({
        orderNo: resultInfo.value.orderNo,
        amount: resultInfo.value.amount,
        status: resultInfo.value.status,
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    },
  })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  const { query } = currRoute()
  const orderId = Number(query.orderId)
  batchRequestHandler([axiosGetPaymentDetailApi(orderId)])
}

onShareAppMessage(() => {
  if (!resultInfo.value) {
    return {
      title: '充值结果',
      path: '/pages/index/index',
    }
  }
  return {
    title: '充值结果',
    path: `/pages-sub/balance/result/index?orderId=${resultInfo.value.id}`,
  }
})
</script>

<template>
  <Page
    title="充值结果"
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
          v-if="resultInfo"
          :icon-name="statusConfig.iconName"
          :icon-color="statusConfig.iconColor"
          :status-text="statusConfig.title"
          :cards="paymentCards"
        />
      </view>
    </scroll-view>

    <!-- 待支付状态下的操作按钮 -->
    <view v-if="isPending" p="x-4 y-3" flex gap="4" border="t gray-100">
      <TButton
        type="warning"
        size="large"
        full
        flex-1
        :loading="cancelLoading"
        @click="handleCancelOrder"
      >
        取消订单
      </TButton>
      <TButton type="primary" size="large" full flex-1 @click="handleContinuePayment">
        继续支付
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
