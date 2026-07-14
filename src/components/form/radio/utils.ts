import type { RadioOption } from './types'

// Radio 组件工具函数

/**
 * 创建单个选项
 * @param value 选项值
 * @param label 选项标签
 * @param suffix 后缀文字
 * @param disabled 是否禁用
 * @returns RadioOption
 */
export function createOption(
  value: string | number,
  label: string,
  suffix?: string,
  disabled?: boolean,
): RadioOption {
  return {
    value,
    label,
    suffix,
    disabled: disabled || false,
  }
}

/**
 * 创建选项列表
 * @param data 选项数据数组
 * @returns RadioOption[]
 */
export function createOptions(
  data: Array<{
    value: string | number
    label: string
    suffix?: string
    disabled?: boolean
    [key: string]: any
  }>,
): RadioOption[] {
  return data.map(item => ({
    value: item.value,
    label: item.label,
    suffix: item.suffix,
    disabled: item.disabled || false,
    ...item, // 保留其他属性
  }))
}

/**
 * 根据值查找选项
 * @param options 选项列表
 * @param value 要查找的值
 * @returns RadioOption | null
 */
export function findOption(
  options: RadioOption[],
  value: string | number,
): RadioOption | null {
  return options.find(option => option.value === value) || null
}

/**
 * 获取选中的选项
 * @param options 选项列表
 * @param value 当前选中的值
 * @returns RadioOption | null
 */
export function getSelectedOption(
  options: RadioOption[],
  value: string | number,
): RadioOption | null {
  return findOption(options, value)
}

/**
 * 验证选项数据
 * @param options 选项列表
 * @returns boolean
 */
export function validateOptions(options: RadioOption[]): boolean {
  if (!Array.isArray(options) || options.length === 0) {
    console.warn('Radio: options should be a non-empty array')
    return false
  }

  const values = new Set()
  for (const option of options) {
    if (typeof option.value === 'undefined' || option.value === null) {
      console.warn('Radio: option value is required')
      return false
    }

    if (!option.label) {
      console.warn('Radio: option label is required')
      return false
    }

    if (values.has(option.value)) {
      console.warn(`Radio: duplicate option value: ${option.value}`)
      return false
    }

    values.add(option.value)
  }

  return true
}

/**
 * 过滤可用的选项
 * @param options 选项列表
 * @returns RadioOption[]
 */
export function getEnabledOptions(options: RadioOption[]): RadioOption[] {
  return options.filter(option => !option.disabled)
}

/**
 * 过滤禁用的选项
 * @param options 选项列表
 * @returns RadioOption[]
 */
export function getDisabledOptions(options: RadioOption[]): RadioOption[] {
  return options.filter(option => option.disabled)
}

/**
 * 获取选项的索引
 * @param options 选项列表
 * @param value 选项值
 * @returns number
 */
export function getOptionIndex(
  options: RadioOption[],
  value: string | number,
): number {
  return options.findIndex(option => option.value === value)
}

/**
 * 获取下一个可用选项
 * @param options 选项列表
 * @param currentValue 当前值
 * @returns RadioOption | null
 */
export function getNextOption(
  options: RadioOption[],
  currentValue: string | number,
): RadioOption | null {
  const currentIndex = getOptionIndex(options, currentValue)
  if (currentIndex === -1) return null

  for (let i = currentIndex + 1; i < options.length; i++) {
    if (!options[i].disabled) {
      return options[i]
    }
  }

  // 如果没有找到，从头开始查找
  for (let i = 0; i < currentIndex; i++) {
    if (!options[i].disabled) {
      return options[i]
    }
  }

  return null
}

/**
 * 获取上一个可用选项
 * @param options 选项列表
 * @param currentValue 当前值
 * @returns RadioOption | null
 */
export function getPrevOption(
  options: RadioOption[],
  currentValue: string | number,
): RadioOption | null {
  const currentIndex = getOptionIndex(options, currentValue)
  if (currentIndex === -1) return null

  for (let i = currentIndex - 1; i >= 0; i--) {
    if (!options[i].disabled) {
      return options[i]
    }
  }

  // 如果没有找到，从尾部开始查找
  for (let i = options.length - 1; i > currentIndex; i--) {
    if (!options[i].disabled) {
      return options[i]
    }
  }

  return null
}

/**
 * 转换数据为选项格式
 * @param data 原始数据
 * @param valueKey 值字段名
 * @param labelKey 标签字段名
 * @param suffixKey 后缀字段名
 * @param disabledKey 禁用字段名
 * @returns RadioOption[]
 */
export function transformToOptions(
  data: any[],
  valueKey: string = 'value',
  labelKey: string = 'label',
  suffixKey?: string,
  disabledKey?: string,
): RadioOption[] {
  return data.map(item => ({
    value: item[valueKey],
    label: item[labelKey],
    suffix: suffixKey ? item[suffixKey] : undefined,
    disabled: disabledKey ? Boolean(item[disabledKey]) : false,
    ...item, // 保留原始数据
  }))
}
