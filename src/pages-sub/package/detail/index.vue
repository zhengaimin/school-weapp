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
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { PACKAGE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules'
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
} = usePackageDetail()

/** 套餐类型文本样式 */
const packageTypeText = computed(() => {
  return packageDetail.value?.packageType === PACKAGE_TYPE.GENERAL
    ? 'xs blue-600'
    : 'xs purple-600'
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
                  :text="packageTypeText"
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
