<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐详情"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'

import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getPackageDetailApi } from '@/api/modules/package/query'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE, PACKAGE_TYPE_I18N, PAYMENT_METHOD } from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'
import { usePackage } from '../hooks/usePackage'
import { usePayment } from '../hooks/usePayment'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { emitPackageTransaction } = usePackageEmitter()
const currentStudentStore = useCurrentStudentStore()
const { deviceType } = storeToRefs(currentStudentStore)

const packageDetail = ref<Pkg.Query.ResGetPackageDetailApi>()

const isVideoDevice = computed(() => deviceType.value === DEVICE_TYPE.VIDEO)

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

/** 是否显示待支付订单 */
const hasPendingPayment = computed(() => {
  return pendingPayment.value?.hasPending
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
/** 是否应该显示正常内容（套餐存在时） */
const shouldShowContent = computed(() => {
  return packageDetail.value?.isPackageExists !== false
})
/** 是否需要显示底部按钮区域 */
const showButtonArea = computed(() => {
  if (!shouldShowContent.value) return false
  return showPurchaseButton.value || hasPendingPayment.value
})
/** 计算内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight(showButtonArea.value ? '164rpx' : '0')
})

/** 获取套餐详情 */
async function axiosGetPackageDetailApi(id: number) {
  try {
    const result = await getPackageDetailApi(id)
    if (result.code === 0) {
      packageDetail.value = result.data
    }
    return result
  }
  catch (error) {
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
/** 刷新页面数据 */
function refreshPageData() {
  const { query } = currRoute()

  if (query.id) {
    batchRequestHandler([
      axiosGetPackageDetailApi(+query.id),
      axiosGetStudentActivePackageApi(),
      axiosGetPendingPaymentApi(),
    ])
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  refreshPageData()
}
</script>

<template>
  <Page
    title="套餐详情"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 商品已下架提示 -->
    <view v-if="packageDetail?.isPackageExists === false" h-full>
      <StatusTip
        custom-class="h-full flex flex-col items-center justify-center"
        image="search"
        tip="商品已下架"
      />
    </view>

    <template v-else-if="packageDetail">
      <!-- 内容区域 -->
      <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
        <view p="4 t-2!" flex="~ col" gap="3">
          <!-- 套餐信息 -->
          <view flex="~ col" gap="3">
            <view bg="white" rounded="xl" p="4" shadow="sm" flex="~ col" gap="4">
              <!-- 类型与价格 -->
              <view flex="~ row justify-between items-center">
                <view
                  :bg="packageDetail.packageType === PACKAGE_TYPE.GENERAL ? 'blue-50' : 'purple-50'"
                  :text="
                    packageDetail.packageType === PACKAGE_TYPE.GENERAL
                      ? 'xs blue-600'
                      : 'xs purple-600'
                  "
                  px="2.5"
                  py="1"
                  rounded="md"
                  font="bold"
                >
                  {{ PACKAGE_TYPE_I18N[packageDetail.packageType] }}
                </view>

                <view flex="~ row items-baseline" text="red-500">
                  <text text="sm" font="bold" mb="1" mr="1">
                    ¥
                  </text>
                  <text text="3xl" font="bold" lh="none">
                    {{ packageDetail.purchasePrice }}
                  </text>
                </view>
              </view>

              <!-- 核心权益网格 -->
              <view flex="~ row justify-around" bg="gray-50" rounded="lg" p="y-3">
                <!-- 话机：通话分钟 -->
                <view v-if="isVideoDevice" flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.packageContent?.videoCallMinutes ?? '-' }}
                  </text>
                  <text text="xs gray-400">
                    通话分钟
                  </text>
                </view>
                <!-- 话机：留言条数 -->
                <view v-if="isVideoDevice" flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{
                      packageDetail.packageContent?.messageCount === -1
                        ? '∞'
                        : (packageDetail.packageContent?.messageCount ?? '-')
                    }}
                  </text>
                  <text text="xs gray-400">
                    留言条数
                  </text>
                </view>
                <!-- 吹风机：吹风时长 -->
                <view v-if="!isVideoDevice" flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.packageContent?.dryerMinutes ?? '-' }}
                  </text>
                  <text text="xs gray-400">
                    吹风时长
                  </text>
                </view>
                <!-- 套餐月数 -->
                <view flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.totalMonths ?? '-' }}
                  </text>
                  <text text="xs gray-400">
                    套餐月数
                  </text>
                </view>
              </view>

              <!-- 有效期（仅固定套餐） -->
              <text v-if="packageDetail.packageType === PACKAGE_TYPE.FIXED" text="xs gray-400">
                有效期：{{ packageDetail.startDate?.slice(0, 10) }} 至
                {{ packageDetail.endDate?.slice(0, 10) }}
              </text>
            </view>
          </view>

          <!-- 套餐说明 -->
          <view v-if="packageDetail.templateDescription" flex="~ col" gap="3">
            <view flex="~ row items-center" px="1">
              <view w="3px" h="14px" bg="primary" rounded-full mr="2" />
              <text text="sm gray-800" font="bold">
                套餐说明
              </text>
            </view>
            <WhiteCard :show-border="false">
              <text text="sm gray-600" leading="relaxed">
                {{ packageDetail.templateDescription }}
              </text>
            </WhiteCard>
          </view>

          <!-- 使用规则 -->
          <view v-if="packageDetail.usageRules" flex="~ col" gap="3">
            <view flex="~ row items-center" px="1">
              <view w="3px" h="14px" bg="orange-500" rounded-full mr="2" />
              <text text="sm gray-800" font="bold">
                使用规则
              </text>
            </view>
            <WhiteCard :show-border="false">
              <text text="sm orange-700" leading="relaxed">
                {{ packageDetail.usageRules }}
              </text>
            </WhiteCard>
          </view>
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
        <!-- 立即购买 -->
        <TButton
          v-if="showPurchaseButton"
          type="primary"
          size="large"
          full
          flex-1
          :loading="purchaseLoading"
          @click="handleGoToPurchase"
        >
          立即购买
        </TButton>
      </view>
    </template>
  </Page>
</template>
