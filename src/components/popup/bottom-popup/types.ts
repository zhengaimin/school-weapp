// BottomPopup 组件相关类型定义

// 组件属性接口
export interface BottomPopupProps {
  /** 是否显示弹框 */
  modelValue?: boolean
  /** 弹框标题 */
  title?: string
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否点击遮罩关闭 */
  closeOnClickModal?: boolean
  /** 自定义样式 */
  customStyle?: string
  /** 自定义类名 */
  customClass?: string
  /** 弹框高度 */
  height?: string
  /** 弹框最大高度 */
  maxHeight?: string
  /** 是否显示底部安全区域 */
  safeAreaInsetBottom?: boolean
  /** z-index 层级 */
  zIndex?: number
  /** 是否显示标题栏 */
  showHeader?: boolean
  /** 标题栏自定义样式 */
  headerStyle?: string
  /** 内容区域自定义样式 */
  contentStyle?: string
  /** 是否显示关闭按钮 (wot-ui 原生属性) */
  closable?: boolean
  /** 是否显示遮罩 */
  modal?: boolean
  /** 自定义modal蒙层样式 */
  modalStyle?: string
  /** 是否当关闭时将弹出层隐藏 */
  hideWhenClose?: boolean
  /** 弹层内容懒渲染 */
  lazyRender?: boolean
  /** 动画类型 */
  transition?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | ''
  /** 是否锁定背景滚动 */
  lockScroll?: boolean
  /** 动画持续时间 */
  duration?: number | boolean
  /** 点击遮罩时触发 */
  onClickModal?: () => void
  /** 进入前触发 */
  onBeforeEnter?: () => void
  /** 进入时触发 */
  onEnter?: () => void
  /** 进入后触发 */
  onAfterEnter?: () => void
  /** 离开前触发 */
  onBeforeLeave?: () => void
  /** 离开时触发 */
  onLeave?: () => void
  /** 离开后触发 */
  onAfterLeave?: () => void
}

// 组件事件接口
export interface BottomPopupEmits {
  /** 弹框关闭时触发 */
  (e: 'close'): void
  /** 弹框打开时触发 */
  (e: 'open'): void
  /** 弹框打开完成时触发 */
  (e: 'opened'): void
  /** 弹框关闭完成时触发 */
  (e: 'closed'): void
  /** 更新 modelValue */
  (e: 'update:modelValue', value: boolean): void
}

// 组件插槽接口
export interface BottomPopupSlots {
  /** 默认插槽 - 弹框内容 */
  default?: () => any
  /** 标题栏插槽 - 自定义标题栏内容 */
  header?: () => any
  /** 关闭按钮插槽 - 自定义关闭按钮 */
  close?: () => any
  /** 底部插槽 - 底部操作栏 */
  footer?: () => any
}

// 组件实例接口
export interface BottomPopupInstance {
  /** 显示弹框 */
  show: () => void
  /** 隐藏弹框 */
  hide: () => void
  /** 切换弹框显示状态 */
  toggle: () => void
}

// 弹框配置选项
export interface BottomPopupOptions {
  /** 弹框标题 */
  title?: string
  /** 弹框高度 */
  height?: string
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否点击遮罩关闭 */
  closeOnClickModal?: boolean
  /** 自定义样式 */
  customStyle?: string
  /** 自定义类名 */
  customClass?: string
  /** 是否显示底部安全区域 */
  safeAreaInsetBottom?: boolean
  /** z-index 层级 */
  zIndex?: number
}

// 预设的弹框高度选项
export const POPUP_HEIGHTS = {
  /** 小尺寸 - 40vh */
  SMALL: '40vh',
  /** 中等尺寸 - 60vh */
  MEDIUM: '60vh',
  /** 大尺寸 - 80vh */
  LARGE: '80vh',
  /** 全屏 - 100vh */
  FULL: '100vh',
} as const

export type PopupHeight = typeof POPUP_HEIGHTS[keyof typeof POPUP_HEIGHTS]

// 预设的 z-index 层级
export const POPUP_Z_INDEX = {
  /** 默认层级 */
  DEFAULT: 999,
  /** 高层级 */
  HIGH: 1999,
  /** 最高层级 */
  TOP: 9999,
} as const

export type PopupZIndex = typeof POPUP_Z_INDEX[keyof typeof POPUP_Z_INDEX]

// 弹框主题配置
export interface BottomPopupTheme {
  /** 标题栏背景色 */
  headerBackground?: string
  /** 标题文字颜色 */
  titleColor?: string
  /** 标题字体大小 */
  titleFontSize?: string
  /** 标题字体粗细 */
  titleFontWeight?: string
  /** 边框颜色 */
  borderColor?: string
  /** 关闭按钮颜色 */
  closeColor?: string
  /** 关闭按钮大小 */
  closeSize?: string
  /** 内容区域背景色 */
  contentBackground?: string
  /** 底部区域背景色 */
  footerBackground?: string
}

// 默认主题配置
export const DEFAULT_THEME: BottomPopupTheme = {
  headerBackground: '#ffffff',
  titleColor: '#1f2937',
  titleFontSize: '18px',
  titleFontWeight: 'bold',
  borderColor: '#f5f5f5',
  closeColor: '#999999',
  closeSize: '32rpx',
  contentBackground: '#ffffff',
  footerBackground: '#ffffff',
}

// 工具函数类型
export interface BottomPopupUtilFn {
  /** 创建弹框实例 */
  create: (options: BottomPopupOptions) => BottomPopupInstance
  /** 显示确认弹框 */
  confirm: (options: BottomPopupOptions & { onConfirm?: () => void, onCancel?: () => void }) => Promise<boolean>
  /** 显示信息弹框 */
  info: (options: BottomPopupOptions & { content: string }) => BottomPopupInstance
}
