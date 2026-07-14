<script setup lang="ts">
import type { DatetimePickerValue } from '@/components/popup/datetime-picker-popup/types'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import Icon from '@/components/icon/index.vue'
import DatetimePickerPopup from '@/components/popup/datetime-picker-popup/index.vue'
import SelectorPopup from '@/components/popup/selector-popup/index.vue'

// 筛选选项接口
export interface FilterOption {
  value: string | number
  label: string
  [key: string]: any // 允许额外的属性
}

export type FilterValue = string | number | number[] | [number, number]

// 组件属性
interface Props {
  // 解决警告问题
  style?: object
  /** 筛选器图标 */
  icon?: string
  /** 筛选选项列表 */
  options: FilterOption[]
  /** 弹框标题 */
  popupTitle?: string
  /** 自定义样式类 */
  customClass?: string
  /** 筛选器类型 */
  type?: 'select' | 'date' | 'daterange' | 'datetime' | 'datetimerange'
  /** 是否精简显示文字，对于 daterange 类型，默认显示月+日，设置为 false 时显示完整年月日 */
  concise?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  popupTitle: '',
  customClass: '',
  type: 'select',
  concise: true,
})

// 事件定义
const emit = defineEmits<{
  change: [value: FilterValue, option?: FilterOption]
}>()

// 使用 defineModel 定义双向绑定
const modelValue = defineModel<DatetimePickerValue | [number, number]>({
  default: undefined,
})

// 弹框显示状态
const showPopup = ref(false)

// 创建 defaultValue 计算属性，处理类型断言
const defaultValue = computed((): number | [number, number] => {
  return modelValue.value as number | [number, number]
})

// 当前选中的选项文本
const selectedText = computed(() => {
  if (modelValue.value === undefined || modelValue.value === null) return '请选择'

  // 处理选择器类型
  if (props.type === 'select') {
    const option = props.options.find(item => item.value === modelValue.value)
    return option?.label || '请选择'
  }

  // 处理日期/时间类型
  if (props.type === 'date') {
    return dayjs(modelValue.value as number).format('YYYY-MM-DD')
  }

  if (props.type === 'datetime') {
    return dayjs(modelValue.value as number).format('YYYY-MM-DD HH:mm')
  }

  if (props.type === 'daterange') {
    if (Array.isArray(modelValue.value) && modelValue.value.length === 2) {
      if (props.concise) {
        const startDate = dayjs(modelValue.value[0]).format('MM-DD')
        const endDate = dayjs(modelValue.value[1]).format('MM-DD')
        return `${startDate} 至 ${endDate}`
      } else {
        const startDate = dayjs(modelValue.value[0]).format('YYYY-MM-DD')
        const endDate = dayjs(modelValue.value[1]).format('YYYY-MM-DD')
        return `${startDate} 至 ${endDate}`
      }
    }
  }

  if (props.type === 'datetimerange') {
    if (Array.isArray(modelValue.value) && modelValue.value.length === 2) {
      const startDateTime = dayjs(modelValue.value[0]).format('YYYY-MM-DD HH:mm')
      const endDateTime = dayjs(modelValue.value[1]).format('YYYY-MM-DD HH:mm')
      return `${startDateTime} 至 ${endDateTime}`
    }
  }

  return '请选择'
})

// 打开筛选弹框
function openFilter() {
  showPopup.value = true
}

// 确认选择
function handleConfirm(value: FilterValue, option?: FilterOption) {
  modelValue.value = value
  console.log('value', value)
  emit('change', value, option)
}

// 取消选择
function handleCancel() {
  showPopup.value = false
}
</script>

<template>
  <!-- 筛选按钮 -->
  <view
    flex="~ items-center justify-center 1"
    p="y-3 x-4"
    box-border
    :class="customClass"
    @click="openFilter"
  >
    <view flex="~ items-center">
      <Icon v-if="icon" :name="icon" icon-color="#6b7280" icon-size="32rpx" />
    </view>
    <view flex="~ items-center justify-center 1" min-w-0>
      <text text="sm gray-600" truncate>
        {{ selectedText }}
      </text>
      <Icon
        :name="showPopup ? 'arrow-up-s-line' : 'arrow-down-s-line'"
        icon-color="#9ca3af"
        icon-size="32rpx"
        m="l-1"
      />
    </view>
  </view>

  <!-- 选择器筛选弹框 -->
  <SelectorPopup
    v-if="props.type === 'select'"
    v-model="showPopup"
    v-model:value="modelValue as string | number"
    :title="popupTitle"
    :options="options"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <!-- 日期时间筛选弹框 -->
  <DatetimePickerPopup
    v-else
    v-model="showPopup"
    :default-value="defaultValue"
    :type="props.type"
    :title="popupTitle || '选择时间'"
    @confirm="handleConfirm"
  />
</template>

<style scoped lang="scss">
// 组件样式
.test {
  box-sizing: border-box;
}
</style>
