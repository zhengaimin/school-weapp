<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "操作结果"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import { computed, ref, unref } from 'vue'
import { getPackageOrderDetailApi } from '@/api/modules/package/payment'
import { postCancelPackageRefundApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import {
  DEVICE_TYPE,
  PACKAGE_STATUS_CONFIGS,
  PACKAGE_TYPE_I18N,
  PAYMENT_METHOD
} from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'
import RefundModal from '../../components/RefundModal.vue'
import { usePackage } from '../../hooks/usePackage'
import { usePayment } from '../../hooks/usePayment'
import { canShowRefundButton } from '../../utils'

defineOptions({
  options: {
    styleIsolation: 'apply-shared'
  }
})

const { pageLoading, pageError, onLoginFail, batchRequestHandler, getContentHeight } = usePage()
const { emitPackageTransaction, emitPackageRefund, onPackageRefund } = usePackageEmitter()
const {
  allPurchasedPackages,
  pendingPayment,
  hasPendingRefund,
  pendingRefundInfo,
  axiosGetStudentActivePackageApi,
  axiosGetCheckPendingApi,
  axiosGetPendingPaymentApi
} = usePackage()
const { axiosPostCancelPaymentApi, axiosPostContinuePaymentApi, cancelLoading, continueLoading } =
  usePayment()

const orderDetail = ref<Pkg.Payment.ResGetOrderDetailApi | null>(null)
const refundModalVisible = ref(false)

/** 获取当前套餐对应的已购买记录 */
const purchasedPackageRecord = computed(() => {
  if (!orderDetail.value) return null

  const { query } = currRoute()
  const recordId = +query.packageRecordId

  if (!recordId) return null

  return allPurchasedPackages.value.find(pkg => pkg.id === recordId) ?? null
})
/** 是否显示待支付订单 */
const hasPendingPayment = computed(() => {
  return Boolean(pendingPayment.value?.hasPending && pendingPayment.value?.orderNo)
})
/** 是否显示退费按钮 */
const showRefundButton = computed(() => {
  if (!purchasedPackageRecord.value) {
    return false
  }
  return canShowRefundButton({
    status: purchasedPackageRecord.value.status,
    endDate: purchasedPackageRecord.value.endDate,
    hasPendingRefund: hasPendingRefund.value
  })
})
/** 是否需要显示底部按钮区域 */
const showButtonArea = computed(() => {
  return showRefundButton.value || hasPendingPayment.value || hasPendingRefund.value
})
/** 计算内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight(unref(showButtonArea) ? '164rpx' : '0')
})

/** 格式化日期（只保留年月日） */
function formatDate(date: string | null) {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

/** 获取套餐订单详情 */
async function axiosGetPackageOrderDetailApi(orderNo: string) {
  try {
    const result = await getPackageOrderDetailApi({ orderNo })
    if (result.code === 0) {
      orderDetail.value = result.data
    }
    return result
  } catch (error) {
    console.error('获取套餐订单详情失败:', error)
    throw error
  }
}

/** 申请退费 */
function handleGoToRefund() {
  if (!purchasedPackageRecord.value?.id) {
    return
  }
  refundModalVisible.value = true
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
      }
    }
  )
}
/** 继续支付 */
async function handleContinuePayment() {
  if (!pendingPayment.value?.orderNo) return

  await axiosPostContinuePaymentApi(
    { orderNo: pendingPayment.value.orderNo, paymentMethod: PAYMENT_METHOD.WECHAT },
    {
      onSuccess: orderId => {
        emitPackageTransaction()
        uni.redirectTo({ url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${orderId}` })
      }
    }
  )
}
/** 取消退款申请 */
async function handleCancelRefund() {
  const refundApplicationId = unref(pendingRefundInfo)?.refundApplicationId
  if (!refundApplicationId) {
    toast.show('未找到可撤销的退费申请')
    return
  }

  try {
    await uni.showModal({
      title: '提示',
      content: '确认取消退款申请吗？'
    })

    uni.showLoading({ title: '取消中...', mask: true })
    const result = await postCancelPackageRefundApi(refundApplicationId)

    if (result.code === 0) {
      toast.show('取消成功')
      emitPackageRefund()
      refreshPageData()
    }
  } catch (error: any) {
    if (error?.errMsg !== 'showModal:fail cancel') {
      console.error('取消退款申请失败:', error)
      toast.show('取消失败，请重试')
    }
  } finally {
    uni.hideLoading()
  }
}

/** 刷新页面数据 */
function refreshPageData() {
  const { query } = currRoute()

  if (query?.orderNo) {
    batchRequestHandler([
      axiosGetPackageOrderDetailApi(query.orderNo as string),
      axiosGetStudentActivePackageApi(),
      axiosGetCheckPendingApi(),
      axiosGetPendingPaymentApi()
    ])
  }
}

function onLoginSuccess() {
  refreshPageData()
}

/** 监听退费事件，刷新页面数据 */
onPackageRefund(() => {
  refreshPageData()
})
</script>

<template>
  <Page
    title="套餐结果"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
      <view p="x-4 t-2 b-4" relative z-1>
        <!-- 结果图标和状态 -->
        <view v-if="orderDetail" flex="~ row items-center justify-center" gap="3" p="t-4 b-6">
          <Icon
            :name="PACKAGE_STATUS_CONFIGS[orderDetail.status].icon"
            :icon-color="PACKAGE_STATUS_CONFIGS[orderDetail.status].iconColor"
            icon-size="64rpx"
          />
          <view text="xl gray-900" font="medium">
            {{ PACKAGE_STATUS_CONFIGS[orderDetail.status].label }}
          </view>
        </view>

        <!-- 详情卡片 -->
        <WhiteCard v-if="orderDetail">
          <view flex="~ col" gap="3">
            <!-- 订单信息 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">订单号</text>
              <text text="sm gray-900">
                {{ orderDetail.orderNo }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">购买状态</text>
              <text text="sm gray-900">
                {{ PACKAGE_STATUS_CONFIGS[orderDetail.status].label }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">支付金额</text>
              <text text="base primary" font="medium">¥{{ orderDetail.amount }}</text>
            </view>
            <view v-if="orderDetail.payTime" flex="~ row justify-between items-center">
              <text text="sm gray-500">支付时间</text>
              <text text="sm gray-900">
                {{ orderDetail.payTime }}
              </text>
            </view>

            <!-- 分隔线 -->
            <view h="1px" bg="gray-100" m="y-1" />

            <!-- 学生信息 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">学生姓名</text>
              <text text="sm gray-900">
                {{ orderDetail.studentName }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">学号</text>
              <text text="sm gray-900">
                {{ orderDetail.studentCode }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">学校</text>
              <text text="sm gray-900">
                {{ orderDetail.schoolName }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">班级</text>
              <text text="sm gray-900">
                {{ orderDetail.className }}
              </text>
            </view>

            <!-- 分隔线 -->
            <view h="1px" bg="gray-100" m="y-1" />

            <!-- 套餐信息 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">套餐名称</text>
              <text text="sm gray-900">
                {{ PACKAGE_TYPE_I18N[orderDetail.packageType] }}
              </text>
            </view>
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">套餐时长</text>
              <text text="sm gray-900">{{ orderDetail.totalMonths }}个月</text>
            </view>
            <view
              v-if="orderDetail.startDate && orderDetail.endDate"
              flex="~ row justify-between items-center"
            >
              <text text="sm gray-500">有效期</text>
              <text text="sm gray-900">
                {{ formatDate(orderDetail.startDate) }} ~ {{ formatDate(orderDetail.endDate) }}
              </text>
            </view>

            <!-- 套餐内容 - 吹风机 -->
            <template v-if="orderDetail.deviceType === DEVICE_TYPE.DRYER">
              <view flex="~ row justify-between items-center">
                <text text="sm gray-500">吹风时长</text>
                <text text="sm gray-900">
                  {{
                    orderDetail.packageContent.dryerMinutes === -1
                      ? '不限'
                      : `${orderDetail.packageContent.dryerMinutes}分钟`
                  }}
                </text>
              </view>
            </template>
            <!-- 套餐内容 - 话机 -->
            <template v-else>
              <view flex="~ row justify-between items-center">
                <text text="sm gray-500">视频通话</text>
                <text text="sm gray-900">
                  {{
                    orderDetail.packageContent.videoCallMinutes === -1
                      ? '不限'
                      : `${orderDetail.packageContent.videoCallMinutes}分钟`
                  }}
                </text>
              </view>
              <view flex="~ row justify-between items-center">
                <text text="sm gray-500">留言条数</text>
                <text text="sm gray-900">
                  {{
                    orderDetail.packageContent.messageCount === -1
                      ? '不限'
                      : `${orderDetail.packageContent.messageCount}条`
                  }}
                </text>
              </view>
            </template>
          </view>
        </WhiteCard>
      </view>
    </scroll-view>

    <!-- 底部按钮区域 -->
    <view v-if="showButtonArea" p="x-4 y-3" flex gap="4" border="t gray-100">
      <!-- 取消待支付订单 -->
      <TButton
        v-if="hasPendingPayment"
        type="warning"
        size="large"
        full
        flex-1
        :loading="cancelLoading"
        @click="handleCancelPayment"
      >
        取消支付
      </TButton>
      <!-- 继续支付 -->
      <TButton
        v-if="hasPendingPayment"
        type="primary"
        size="large"
        full
        flex-1
        :loading="continueLoading"
        @click="handleContinuePayment"
      >
        继续支付
      </TButton>
      <!-- 撤销退费申请 -->
      <TButton
        v-if="hasPendingRefund"
        type="warning"
        size="large"
        full
        flex-1
        @click="handleCancelRefund"
      >
        撤销退费申请
      </TButton>
      <!-- 申请退费 -->
      <TButton
        v-if="showRefundButton"
        type="primary"
        size="large"
        full
        flex-1
        @click="handleGoToRefund"
      >
        申请退费
      </TButton>
    </view>

    <!-- 退费弹窗 -->
    <RefundModal
      :id="purchasedPackageRecord?.id"
      v-model:visible="refundModalVisible"
      @success="refreshPageData"
    />
  </Page>
</template>
