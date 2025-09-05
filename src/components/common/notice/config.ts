import type { NoticeType } from './types'

export const typeConfig: Record<
  NoticeType,
  {
    bgColor: string
    borderColor: string
    icon: string
    iconColor: string
    textColor: string
  }
> = {
  warning: {
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
    icon: 'information-line',
    iconColor: '#f59e0b',
    textColor: '#f59e0b',
  },
  info: {
    bgColor: '#eff6ff',
    borderColor: '#3b82f6',
    icon: 'information-line',
    iconColor: '#2563eb',
    textColor: '#1e40af',
  },
  success: {
    bgColor: '#f0fdf4',
    borderColor: '#22c55e',
    icon: 'checkbox-circle-line',
    iconColor: '#16a34a',
    textColor: '#15803d',
  },
  error: {
    bgColor: '#fef2f2',
    borderColor: '#ef4444',
    icon: 'close-circle-line',
    iconColor: '#dc2626',
    textColor: '#b91c1c',
  },
}
