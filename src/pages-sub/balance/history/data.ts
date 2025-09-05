import { PAYMENT_STATUS, PAYMENT_STATUS_I18N } from '@/constant/modules/payment/recharge'

// 时间筛选类型
export type TimeFilterType = 'all' | 'week' | 'month' | 'quarter'

// 状态配置接口
export interface StatusConfig {
  label: string
  class: string
  icon: string
  iconColor: string
  bgColor: string
}

// 筛选选项接口
export interface FilterOption {
  label: string
  value: string | number
}

// 状态配置映射
export const statusConfigs: Record<string, StatusConfig> = {
  [PAYMENT_STATUS.SUCCESS]: {
    label: '成功',
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  [PAYMENT_STATUS.FAILED]: {
    label: '失败',
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  [PAYMENT_STATUS.PENDING]: {
    label: '处理中',
    class: 'label-warning',
    icon: 'time-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
  [PAYMENT_STATUS.CANCELLED]: {
    label: '已取消',
    class: 'label-cancel',
    icon: 'stop-circle-line',
    iconColor: '#6b7280',
    bgColor: '#f3f4f6',
  },
  [PAYMENT_STATUS.REFUND]: {
    label: '已退款',
    class: 'label-cancel',
    icon: 'refund-2-line',
    iconColor: '#6b7280',
    bgColor: '#f3f4f6',
  },
  [PAYMENT_STATUS.EXPIRED]: {
    label: '已过期',
    class: 'label-cancel',
    icon: 'time-line',
    iconColor: '#6b7280',
    bgColor: '#f3f4f6',
  },
}

// 时间筛选选项
export const timeFilterOptions: FilterOption[] = [
  { value: 'all', label: '全部' },
  { value: 'week', label: '最近一周' },
  { value: 'month', label: '最近一月' },
  { value: 'quarter', label: '最近三月' },
]

// 获取状态配置
export function getStatusConfig(status: number): StatusConfig {
  return statusConfigs[status]
}

// 获取时间筛选选项
export function getTimeFilterOptions(): FilterOption[] {
  return [...timeFilterOptions]
}
