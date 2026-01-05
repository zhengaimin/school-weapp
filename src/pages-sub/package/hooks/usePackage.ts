import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getCheckPendingApi, getPendingPackagePaymentApi, getStudentActivePackageApi } from '@/api/modules'
import { PACKAGE_TYPE } from '@/constant/modules/business/package'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

export function usePackage() {
  const parentStore = useParentStore()
  const currentStudentStore = useCurrentStudentStore()
  const { deviceType } = storeToRefs(currentStudentStore)

  const activePackage = ref<Pkg.Query.IStudentActivePackageVo | null>(null)
  const activePackageTotal = ref<number | null>(null)
  const allPurchasedPackages = ref<Pkg.Query.IStudentActivePackageVo[]>([])
  const purchasedPackageIds = ref<Set<number>>(new Set())
  const pendingPayment = ref<Pkg.Payment.ResGetPendingPaymentApi | null>(null)
  const pendingRefundInfo = ref<Pkg.Refund.IPendingApplication | null>(null)
  const hasPendingRefund = ref(false)

  /** 获取学生当前正在使用的套餐 */
  async function axiosGetStudentActivePackageApi() {
    try {
      const result = await getStudentActivePackageApi()
      if (result.code === 0) {
        const allPackages = [
          ...(result.data.activePackages || []),
          ...(result.data.waitingPackages || []),
        ]
        allPurchasedPackages.value = allPackages
        purchasedPackageIds.value = new Set(allPackages.map(pkg => pkg.packageId))
        activePackage.value = result.data.activePackages?.[0] ?? null
        activePackageTotal.value = result.data?.totalCount ?? null
      }
      return result
    }
    catch (error) {
      console.error('获取学生当前套餐失败:', error)
      return { code: -1 }
    }
  }

  /** 查询当前是否存在待支付的套餐订单 */
  async function axiosGetPendingPaymentApi() {
    try {
      const result = await getPendingPackagePaymentApi({ deviceType: unref(deviceType) })
      if (result.code === 0) {
        pendingPayment.value = result.data
      }
      return result
    }
    catch (error) {
      console.error('获取待支付订单失败:', error)
      throw error
    }
  }

  /** 检查是否存在待审核的套餐退费申请 */
  async function axiosGetCheckPendingApi() {
    try {
      const result = await getCheckPendingApi({ deviceType: unref(deviceType) })
      if (result.code === 0) {
        hasPendingRefund.value = result.data.hasPendingAudit
        pendingRefundInfo.value = result.data.pendingApplication ?? null
      }
      return result
    }
    catch (error) {
      console.error('检查待审核退费申请失败:', error)
      throw error
    }
  }

  /** 判断当前活跃套餐是否为固定套餐 */
  const isFixedPackageActive = computed(() => {
    return activePackage.value?.snapshotInfo.packageType === PACKAGE_TYPE.FIXED
  })

  /** 判断当前活跃套餐是否为通用套餐 */
  const isGeneralPackageActive = computed(() => {
    return activePackage.value?.snapshotInfo.packageType === PACKAGE_TYPE.GENERAL
  })

  return {
    activePackage,
    activePackageTotal,
    allPurchasedPackages,
    purchasedPackageIds,
    pendingPayment,
    pendingRefundInfo,
    hasPendingRefund,
    axiosGetStudentActivePackageApi,
    axiosGetPendingPaymentApi,
    axiosGetCheckPendingApi,
    isFixedPackageActive,
    isGeneralPackageActive,
  }
}
