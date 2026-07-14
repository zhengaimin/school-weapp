// Radio 组件相关类型定义

// 选项数据类型
export interface RadioOption {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: string
  /** 后缀文字 */
  suffix?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 额外的数据属性 */
  [key: string]: any
}

// 组件属性接口
export interface RadioProps {
  /** 当前选中的值 */
  modelValue?: string | number
  /** 选项列表 */
  options: RadioOption[]
  /** 自定义样式类 */
  customClass?: string
  /** 选项之间的间距 */
  gap?: string
  /** 每行显示的选项数量，0表示单行显示 */
  columns?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 选项容器自定义样式 */
  itemStyle?: string
  /** 选项容器自定义类名 */
  itemClass?: string
}

// 组件事件接口
export interface RadioEmits {
  /** 选项变化时触发 */
  (e: 'change', value: string | number, option: RadioOption): void
  /** 更新 modelValue */
  (e: 'update:modelValue', value: string | number): void
}

// 组件插槽接口
export interface RadioSlots {
  /** 选项内容插槽 */
  option?: (props: {
    option: RadioOption
    selected: boolean
    disabled: boolean
  }) => any
  /** 后缀内容插槽 */
  suffix?: (props: {
    option: RadioOption
    selected: boolean
    disabled: boolean
  }) => any
}

// 组件实例接口
export interface RadioInstance {
  /** 选择指定选项 */
  select: (value: string | number) => void
  /** 清除选择 */
  clear: () => void
  /** 获取当前选中的选项 */
  getSelected: () => RadioOption | null
}

// 预设的列数选项
export const RADIO_COLUMNS = {
  /** 单行显示 */
  SINGLE: 0,
  /** 两列显示 */
  TWO: 2,
  /** 三列显示 */
  THREE: 3,
  /** 四列显示 */
  FOUR: 4,
} as const

export type RadioColumns = typeof RADIO_COLUMNS[keyof typeof RADIO_COLUMNS]

// 预设的间距选项
export const RADIO_GAPS = {
  /** 无间距 */
  NONE: '',
  /** 小间距 */
  SMALL: 'y-2',
  /** 中等间距 */
  MEDIUM: 'y-3',
  /** 大间距 */
  LARGE: 'y-4',
} as const

export type RadioGap = typeof RADIO_GAPS[keyof typeof RADIO_GAPS]

// 工具函数类型
export interface RadioUtils {
  /** 创建选项 */
  createOption: (value: string | number, label: string, suffix?: string, disabled?: boolean) => RadioOption
  /** 创建选项列表 */
  createOptions: (data: Array<{ value: string | number, label: string, suffix?: string, disabled?: boolean }>) => RadioOption[]
  /** 根据值查找选项 */
  findOption: (options: RadioOption[], value: string | number) => RadioOption | null
  /** 获取选中的选项 */
  getSelectedOption: (options: RadioOption[], value: string | number) => RadioOption | null
}
