<script setup lang="ts">
import type { FormContext, FormItem, FormItemExpose } from '../types'
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  id?: string
  /** 标签位置，可选值：left、top */
  labelPosition?: 'left' | 'top'
  /** 标签宽度 */
  labelWidth?: string | number
  /** 是否必填，为 true 时会在标签前显示红色 * 号 */
  required?: boolean
  /** 标签文本 */
  label?: string
  /** 表单域 model 字段，在使用 form 组件时，该属性是必填的 */
  prop?: string
}

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<Props>(), {
  labelPosition: 'top',
  labelWidth: 'auto',
  required: false,
  label: '',
})

// 获取Form上下文
const formContext = inject<FormContext>('form')

// 错误信息
const errorMessage = ref('')

// 监听错误信息的改变
if (formContext && props.prop) {
  watch(
    () => formContext.errorMessages[props.prop!],
    (newError) => {
      errorMessage.value = newError || ''
    },
    { immediate: true },
  )
}

// 验证函数
async function validateField(): Promise<boolean> {
  if (!formContext || !props.prop) return true

  const rules = formContext.rules.value?.[props.prop]
  if (!rules || rules.length === 0) return true

  const value = formContext.model.value?.[props.prop]

  for (const rule of rules) {
    try {
      // 检查必填
      if (rule.required && (value === undefined || value === null || value === '')) {
        formContext.setErrorMessage(
          props.prop,
          rule.message || `${props.label || props.prop}不能为空`,
        )
        return false
      }

      // 检查正则表达式
      if (rule.pattern && !rule.pattern.test(String(value))) {
        formContext.setErrorMessage(
          props.prop,
          rule.message || `${props.label || props.prop}格式不正确`,
        )
        return false
      }

      // 检查长度
      if (rule.min !== undefined && String(value).length < rule.min) {
        formContext.setErrorMessage(
          props.prop,
          rule.message || `${props.label || props.prop}长度不能小于${rule.min}`,
        )
        return false
      }

      if (rule.max !== undefined && String(value).length > rule.max) {
        formContext.setErrorMessage(
          props.prop,
          rule.message || `${props.label || props.prop}长度不能大于${rule.max}`,
        )
        return false
      }

      // 自定义验证器
      if (rule.validator) {
        const result = rule.validator(value, rule)
        if (result instanceof Promise) {
          const validatorResult = await result
          if (typeof validatorResult === 'string') {
            formContext.setErrorMessage(props.prop, validatorResult)
            return false
          }
          if (validatorResult === false) {
            formContext.setErrorMessage(
              props.prop,
              rule.message || `${props.label || props.prop}验证失败`,
            )
            return false
          }
        } else {
          if (typeof result === 'string') {
            formContext.setErrorMessage(props.prop, result)
            return false
          }
          if (result === false) {
            formContext.setErrorMessage(
              props.prop,
              rule.message || `${props.label || props.prop}验证失败`,
            )
            return false
          }
        }
      }
    } catch (error) {
      const message
        = error instanceof Error ? error.message : `${props.label || props.prop}验证出错`
      formContext.setErrorMessage(props.prop, message)
      return false
    }
  }

  // 验证通过，清除错误信息
  formContext.clearErrorMessage(props.prop)
  return true
}

// 重置函数
function resetField() {
  if (formContext && props.prop) {
    formContext.clearErrorMessage(props.prop)
  }
}

// 创建FormItem对象
const formItem: FormItem = {
  prop: props.prop || '',
  validate: validateField,
  reset: resetField,
}

// 注册到Form组件
onMounted(() => {
  if (formContext && props.prop) {
    formContext.registerFormItem(formItem)
  }
})

// 注销
onUnmounted(() => {
  if (formContext && props.prop) {
    formContext.unregisterFormItem(formItem)
  }
})

// 暴露方法
defineExpose<FormItemExpose>({
  validate: validateField,
  reset: resetField,
})

// 计算标签宽度样式
const labelWidthStyle = computed(() => {
  if (props.labelWidth === 'auto') return {}

  const width = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth

  return { width }
})

// 计算容器类名
const containerClass = computed(() => {
  return [`cell-container--${props.labelPosition}`]
})
</script>

<template>
  <view :id="id" flex="~ items-start" class="cell-container" :class="containerClass">
    <!-- 标签区域 -->
    <view
      v-if="label"
      class="cell-label"
      box="border"
      flex="~ shrink-0 items-center"
      :style="labelWidthStyle"
    >
      <!-- 必填标记 -->
      <text
        v-if="required && labelPosition === 'left'"
        class="cell-required"
        m="r-1"
        text="sm red-500"
      >
        *
      </text>

      <!-- 标签内容 -->
      <slot name="label">
        <text class="cell-label-text" text="sm gray-700">
          {{ label }}
        </text>
      </slot>

      <text
        v-if="required && labelPosition === 'top'"
        class="cell-required"
        m="l-1"
        text="sm red-500"
      >
        *
      </text>

      <!-- 标签后缀插槽 -->
      <slot name="label-suffix"></slot>
    </view>

    <!-- 内容区域 -->
    <view class="cell-content" w-full flex="~ col">
      <slot></slot>

      <!-- 错误信息显示 -->
      <view v-if="errorMessage" class="cell-error-message">
        {{ errorMessage }}
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.cell-container--left {
  --wot-input-inner-height: 24px;
  --wot-textarea-inner-height: 24px;

  .cell-label {
    margin-right: 12px;
  }

  .cell-content {
    flex: 1;
  }

  :deep(.wd-input),
  :deep(.wd-textarea) {
    width: 100%;

    &::after {
      content: initial !important;
    }
  }

  :deep(.wd-textarea) {
    padding: 0 !important;
  }
}

.cell-container--top {
  --wot-input-inner-height: 72rpx;
  --wot-textarea-inner-height: 72rpx;
  flex-direction: column;

  .cell-label {
    margin-bottom: 8px;
  }

  .cell-content {
  }

  // 去表底部边框
  :deep(.wd-input),
  :deep(.wd-textarea) {
    width: 100%;

    &::after {
      content: initial !important;
    }
  }

  :deep(.wd-input) {
    &.is-disabled {
      .wd-input__value {
        @apply bg-gray-50;

        input {
          @apply text-gray-500;
        }
      }
    }

    .wd-input__suffix {
      @apply flex row items-center;
    }

    .wd-input__value {
      border: 1px solid #d1d5db;
      padding: 0 12px;
      @apply rounded-lg;
      @apply overflow-hidden;
    }
  }

  :deep(.wd-textarea) {
    padding: 0 !important;

    .wd-textarea__inner {
      border: 1px solid #d1d5db;
      padding: 12rpx 24rpx;
      @apply rounded-lg;
      @apply overflow-hidden;
    }
  }

  :deep(.wd-picker) {
    .wd-cell {
      border: 1px solid #d1d5db;
      @apply rounded-lg;
      @apply overflow-hidden;

      &.is-disabled {
        @apply bg-gray-50;
      }

      .wd-cell__wrapper {
        padding-top: 12rpx;
        padding-bottom: 12rpx;
      }
    }
  }

  :deep(.wd-input-number) {
    .wd-input-number__action {
      @apply hidden;
    }

    .wd-input-number__inner {
      @apply rounded-lg overflow-hidden w-full box-border;
      border: 1px solid #d1d5db;
      padding: 0 24rpx;
    }

    .wd-input-number__input {
      @apply h-full w-full p-0;
      height: 72rpx !important;
      line-height: 72rpx !important;
      text-align: left !important;
      @apply text-sm!;
    }

    .wd-input-number__input-border {
      @apply hidden;
    }
  }
}

// 错误信息样式
.cell-error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
}
</style>
