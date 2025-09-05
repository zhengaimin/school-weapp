import type { User } from '@/api/interface/modules/user'
import type { TAmountType } from '@/constant/modules/fund'
import { AMOUNT_TYPE_I18N, AMOUNT_TYPE_ICON_MAP, POSITIVE_AMOUNT_TYPES } from '@/constant/modules/fund'

// #region 格式化函数
// 获取交易类型的中文显示
export function getAmountTypeLabel(type: User.Balance.AmountType): string {
  return AMOUNT_TYPE_I18N[type as TAmountType] || type
}

// 获取交易类型的图标
export function getAmountTypeIcon(type: User.Balance.AmountType): string {
  return AMOUNT_TYPE_ICON_MAP[type as TAmountType] || 'money-dollar-circle-line'
}

// 格式化金额显示
export function formatAmount(amount: string, type: User.Balance.AmountType): string {
  const numAmount = Number.parseFloat(amount)
  const isPositive = POSITIVE_AMOUNT_TYPES.includes(type as TAmountType)
  const prefix = isPositive ? '+' : '-'
  return `${prefix}¥${Math.abs(numAmount).toFixed(2)}`
}

// #endregion
