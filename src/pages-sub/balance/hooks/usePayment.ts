import type { Payment } from '@/api/interface/modules/payment'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import {
  getPaymentStatusApi,
  postCancelPaymentRecordApi,
  postContinueApi,
  postRechargeApi,
} from '@/api/modules/payment'
import { USER_TYPE } from '@/constant/modules'
import { useUserStore } from '@/store/user'
import { useMessage } from '@/uni_modules/wot-design-uni'
import { toast } from '@/utils/toast'
import { requestWxPayment } from '@/utils/uni'

export function usePayment() {
  const message = useMessage()
  const userStore = useUserStore()

  const { currentStudent, userInfo } = storeToRefs(userStore)

  const cancelLoading = ref(false)
  const rechargeLoading = ref(false)
  // 支付订单
  async function axiosPostPayApi(
    record: Payment.Order.IPaymentRecordVo,
    callback?: {
      onSuccess?: (data: Payment.Status.ResGetPaymentStatusApi) => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) {
    try {
      await message.confirm({
        title: '确认支付',
        msg: `确认支付¥${Number(record.amount).toFixed(2)}？`,
      })
    }
    catch (error) {
      return // 用户取消操作
    }

    try {
      uni.showLoading({ title: '支付中' })

      // 调用继续支付接口
      const continueResult = await postContinueApi({
        orderNo: record.orderNo,
        paymentMethod: record.paymentMethod,
      })

      if (continueResult.code !== 0 || !continueResult.data) {
        callback?.onError?.(new Error('继续支付失败'))
        return
      }

      // 发起支付
      await requestWxPayment(continueResult.data.payParams)

      // 支付成功后，查询支付状态
      const statusResult = await getPaymentStatusApi({ orderNo: record.orderNo })
      if (statusResult.code === 0 && statusResult.data.status === 1) {
        callback?.onSuccess?.(statusResult.data)
      }
      else {
        const error = new Error(statusResult.data?.statusText || '支付失败或状态异常')
        toast.show(error.message)
        callback?.onError?.(error)
      }
    }
    catch (error: any) {
      callback?.onError?.(error)
    }
    finally {
      uni.hideLoading()
      callback?.onFinally?.()
    }
  }

  // 取消订单
  async function axiosPostCancelPaymentRecordApi(
    record: Payment.Order.IPaymentRecordVo,
    callback?: {
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
    catch (error) {
      return // 用户取消操作
    }

    cancelLoading.value = true
    try {
      const result = await postCancelPaymentRecordApi({ orderNo: record.orderNo })

      if (result.code === 0) {
        toast.show('订单已取消')
        callback?.onSuccess?.()
      }
      else {
        const error = new Error('取消订单失败')
        toast.show(error.message)
        callback?.onError?.(error)
      }
    }
    catch (error) {
      callback?.onError?.(error)
    }
    finally {
      cancelLoading.value = false
      callback?.onFinally?.()
    }
  }

  // 充值订单
  async function axiosPostRechargeApi(
    amount: number,
    paymentMethod: string,
    callback: {
      onSuccess?: (data: Payment.Status.ResGetPaymentStatusApi) => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) {
    try {
      await message.confirm({
        title: '确认充值',
        msg: `确认充值¥${amount}？`,
      })
    }
    catch (error) {
      return // 用户取消操作
    }

    try {
      uni.showLoading({ title: '正在创建订单...' })
      const { userType } = unref(userInfo) || {}
      const { studentId } = unref(currentStudent) || {}

      // 第一步：创建订单
      if (userType !== USER_TYPE.PARENT || !studentId) {
        const error = new Error('当前用户不是家长或未绑定孩子')
        toast.show(error.message)
        callback?.onError?.(error)
        return
      }

      const result = await postRechargeApi({
        amount: String(amount),
        paymentMethod,
        studentId,
      })

      if (result.code !== 0 || !result.data) {
        const error = new Error('创建订单失败')
        callback?.onError?.(error)
        return
      }

      uni.hideLoading()

      // 发起支付
      await requestWxPayment(result.data.payParams)

      // 支付成功后，查询支付状态
      const statusResult = await getPaymentStatusApi({ orderNo: result.data.orderNo })
      if (statusResult.code === 0) {
        callback?.onSuccess?.(statusResult.data)
      }
      else {
        // 处理支付失败或状态查询失败的情况
        const error = new Error(statusResult.data?.statusText || '支付失败或状态异常')
        callback?.onError?.(error)
      }
    }
    catch (error: any) {
      uni.hideLoading()
      callback?.onError?.(error)
    }
    finally {
      callback?.onFinally?.()
    }
  }

  return {
    axiosPostPayApi,
    axiosPostCancelPaymentRecordApi,
    axiosPostRechargeApi,

    cancelLoading,
    rechargeLoading,
  }
}
