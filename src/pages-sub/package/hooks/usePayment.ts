import type { Pkg } from '@/api/interface/modules/package'
import { computed, ref } from 'vue'
import {
  getPendingPaymentApi,
  getStudentActivePackageApi,
  postCancelPaymentApi,
  postContinuePaymentApi,
  postPurchasePackageApi,
} from '@/api/modules/package'
import { getCheckPendingApi } from '@/api/modules/package/refund'
import { getPaymentStatusApi } from '@/api/modules/payment'
import { PACKAGE_TYPE } from '@/constant/modules/business/package'
import { usePackageStore } from '@/store/package'
import { useMessage } from '@/uni_modules/wot-design-uni'
import { toast } from '@/utils/toast'
import { requestWxPayment } from '@/utils/uni'

export function usePayment() {
  const message = useMessage()
  const packageStore = usePackageStore()

  const purchaseLoading = ref(false)
  const continueLoading = ref(false)
  const cancelLoading = ref(false)
  const activePackageTotal = ref(null)

  // 响应式数据
  const pendingPayment = ref<Pkg.Payment.ResGetPendingPaymentApi>()
  const hasPendingRefund = ref(false)
  const pendingRefundInfo = ref<Pkg.Refund.IPendingApplication>()

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

  // 获取学生当前正在使用的套餐
  async function axiosGetStudentActivePackageApi() {
    try {
      const result = await getStudentActivePackageApi()
      if (result.code === 0) {
        if (result.data.activePackages?.length) {
          // 存储活跃套餐数据
          packageStore.setActivePackage(result.data.activePackages[0])
        }
        else {
          // 存储活跃套餐数据
          packageStore.setActivePackage(null)
        }

        activePackageTotal.value = result.data?.totalCount
      }

      return result
    }
    catch (error) {
      console.error('获取学生当前套餐失败:', error)
      return { code: -1 }
    }
  }

  // 查询当前是否存在待支付的套餐订单
  async function axiosGetPendingPaymentApi() {
    try {
      const result = await getPendingPaymentApi()
      if (result.code === 0) {
        pendingPayment.value = result.data
        packageStore.setPendingPayment(result.data)
      }
      return result
    }
    catch (error) {
      console.error('获取待支付订单失败:', error)
      throw error
    }
  }

  // 检查是否存在待审核的套餐退费申请
  async function axiosGetCheckPendingApi() {
    try {
      const result = await getCheckPendingApi()
      if (result.code === 0) {
        hasPendingRefund.value = result.data.hasPendingAudit
        pendingRefundInfo.value = result.data.pendingApplication
        packageStore.setPendingRefundInfo(result.data.pendingApplication, result.data.hasPendingAudit)
      }
      return result
    }
    catch (error) {
      console.error('检查待审核退费申请失败:', error)
      throw error
    }
  }

  // 判断当前活跃套餐是否为固定套餐
  const isFixedPackageActive = computed(() => {
    return (
      packageStore.activePackage
      && packageStore.activePackage.snapshotInfo.packageType === PACKAGE_TYPE.FIXED
    )
  })

  // 判断当前活跃套餐是否为通用套餐
  const isGeneralPackageActive = computed(() => {
    return (
      packageStore.activePackage
      && packageStore.activePackage.snapshotInfo.packageType === PACKAGE_TYPE.GENERAL
    )
  })

  return {
    axiosPostPurchasePackageApi,
    axiosPostContinuePaymentApi,
    axiosPostCancelPaymentApi,
    axiosGetPendingPaymentApi,
    axiosGetCheckPendingApi,
    axiosGetStudentActivePackageApi,

    purchaseLoading,
    continueLoading,
    cancelLoading,
    pendingPayment,
    hasPendingRefund,
    pendingRefundInfo,
    isFixedPackageActive,
    isGeneralPackageActive,
    activePackageTotal,
  }
}
