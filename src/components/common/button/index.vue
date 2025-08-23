<script setup lang="ts">
import { computed } from 'vue'
import { bool, oneOf, string } from 'vue-types'

import Loading from '@/components/common/loading/index.vue'

// 定义组件选项
defineOptions({
  name: 'CommonButton',
  options: {
    styleIsolation: 'shared',
  },
})

// 定义 props
const props = defineProps({
  // 按钮类型
  type: oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'default']).def(
    'default',
  ),
  // 按钮尺寸
  size: oneOf(['small', 'medium', 'large']).def('medium'),
  // 是否为块级按钮
  block: bool().def(false),
  // 是否为朴素按钮
  plain: bool().def(false),
  // 是否禁用
  disabled: bool().def(false),
  // 是否加载中
  loading: bool().def(false),
  // 加载文本
  loadingText: string().def(''),
  // 自定义类名
  customClass: string().def(''),
  // 自定义样式
  customStyle: string().def(''),
  openType: string().def(''),
})

// 定义事件
const emit = defineEmits<{
  click: [event: Event]
  getphonenumber: [event: Event]
}>()

// 计算按钮类名
const buttonClass = computed(() => {
  const classes = ['button']

  // 按钮类型
  classes.push(`button--${props.type}`)

  // 按钮尺寸
  classes.push(`button--${props.size}`)

  // 按钮状态
  if (props.block)
    classes.push('button--block')
  if (props.plain)
    classes.push('button--plain')
  if (props.disabled)
    classes.push('button--disabled')
  if (props.loading)
    classes.push('button--loading')

  // 自定义类名
  if (props.customClass)
    classes.push(props.customClass)

  return classes.join(' ')
})

// 处理点击事件
function handleClick(event: Event) {
  if (props.disabled || props.loading) {
    return
  }
  emit('click', event)
}

// 计算按钮文本
const buttonText = computed(() => {
  if (props.loading && props.loadingText) {
    return props.loadingText
  }
  return ''
})

// 计算 loading 颜色（与文本颜色一致）
const loadingColor = computed(() => {
  if (props.plain) {
    // 朴素按钮使用对应的主题色
    switch (props.type) {
      case 'primary':
        return '#3b82f6'
      case 'success':
        return '#10b981'
      case 'warning':
        return '#f59e0b'
      case 'danger':
        return '#ef4444'
      case 'info':
        return '#60a5fa'
      default:
        return '#6b7280'
    }
  }
  else {
    // 实心按钮使用白色（除了 default 类型）
    return props.type === 'default' ? '#6b7280' : '#ffffff'
  }
})

// 计算 loading 尺寸
const loadingSize = computed(() => {
  switch (props.size) {
    case 'small':
      return '28rpx'
    case 'large':
      return '40rpx'
    case 'medium':
    default:
      return '32rpx'
  }
})
</script>

<template>
  <button
    :class="buttonClass"
    :style="customStyle"
    :disabled="disabled"
    :open-type="openType"
    @getphonenumber="e => emit('getphonenumber', e)"
    @click="handleClick"
  >
    <view v-if="loading" class="button__loading-indicator">
      <Loading :loading-color="loadingColor" :loading-size="loadingSize" />
    </view>
    <view class="button__content" :style="{ visibility: loading ? 'hidden' : 'visible' }">
      <slot>{{ buttonText }}</slot>
    </view>
  </button>
</template>

<style lang="scss" scoped>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid transparent;
  outline: none;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  @apply rounded-xl;

  // 按钮尺寸
  &--small {
    @apply px-3 py-1.5 text-xs;
    min-height: 28px;
  }

  &--medium {
    @apply px-4 py-2 text-sm;
    min-height: 36px;
  }

  &--large {
    @apply px-6 py-3 text-base;
    min-height: 44px;
  }

  // 按钮类型
  &--default {
    @apply bg-transparent text-gray-700 border-gray-300;
  }

  &--primary {
    @apply bg-blue-500 text-white border-blue-500;
  }

  &--secondary {
    @apply bg-gray-500 text-white border-gray-500;
  }

  &--success {
    @apply bg-green-500 text-white border-green-500;
  }

  &--warning {
    @apply bg-yellow-500 text-white border-yellow-500;
  }

  &--danger {
    @apply bg-red-500 text-white border-red-500;
  }

  &--info {
    @apply bg-blue-400 text-white border-blue-400;
  }

  // 按钮状态
  &--block {
    @apply w-full;
  }

  &--plain {
    @apply bg-transparent;

    &.button--primary {
      @apply text-blue-500 border-blue-500;
    }

    &.button--success {
      @apply text-green-500 border-green-500;
    }

    &.button--warning {
      @apply text-yellow-500 border-yellow-500;
    }

    &.button--danger {
      @apply text-red-500 border-red-500;
    }
  }

  &--disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  &--loading {
    @apply cursor-not-allowed;
  }
}

.button__loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
}

.button__content {
  @apply flex items-center justify-center;
}

// 移除默认按钮样式
button {
  &::after {
    content: initial !important;
  }
}
</style>
