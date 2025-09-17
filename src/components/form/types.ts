// 规则项定义
export interface RuleItem {
  required?: boolean
  message?: string
  pattern?: RegExp
  validator?: (value: any, rule: RuleItem) => boolean | Promise<boolean> | string | Promise<string>
  trigger?: 'blur' | 'change'
  min?: number
  max?: number
}

// 验证错误定义
export interface ValidateError {
  prop: string
  message: string
}

// 验证结果定义
export interface ValidateResult {
  valid: boolean
  errors: ValidateError[]
}

// Form组件暴露的方法
export interface FormExpose {
  validate: (fields?: string[]) => Promise<ValidateResult>
  reset: () => void
}

// FormItem组件暴露的方法
export interface FormItemExpose {
  validate: () => Promise<boolean>
  reset: () => void
}

// Form提供给子组件的数据
export interface FormContext {
  registerFormItem: (item: FormItem) => void
  unregisterFormItem: (item: FormItem) => void
  setErrorMessage: (prop: string, message: string) => void
  clearErrorMessage: (prop?: string) => void
  errorMessages: Record<string, string>
  model: Record<string, any>
  rules: Record<string, RuleItem[]>
}

// FormItem定义
export interface FormItem {
  prop: string
  validate: () => Promise<boolean>
  reset: () => void
}

// Form Key
export const FORM_KEY = Symbol('form')
