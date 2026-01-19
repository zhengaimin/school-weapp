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
import type { TPaymentStatus } from '@/constant/modules'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getPaymentDetailApi } from '@/api/modules/payment/order'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { PAYMENT_STATUS, RECHARGE_RESULT_STATUS_CONFIG } from '@/constant/modules'
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
  }
  catch (error) {
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
        <!-- 结果图标和状态 -->
        <view v-if="resultInfo" flex="~ row items-center justify-center" gap="3" p="t-4 b-6">
          <Icon
            :name="statusConfig.iconName"
            :icon-color="statusConfig.iconColor"
            icon-size="64rpx"
          />
          <view text="xl gray-900" font="medium">
            {{ statusConfig.title }}
          </view>
        </view>

        <!-- 详情卡片 -->
        <WhiteCard v-if="resultInfo">
          <view flex="~ col" gap="3">
            <!-- 订单信息 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                订单号
              </text>
              <text text="sm gray-900">
                {{ resultInfo.orderNo || '-' }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                充值状态
              </text>
              <text text="sm gray-900">
                {{ statusConfig.title }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                充值金额
              </text>
              <text text="base primary" font="medium">
                ¥{{ resultInfo.amount.toFixed(2) }}
              </text>
            </view>
            <view v-if="resultInfo.payTime" flex="~ row justify-between items-center">
              <text text="sm gray-500">
                充值时间
              </text>
              <text text="sm gray-900">
                {{ formatTime(resultInfo.payTime) }}
              </text>
            </view>
            <view v-else-if="resultInfo.createdAt" flex="~ row justify-between items-center">
              <text text="sm gray-500">
                创建时间
              </text>
              <text text="sm gray-900">
                {{ formatTime(resultInfo.createdAt) }}
              </text>
            </view>

            <!-- 分隔线 -->
            <view h="1px" bg="gray-100" m="y-1" />

            <!-- 学生信息 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                学生姓名
              </text>
              <text text="sm gray-900">
                {{ resultInfo.studentName || '-' }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                学校
              </text>
              <text text="sm gray-900">
                {{ resultInfo.schoolName || '-' }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                是否本人操作
              </text>
              <text text="sm gray-900">
                {{ isSelfOperation ? '是' : '否' }}
              </text>
            </view>

            <!-- 交易流水号 -->
            <template v-if="resultInfo.transactionId">
              <view h="1px" bg="gray-100" m="y-1" />
              <view flex="~ row justify-between items-center">
                <text text="sm gray-500">
                  交易流水号
                </text>
                <text text="sm gray-900">
                  {{ resultInfo.transactionId }}
                </text>
              </view>
            </template>
          </view>
        </WhiteCard>
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
