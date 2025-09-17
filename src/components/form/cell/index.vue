<script setup lang="ts">
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
  /** 是否显示错误 */
  error?: boolean
  /** 错误信息 */
  errorMessage?: string
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
  error: false,
  errorMessage: '',
})

// 计算标签宽度样式
const labelWidthStyle = computed(() => {
  if (props.labelWidth === 'auto')
    return {}

  const width = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth

  return { width }
})

// 计算容器类名
const containerClass = computed(() => {
  return [`cell-container--${props.labelPosition}`, { 'is-error': props.error }]
})
</script>

<template>
  <wd-form-item :prop="prop">
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
        <view v-if="error && errorMessage" class="error-message">
          {{ errorMessage }}
        </view>
      </view>
    </view>
  </wd-form-item>
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

.error-message {
  color: #dd524d;
  font-size: 12px;
  margin-top: 4px;
}

.is-error {
  :deep(.wd-input__value),
  :deep(.wd-textarea__inner),
  :deep(.wd-cell) {
    border-color: #dd524d !important;
  }
}
</style>
