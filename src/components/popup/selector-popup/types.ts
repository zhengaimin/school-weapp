// 选择器弹框组件相关类型定义

// 选项接口
export interface SelectorOption {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
  /** 额外数据 */
  [key: string]: any
}

// 组件属性接口
export interface SelectorPopupProps {
  /** 是否显示弹框 */
  modelValue?: boolean
  /** 选中的值 */
  value?: string | number
  /** 弹框标题 */
  title?: string
  /** 选项列表 */
  options: SelectorOption[]
  /** 占位符文本 */
  placeholder?: string
  /** 是否显示确认按钮 */
  showConfirm?: boolean
  /** 是否多选模式 */
  multiple?: boolean
  /** 自定义样式 */
  customStyle?: string
  /** 自定义类名 */
  customClass?: string
}

// 组件事件接口
export interface SelectorPopupEmits {
  /** 更新显示状态 */
  (e: 'update:modelValue', value: boolean): void
  /** 更新选中值 */
  (e: 'update:value', value: string | number): void
  /** 选项改变时触发 */
  (e: 'change', value: string | number, option: SelectorOption): void
  /** 确认选择时触发 */
  (e: 'confirm', value: string | number, option: SelectorOption): void
  /** 取消选择时触发 */
  (e: 'cancel'): void
  /** 弹框关闭时触发 */
  (e: 'close'): void
}

// 组件实例接口
export interface SelectorPopupInstance {
  /** 显示弹框 */
  show: () => void
  /** 隐藏弹框 */
  hide: () => void
  /** 获取当前选中的选项 */
  getSelectedOption: () => SelectorOption | undefined
  /** 设置选中的值 */
  setSelectedValue: (value: string | number) => void
}
