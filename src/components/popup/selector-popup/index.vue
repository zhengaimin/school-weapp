<script setup lang="ts">
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'

// 选项接口
export interface SelectorOption {
  value: string | number
  label: string
  [key: string]: any // 允许额外的属性
}

// 组件属性
interface Props {
  /** 弹框标题 */
  title?: string
  /** 选项列表 */
  options: SelectorOption[]
  /** 占位符文本 */
  placeholder?: string
  /** 是否显示弹框 */
  modelValue?: boolean
  /** 选中的值 */
  value?: string | number
  /** 是否显示确认按钮 */
  showConfirmButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '请选择',
  placeholder: '请选择',
  modelValue: false,
  value: '',
  showConfirmButton: false,
})

// 事件定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:value': [value: string | number]
  'change': [value: string | number, option: SelectorOption]
  'confirm': [value: string | number, option: SelectorOption]
  'cancel': []
}>()

// 使用 defineModel 定义双向绑定
const show = defineModel('modelValue', { default: false })
const selectedValue = defineModel<string | number>('value', { default: '' })

// 当前选中的选项
const selectedOption = computed(() => {
  return props.options.find(item => item.value === selectedValue.value)
})

// 选择选项
function selectOption(option: SelectorOption) {
  selectedValue.value = option.value
  emit('change', option.value, option)

  if (!props.showConfirmButton) {
    handleConfirm()
  }
}

// 确认选择
function handleConfirm() {
  if (selectedOption.value) {
    emit('confirm', selectedValue.value, selectedOption.value)
  }
  show.value = false
}

// 取消选择
function handleCancel() {
  emit('cancel')
  show.value = false
}
</script>

<template>
  <BottomPopup v-model="show" :title="title" height="auto" max-height="80vh" @close="handleCancel">
    <view flex="~ col" h-full>
      <!-- 选项列表 -->
      <scroll-view :scroll-y="true" min-h-0 flex-1 p="y-2">
        <template v-if="options.length > 0">
          <view
            v-for="option in options"
            :key="option.value"
            flex="~ items-center justify-between"
            p="y-3 x-4"
            @click="selectOption(option)"
          >
            <text
              text="sm"
              :class="[selectedValue === option.value ? 'text-primary font-medium' : 'text-gray-700']"
            >
              {{ option.label }}
            </text>
            <Icon
              v-if="selectedValue === option.value"
              name="check-line"
              icon-color="#3269dd"
              icon-size="36rpx"
            />
          </view>
        </template>
        <wd-status-tip v-else image="content" tip="暂无内容" />
      </scroll-view>

      <!-- 操作按钮 -->
      <view v-if="showConfirmButton" p="4" pt-0>
        <view flex="~ gap-3">
          <TButton flex-1 bg-gray-100 p-3 text="gray-700 sm" border="rounded-lg" @click="handleCancel">
            取消
          </TButton>
          <TButton
            flex-1
            p-3
            text="white sm"
            border="rounded-lg"
            :class="[selectedOption ? 'bg-primary' : 'bg-gray-300']"
            :disabled="!selectedOption"
            @click="handleConfirm"
          >
            确定
          </TButton>
        </view>
      </view>
    </view>
  </BottomPopup>
</template>
