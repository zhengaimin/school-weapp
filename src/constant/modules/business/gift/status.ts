// #region 赠费状态
// Types
export const GIFT_STATUS = {
  VALID: 'VALID',
  SOON_TO_EXPIRE: 'SOON_TO_EXPIRE',
  EXPIRED: 'EXPIRED',
  USED_UP: 'USED_UP',
} as const

export type TGiftStatus = (typeof GIFT_STATUS)[keyof typeof GIFT_STATUS]

// I18N
export const GIFT_STATUS_I18N = {
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

// 配置映射
export interface StatusConfig {
  label: string
  class: string
  icon: string
  iconColor: string
  bgColor: string
}

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
