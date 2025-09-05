<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐列表"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import { computed, ref } from 'vue'
import {
  getAvailablePackagesApi,
  getPendingPaymentApi,
  getStudentActivePackageApi,
  postCancelPaymentApi,
  postContinuePaymentApi,
} from '@/api/modules/package'
import { getCheckPendingApi, postCancelPackageRefundApi } from '@/api/modules/package/refund'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import Icon from '@/components/icon/index.vue'
import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { PACKAGE_TYPE } from '@/constant/modules/package'
import { PAYMENT_METHOD } from '@/constant/modules/payment'
import { PACKAGE_HISTORY_PATH, PACKAGE_REFUND_HISTORY_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import { requestWxPayment } from '@/utils/uni'
import ActivePackageCard from './components/ActivePackageCard.vue'
import PackageDetailsPopup from './components/PackageDetailsPopup.vue'
import PackageItem from './components/PackageItem.vue'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: packagesList,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IPackage>({
  get: getAvailablePackagesApi,
  immediate: false,
  listField: 'packages',
})
// #endregion

// #region 定义响应式数据
const pendingPayment = ref<Pkg.Payment.ResGetPendingPaymentApi>()
const activePackage = ref<Pkg.Query.IStudentActivePackageVo>()
const showPackageDetails = ref(false)
const selectedPackage = ref<Pkg.Query.IPackage>()
const hasPendingRefund = ref(false)
const pendingRefundInfo = ref<Pkg.Refund.IPendingApplication>()
const cancelRefundLoading = ref(false)
const continueLoading = ref(false)
const cancelLoading = ref(false)
// #endregion

// #region 定义计算属性
const contentStyle = computed(() => {
  return getContentHeight('0')
})
// 是否显示待支付订单
const hasPendingPayment = computed(() => {
  return pendingPayment.value?.hasPending
})
// 是否显示当前激活套餐
const hasActivePackage = computed(() => {
  return !!activePackage.value
})
const isFixedPackageActive = computed(() => {
  return (
    hasActivePackage.value && activePackage.value?.snapshotInfo.packageType !== PACKAGE_TYPE.GENERAL
  )
})
// 是否显示购买按钮
const showPurchaseButton = computed(() => {
  if (!selectedPackage.value)
    return false

  // 当前没有激活套餐可以显示按钮
  if (!hasActivePackage.value)
    return true

  // 当前存在激活套餐，激活套餐、选中套餐类型为统一类型，且都是通用套餐，则可以点击继续购买
  if (
    hasActivePackage.value
    && activePackage.value?.snapshotInfo.packageType === 'GENERAL'
    && selectedPackage.value.packageType === 'GENERAL'
  ) {
    return true
  }

  return false
})

// 是否显示退款按钮
const showRefundButton = computed(() => {
  return hasActivePackage.value
})

// 是否禁用购买按钮
const disablePurchaseButton = computed(() => {
  return hasPendingPayment.value || hasPendingRefund.value
})

// 是否禁用退款按钮
const disableRefundButton = computed(() => {
  return hasPendingPayment.value || hasPendingRefund.value
})
// #endregion

// #region 接口请求函数
// 获取学生当前正在使用的套餐
async function axiosGetStudentActivePackageApi() {
  try {
    const result = await getStudentActivePackageApi()
    if (result.code === 0) {
      // 存储活跃套餐数据
      activePackage.value
        = result.data.activePackages.length > 0 ? result.data.activePackages[0] : undefined
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
    }
    return result
  }
  catch (error) {
    console.error('检查待审核退费申请失败:', error)
    throw error
  }
}

// 取消套餐退费申请
async function axiosPostCancelPackageRefundApi(refundApplicationId: number) {
  try {
    const result = await postCancelPackageRefundApi(refundApplicationId)
    if (result.code === 0) {
      toast.show('退款申请已取消')
      // 重新检查待审核状态
      await axiosGetCheckPendingApi()
    }
    return result
  }
  catch (error) {
    console.error('取消退款申请失败:', error)
    throw error
  }
}

// 继续支付已有待支付订单
async function axiosPostContinuePaymentApi() {
  try {
    if (!pendingPayment.value?.orderNo) {
      throw new Error('订单号不存在')
    }

    const params: Pkg.Payment.ReqPostContinuePaymentApi = {
      orderNo: pendingPayment.value.orderNo,
      paymentMethod: PAYMENT_METHOD.WECHAT,
    }

    const result = await postContinuePaymentApi(params)
    return result
  }
  catch (error) {
    console.error('继续支付失败:', error)
    throw error
  }
}

// 取消支付订单
async function axiosPostCancelPaymentApi() {
  try {
    if (!pendingPayment.value?.orderNo) {
      throw new Error('订单号不存在')
    }

    const result = await postCancelPaymentApi({
      orderNo: pendingPayment.value.orderNo,
    })
    return result
  }
  catch (error) {
    console.error('取消支付失败:', error)
    throw error
  }
}
// #endregion

// #region 方法定义
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
    // 刷新数据
    handleRefreshPaymentNotice()
    return res
  }
  catch (err: any) {
    if (err.errMsg !== 'requestPayment:fail cancel') {
      uni.showToast({
        title: '支付失败',
        icon: 'none',
      })
    }
    throw err
  }
}
// 处理待支付通知的刷新事件
async function handleRefreshPaymentNotice() {
  await Promise.all([
    onRefreshList(),
    axiosGetPendingPaymentApi(),
    axiosGetStudentActivePackageApi(),
    axiosGetCheckPendingApi(),
  ])
}
// #endregion

// #region 事件处理函数
// 跳转到套餐购买历史页面
function handleGoToHistory() {
  uni.navigateTo({ url: PACKAGE_HISTORY_PATH })
}

// 跳转到退款历史页面
function handleGoToRefundHistory() {
  uni.navigateTo({ url: PACKAGE_REFUND_HISTORY_PATH })
}

// 显示套餐详情弹窗并设置选中套餐
function handleShowPackageDetails(pkg: Pkg.Query.IPackage) {
  if (isFixedPackageActive.value) {
    toast.show('您已购买固定套餐，无法叠加购买其他套餐')
    return
  }
  selectedPackage.value = pkg
  showPackageDetails.value = true
}

// 处理当前套餐卡片点击事件，显示详情弹框
function handleShowActivePackageDetails(pkg: Pkg.Query.IStudentActivePackageVo) {
  // 将当前激活套餐转换为普通套餐格式以便在弹框中显示
  const packageData: Pkg.Query.IPackage = {
    id: pkg.packageId,
    templateCode: `ACTIVE_${pkg.packageId}`,
    packageName: pkg.snapshotInfo.packageName,
    packageType: pkg.snapshotInfo.packageType,
    purchasePrice: 0, // 已购买套餐不显示价格
    monthlyPrice: 0,
    totalMonths: pkg.snapshotInfo.totalMonths,
    packageContent: {
      videoCallMinutes: pkg.snapshotInfo.videoCallMinutes,
      messageCount: pkg.snapshotInfo.messageCount,
    },
    templateDescription: '当前使用中的套餐',
    usageRules: '已购买套餐，按套餐规则使用',
    startTime: pkg.startDate,
    endTime: pkg.endDate,
    monthlyDecrease: pkg.snapshotInfo.monthlyDecrease,
  }

  selectedPackage.value = packageData
  showPackageDetails.value = true
}

// 处理弹框退款事件
function handlePackageRefund() {
  hasPendingRefund.value = true
  toast.show('退款申请已提交，请等待审核')
}

// 处理弹框支付事件
function handlePackagePurchase() {
  batchRequestHandler([
    onRefreshList(),
    axiosGetStudentActivePackageApi(),
    axiosGetPendingPaymentApi(),
    axiosGetCheckPendingApi(),
  ])
}

// 取消退款申请
async function handleCancelRefund() {
  if (!pendingRefundInfo.value) {
    toast.show('没有待取消的退款申请')
    return
  }

  try {
    cancelRefundLoading.value = true
    await axiosPostCancelPackageRefundApi(pendingRefundInfo.value.refundApplicationId)
  }
  catch (error) {
    toast.show('取消失败，请重试')
  }
  finally {
    cancelRefundLoading.value = false
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
  }
  catch (error) {
    toast.show('支付失败，请重试')
  }
  finally {
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
      // 刷新数据
      handleRefreshPaymentNotice()
    }
  }
  catch (error) {
    toast.show('取消失败，请重试')
  }
  finally {
    cancelLoading.value = false
  }
}
// #endregion

// #region 生命周期钩子
// 登录成功后的页面初始化逻辑（刷新接口与数据）
async function onLoginSuccess() {
  batchRequestHandler([
    onRefreshList(),
    axiosGetStudentActivePackageApi(),
    axiosGetPendingPaymentApi(),
    axiosGetCheckPendingApi(),
  ])
}
// #endregion
</script>

<template>
  <Page
    title="套餐列表"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #header-right>
      <view flex="~ row items-center justify-center" h-full gap="4">
        <Icon
          name="history-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="handleGoToHistory"
        />
        <Icon
          name="refund-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="handleGoToRefundHistory"
        />
      </view>
    </template>

    <!-- 套餐列表区域（可刷新/上拉） -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :style="contentStyle"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 t-2" flex="~ col" gap="3">
        <!-- 待审核套餐提示 -->
        <Notice
          v-if="hasPendingRefund"
          type="warning"
          title="当前存在待审核退款申请，点击查看"
          popup-title="存在待审核退款申请"
          :popup-content="`当前存在待审核退款申请${pendingRefundInfo.applyAmount}元，是否取消申请？`"
          cancel-button-text="取消申请"
          confirm-button-text="知道了"
          @cancel="handleCancelRefund"
          @confirm="handleCancelRefund"
        />

        <!-- 待支付提醒 -->
        <Notice
          v-if="hasPendingPayment"
          type="warning"
          title="当前存在待支付订单，点击查看"
          popup-title="待支付订单"
          :popup-content="`订单金额: ¥${pendingPayment?.amount || 0}，是否继续支付？`"
          confirm-button-text="继续支付"
          cancel-button-text="取消订单"
          @confirm="handleContinuePayment"
          @cancel="handleCancelPayment"
        />

        <!-- 当前套餐区域（顶部） -->
        <view v-if="hasActivePackage" flex="~ col" gap="2">
          <!-- 区块标题 -->
          <view text="sm gray-700" font="medium">
            当前套餐
          </view>

          <!-- 当前使用套餐卡片 -->
          <ActivePackageCard
            :active-package="activePackage!"
            @show-details="handleShowActivePackageDetails"
          />
        </view>

        <!-- 区块标题 -->
        <view text="sm gray-700" font="medium">
          套餐列表
        </view>
        <view flex="~ col" gap="3">
          <PackageItem
            v-for="pkg in packagesList"
            :key="pkg.id"
            :pkg="pkg"
            :is-active="pkg.id === activePackage?.packageId"
            @click="handleShowPackageDetails"
          />
        </view>
      </view>
    </RefreshList>

    <!-- 套餐详情弹框 -->
    <PackageDetailsPopup
      v-model="showPackageDetails"
      :item="selectedPackage"
      :active-package="activePackage"
      :show-purchase-button="showPurchaseButton"
      :show-refund-button="showRefundButton"
      :disable-purchase-button="disablePurchaseButton"
      :disable-refund-button="disableRefundButton"
      @purchase="handlePackagePurchase"
      @refund="handlePackageRefund"
    />
  </Page>
</template>

<style scoped lang="scss"></style>
