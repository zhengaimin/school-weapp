import type { Pkg } from '@/api/interface/modules/package'
import { ref } from 'vue'
import {
  postCancelPaymentApi,
  postContinuePaymentApi,
  postPurchasePackageApi,
} from '@/api/modules/package'
import { getPaymentStatusApi } from '@/api/modules/payment'
import { useMessage } from '@/uni_modules/wot-design-uni'
import { toast } from '@/utils/toast'
import { requestWxPayment } from '@/utils/uni'

export function usePayment() {
  const message = useMessage()

  const purchaseLoading = ref(false)
  const continueLoading = ref(false)
  const cancelLoading = ref(false)

  // 购买套餐
  async function axiosPostPurchasePackageApi(
    params: Pkg.Payment.ReqPostPurchaseApi,
    callbacks?: {
      onSuccess?: () => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) {
    try {
      await message.confirm({
        title: '确认支付',
        msg: `您即将购买该套餐，是否确认？`,
      })
    }
    catch {
      return
    }

    purchaseLoading.value = true
    try {
      uni.showLoading({ title: '正在创建订单...' })
      const result = await postPurchasePackageApi(params)

      if (result.code !== 0 || !result.data) {
        throw new Error('创建订单失败')
      }

      await requestWxPayment(result.data.paymentParams)

      const statusResult = await getPaymentStatusApi({ orderNo: result.data.orderId })
      if (statusResult.code === 0 && statusResult.data?.status === 1) {
        toast.show('支付成功')
        callbacks?.onSuccess?.()
      }
      else {
        throw new Error(statusResult.data?.statusText || '支付失败或状态异常')
      }
    }
    catch (error: any) {
      toast.show(error.message || '操作失败')
      callbacks?.onError?.(error)
    }
    finally {
      uni.hideLoading()
      purchaseLoading.value = false
      callbacks?.onFinally?.()
    }
  }

  // 继续支付
  async function axiosPostContinuePaymentApi(
    params: Pkg.Payment.ReqPostContinuePaymentApi,
    callbacks?: {
      onSuccess?: () => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) {
    continueLoading.value = true
    try {
      uni.showLoading({ title: '支付中...' })
      const result = await postContinuePaymentApi(params)

      if (result.code !== 0 || !result.data) {
        throw new Error('支付失败')
      }

      await requestWxPayment(result.data.paymentParams)

      const statusResult = await getPaymentStatusApi({ orderNo: result.data.orderId })
      if (statusResult.code === 0 && statusResult.data?.status === 1) {
        toast.show('支付成功')
        callbacks?.onSuccess?.()
      }
      else {
        throw new Error(statusResult.data?.statusText || '支付失败或状态异常')
      }
    }
    catch (error: any) {
      toast.show(error.message || '操作失败')
      callbacks?.onError?.(error)
    }
    finally {
      uni.hideLoading()
      continueLoading.value = false
      callbacks?.onFinally?.()
    }
  }

  // 取消支付
  async function axiosPostCancelPaymentApi(
    params: Pkg.Payment.ReqPostCancelPaymentApi,
    callbacks?: {
      onSuccess?: () => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) {
    try {
      await message.confirm({
        title: '取消订单',
        msg: '确定要取消该订单吗？',
      })
    }
    catch {
      return
    }
    cancelLoading.value = true
    try {
      const result = await postCancelPaymentApi(params)
      if (result.code === 0) {
        toast.show('订单已取消')
        callbacks?.onSuccess?.()
      }
      else {
        throw new Error('取消订单失败')
      }
    }
    catch (error: any) {
      toast.show(error.message || '操作失败')
      callbacks?.onError?.(error)
    }
    finally {
      cancelLoading.value = false
      callbacks?.onFinally?.()
    }
  }

  return {
    axiosPostPurchasePackageApi,
    axiosPostContinuePaymentApi,
    axiosPostCancelPaymentApi,
    purchaseLoading,
    continueLoading,
    cancelLoading,
  }
}
