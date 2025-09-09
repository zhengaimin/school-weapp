/**
 * @file 常量相关的通用类型定义
 */

/**
 * 通用 I18N 映射类型
 * @template T - 常量联合类型
 * @example
 * type TStatus = 'pending' | 'completed'
 * type TStatusI18N = TI18NMap<TStatus>
 */
export type TI18NMap<T extends string | number> = Record<T, string>

/**
 * 通用选项接口类型
 * @template T - 值的类型
 * @example
 * const options: IOption<string>[] = [
 *   { label: '待处理', value: 'pending' },
 *   { label: '已完成', value: 'completed' }
 * ]
 */
export interface IOption<T = string | number> {
  /** 显示标签 */
  label: string
  /** 选项值 */
  value: T
  /** 是否禁用 */
  disabled?: boolean
  /** 额外数据 */
  [key: string]: any
}

/**
 * 通用选项数组类型
 * @template T - 值的类型
 */
export type TOptions<T = string | number> = IOption<T>[]

/**
 * 状态配置接口
 * 用于定义状态的视觉展示配置
 */
export interface IStatusConfig {
  /** 状态显示标签 */
  label: string
  /** 状态样式类名 */
  class: string
  /** 状态图标名称 */
  icon: string
  /** 图标颜色 */
  iconColor: string
  /** 背景颜色 */
  bgColor: string
  /** 文字颜色（可选） */
  textColor?: string
  /** 边框颜色（可选） */
  borderColor?: string
}

/**
 * 状态配置映射类型
 * @template T - 状态类型
 * @example
 * type TRefundStatus = 'pending' | 'completed'
 * type TRefundStatusConfigs = TStatusConfigMap<TRefundStatus>
 */
export type TStatusConfigMap<T extends string | number> = Record<T, IStatusConfig>

/**
 * 扩展的状态配置接口（包含更多 UI 属性）
 */
export interface IExtendedStatusConfig extends IStatusConfig {
  /** 进度百分比（可选） */
  progress?: number
  /** 是否可点击 */
  clickable?: boolean
  /** 提示信息 */
  tooltip?: string
  /** 优先级（用于排序） */
  priority?: number
}

/**
 * 带有搜索功能的选项接口类型
 */
export interface ISearchableOption<T = string | number> extends IOption<T> {
  /** 搜索关键词（用于过滤） */
  keywords?: string[]
  /** 分组名称 */
  group?: string
}

/**
 * 树形选项接口类型
 */
export interface ITreeOption<T = string | number> extends IOption<T> {
  /** 子选项 */
  children?: ITreeOption<T>[]
  /** 父级值 */
  parentValue?: T
  /** 层级深度 */
  level?: number
  /** 是否展开 */
  expanded?: boolean
}

/**
 * 常量定义结构接口类型
 * 标准的常量定义应包含的内容
 */
export interface IConstantDefinition<T extends string | number> {
  /** 常量对象 */
  constants: Record<string, T>
  /** 类型定义 */
  type: T
  /** I18N 映射 */
  i18n: TI18NMap<T>
  /** 选项数组 */
  options: TOptions<T>
  /** 状态配置映射（可选） */
  configs?: TStatusConfigMap<T>
}