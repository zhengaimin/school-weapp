import type { Pkg } from '@/api/interface/modules/package'
import { computed, ref } from 'vue'
import { getPlatformPackageDetailApi, getStudentPackageDetailApi } from '@/api/modules/package'
import { PAYMENT_METHOD } from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
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
  const {
    pendingPayment,
    axiosGetPendingPaymentApi,
  } = usePackage()
  const {
    axiosPostPurchasePlatformPackageApi,
    axiosPostCancelPaymentApi,
    axiosPostContinuePaymentApi,
    purchaseLoading,
    cancelLoading,
    continueLoading,
  } = usePayment()

  const packageDetail = ref<Pkg.Platform.ResGetPlatformPackageDetailApi>()
  const isPurchased = ref(false)

  const hasPendingPayment = computed(() => {
    return !!pendingPayment.value?.hasPending
  })

  const showPurchaseButton = computed(() => {
    if (isPurchased.value) return false
    if (hasPendingPayment.value) return false
    return packageDetail.value?.purchasable !== false
  })
  const showButtonArea = computed(() => {
    return showPurchaseButton.value || hasPendingPayment.value
  })
  const contentHeight = computed(() => {
    return getContentHeight(showButtonArea.value ? PACKAGE_DETAIL_BUTTON_AREA_HEIGHT : '0')
  })

  /** 刷新页面数据 */
  function refreshPageData() {
    const { query } = currRoute() as { path: string, query: { id?: string, type?: string } }
    if (!query.id) return
    const packageId = Number(query.id)
    if (Number.isNaN(packageId)) return
    const isPurchasedDetail = query.type === 'purchased'
    isPurchased.value = isPurchasedDetail
    batchRequestHandler(isPurchasedDetail
      ? [axiosGetStudentPackageDetailApi(packageId)]
      : [axiosGetPlatformPackageDetailApi(packageId), axiosGetPendingPaymentApi(null)])
  }

  /** 获取套餐详情 */
  async function axiosGetPlatformPackageDetailApi(id: number) {
    try {
      const result = await getPlatformPackageDetailApi(id)
      if (result.code === 0) {
        packageDetail.value = result.data
      }
      return result
    } catch (error) {
      console.error('获取套餐详情失败:', error)
      throw error
    }
  }

  /** 获取学生已购买套餐详情 */
  async function axiosGetStudentPackageDetailApi(id: number) {
    try {
      const result = await getStudentPackageDetailApi(id)
      if (result.code === 0 && result.data) {
        const detail = result.data
        packageDetail.value = {
          ...detail,
          id: detail.platformPackageId ?? detail.id,
          name: detail.packageName || '套餐',
          modules: detail.modules || [],
          deviceType: detail.deviceType,
          pricingMode: 'FIXED_TOTAL',
          monthlyPrice: detail.purchasePrice,
          description: detail.templateDescription,
          templateDescription: detail.templateDescription,
          usageRules: detail.usageRules,
          packageContent: detail.packageContent,
          purchasable: false,
          status: detail.status ?? 0,
          statusText: detail.statusText || '',
        }
      }
      return result
    } catch (error) {
      console.error('获取已购套餐详情失败:', error)
      throw error
    }
  }

  /** 购买套餐 */
  async function handleGoToPurchase() {
    if (!packageDetail.value?.id) {
      toast.show('套餐信息不完整')
      return
    }
    await axiosPostPurchasePlatformPackageApi(
      {
        platformPackageId: packageDetail.value.id,
      },
      {
        onSuccess: (orderId) => {
          emitPackageTransaction()
          uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${orderId}` })
        },
        onError: (error) => {
          console.error('购买平台套餐失败:', error)
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
    isPurchased,
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
