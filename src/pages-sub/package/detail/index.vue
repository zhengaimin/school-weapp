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
import { DEVICE_TYPE, DEVICE_TYPE_I18N, PACKAGE_KIND, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_TAG_CONFIGS } from '../constants'
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

/** 是否平台套餐 */
const isPlatformPackage = computed(() => packageDetail.value?.packageKind === PACKAGE_KIND.PLATFORM)
/** 套餐标签：平台套餐展示计费模式，设备套餐展示设备类型，配色按类型区分 */
const packageTag = computed(() => {
  if (isPlatformPackage.value) {
    const isDecreasing = packageDetail.value?.pricingMode === 'DECREASING'
    return {
      text: isDecreasing ? '按月递减' : '固定总价',
      style: isDecreasing ? PACKAGE_TAG_CONFIGS.DECREASING : PACKAGE_TAG_CONFIGS.FIXED_TOTAL,
    }
  }

  const deviceType = packageDetail.value?.deviceType || packageDetail.value?.packageContent?.deviceType
  if (deviceType) return { text: DEVICE_TYPE_I18N[deviceType], style: PACKAGE_TAG_CONFIGS[deviceType] }

  const packageType = packageDetail.value?.packageType
  return {
    text: packageType ? PACKAGE_TYPE_I18N[packageType] : '套餐',
    style: PACKAGE_TAG_CONFIGS.DEFAULT,
  }
})
/** 购买价格 */
const purchasePriceText = computed(() => {
  const price = Number(packageDetail.value?.purchasePrice)
  return Number.isFinite(price) ? price.toFixed(2) : '-'
})
/** 套餐月数 */
const totalMonthsText = computed(() => {
  const totalMonths = packageDetail.value?.totalMonths
  return totalMonths ? `${totalMonths}个月` : '-'
})
/** 套餐起止日期；通用套餐购买前没有具体日期，此时不展示 */
const validityText = computed(() => {
  const startDate = packageDetail.value?.startDate
  const endDate = packageDetail.value?.endDate
  if (!startDate && !endDate) return ''
  return `${formatDate(startDate)} 至 ${formatDate(endDate)}`
})

function formatDate(date?: string) {
  return date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '-'
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
    <template v-if="packageDetail">
      <!-- 内容区域 -->
      <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
        <view p="4 t-2!" flex="~ col" gap="3">
          <!-- 套餐信息 -->
          <view flex="~ col" gap="3">
            <view bg="white" rounded="xl" p="4" shadow="sm" flex="~ col" gap="3">
              <text text="lg gray-800" font="bold">
                {{ packageDetail.packageName }}
              </text>

              <view flex="~ row justify-between items-center">
                <view
                  text="xs"
                  px="2.5"
                  py="1"
                  rounded="md"
                  font="bold"
                  :style="packageTag.style"
                >
                  {{ packageTag.text }}
                </view>

                <view flex="~ row items-baseline" text="red-500">
                  <text text="sm" font="bold" mb="1" mr="1">
                    ¥
                  </text>
                  <text text="3xl" font="bold" lh="none">
                    {{ purchasePriceText }}
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

              <view v-else-if="!isPlatformPackage" flex="~ row justify-around" bg="gray-50" rounded="lg" p="y-3">
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
              </view>

              <view flex="~ col" gap="1.5" pt="2" border="t gray-100">
                <view flex="~ row items-center justify-between">
                  <text text="xs gray-400">
                    套餐月数
                  </text>
                  <text text="xs gray-700" font="medium">
                    {{ totalMonthsText }}
                  </text>
                </view>
                <view v-if="validityText" flex="~ row items-center justify-between">
                  <text text="xs gray-400">
                    有效期
                  </text>
                  <text text="xs gray-700" font="medium">
                    {{ validityText }}
                  </text>
                </view>
              </view>
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
