import type { TI18NMap, TOptions } from '@/types'

// #region 支付方式
// Types
export const PAYMENT_METHOD = {
  MOCK: 'MOCK',
  WECHAT: 'WECHAT',
} as const

export type TPaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

// I18N
export const PAYMENT_METHOD_I18N: TI18NMap<TPaymentMethod> = {
  [PAYMENT_METHOD.MOCK]: '模拟支付',
  [PAYMENT_METHOD.WECHAT]: '微信支付',
}

// Options
export const PAYMENT_METHOD_OPTIONS: TOptions<TPaymentMethod> = [
  { label: PAYMENT_METHOD_I18N[PAYMENT_METHOD.MOCK], value: PAYMENT_METHOD.MOCK },
  { label: PAYMENT_METHOD_I18N[PAYMENT_METHOD.WECHAT], value: PAYMENT_METHOD.WECHAT },
]
// #endregion

// #region 支付状态
// Types
export const PAYMENT_STATUS = {
  /** 待支付 - 0 */
  PENDING: 0,
  /** 支付成功 - 1 */
  SUCCESS: 1,
  /** 支付失败 - 2 */
  FAILED: 2,
  /** 已退款 - 3 */
  REFUND: 3,
  /** 已取消 - 4 */
  CANCELLED: 4,
  /** 已过期 - 5 */
  EXPIRED: 5,
} as const

export type TPaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

// I18N
export const PAYMENT_STATUS_I18N: TI18NMap<TPaymentStatus> = {
  [PAYMENT_STATUS.PENDING]: '待支付',
  [PAYMENT_STATUS.SUCCESS]: '支付成功',
  [PAYMENT_STATUS.FAILED]: '支付失败',
  [PAYMENT_STATUS.REFUND]: '已退款',
  [PAYMENT_STATUS.CANCELLED]: '已取消',
  [PAYMENT_STATUS.EXPIRED]: '已过期',
}

// Options
export const PAYMENT_STATUS_OPTIONS: TOptions<TPaymentStatus> = [
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.PENDING], value: PAYMENT_STATUS.PENDING },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.SUCCESS], value: PAYMENT_STATUS.SUCCESS },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.FAILED], value: PAYMENT_STATUS.FAILED },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.REFUND], value: PAYMENT_STATUS.REFUND },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.CANCELLED], value: PAYMENT_STATUS.CANCELLED },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.EXPIRED], value: PAYMENT_STATUS.EXPIRED },
]
// #endregion

// #region 充值结果状态配置接口
interface IRechargeResultStatusConfig {
  bgColor: string
  iconName: string
  iconColor: string
  title: string
  description: string
}

export const RECHARGE_RESULT_STATUS_CONFIG: Record<TPaymentStatus, IRechargeResultStatusConfig> = {
  [PAYMENT_STATUS.PENDING]: {
    bgColor: '#fef3c7',
    iconName: 'time-line',
    iconColor: '#f59e0b',
    title: '待支付',
    description: '订单等待支付',
  },
  [PAYMENT_STATUS.SUCCESS]: {
    bgColor: '#d1fae5',
    iconName: 'check-line',
    iconColor: '#10b981',
    title: '充值成功！',
    description: '您的账户已成功充值',
  },
  [PAYMENT_STATUS.FAILED]: {
    bgColor: '#fee2e2',
    iconName: 'close-line',
    iconColor: '#ef4444',
    title: '充值失败',
    description: '支付失败，请稍后重试',
  },
  [PAYMENT_STATUS.REFUND]: {
    bgColor: '#e5e7eb',
    iconName: 'refund-2-line',
    iconColor: '#4b5563',
    title: '已退款',
    description: '该笔订单已退款',
  },
  [PAYMENT_STATUS.CANCELLED]: {
    bgColor: '#e5e7eb',
    iconName: 'close-circle-line',
    iconColor: '#4b5563',
    title: '已取消',
    description: '订单已取消',
  },
  [PAYMENT_STATUS.EXPIRED]: {
    bgColor: '#e5e7eb',
    iconName: 'error-warning-line',
    iconColor: '#4b5563',
    title: '已过期',
    description: '订单已过期',
  },
}
// #endregion
