import type { NoticeConfig, NoticeType } from './types'

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
  custom: {
    bgColor: '#f3f4f6',
    borderColor: '#d1d5db',
    icon: 'information-line',
    iconColor: '#6b7280',
    textColor: '#374151',
  },
}

/**
 * 获取通知配置
 * @param type 通知类型
 * @param customConfig 自定义配置
 * @returns 通知配置
 */
export function getNoticeConfig(
  type: NoticeType = 'info',
  customConfig?: Partial<NoticeConfig>,
): NoticeConfig {
  const defaultConfig = typeConfig[type]

  if (!customConfig) {
    return defaultConfig
  }

  return {
    ...defaultConfig,
    ...customConfig,
  }
}

/**
 * 合并通知配置
 * @param baseConfig 基础配置
 * @param overrides 覆盖配置
 * @returns 合并后的配置
 */
export function mergeNoticeConfig(
  baseConfig: NoticeConfig,
  overrides: Partial<NoticeConfig>,
): NoticeConfig {
  return {
    ...baseConfig,
    ...overrides,
  }
}

// 人脸状态通知配置
export const faceStatusConfig = {
  not_collected: {
    bgColor: 'blue-50',
    borderColor: 'blue-200',
    icon: 'information-line',
    iconColor: '#3b82f6',
    titleColor: 'blue-900',
    contentColor: 'blue-700',
    title: '请上传人脸照片',
    content: '为确保身份验证的准确性，请上传清晰的人脸照片。支持JPG、PNG格式。',
  },
  collected: {
    bgColor: 'yellow-50',
    borderColor: 'yellow-200',
    icon: 'time-line',
    iconColor: '#f59e0b',
    titleColor: 'yellow-900',
    contentColor: 'yellow-700',
    title: '照片审核中',
    content: '您的人脸照片正在审核中，请耐心等待审核结果。通常需要1-2个工作日。',
  },
  auditing: {
    bgColor: 'yellow-50',
    borderColor: 'yellow-200',
    icon: 'loader-4-line',
    iconColor: '#f59e0b',
    titleColor: 'yellow-900',
    contentColor: 'yellow-700',
    title: '照片审核中',
    content: '您的人脸照片正在审核中，请耐心等待审核结果。通常需要1-2个工作日。',
  },
  audit_passed: {
    bgColor: 'green-50',
    borderColor: 'green-200',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    titleColor: 'green-900',
    contentColor: 'green-700',
    title: '审核已通过',
    content: '恭喜！您的人脸照片已通过审核，现在可以正常使用人脸识别功能。',
  },
  audit_failed: {
    bgColor: 'red-50',
    borderColor: 'red-200',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    titleColor: 'red-900',
    contentColor: 'red-700',
    title: '审核失败，请重新上传',
    content: '您的人脸照片未通过审核。请确保照片清晰、光线充足，并重新上传符合要求的照片。',
  },
}
