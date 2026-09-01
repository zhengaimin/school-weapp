<script lang="ts" setup>
import type { AvailablePackage } from '../types'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'

interface Props {
  package: AvailablePackage
  isPurchased?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

const modules = computed(() => props.package.modules || [])
const moduleSummary = computed(() => {
  if (!modules.value.length) return `套餐周期 ${props.package.totalMonths ?? '-'}个月`

  return modules.value
    .map(module => module.kind === 'FEATURE' ? module.name : `${module.name} ${getModuleValue(module)}`)
    .join('、')
})
const pricingModeText = computed(() => {
  if (props.package.pricingMode === 'DECREASING') return '按月递减'
  if (props.package.pricingMode === 'FIXED_TOTAL') return '固定总价'
  return '套餐计费'
})
const price = computed(() => props.package.monthlyPrice)
const priceUnit = computed(() => '/月')

function formatDate(date?: string) {
  return date?.slice(0, 10) || '-'
}

function getModuleValue(module: AvailablePackage['modules'][number]) {
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
            {{ package.name || '套餐' }}
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
          {{ price ?? '-' }}
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
        <text class="module-count">
          {{ modules.length || 1 }} 项
        </text>
      </view>
      <text class="module-summary">
        {{ moduleSummary }}
      </text>
    </view>

    <view v-if="package.description" class="description">
      <text>{{ package.description }}</text>
    </view>

    <text v-if="package.startDate || package.endDate" class="validity validity-row">
      {{ formatDate(package.startDate) }} 至 {{ formatDate(package.endDate) }}
    </text>

    <view class="package-footer">
      <view flex="~ row items-center" gap="2" class="package-tags">
        <text class="package-tag pricing-tag">
          {{ pricingModeText }}
        </text>
        <text v-if="package.purchasable === false" class="package-tag unavailable-tag">
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
.pricing-tag { background: #f1f5f9; color: #64748b; }
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
