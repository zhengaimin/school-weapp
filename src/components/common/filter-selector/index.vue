<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/icon/index.vue'
import SelectorPopup from '@/components/popup/selector-popup/index.vue'

// 筛选选项接口
export interface FilterOption {
  value: string | number
  label: string
  [key: string]: any // 允许额外的属性
}

// 组件属性
interface Props {
  /** 筛选器图标 */
  icon?: string
  /** 筛选选项列表 */
  options: FilterOption[]
  /** 弹框标题 */
  popupTitle?: string
  /** 自定义样式类 */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  popupTitle: '',
  customClass: '',
})

// 事件定义
const emit = defineEmits<{
  change: [value: string | number, option: FilterOption]
}>()

// 使用 defineModel 定义双向绑定
const modelValue = defineModel<string | number>({
  default: '',
})

// 弹框显示状态
const showPopup = ref(false)

// 当前选中的选项文本
const selectedText = computed(() => {
  const option = props.options.find(item => item.value === modelValue.value)
  return option?.label || '请选择'
})

// 打开筛选弹框
function openFilter() {
  showPopup.value = true
}

// 确认选择
function handleConfirm(value: string | number, option: FilterOption) {
  modelValue.value = value
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
    w-full
    p="y-3 x-4"
    :class="customClass"
    @click="openFilter"
  >
    <view flex="~ items-center">
      <Icon v-if="icon" :name="icon" icon-color="#6b7280" icon-size="32rpx" />
    </view>
    <view flex="~ items-center">
      <text text="sm gray-600">
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

  <!-- 筛选弹框 -->
  <SelectorPopup
    v-model="showPopup"
    v-model:value="modelValue"
    :title="popupTitle"
    :options="options"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<style scoped lang="scss">
// 组件样式
</style>
