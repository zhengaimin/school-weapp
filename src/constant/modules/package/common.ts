// #region 套餐类型
// Types
export const PACKAGE_TYPE = {
  GENERAL: 'GENERAL',
  FIXED: 'FIXED',
} as const

export type TPackageType = (typeof PACKAGE_TYPE)[keyof typeof PACKAGE_TYPE]

// I18N
export const PACKAGE_TYPE_I18N: Record<TPackageType, string> = {
  [PACKAGE_TYPE.GENERAL]: '通用套餐',
  [PACKAGE_TYPE.FIXED]: '固定套餐',
}

// Options
export const PACKAGE_TYPE_OPTIONS = [
  { label: PACKAGE_TYPE_I18N[PACKAGE_TYPE.GENERAL], value: PACKAGE_TYPE.GENERAL },
  { label: PACKAGE_TYPE_I18N[PACKAGE_TYPE.FIXED], value: PACKAGE_TYPE.FIXED },
]
// #endregion

// #region 套餐状态
// Types
export const PACKAGE_STATUS = {
  PENDING: 0,
  WAITING_ACTIVE: 1,
  ACTIVE: 2,
  EXPIRED: 3,
  USED_UP: 4,
  REFUNDED: 5,
  CANCELLED: 6,
  REFUND_PENDING: 7,
} as const

export type TPackageStatus = (typeof PACKAGE_STATUS)[keyof typeof PACKAGE_STATUS]

// I18N
export const PACKAGE_STATUS_I18N: Record<TPackageStatus, string> = {
  [PACKAGE_STATUS.PENDING]: '待支付',
  [PACKAGE_STATUS.WAITING_ACTIVE]: '待激活',
  [PACKAGE_STATUS.ACTIVE]: '有效/已激活',
  [PACKAGE_STATUS.EXPIRED]: '已过期',
  [PACKAGE_STATUS.USED_UP]: '已用完',
  [PACKAGE_STATUS.REFUNDED]: '已退款',
  [PACKAGE_STATUS.CANCELLED]: '已取消',
  [PACKAGE_STATUS.REFUND_PENDING]: '申请退款中',
}

// Options
export const PACKAGE_STATUS_OPTIONS = [
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.PENDING], value: PACKAGE_STATUS.PENDING },
  {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.WAITING_ACTIVE],
    value: PACKAGE_STATUS.WAITING_ACTIVE,
  },
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.ACTIVE], value: PACKAGE_STATUS.ACTIVE },
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.EXPIRED], value: PACKAGE_STATUS.EXPIRED },
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.USED_UP], value: PACKAGE_STATUS.USED_UP },
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.REFUNDED], value: PACKAGE_STATUS.REFUNDED },
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.CANCELLED], value: PACKAGE_STATUS.CANCELLED },
  {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.REFUND_PENDING],
    value: PACKAGE_STATUS.REFUND_PENDING,
  },
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
export const PACKAGE_STATUS_CONFIGS: Record<TPackageStatus, StatusConfig> = {
  [PACKAGE_STATUS.PENDING]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.PENDING],
    class: 'label-warning',
    icon: 'time-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
  [PACKAGE_STATUS.WAITING_ACTIVE]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.WAITING_ACTIVE],
    class: 'label-info',
    icon: 'time-line',
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
  },
  [PACKAGE_STATUS.ACTIVE]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.ACTIVE],
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  [PACKAGE_STATUS.EXPIRED]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.EXPIRED],
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  [PACKAGE_STATUS.USED_UP]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.USED_UP],
    class: 'label-warning',
    icon: 'error-warning-line',
    iconColor: '#eab308',
    bgColor: '#fef9c3',
  },
  [PACKAGE_STATUS.REFUNDED]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.REFUNDED],
    class: 'label-info',
    icon: 'refund-line',
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
  },
  [PACKAGE_STATUS.CANCELLED]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.CANCELLED],
    class: 'label-default',
    icon: 'forbid-line',
    iconColor: '#9ca3af',
    bgColor: '#f3f4f6',
  },
  [PACKAGE_STATUS.REFUND_PENDING]: {
    label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.REFUND_PENDING],
    class: 'label-warning',
    icon: 'refund-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
}
// #endregion
