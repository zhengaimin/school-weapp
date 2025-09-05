/**
 * @file 赠费相关的常量
 */

// #region 赠费来源类型
// Types
export const GIFT_SOURCE = {
  /** 管理员赠送 */
  ADMIN_GIFT: 'ADMIN_GIFT',
  /** 活动赠送 */
  PROMOTION: 'PROMOTION',
  /** 补偿赠送 */
  COMPENSATION: 'COMPENSATION',
  /** 奖励赠送 */
  REWARD: 'REWARD',
} as const

export type TGiftSource = (typeof GIFT_SOURCE)[keyof typeof GIFT_SOURCE]

// I18N
export const GIFT_SOURCE_I18N: Record<TGiftSource, string> = {
  [GIFT_SOURCE.ADMIN_GIFT]: '管理员赠送',
  [GIFT_SOURCE.PROMOTION]: '活动赠送',
  [GIFT_SOURCE.COMPENSATION]: '补偿赠送',
  [GIFT_SOURCE.REWARD]: '奖励赠送',
}

// Options
export const GIFT_SOURCE_OPTIONS = [
  { label: GIFT_SOURCE_I18N[GIFT_SOURCE.ADMIN_GIFT], value: GIFT_SOURCE.ADMIN_GIFT },
  { label: GIFT_SOURCE_I18N[GIFT_SOURCE.PROMOTION], value: GIFT_SOURCE.PROMOTION },
  { label: GIFT_SOURCE_I18N[GIFT_SOURCE.COMPENSATION], value: GIFT_SOURCE.COMPENSATION },
  { label: GIFT_SOURCE_I18N[GIFT_SOURCE.REWARD], value: GIFT_SOURCE.REWARD },
]
// #endregion

// #region 赠费状态
// Types
export const GIFT_STATUS = {
  /** 有效 */
  VALID: 'VALID',
  /** 即将到期 */
  SOON_TO_EXPIRE: 'SOON_TO_EXPIRE',
  /** 已过期 */
  EXPIRED: 'EXPIRED',
  /** 已用完 */
  USED_UP: 'USED_UP',
} as const

export type TGiftStatus = (typeof GIFT_STATUS)[keyof typeof GIFT_STATUS]

// I18N
export const GIFT_STATUS_I18N: Record<TGiftStatus, string> = {
  [GIFT_STATUS.VALID]: '有效',
  [GIFT_STATUS.SOON_TO_EXPIRE]: '即将到期',
  [GIFT_STATUS.EXPIRED]: '已过期',
  [GIFT_STATUS.USED_UP]: '已用完',
}

// Options
export const GIFT_STATUS_OPTIONS = [
  { label: GIFT_STATUS_I18N[GIFT_STATUS.VALID], value: GIFT_STATUS.VALID },
  { label: GIFT_STATUS_I18N[GIFT_STATUS.SOON_TO_EXPIRE], value: GIFT_STATUS.SOON_TO_EXPIRE },
  { label: GIFT_STATUS_I18N[GIFT_STATUS.EXPIRED], value: GIFT_STATUS.EXPIRED },
  { label: GIFT_STATUS_I18N[GIFT_STATUS.USED_UP], value: GIFT_STATUS.USED_UP },
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
export const GIFT_STATUS_CONFIGS: Record<TGiftStatus, StatusConfig> = {
  [GIFT_STATUS.VALID]: {
    label: GIFT_STATUS_I18N[GIFT_STATUS.VALID],
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  [GIFT_STATUS.SOON_TO_EXPIRE]: {
    label: GIFT_STATUS_I18N[GIFT_STATUS.SOON_TO_EXPIRE],
    class: 'label-warning',
    icon: 'time-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
  [GIFT_STATUS.EXPIRED]: {
    label: GIFT_STATUS_I18N[GIFT_STATUS.EXPIRED],
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  [GIFT_STATUS.USED_UP]: {
    label: GIFT_STATUS_I18N[GIFT_STATUS.USED_UP],
    class: 'label-default',
    icon: 'forbid-line',
    iconColor: '#9ca3af',
    bgColor: '#f3f4f6',
  },
}
// #endregion
