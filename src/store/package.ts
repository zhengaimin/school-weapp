import type { Pkg } from '@/api/interface/modules/package'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePackageStore = defineStore(
  'package',
  () => {
    // 当前活跃套餐信息
    const activePackage = ref<Pkg.Query.IStudentActivePackageVo | null>(null)

    // 待支付套餐信息
    const pendingPayment = ref<Pkg.Payment.ResGetPendingPaymentApi | null>(null)

    // 待审核套餐信息
    const pendingRefundInfo = ref<Pkg.Refund.IPendingApplication | null>(null)

    // 是否有待审核退款申请
    const hasPendingRefund = ref(false)

    // 设置当前活跃套餐信息
    const setActivePackage = (pkg: Pkg.Query.IStudentActivePackageVo | null) => {
      activePackage.value = pkg
    }

    // 设置待支付套餐信息
    const setPendingPayment = (payment: Pkg.Payment.ResGetPendingPaymentApi | null) => {
      pendingPayment.value = payment
    }

    // 设置待审核套餐信息
    const setPendingRefundInfo = (info: Pkg.Refund.IPendingApplication | null, hasPending: boolean = false) => {
      pendingRefundInfo.value = info
      hasPendingRefund.value = hasPending
    }

    // 清除待支付套餐信息
    const clearPendingPayment = () => {
      pendingPayment.value = null
    }

    // 清除待审核套餐信息
    const clearPendingRefundInfo = () => {
      pendingRefundInfo.value = null
      hasPendingRefund.value = false
    }

    return {
      activePackage,
      pendingPayment,
      pendingRefundInfo,
      hasPendingRefund,
      setActivePackage,
      setPendingPayment,
      setPendingRefundInfo,
      clearPendingPayment,
      clearPendingRefundInfo,
    }
  },
  {
    persist: true,
  },
)
