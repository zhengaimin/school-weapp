<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import { ref } from 'vue'
import { postCancelPaymentApi, postContinuePaymentApi } from '@/api/modules/package'
import Notice from '@/components/common/notice/index.vue'
import { PAYMENT_METHOD } from '@/constant/modules'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import { requestWxPayment } from '@/utils/uni'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = defineProps<{
  pendingPayment: Pkg.Payment.ResGetPendingPaymentApi | undefined
}>()

const emit = defineEmits<{
  refresh: []
}>()

const continueLoading = ref(false)
const cancelLoading = ref(false)

// 格式化价格显示（前缀人民币符号）
function formatPrice(price: number): string {
  return `¥${price}`
}

// 继续支付已有待支付订单
async function axiosPostContinuePaymentApi() {
  try {
    if (!props.pendingPayment?.orderNo) {
      throw new Error('订单号不存在')
    }

    const params: Pkg.Payment.ReqPostContinuePaymentApi = {
      orderNo: props.pendingPayment.orderNo,
      paymentMethod: PAYMENT_METHOD.WECHAT,
    }

    const result = await postContinuePaymentApi(params)
    return result
  } catch (error) {
    console.error('继续支付失败:', error)
    throw error
  }
}

// 取消支付订单
async function axiosPostCancelPaymentApi() {
  try {
    if (!props.pendingPayment?.orderNo) {
      throw new Error('订单号不存在')
    }

    const result = await postCancelPaymentApi({
      orderNo: props.pendingPayment.orderNo,
    })
    return result
  } catch (error) {
    console.error('取消支付失败:', error)
    throw error
  }
}

// 发起微信支付（在小程序环境下调用微信支付接口）
async function handleWechatPayment(paymentParams: Pkg.Payment.IJsApiPayParams) {
  if (!isMpWeixin) {
    toast.show('当前环境不支持微信支付')
    throw new Error('当前环境不支持微信支付')
  }

  try {
    const res = await requestWxPayment({
      timeStamp: paymentParams.timeStamp,
      nonceStr: paymentParams.nonceStr,
      package: paymentParams.package,
      signType: paymentParams.signType,
      paySign: paymentParams.paySign,
    })
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
    // 通知父组件刷新数据
    emit('refresh')
    return res
  } catch (err: any) {
    if (err.errMsg !== 'requestPayment:fail cancel') {
      uni.showToast({
        title: '支付失败',
        icon: 'none',
      })
    }
    throw err
  }
}

// 继续支付当前待支付订单
async function handleContinuePayment() {
  try {
    continueLoading.value = true
    const result = await axiosPostContinuePaymentApi()
    if (result.code === 0) {
      await handleWechatPayment(result.data.paymentParams)
    }
  } catch (error) {
    toast.show('支付失败，请重试')
  } finally {
    continueLoading.value = false
  }
}

// 取消支付订单
async function handleCancelPayment() {
  try {
    cancelLoading.value = true
    const result = await axiosPostCancelPaymentApi()
    if (result.code === 0) {
      toast.show('订单已取消')
      // 通知父组件刷新数据
      emit('refresh')
    }
  } catch (error) {
    toast.show('取消失败，请重试')
  } finally {
    cancelLoading.value = false
  }
}
</script>

<template>
  <Notice
    type="warning"
    title="当前存在待支付订单，点击查看"
    :content="`订单金额:${formatPrice(pendingPayment?.amount || 0)}`"
    popup-title="待支付订单"
  >
    <text></text>
    <!-- <template #right>
      <view flex="~ items-center" gap="3">
        <view
          text="sm grey-600"
          :class="{ 'opacity-50': continueLoading }"
          @click="handleContinuePayment"
        >
          {{ continueLoading ? '处理中' : '继续支付' }}
        </view>
        <view
          text="sm grey-600"
          :class="{ 'opacity-50': cancelLoading }"
          @click="handleCancelPayment"
        >
          {{ cancelLoading ? '处理中' : '取消' }}
        </view>
      </view>
    </template> -->
  </Notice>
</template>
