<script setup lang="ts">
// 选项数据类型
export interface RadioOption {
  value: string | number
  label: string
  suffix?: string
  disabled?: boolean
  [key: string]: any // 允许额外的属性
}

// 组件属性
interface Props {
  /** 选项列表 */
  options: RadioOption[]
  /** 每行显示的选项数量，0表示单行显示 */
  columns?: number
  /** 是否禁用 */
  disabled?: boolean
}

// 事件定义
interface Emits {
  (e: 'change', value: string | number, option: RadioOption): void
}

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<Props>(), {
  columns: 0,
  disabled: false,
})

const emit = defineEmits<Emits>()

// 使用 defineModel 定义双向绑定
const modelValue = defineModel<string | number>({
  default: '',
})

// 选择选项
function selectOption(option: RadioOption) {
  if (props.disabled || option.disabled) {
    return
  }

  modelValue.value = option.value
  emit('change', option.value, option)
}

// 判断选项是否被选中
function isSelected(option: RadioOption): boolean {
  return modelValue.value === option.value
}

// 计算选项的样式
const optionFlexBasis = computed(() => {
  if (props.columns > 0) {
    return `calc(${(1 / props.columns) * 100}% - ${((props.columns - 1) / props.columns) * 0.75}rem)`
  }
  return '100%'
})
</script>

<template>
  <view
    class="t-radio"
    flex="~ wrap"
    :class="[props.columns > 0 ? 'gap-3' : 'flex-col gap-y-3']"
  >
    <view
      v-for="option in options"
      :key="option.value"
      flex="~ items-center justify-between"
      p="3"
      border="~ gray-200 solid rounded-md"
      transition="colors"
      :style="{ flexBasis: optionFlexBasis }"
      :class="{
        '!border-primary !bg-primary !bg-opacity-5': isSelected(option),
        'opacity-50 cursor-not-allowed': props.disabled || option.disabled,
      }"
      @click="selectOption(option)"
    >
      <!-- 左侧内容区域 -->
      <view flex="~ items-center">
        <!-- 单选圆圈 -->
        <view
          w="4"
          h="4"
          border="~ solid rounded-full"
          m="r-3"
          flex="~ items-center justify-center"
          :class="isSelected(option) ? 'border-primary bg-primary' : 'border-gray-300'"
        >
          <view v-if="isSelected(option)" w="2" h="2" bg="white" rounded="full" />
        </view>

        <!-- 选项内容 -->
        <slot
          name="option"
          :option="option"
          :selected="isSelected(option)"
          :disabled="disabled || option.disabled"
        >
          <!-- 默认选项内容 -->
          <text text="sm gray-900">
            {{ option.label }}
          </text>
        </slot>
      </view>

      <!-- 右侧后缀内容 -->
      <view v-if="option.suffix || $slots.suffix">
        <slot
          name="suffix"
          :option="option"
          :selected="isSelected(option)"
          :disabled="disabled || option.disabled"
        >
          <!-- 默认后缀内容 -->
          <view v-if="option.suffix" text="xs primary" font="medium">
            {{ option.suffix }}
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>
