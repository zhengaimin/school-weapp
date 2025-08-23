export interface CellProps {
  /** 标签位置，可选值：left、top */
  labelPosition?: 'left' | 'top'
  /** 标签宽度 */
  labelWidth?: string | number
  /** 是否必填，为 true 时会在标签前显示红色 * 号 */
  required?: boolean
  /** 标签文本 */
  label?: string
}

export interface CellSlots {
  /** 默认插槽，用于放置表单控件 */
  'default'?: () => any
  /** 标签插槽，用于自定义标签内容 */
  'label'?: () => any
  /** 标签后缀插槽，用于在标签后添加额外内容 */
  'label-suffix'?: () => any
}
