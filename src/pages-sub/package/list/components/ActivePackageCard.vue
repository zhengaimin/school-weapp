<script lang="ts" setup>
import type { ActivePackage } from '../types'
import dayjs from 'dayjs'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { PACKAGE_BUY_STATUS, PACKAGE_BUY_STATUS_I18N } from '@/constant/modules'

const props = defineProps<{
  package: ActivePackage
}>()
const emit = defineEmits<{
  click: [orderNo: string]
}>()

const modules = computed(() => props.package.modules || [])
const pricingModeText = computed(() => {
  if (props.package.pricingMode === 'DECREASING') return '按月递减'
  if (props.package.pricingMode === 'FIXED_TOTAL') return '固定总价'
  return props.package.monthlyDecrease ? '按月递减' : '固定总价'
})
const moduleSummary = computed(() => {
  if (!modules.value.length) return '暂无权益信息'

  return modules.value
    .map(module => module.kind === 'FEATURE' ? module.name : `${module.name} ${getModuleValue(module)}`)
    .join('、')
})
const statusClass = computed(() => {
  switch (props.package.status) {
    case PACKAGE_BUY_STATUS.PENDING:
      return 'pending'
    case PACKAGE_BUY_STATUS.WAITING_ACTIVE:
      return 'waiting'
    case PACKAGE_BUY_STATUS.ACTIVE:
      return 'active'
    case PACKAGE_BUY_STATUS.USED_UP:
      return 'used'
    case PACKAGE_BUY_STATUS.REFUND_PENDING:
      return 'refund'
    case PACKAGE_BUY_STATUS.EXPIRED:
    case PACKAGE_BUY_STATUS.REFUNDED:
    case PACKAGE_BUY_STATUS.CANCELLED:
      return 'closed'
    default:
      return 'default'
  }
})

function handleClick() {
  const orderNo = props.package.paymentOrderNo
  if (orderNo) emit('click', orderNo)
}

function getModuleValue(module: ActivePackage['modules'][number]) {
  if (module.kind === 'FEATURE') return '功能权益'
  if (module.monthlyGiftMinutes === -1) return '不限分钟'
  if (module.monthlyGiftMinutes !== undefined) return `${module.monthlyGiftMinutes} 分钟/月`
  return '按量计费'
}
</script>

<template>
  <WhiteCard v-if="package" custom-class="active-package-card" @click="handleClick">
    <view flex="~ row items-start justify-between" gap="3">
      <view min-w-0 flex="~ col" gap="1">
        <view flex="~ row items-center" gap="2">
          <text class="package-name">
            {{ package.name || '套餐' }}
          </text>
          <text class="package-tag pricing-tag" shrink-0>
            {{ pricingModeText }}
          </text>
        </view>
      </view>
      <view class="status-badge" :class="statusClass">
        <text>{{ package.statusText || PACKAGE_BUY_STATUS_I18N[package.status] || '套餐' }}</text>
      </view>
    </view>

    <view class="module-list">
      <view class="module-header">
        <text class="module-title">
          套餐权益
        </text>
        <text class="module-count">
          {{ package.modules?.length || 0 }} 项
        </text>
      </view>
      <text class="module-summary">
        {{ moduleSummary }}
      </text>
    </view>

    <view class="package-footer">
      <text class="validity">
        到期时间：{{ package.endDate ? dayjs(package.endDate).format('YYYY-MM-DD') : '-' }}
      </text>
      <view flex="~ row items-center" text="sm primary" font="medium">
        <text>查看详情</text>
        <text class="i-carbon-chevron-right" text="xs" ml="0.5" />
      </view>
    </view>
  </WhiteCard>
</template>

<style scoped lang="scss">
.active-package-card {
  border: 1rpx solid #e8edf5;
  box-shadow: 0 6rpx 18rpx rgba(39, 64, 96, 0.05);
  padding: 26rpx 28rpx;
}

.package-name { flex: 1; min-width: 0; overflow: hidden; color: #1f2937; font-size: 30rpx; font-weight: 700; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
.package-tag { border-radius: 6rpx; font-size: 21rpx; line-height: 1.4; padding: 4rpx 10rpx; }
.pricing-tag { background: #f1f5f9; color: #64748b; }
.status-badge { border-radius: 6rpx; font-size: 22rpx; padding: 6rpx 12rpx; }
.status-badge.active { background: #ecfdf3; color: #15945a; }
.status-badge.waiting { background: #eff6ff; color: #2563eb; }
.status-badge.pending, .status-badge.refund { background: #fff7ed; color: #c2410c; }
.status-badge.used { background: #fefce8; color: #a16207; }
.status-badge.closed { background: #fef2f2; color: #b91c1c; }
.status-badge.default { background: #f3f4f6; color: #4b5563; }
.module-list { background: transparent; border-top: 1rpx solid #edf1f7; margin-top: 20rpx; padding: 18rpx 0 0; }
.module-header { align-items: center; display: flex; justify-content: space-between; padding-bottom: 8rpx; }
.module-title { color: #334155; font-size: 24rpx; font-weight: 600; }
.module-count { color: #94a3b8; font-size: 22rpx; }
.module-summary { -webkit-box-orient: vertical; -webkit-line-clamp: 2; color: #475569; display: -webkit-box; font-size: 24rpx; line-height: 1.5; overflow: hidden; }
.package-footer { align-items: center; display: flex; justify-content: space-between; margin-top: 18rpx; }
.validity { color: #94a3b8; font-size: 22rpx; }
</style>
