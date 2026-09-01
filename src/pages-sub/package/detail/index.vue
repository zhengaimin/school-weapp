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
import dayjs from 'dayjs'
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE } from '@/constant/modules'
import { usePackageDetail } from './hooks/usePackageDetail'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const {
  pageLoading,
  pageError,
  onLoginFail,
  packageDetail,
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
} = usePackageDetail()

const pricingModeText = computed(() => {
  return packageDetail.value?.pricingMode === 'FIXED_TOTAL' ? '固定总价' : '按月递减'
})
const validityText = computed(() => {
  const startDate = packageDetail.value?.startDate
  const endDate = packageDetail.value?.endDate
  const startTime = startDate && dayjs(startDate).isValid()
    ? dayjs(startDate).format('YYYY-MM-DD HH:mm')
    : '-'
  const endTime = endDate && dayjs(endDate).isValid()
    ? dayjs(endDate).format('YYYY-MM-DD HH:mm')
    : '-'
  return `${startTime} 至 ${endTime}`
})
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
    <template v-if="packageDetail">
      <!-- 内容区域 -->
      <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
        <view p="4 t-2!" flex="~ col" gap="3">
          <!-- 套餐信息 -->
          <view flex="~ col" gap="3">
            <view bg="white" rounded="xl" p="4" shadow="sm" flex="~ col" gap="4">
              <text text="lg gray-800" font="bold">
                {{ packageDetail.name || '套餐' }}
              </text>

              <view flex="~ row justify-between items-center">
                <view
                  bg="blue-50"
                  text="xs blue-600"
                  px="2.5"
                  py="1"
                  rounded="md"
                  font="bold"
                >
                  {{ pricingModeText }}
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

              <view v-if="packageDetail.modules?.length" flex="~ col" bg="gray-50" rounded="lg" p="3" gap="2">
                <view
                  v-for="module in packageDetail.modules"
                  :key="module.moduleKey"
                  flex="~ row items-center justify-between"
                >
                  <text text="sm gray-600">
                    {{ module.name }}
                  </text>
                  <text text="sm gray-800" font="bold">
                    {{ module.monthlyGiftMinutes === undefined ? '功能权益' : (module.monthlyGiftMinutes === -1 ? '不限' : `${module.monthlyGiftMinutes}分钟/月`) }}
                  </text>
                </view>
              </view>

              <view v-else flex="~ row justify-around" bg="gray-50" rounded="lg" p="y-3">
                <view v-if="packageDetail.deviceType === DEVICE_TYPE.VIDEO" flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.packageContent?.videoCallMinutes ?? '-' }}
                  </text>
                  <text text="xs gray-400">
                    通话分钟
                  </text>
                </view>
                <view v-if="packageDetail.deviceType === DEVICE_TYPE.VIDEO" flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.packageContent?.messageCount === -1 ? '∞' : (packageDetail.packageContent?.messageCount ?? '-') }}
                  </text>
                  <text text="xs gray-400">
                    留言条数
                  </text>
                </view>
                <view v-if="packageDetail.deviceType === DEVICE_TYPE.DRYER" flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.packageContent?.dryerMinutes ?? '-' }}
                  </text>
                  <text text="xs gray-400">
                    吹风时长
                  </text>
                </view>
                <view flex="~ col items-center justify-center" gap="1">
                  <text text="lg gray-800" font="bold" lh="none">
                    {{ packageDetail.totalMonths ?? '-' }}
                  </text>
                  <text text="xs gray-400">
                    套餐月数
                  </text>
                </view>
              </view>

              <text v-if="packageDetail.modules?.length" text="xs gray-400">
                套餐月数：{{ packageDetail.totalMonths }}个月
              </text>
              <text v-if="packageDetail.startDate || packageDetail.endDate" text="xs gray-400">
                有效期：{{ validityText }}
              </text>
            </view>
          </view>
          <!-- 套餐说明 -->
          <view v-if="packageDetail.description" flex="~ col" gap="3">
            <view flex="~ row items-center" px="1">
              <view w="3px" h="14px" bg="primary" rounded-full mr="2" />
              <text text="sm gray-800" font="bold">
                套餐说明
              </text>
            </view>
            <WhiteCard :show-border="false">
              <text text="sm gray-600" leading="relaxed">
                {{ packageDetail.description }}
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
