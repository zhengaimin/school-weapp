/**
 * @file 退款相关的常量
 */
import type { FilterOption } from '@/components/common/filter-selector/index.vue'

import { ALL } from '@/constant/modules/common'

// #region 退款类型
// Types
export const REFUND_TYPE = {
  /** 全额退款 */
  FULL: 'FULL',
} as const

export type TRefundType = (typeof REFUND_TYPE)[keyof typeof REFUND_TYPE]

// I18N
export const REFUND_TYPE_I18N: Record<TRefundType, string> = {
  [REFUND_TYPE.FULL]: '全额退款',
}

// Options
export const REFUND_TYPE_OPTIONS = [
  { label: REFUND_TYPE_I18N[REFUND_TYPE.FULL], value: REFUND_TYPE.FULL },
]
// #endregion

// #region 退款状态
// Types
export const REFUND_STATUS = {
  /** 待审核 */
  PENDING: 0,
  /** 审核通过 */
  APPROVED: 1,
  /** 退款处理中 */
  PROCESSING: 2,
  /** 全部退款完成 */
  COMPLETED: 3,
  /** 部分退款完成 */
  PARTIAL: 4,
  /** 审核拒绝 */
  REJECTED: 5,
  /** 用户取消 */
  CANCELLED: 6,
} as const

export type TRefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS]

// I18N
export const REFUND_STATUS_I18N: Record<TRefundStatus, string> = {
  [REFUND_STATUS.PENDING]: '待审核',
  [REFUND_STATUS.APPROVED]: '审核通过',
  [REFUND_STATUS.PROCESSING]: '退款处理中',
  [REFUND_STATUS.COMPLETED]: '全部退款完成',
  [REFUND_STATUS.PARTIAL]: '部分退款完成',
  [REFUND_STATUS.REJECTED]: '审核拒绝',
  [REFUND_STATUS.CANCELLED]: '用户取消',
}

// Options
export const REFUND_STATUS_OPTIONS: FilterOption[] = [
  { value: ALL, label: '全部状态' },
  { value: REFUND_STATUS.PENDING, label: REFUND_STATUS_I18N[REFUND_STATUS.PENDING] },
  { value: REFUND_STATUS.APPROVED, label: REFUND_STATUS_I18N[REFUND_STATUS.APPROVED] },
  { value: REFUND_STATUS.PROCESSING, label: REFUND_STATUS_I18N[REFUND_STATUS.PROCESSING] },
  { value: REFUND_STATUS.COMPLETED, label: REFUND_STATUS_I18N[REFUND_STATUS.COMPLETED] },
  { value: REFUND_STATUS.PARTIAL, label: REFUND_STATUS_I18N[REFUND_STATUS.PARTIAL] },
  { value: REFUND_STATUS.REJECTED, label: REFUND_STATUS_I18N[REFUND_STATUS.REJECTED] },
  { value: REFUND_STATUS.CANCELLED, label: REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED] },
]

/**
 * 状态配置接口
 */
export interface StatusConfig {
  label: string
  class: string
  icon: string
  iconColor: string
  bgColor: string
}

/**
 * 状态配置映射
 */
export const REFUND_STATUS_CONFIGS: Record<TRefundStatus, StatusConfig> = {
  [REFUND_STATUS.PENDING]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.PENDING],
    class: 'label-info',
    icon: 'search-line',
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
  },
  [REFUND_STATUS.APPROVED]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.APPROVED],
    class: 'label-info',
    icon: 'shield-check-line',
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
  },
  [REFUND_STATUS.PROCESSING]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.PROCESSING],
    class: 'label-warning',
    icon: 'time-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
  [REFUND_STATUS.COMPLETED]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.COMPLETED],
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  [REFUND_STATUS.PARTIAL]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.PARTIAL],
    class: 'label-warning',
    icon: 'error-warning-line',
    iconColor: '#eab308',
    bgColor: '#fef9c3',
  },
  [REFUND_STATUS.REJECTED]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.REJECTED],
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  [REFUND_STATUS.CANCELLED]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED],
    class: 'label-default',
    icon: 'forbid-line',
    iconColor: '#9ca3af',
    bgColor: '#f3f4f6',
  },
}
// #endregion
