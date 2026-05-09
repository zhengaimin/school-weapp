<script lang="ts" setup>
import type { User } from '@/api/interface/modules/user'
import type { TAmountType, TBalanceBusinessType } from '@/constant/modules'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import {
  AMOUNT_TYPE,
  AMOUNT_TYPE_I18N,
  AMOUNT_TYPE_ICON_MAP,
  BALANCE_BUSINESS_TYPE_I18N,
  POSITIVE_AMOUNT_TYPES,
} from '@/constant/modules'
import { formatTime } from '@/utils/format'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = defineProps<{
  record: User.Balance.IBalanceDetailRecordVo
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const AMOUNT_TYPE_COLOR_MAP: Record<TAmountType, string> = {
  [AMOUNT_TYPE.RECHARGE]: '#10b981',
  [AMOUNT_TYPE.CONSUMPTION]: '#ef4444',
  [AMOUNT_TYPE.CARD_RECHARGE]: '#ef4444',
  [AMOUNT_TYPE.REFUND]: '#ef4444',
  [AMOUNT_TYPE.FREEZE]: '#ef4444',
  [AMOUNT_TYPE.UNFREEZE]: '#10b981',
  [AMOUNT_TYPE.ADJUST]: '#ef4444',
  [AMOUNT_TYPE.PACKAGE_PURCHASE]: '#ef4444',
}

const AMOUNT_TYPE_TEXT_COLOR_MAP: Record<TAmountType, string> = {
  [AMOUNT_TYPE.RECHARGE]: 'text-green-600',
  [AMOUNT_TYPE.CONSUMPTION]: 'text-red-600',
  [AMOUNT_TYPE.CARD_RECHARGE]: 'text-red-600',
  [AMOUNT_TYPE.REFUND]: 'text-red-600',
  [AMOUNT_TYPE.FREEZE]: 'text-red-600',
  [AMOUNT_TYPE.UNFREEZE]: 'text-green-600',
  [AMOUNT_TYPE.ADJUST]: 'text-red-600',
  [AMOUNT_TYPE.PACKAGE_PURCHASE]: 'text-red-600',
}

const iconColor = computed(() => {
  return AMOUNT_TYPE_COLOR_MAP[props.record.amountType as TAmountType] || '#ef4444'
})

const amountTextColorClass = computed(() => {
  return AMOUNT_TYPE_TEXT_COLOR_MAP[props.record.amountType as TAmountType] || 'text-red-600'
})

// 获取交易类型的中文显示
function getAmountTypeLabel(type: User.Balance.AmountType): string {
  return AMOUNT_TYPE_I18N[type as TAmountType] || type
}

// 获取交易类型的图标
function getAmountTypeIcon(type: User.Balance.AmountType): string {
  return AMOUNT_TYPE_ICON_MAP[type as TAmountType] || 'money-dollar-circle-line'
}

// 获取业务类型的中文显示
function getBusinessTypeLabel(type: string): string {
  return BALANCE_BUSINESS_TYPE_I18N[type as TBalanceBusinessType] || type
}

// 格式化后端返回的流水描述
function formatDescription(description: string): string {
  return description.replace(/IC卡充值/g, '圈存')
}

// 格式化金额显示
function formatAmount(amount: string, type: User.Balance.AmountType): string {
  const numAmount = Number.parseFloat(amount)
  const isPositive = POSITIVE_AMOUNT_TYPES.includes(type as TAmountType)
  const prefix = isPositive ? '+' : '-'
  return `${prefix}￥${Math.abs(numAmount).toFixed(2)}`
}
</script>

<template>
  <view relative overflow="hidden" @click="e => emit('click', e)">
    <WhiteCard custom-class="pt-3 relative">
      <!-- 背景图标 -->
      <view absolute left--68rpx top-68rpx style="transform: translateY(-50%)">
        <Icon
          :name="getAmountTypeIcon(record.amountType)"
          :icon-color="iconColor"
          icon-size="256rpx"
          custom-class="opacity-10"
        />
      </view>

      <!-- 内容区域 -->
      <view relative z="10">
        <!-- 第一行：交易类型和金额 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ getAmountTypeLabel(record.amountType) }}
          </view>
          <view
            text="lg"
            font="bold"
            :class="amountTextColorClass"
          >
            {{ formatAmount(record.amount, record.amountType) }}
          </view>
        </view>

        <!-- 第二行：描述和时间 -->
        <view flex="~ justify-between items-start" gap="4">
          <view text="xs gray-600">
            {{ formatDescription(record.description) }}
          </view>
          <view text="xs gray-600" whitespace-nowrap>
            {{ formatTime(record.operationTime) }}
          </view>
        </view>

        <!-- 第三行：余额信息 -->
        <view flex="~ justify-between items-center" m="t-1">
          <view v-if="record.totalBalanceAfter" text="xs text-secondary">
            余额: ¥{{ parseFloat(record.totalBalanceAfter).toFixed(2) }}
          </view>
          <view text="xs gray-500" whitespace-nowrap>
            {{ getBusinessTypeLabel(record.relatedBusinessType) }}
          </view>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
