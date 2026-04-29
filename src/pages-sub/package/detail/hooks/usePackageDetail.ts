import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getPackageDetailApi } from '@/api/modules/package/query'
import { DEVICE_TYPE, PACKAGE_TYPE, PAYMENT_METHOD } from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'
import { usePackage } from '../../hooks/usePackage'
import { usePayment } from '../../hooks/usePayment'
import { PACKAGE_DETAIL_BUTTON_AREA_HEIGHT } from '../constants'

/**
 * 套餐详情页逻辑
 * @returns 套餐详情页所需状态与事件
 */
export function usePackageDetail() {
  const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
  const { emitPackageTransaction } = usePackageEmitter()
  const currentStudentStore = useCurrentStudentStore()
  const { devices } = storeToRefs(currentStudentStore)
  const {
    activePackage,
    pendingPayment,
    axiosGetStudentActivePackageApi,
    axiosGetPendingPaymentApi,
  } = usePackage()
  const {
    axiosPostPurchasePackageApi,
    axiosPostCancelPaymentApi,
    axiosPostContinuePaymentApi,
    purchaseLoading,
    cancelLoading,
    continueLoading,
  } = usePayment()

  const packageDetail = ref<Pkg.Query.ResGetPackageDetailApi>()

  /** 当前套餐对应设备类型（无详情时回退学生首台设备类型） */
  const packageDeviceType = computed(
    () => packageDetail.value?.deviceType || devices.value?.[0]?.deviceType,
  )
  const isVideoDevice = computed(() => packageDeviceType.value === DEVICE_TYPE.VIDEO)
  const hasPendingPayment = computed(() => {
    return !!pendingPayment.value?.hasPending
  })

  /**
   * 是否显示购买按钮
   * 购买规则：
   * 1. 通用套餐可以叠加购买
   * 2. 固定套餐不能叠加购买
   * 3. 通用套餐、固定套餐互斥（不能同时拥有）
   */
  const showPurchaseButton = computed(() => {
    if (hasPendingPayment.value) return false
    if (!packageDetail.value) return false
    const currentType = activePackage.value?.snapshotInfo?.packageType
    const targetType = packageDetail.value.packageType
    // 没有已激活套餐，可以购买任何套餐
    if (!activePackage.value) return true
    // 已有通用套餐，只能叠加购买通用套餐
    if (currentType === PACKAGE_TYPE.GENERAL && targetType === PACKAGE_TYPE.GENERAL) {
      return true
    }
    // 其他情况不能购买（固定套餐不能叠加、通用与固定互斥）
    return false
  })
  const shouldShowContent = computed(() => {
    return packageDetail.value?.isPackageExists !== false
  })
  const showButtonArea = computed(() => {
    if (!shouldShowContent.value) return false
    return showPurchaseButton.value || hasPendingPayment.value
  })
  const contentHeight = computed(() => {
    return getContentHeight(showButtonArea.value ? PACKAGE_DETAIL_BUTTON_AREA_HEIGHT : '0')
  })

  /** 刷新页面数据 */
  function refreshPageData() {
    const { query } = currRoute()
    if (!query.id) return
    const packageId = Number(query.id)
    if (Number.isNaN(packageId)) return
    batchRequestHandler([
      axiosGetPackageDetailApi(packageId),
      axiosGetStudentActivePackageApi(),
      axiosGetPendingPaymentApi(),
    ])
  }

  /** 获取套餐详情 */
  async function axiosGetPackageDetailApi(id: number) {
    try {
      const result = await getPackageDetailApi(id)
      if (result.code === 0) {
        packageDetail.value = result.data
      }
      return result
    } catch (error) {
      console.error('获取套餐详情失败:', error)
      throw error
    }
  }

  /** 购买套餐 */
  async function handleGoToPurchase() {
    if (!packageDetail.value?.packageTemplateId) {
      toast.show('套餐信息不完整')
      return
    }
    await axiosPostPurchasePackageApi(
      {
        packageId: packageDetail.value.packageTemplateId,
        paymentMethod: PAYMENT_METHOD.WECHAT,
      },
      {
        onSuccess: (orderId) => {
          emitPackageTransaction()
          uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${orderId}` })
        },
        onError: (error) => {
          console.error('购买套餐失败:', error)
          emitPackageTransaction()
        },
      },
    )
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
          uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?type=purchase&orderNo=${orderId}` })
        },
      },
    )
  }

  /** 登录成功处理 */
  function onLoginSuccess() {
    refreshPageData()
  }

  return {
    pageLoading,
    pageError,
    onLoginFail,
    packageDetail,
    isVideoDevice,
    hasPendingPayment,
    showPurchaseButton,
    showButtonArea,
    contentHeight,
    purchaseLoading,
    cancelLoading,
    continueLoading,
    onLoginSuccess,
    handleGoToPurchase,
    handleCancelPayment,
    handleContinuePayment,
  }
}
