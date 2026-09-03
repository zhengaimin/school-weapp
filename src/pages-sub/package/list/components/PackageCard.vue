<script lang="ts" setup>
import type { AvailablePackage } from '../types'
import type { Pkg } from '@/api/interface/modules/package'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE_I18N, PACKAGE_KIND, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_TAG_CONFIGS } from '../../constants'
import { formatPackageContentSummary } from '../../utils'

interface Props {
  package: AvailablePackage
  isPurchased?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

const modules = computed(() => props.package.modules || [])
const isPlatformPackage = computed(() => props.package.packageKind === PACKAGE_KIND.PLATFORM)
/** 套餐类型名称：通用套餐 / 固定套餐 */
const packageTypeText = computed(() => PACKAGE_TYPE_I18N[props.package.packageType] || '套餐')
/** 卡片标题：平台套餐用套餐名称，设备套餐用套餐类型名称 */
const packageTitle = computed(() => {
  if (!isPlatformPackage.value) return packageTypeText.value
  return props.package.packageName || '套餐'
})
/** 左下角标签：平台套餐展示计费模式，设备套餐展示设备类型，配色按类型区分 */
const packageTag = computed(() => {
  if (isPlatformPackage.value) {
    const isDecreasing = props.package.pricingMode === 'DECREASING'
    return {
      text: isDecreasing ? '按月递减' : '固定总价',
      style: isDecreasing ? PACKAGE_TAG_CONFIGS.DECREASING : PACKAGE_TAG_CONFIGS.FIXED_TOTAL,
    }
  }

  const deviceType = props.package.deviceType || props.package.packageContent?.deviceType
  if (!deviceType) return { text: packageTypeText.value, style: PACKAGE_TAG_CONFIGS.DEFAULT }
  return { text: DEVICE_TYPE_I18N[deviceType], style: PACKAGE_TAG_CONFIGS[deviceType] }
})
const moduleSummary = computed(() => {
  if (modules.value.length) {
    return modules.value
      .map(module => module.kind === 'FEATURE' ? module.name : `${module.name} ${getModuleValue(module)}`)
      .join('、')
  }

  // 普通设备套餐没有模块权益，改用套餐内容展示设备额度
  return formatPackageContentSummary(props.package.packageContent)
    || `套餐周期 ${props.package.totalMonths ?? '-'}个月`
})
const price = computed(() => {
  const value = Number(props.package.monthlyPrice)
  return Number.isFinite(value) ? value.toFixed(2) : '-'
})
const priceUnit = computed(() => '/月')

function formatDate(date?: string) {
  return date?.slice(0, 10) || '-'
}

function getModuleValue(module: Pkg.Platform.IModule) {
  if (module.kind === 'FEATURE') return '功能权益'
  if (module.monthlyGiftMinutes === -1) return '不限分钟'
  if (module.monthlyGiftMinutes !== undefined) return `${module.monthlyGiftMinutes} 分钟/月`
  return '按量计费'
}
</script>

<template>
  <WhiteCard custom-class="package-card" @click="emit('click')">
    <view flex="~ row items-start justify-between" gap="3">
      <view min-w-0 flex="~ col" gap="1">
        <view flex="~ row items-center" gap="2">
          <text class="package-name">
            {{ packageTitle }}
          </text>
          <view v-if="isPurchased" class="status-badge purchased">
            <text>
              已购买
            </text>
          </view>
        </view>
      </view>
      <view flex="~ row items-baseline" shrink-0 class="price">
        <text class="price-symbol">
          ¥
        </text>
        <text class="price-value">
          {{ price }}
        </text>
        <text class="price-unit">
          {{ priceUnit }}
        </text>
      </view>
    </view>

    <view class="module-list">
      <view class="module-header">
        <text class="module-title">
          套餐权益
        </text>
        <text v-if="modules.length" class="module-count">
          {{ modules.length }} 项
        </text>
      </view>
      <text class="module-summary">
        {{ moduleSummary }}
      </text>
    </view>

    <view v-if="package.templateDescription" class="description">
      <text>{{ package.templateDescription }}</text>
    </view>

    <text v-if="package.startTime || package.endTime" class="validity validity-row">
      {{ formatDate(package.startTime) }} 至 {{ formatDate(package.endTime) }}
    </text>

    <view class="package-footer">
      <view flex="~ row items-center" gap="2" class="package-tags">
        <text class="package-tag" :style="packageTag.style">
          {{ packageTag.text }}
        </text>
        <text v-if="!package.purchasable" class="package-tag unavailable-tag">
          暂不可购买
        </text>
      </view>
      <view flex="~ row items-center" text="xs primary" font="medium">
        <text>查看详情</text>
        <text class="i-carbon-chevron-right" text="xs" ml="0.5" />
      </view>
    </view>
  </WhiteCard>
</template>

<style scoped lang="scss">
.package-card {
  border: 1rpx solid #e8edf5;
  box-shadow: 0 6rpx 18rpx rgba(39, 64, 96, 0.05);
  padding: 26rpx 28rpx;
}

.package-name {
  overflow: hidden;
  color: #1f2937;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.package-tags { flex-wrap: wrap; }
.package-tag { border-radius: 6rpx; font-size: 21rpx; line-height: 1.4; padding: 4rpx 10rpx; }
.unavailable-tag { background: #fef2f2; color: #dc2626; }
.price { color: #e05252; }
.price-symbol { font-size: 24rpx; font-weight: 700; }
.price-value { font-size: 36rpx; font-weight: 700; line-height: 1; }
.price-unit { color: #9ca3af; font-size: 22rpx; margin-left: 4rpx; }
.status-badge { border-radius: 6rpx; padding: 4rpx 10rpx; font-size: 21rpx; }
.status-badge.purchased { background: #ecfdf3; color: #15945a; }
.module-list { background: transparent; border-top: 1rpx solid #edf1f7; margin-top: 20rpx; padding: 18rpx 0 0; }
.module-header { align-items: center; display: flex; justify-content: space-between; padding-bottom: 8rpx; }
.module-title { color: #334155; font-size: 24rpx; font-weight: 600; }
.module-count { color: #94a3b8; font-size: 22rpx; }
.module-summary { -webkit-box-orient: vertical; -webkit-line-clamp: 2; color: #475569; display: -webkit-box; font-size: 24rpx; line-height: 1.5; overflow: hidden; }
.description { color: #64748b; font-size: 24rpx; line-height: 1.5; margin-top: 14rpx; }
.validity { color: #94a3b8; font-size: 22rpx; }
.validity-row { display: block; margin-top: 16rpx; }
.package-footer { align-items: center; display: flex; justify-content: space-between; margin-top: 12rpx; }
</style>
