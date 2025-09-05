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
// #region 导入
import type { Payment } from '@/api/interface/modules/payment'
import type { TPaymentStatus } from '@/constant/modules/payment/recharge'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getPaymentDetailApi } from '@/api/modules/payment/order'
import TButton from '@/components/common/button/index.vue'
import DetailBlock from '@/components/common/detail-block/index.vue'
import Page from '@/components/common/page/index.vue'
import { PAYMENT_STATUS, RECHARGE_RESULT_STATUS_CONFIG } from '@/constant/modules/payment/recharge'
import { usePage } from '@/hooks/usePage'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useUserStore } from '@/store/user'
import { currRoute } from '@/utils'
import { useBalanceEmitter } from '@/utils/emit/balance'
import { formatTime } from '@/utils/time'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { axiosPostPayApi, axiosPostCancelPaymentRecordApi, cancelLoading } = usePayment()
const { emitRechargeSuccess } = useBalanceEmitter()
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// #endregion

// #region 定义响应式数据
// 充值结果信息
const resultInfo = ref<
  | (Omit<Payment.Order.ResGetPaymentDetailApi, 'status' | 'amount'> & {
    status: TPaymentStatus
    amount: number
  })
  | undefined
    >(undefined)
// #endregion

// #region 定义计算属性
// 根据充值状态返回对应的配置
const statusConfig = computed(() => {
  const { status } = unref(resultInfo) || {}

  if (!status) {
    // 默认显示 PENDING 状态
    return RECHARGE_RESULT_STATUS_CONFIG[PAYMENT_STATUS.PENDING]
  }

  return RECHARGE_RESULT_STATUS_CONFIG[status]
})

// 是否为本人操作
const isSelfOperation = computed(() => {
  const { userId } = unref(userInfo) || {}

  if (!resultInfo.value || !userInfo) {
    return false
  }
  return resultInfo.value.userId === userId
})

// 是否为待支付状态
const isPending = computed(() => {
  return resultInfo.value?.status === PAYMENT_STATUS.PENDING
})

// 根据订单状态配置背景气泡颜色
const statusBgColors = computed(() => {
  const status = resultInfo.value?.status
  const colors: Record<TPaymentStatus, string[]> = {
    [PAYMENT_STATUS.PENDING]: ['bg-yellow-200', 'bg-blue-100', 'bg-gray-200'],
    [PAYMENT_STATUS.SUCCESS]: ['bg-green-200', 'bg-cyan-100', 'bg-blue-100'],
    [PAYMENT_STATUS.FAILED]: ['bg-red-200', 'bg-orange-200', 'bg-gray-300'],
    [PAYMENT_STATUS.REFUND]: ['bg-gray-200', 'bg-blue-100', 'bg-gray-300'],
    [PAYMENT_STATUS.CANCELLED]: ['bg-gray-200', 'bg-gray-100', 'bg-gray-300'],
    [PAYMENT_STATUS.EXPIRED]: ['bg-gray-200', 'bg-yellow-100', 'bg-gray-300'],
  }
  if (status === undefined) {
    return colors[PAYMENT_STATUS.PENDING]
  }
  return colors[status as TPaymentStatus]
})

const contentHeight = computed(() => {
  const { status } = unref(resultInfo) || {}
  return getContentHeight(status === PAYMENT_STATUS.PENDING ? '164rpx' : '0')
})

// 充值详情列表
const rechargeItems = computed(() => {
  if (!resultInfo.value) {
    return []
  }

  const {
    studentName,
    studentCode,
    className,
    schoolName,
    amount,
    payTime,
    statusText,
    orderNo,
    transactionId,
    createdAt,
  } = unref(resultInfo)

  const items = [
    { key: 'studentName', label: '学生姓名', value: studentName || '-' },
    { key: 'studentCode', label: '学生学号', value: studentCode || '-' },
    { key: 'className', label: '班级', value: className || '-' },
    { key: 'schoolName', label: '学校', value: schoolName || '-' },
    { key: 'amount', label: '充值金额', value: String(amount ?? '-') },
    {
      key: 'time',
      label: '充值时间',
      value: payTime ? formatTime(payTime) : formatTime(createdAt),
    },
    { key: 'status', label: '交易状态', value: statusText || '-' },
    { key: 'orderNo', label: '订单号', value: orderNo || '-' },
    { key: 'isSelf', label: '是否本人操作', value: isSelfOperation.value ? '是' : '否' },
  ]

  // 如果有交易流水号则显示
  if (transactionId) {
    items.push({ key: 'transactionId', label: '交易流水号', value: transactionId })
  }

  return items
})
// #endregion

// #region 接口请求函数
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
  }
  catch (error) {
    console.error('获取支付详情失败:', error)
    throw error
  }
}
// #endregion

// #region 事件处理函数
// 继续支付
async function handleContinuePayment() {
  if (!resultInfo.value)
    return

  // 转换数据格式以匹配 IPaymentRecordVo 接口
  const paymentRecord: Payment.Order.IPaymentRecordVo = {
    ...resultInfo.value,
    amount: String(resultInfo.value.amount), // 转换为字符串
    userName: resultInfo.value.userName || '',
    createdAt: resultInfo.value.createdAt || '',
  }

  await axiosPostPayApi(paymentRecord, {
    onSuccess: (data) => {
      if (!resultInfo.value)
        return
      // 支付成功后更新状态
      resultInfo.value.status = PAYMENT_STATUS.SUCCESS
      // 发送事件
      emitRechargeSuccess({
        orderNo: resultInfo.value.orderNo,
        amount: resultInfo.value.amount,
        status: resultInfo.value.status,
      })

      // 返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    },
  })
}

// 取消订单
async function handleCancelOrder() {
  if (!resultInfo.value)
    return

  // 转换数据格式以匹配 IPaymentRecordVo 接口
  const paymentRecord: Payment.Order.IPaymentRecordVo = {
    ...resultInfo.value,
    amount: String(resultInfo.value.amount), // 转换为字符串
    userName: resultInfo.value.userName || '',
    createdAt: resultInfo.value.createdAt || '',
  }

  await axiosPostCancelPaymentRecordApi(paymentRecord, {
    onSuccess: () => {
      if (!resultInfo.value)
        return
      // 取消成功后更新状态
      resultInfo.value.status = PAYMENT_STATUS.CANCELLED
      // 发送事件
      emitRechargeSuccess({
        orderNo: resultInfo.value.orderNo,
        amount: resultInfo.value.amount,
        status: resultInfo.value.status,
      })

      // 取消成功后返回充值页面
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    },
  })
}

async function onLoginSuccess() {
  const { query } = currRoute()
  const orderId = Number(query.orderId)
  batchRequestHandler([axiosGetPaymentDetailApi(orderId)])
}
// #endregion
</script>

<template>
  <Page
    title="充值结果"
    :loading="pageLoading"
    :error="pageError"
    :show-bg="!pageLoading"
    :bg-colors="statusBgColors"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view v-if="resultInfo" scroll-y :style="contentHeight">
      <view p="x-4 t-2 b-4" relative z-1>
        <!-- 提示区域 -->
        <view text="center" p="y-8">
          <view text="xl gray-900" font="medium" m="b-2">
            {{ statusConfig.title }}
          </view>
          <view text="sm gray-600">
            {{ statusConfig.description }}
          </view>
        </view>

        <!-- 充值详情 -->
        <DetailBlock :items="rechargeItems" m="b-4">
          <template #amount>
            <text text="primary">
              ¥{{ resultInfo.amount.toFixed(2) }}
            </text>
          </template>
          <template #status>
            <text text="sm accent" font="medium">
              {{ resultInfo.statusText }}
            </text>
          </template>
        </DetailBlock>
      </view>
    </scroll-view>

    <!-- 待支付状态下的操作按钮 -->
    <view v-if="isPending" p="4" flex="~ row" gap="3">
      <TButton type="danger" full size="large" :loading="cancelLoading" @click="handleCancelOrder">
        取消订单
      </TButton>
      <TButton type="primary" full size="large" @click="handleContinuePayment">
        继续支付
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
