import type { PackageDetail } from '../types'
import type { TPackageKind } from '@/constant/modules'
import { computed, ref } from 'vue'
import { getAvailablePackagesApi, getStudentPackageDetailApi } from '@/api/modules/package'
import { PACKAGE_KIND, PAYMENT_METHOD } from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'
import { usePackage } from '../../hooks/usePackage'
import { usePayment } from '../../hooks/usePayment'
import { PACKAGE_DETAIL_BUTTON_AREA_HEIGHT } from '../constants'

/** 可购买套餐没有单条查询接口，按接口最大分页拉取后匹配套餐 ID */
const AVAILABLE_PAGE_SIZE = 100

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
    axiosPostPurchasePackageApi,
    axiosPostPurchasePlatformPackageApi,
    axiosPostCancelPaymentApi,
    axiosPostContinuePaymentApi,
    purchaseLoading,
    cancelLoading,
    continueLoading,
  } = usePayment()

  const packageDetail = ref<PackageDetail>()
  const isPurchased = ref(false)

  const hasPendingPayment = computed(() => {
    return !!pendingPayment.value?.hasPending
  })

  const showPurchaseButton = computed(() => {
    if (isPurchased.value) return false
    if (hasPendingPayment.value) return false
    return !!packageDetail.value?.purchasable
  })
  const showButtonArea = computed(() => {
    return showPurchaseButton.value || hasPendingPayment.value
  })
  const contentHeight = computed(() => {
    return getContentHeight(showButtonArea.value ? PACKAGE_DETAIL_BUTTON_AREA_HEIGHT : '0')
  })

  /** 刷新页面数据 */
  function refreshPageData() {
    const { query } = currRoute() as {
      path: string
      query: { id?: string, type?: string, packageKind?: TPackageKind }
    }
    if (!query.id) return
    const packageId = Number(query.id)
    if (Number.isNaN(packageId)) return
    const isPurchasedDetail = query.type === 'purchased'
    isPurchased.value = isPurchasedDetail
    batchRequestHandler(isPurchasedDetail
      ? [axiosGetStudentPackageDetailApi(packageId)]
      : [
          axiosGetAvailablePackageDetailApi(packageId, query.packageKind),
          axiosGetPendingPaymentApi(null),
        ])
  }

  /** 获取可购买套餐详情 */
  async function axiosGetAvailablePackageDetailApi(id: number, packageKind?: TPackageKind) {
    try {
      const result = await getAvailablePackagesApi({
        page: 1,
        pageSize: AVAILABLE_PAGE_SIZE,
        packageKind,
      })
      if (result.code === 0) {
        const target = result.data?.packages?.find(item => item.id === id)
        packageDetail.value = target
          ? {
              id: target.id,
              packageKind: target.packageKind,
              packageType: target.packageType,
              packageName: target.packageName || '套餐',
              // 计费模式只属于平台套餐，普通套餐改用套餐类型展示
              pricingMode: target.packageKind === PACKAGE_KIND.PLATFORM
                ? (target.pricingMode || (target.monthlyDecrease ? 'DECREASING' : 'FIXED_TOTAL'))
                : undefined,
              purchasePrice: target.purchasePrice,
              totalMonths: target.totalMonths,
              deviceType: target.deviceType || undefined,
              modules: target.modules ?? [],
              packageContent: target.packageContent,
              startDate: target.startTime,
              endDate: target.endTime,
              description: target.templateDescription,
              usageRules: target.usageRules,
              purchasable: target.purchasable,
            }
          : undefined
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
          id: detail.id,
          packageKind: detail.packageKind,
          packageType: detail.packageType,
          packageName: detail.packageName || '套餐',
          // 已购套餐详情不返回 pricingMode，平台套餐按套餐内容的按月递减开关兜底
          pricingMode: detail.packageKind === PACKAGE_KIND.PLATFORM
            ? (detail.packageContent?.monthlyDecrease ? 'DECREASING' : 'FIXED_TOTAL')
            : undefined,
          purchasePrice: detail.purchasePrice,
          totalMonths: detail.packageContent?.totalMonths,
          deviceType: detail.deviceType,
          modules: detail.modules ?? [],
          packageContent: detail.packageContent,
          startDate: detail.startDate,
          endDate: detail.endDate,
          description: detail.templateDescription,
          usageRules: detail.usageRules,
          purchasable: false,
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
    const detail = packageDetail.value
    if (!detail?.id) {
      toast.show('套餐信息不完整')
      return
    }
    const callbacks = {
      onSuccess: (orderId: string) => {
        emitPackageTransaction()
        uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${orderId}` })
      },
      onError: (error: any) => {
        console.error('购买套餐失败:', error)
        emitPackageTransaction()
      },
    }
    // 平台组合套餐与普通设备套餐的下单入参不同，按套餐来源类型分别提交
    if (detail.packageKind === PACKAGE_KIND.PLATFORM) {
      await axiosPostPurchasePlatformPackageApi({ platformPackageId: detail.id }, callbacks)
      return
    }
    await axiosPostPurchasePackageApi(
      {
        packageId: detail.id,
        packageKind: detail.packageKind,
        paymentMethod: PAYMENT_METHOD.WECHAT,
      },
      callbacks,
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
