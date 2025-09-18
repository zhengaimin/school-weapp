<script lang="ts" setup>
import type { User } from '@/api/interface/modules/user'
// #region 导入
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { formatTime } from '@/utils/format'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 定义 Props 和 Emits
const props = defineProps<{
  record: User.Balance.IBalanceDetailRecordVo
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
// #endregion

// #region 金额类型常量
const AMOUNT_TYPE = {
  RECHARGE: 'RECHARGE',
  CONSUMPTION: 'CONSUMPTION',
  REFUND: 'REFUND',
  FREEZE: 'FREEZE',
  UNFREEZE: 'UNFREEZE',
  ADJUST: 'ADJUST',
  PACKAGE_PURCHASE: 'PACKAGE_PURCHASE',
} as const

type TAmountType = (typeof AMOUNT_TYPE)[keyof typeof AMOUNT_TYPE]

const AMOUNT_TYPE_I18N: Record<TAmountType, string> = {
  [AMOUNT_TYPE.RECHARGE]: '充值',
  [AMOUNT_TYPE.CONSUMPTION]: '消费',
  [AMOUNT_TYPE.REFUND]: '退款',
  [AMOUNT_TYPE.FREEZE]: '冻结',
  [AMOUNT_TYPE.UNFREEZE]: '解冻',
  [AMOUNT_TYPE.ADJUST]: '调整',
  [AMOUNT_TYPE.PACKAGE_PURCHASE]: '套餐购买',
}

const AMOUNT_TYPE_ICON_MAP: Record<TAmountType, string> = {
  [AMOUNT_TYPE.RECHARGE]: 'add-circle-line',
  [AMOUNT_TYPE.CONSUMPTION]: 'shopping-cart-line', // 更换消费类型图标
  [AMOUNT_TYPE.REFUND]: 'refund-2-line',
  [AMOUNT_TYPE.FREEZE]: 'lock-line',
  [AMOUNT_TYPE.UNFREEZE]: 'lock-unlock-line',
  [AMOUNT_TYPE.ADJUST]: 'settings-line',
  [AMOUNT_TYPE.PACKAGE_PURCHASE]: 'shopping-bag-line',
}

const POSITIVE_AMOUNT_TYPES: TAmountType[] = [
  AMOUNT_TYPE.RECHARGE,
  AMOUNT_TYPE.UNFREEZE,
]

const AMOUNT_TYPE_COLOR_MAP: Record<string, string> = {
  [AMOUNT_TYPE.RECHARGE]: '#10b981',
  [AMOUNT_TYPE.CONSUMPTION]: '#ef4444',
  [AMOUNT_TYPE.REFUND]: '#ef4444',
  [AMOUNT_TYPE.FREEZE]: '#ef4444',
  [AMOUNT_TYPE.UNFREEZE]: '#10b981',
  [AMOUNT_TYPE.ADJUST]: '#ef4444',
  [AMOUNT_TYPE.PACKAGE_PURCHASE]: '#ef4444',
}

const AMOUNT_TYPE_TEXT_COLOR_MAP: Record<string, string> = {
  [AMOUNT_TYPE.RECHARGE]: 'text-green-600',
  [AMOUNT_TYPE.CONSUMPTION]: 'text-red-600',
  [AMOUNT_TYPE.REFUND]: 'text-red-600',
  [AMOUNT_TYPE.FREEZE]: 'text-red-600',
  [AMOUNT_TYPE.UNFREEZE]: 'text-green-600',
  [AMOUNT_TYPE.ADJUST]: 'text-red-600',
  [AMOUNT_TYPE.PACKAGE_PURCHASE]: 'text-red-600',
}
// #endregion

// #region 计算属性
const iconColor = computed(() => {
  return AMOUNT_TYPE_COLOR_MAP[props.record.amountType as TAmountType] || '#ef4444'
})

const amountTextColorClass = computed(() => {
  return AMOUNT_TYPE_TEXT_COLOR_MAP[props.record.amountType as TAmountType] || 'text-red-600'
})
// #endregion

// #region 方法实现
// 获取交易类型的中文显示
function getAmountTypeLabel(type: User.Balance.AmountType): string {
  return AMOUNT_TYPE_I18N[type as TAmountType] || type
}

// 获取交易类型的图标
function getAmountTypeIcon(type: User.Balance.AmountType): string {
  return AMOUNT_TYPE_ICON_MAP[type as TAmountType] || 'money-dollar-circle-line'
}

// 格式化金额显示
function formatAmount(amount: string, type: User.Balance.AmountType): string {
  const numAmount = Number.parseFloat(amount)
  const isPositive = POSITIVE_AMOUNT_TYPES.includes(type as TAmountType)
  const prefix = isPositive ? '+' : '-'
  return `${prefix}¥${Math.abs(numAmount).toFixed(2)}`
}
// #endregion
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
            {{ record.description }}
          </view>
          <view text="xs gray-600" whitespace-nowrap>
            {{ formatTime(record.createdAt) }}
          </view>
        </view>

        <!-- 第三行：余额信息 -->
        <view v-if="record.balanceAfter" text="xs text-secondary">
          余额: ¥{{ parseFloat(record.balanceAfter).toFixed(2) }}
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
