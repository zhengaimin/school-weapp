<script setup lang="ts">
import type { FormExpose, FormItem, RuleItem, ValidateError, ValidateResult } from '../types'
import { provide, reactive, ref, unref, watch } from 'vue'

interface Props {
  model: Record<string, any>
  rules?: Record<string, RuleItem[]>
}

const props = defineProps<Props>()

const FORM_KEY = Symbol('form')

// 子组件注册列表
const formItems = ref<FormItem[]>([])

// 错误信息管理
const errorMessages = reactive<Record<string, string>>({})

// 注册子组件
function registerFormItem(item: FormItem) {
  formItems.value.push(item)
}

// 注销子组件
function unregisterFormItem(item: FormItem) {
  const index = formItems.value.indexOf(item)
  if (index > 0) {
    formItems.value.splice(index, 1)
  }
}

// 设置错误信息
function setErrorMessage(prop: string, message: string) {
  errorMessages[prop] = message
}

// 清除错误信息
function clearErrorMessage(prop?: string) {
  if (prop) {
    errorMessages[prop] = ''
  }
  else {
    Object.keys(errorMessages).forEach((key) => {
      errorMessages[key] = ''
    })
  }
}

// 表单校验函数
async function validate(fields?: string[]): Promise<ValidateResult> {
  const errors: ValidateError[] = []
  let valid = true

  const itemsToValidate = fields
    ? formItems.value.filter(item => fields.includes(item.prop))
    : formItems.value

  for (const item of itemsToValidate) {
    try {
      const itemValid = await item.validate()
      if (!itemValid) {
        valid = false
      }
    }
    catch (error) {
      valid = false
      if (error instanceof Error) {
        errors.push({
          prop: item.prop,
          message: error.message,
        })
      }
    }
  }

  return {
    valid,
    errors,
  }
}

// 重置表单
function reset() {
  formItems.value.forEach(item => item.reset())
  clearErrorMessage()
}

// 提供给子组件的方法
provide('form', {
  registerFormItem,
  unregisterFormItem,
  setErrorMessage,
  clearErrorMessage,
  errorMessages,
  model: computed(() => unref(props.model)),
  rules: computed(() => unref(props.rules)),
})

// 监听model变化，如果需要可以重置错误
watch(() => props.model, () => {
  // 可以在这里重置错误或进行其他处理
}, { deep: true })

defineExpose<FormExpose>({
  validate,
  reset,
})
</script>

<template>
  <view class="custom-form school-form">
    <slot></slot>
  </view>
</template>

<style scoped lang="scss">
.custom-form {
  width: 100%;
}
</style>
