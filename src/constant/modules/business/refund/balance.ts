/**
 * @file 退款相关的常量
 */
import type { FilterOption } from '@/components/common/filter-selector/index.vue'
import type { TI18NMap, TOptions, TStatusConfigMap } from '@/types'

// Types
export const REFUND_APPLICATION_STATUS = {
  /** 待审核 */
  PENDING: 0,
  /** 审核通过 */
  APPROVED: 1,
  /** 审核拒绝 */
  REJECTED: 2,
  /** 退款完成 */
  COMPLETED: 3,
} as const

export type TRefundApplicationStatus = (typeof REFUND_APPLICATION_STATUS)[keyof typeof REFUND_APPLICATION_STATUS]

// I18N
export const REFUND_APPLICATION_STATUS_I18N: TI18NMap<TRefundApplicationStatus> = {
  [REFUND_APPLICATION_STATUS.PENDING]: '待审核',
  [REFUND_APPLICATION_STATUS.APPROVED]: '审核通过',
  [REFUND_APPLICATION_STATUS.REJECTED]: '审核拒绝',
  [REFUND_APPLICATION_STATUS.COMPLETED]: '退款完成',
}

// Options
export const REFUND_APPLICATION_STATUS_OPTIONS: TOptions<TRefundApplicationStatus> = [
  { label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.PENDING], value: REFUND_APPLICATION_STATUS.PENDING },
  { label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.APPROVED], value: REFUND_APPLICATION_STATUS.APPROVED },
  { label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.REJECTED], value: REFUND_APPLICATION_STATUS.REJECTED },
  { label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.COMPLETED], value: REFUND_APPLICATION_STATUS.COMPLETED },
]

/**
 * 退款申请状态配置映射
 */
export const REFUND_APPLICATION_STATUS_CONFIGS: TStatusConfigMap<TRefundApplicationStatus> = {
  [REFUND_APPLICATION_STATUS.PENDING]: {
    label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.PENDING],
    class: 'label-info',
    icon: 'search-line',
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
  },
  [REFUND_APPLICATION_STATUS.APPROVED]: {
    label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.APPROVED],
    class: 'label-success',
    icon: 'shield-check-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  [REFUND_APPLICATION_STATUS.REJECTED]: {
    label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.REJECTED],
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  [REFUND_APPLICATION_STATUS.COMPLETED]: {
    label: REFUND_APPLICATION_STATUS_I18N[REFUND_APPLICATION_STATUS.COMPLETED],
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
}

// Types
export const REFUND_TYPE = {
  /** 全额退款 */
  FULL: 'FULL',
} as const

export type TRefundType = (typeof REFUND_TYPE)[keyof typeof REFUND_TYPE]

// I18N
export const REFUND_TYPE_I18N: TI18NMap<TRefundType> = {
  [REFUND_TYPE.FULL]: '全额退款',
}

// Options
export const REFUND_TYPE_OPTIONS: TOptions<TRefundType> = [
  { label: REFUND_TYPE_I18N[REFUND_TYPE.FULL], value: REFUND_TYPE.FULL },
]

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
  /** 全部取消 */
  ALL_CANCELLED: 7,
} as const

export type TRefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS]

// I18N
export const REFUND_STATUS_I18N: TI18NMap<TRefundStatus> = {
  [REFUND_STATUS.PENDING]: '待审核',
  [REFUND_STATUS.APPROVED]: '审核通过',
  [REFUND_STATUS.PROCESSING]: '退款处理中',
  [REFUND_STATUS.COMPLETED]: '全部退款完成',
  [REFUND_STATUS.PARTIAL]: '部分退款完成',
  [REFUND_STATUS.REJECTED]: '审核拒绝',
  [REFUND_STATUS.CANCELLED]: '用户取消',
  [REFUND_STATUS.ALL_CANCELLED]: '全部取消',
}

// Options
export const REFUND_STATUS_OPTIONS: FilterOption[] = [
  { value: REFUND_STATUS.PENDING, label: REFUND_STATUS_I18N[REFUND_STATUS.PENDING] },
  { value: REFUND_STATUS.APPROVED, label: REFUND_STATUS_I18N[REFUND_STATUS.APPROVED] },
  { value: REFUND_STATUS.PROCESSING, label: REFUND_STATUS_I18N[REFUND_STATUS.PROCESSING] },
  { value: REFUND_STATUS.COMPLETED, label: REFUND_STATUS_I18N[REFUND_STATUS.COMPLETED] },
  { value: REFUND_STATUS.PARTIAL, label: REFUND_STATUS_I18N[REFUND_STATUS.PARTIAL] },
  { value: REFUND_STATUS.REJECTED, label: REFUND_STATUS_I18N[REFUND_STATUS.REJECTED] },
  { value: REFUND_STATUS.CANCELLED, label: REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED] },
  { value: REFUND_STATUS.ALL_CANCELLED, label: REFUND_STATUS_I18N[REFUND_STATUS.ALL_CANCELLED] },
]

/**
 * 状态配置映射
 */
export const REFUND_STATUS_CONFIGS: TStatusConfigMap<TRefundStatus> = {
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
  [REFUND_STATUS.ALL_CANCELLED]: {
    label: REFUND_STATUS_I18N[REFUND_STATUS.ALL_CANCELLED],
    class: 'label-default',
    icon: 'close-circle-line',
    iconColor: '#6b7280',
    bgColor: '#f9fafb',
  },
}
