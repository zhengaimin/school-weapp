export type NoticeType = 'warning' | 'info' | 'success' | 'error' | 'custom'

export interface NoticeConfig {
  bgColor: string
  borderColor: string
  icon: string
  iconColor: string
  textColor: string
}

export interface NoticeProps {
  type?: NoticeType
  title?: string
  content?: string
  config?: NoticeConfig
  icon?: string
  iconColor?: string
  bgColor?: string
  borderColor?: string
  textColor?: string
}
