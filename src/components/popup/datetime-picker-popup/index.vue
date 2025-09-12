<script lang="ts" setup>
import type { Emits, Props } from './types'
import dayjs from 'dayjs'

import { computed, ref, watch } from 'vue'
import TButton from '@/components/common/button/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '选择时间',
  defaultValue: () => new Date().getTime(),
  type: 'datetime',
})

const emits = defineEmits<Emits>()

const innerValue = ref<number>()
const dateRange = ref<[number, number]>([new Date().getTime(), new Date().getTime()])
const activeTab = ref(0)
const currentPickerValue = ref<number>(new Date().getTime())

// 动态设置最小和最大可选日期
const minDate = computed(() => {
  // 如果当前正在选择结束时间，则最小日期为已选定的开始时间
  return activeTab.value === 1 ? dateRange.value[0] : undefined
})

const maxDate = computed(() => {
  // 如果当前正在选择开始时间，则最大日期为已选定的结束时间
  return activeTab.value === 0 ? dateRange.value[1] : undefined
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.type === 'datetimerange' || props.type === 'daterange') {
        if (Array.isArray(props.defaultValue)) {
          dateRange.value = props.defaultValue
          currentPickerValue.value = props.defaultValue[activeTab.value]
        }
      }
      else {
        innerValue.value = props.defaultValue as number
        currentPickerValue.value = props.defaultValue as number
      }
    }
  },
  { immediate: true },
)

function handleReset() {
  const now = new Date().getTime()
  if (props.type === 'datetimerange' || props.type === 'daterange') {
    dateRange.value = [now, now]
    currentPickerValue.value = now
  }
  else {
    innerValue.value = now
    currentPickerValue.value = now
  }
}

function handleConfirm() {
  if (props.type === 'datetimerange' || props.type === 'daterange') {
    // 验证开始时间不能大于结束时间（允许等于）
    if (dateRange.value[0] > dateRange.value[1]) {
      uni.showToast({
        title: '开始时间不能大于结束时间',
        icon: 'none',
      })
      return
    }
    emits('confirm', dateRange.value)
  }
  else {
    emits('confirm', innerValue.value!)
  }
  emits('update:modelValue', false)
}

// 计算 picker 类型
const pickerType = computed(() => {
  return props.type === 'date' || props.type === 'daterange' ? 'date' : 'datetime'
})

// 计算日期格式
const format = computed(() => {
  return props.type.includes('date') && !props.type.includes('datetime')
    ? 'YYYY-MM-DD'
    : 'YYYY-MM-DD HH:mm'
})

const pickerValue = computed({
  get: () => currentPickerValue.value,
  set: (val) => {
    currentPickerValue.value = val!
    if (props.type === 'datetimerange' || props.type === 'daterange') {
      dateRange.value[activeTab.value] = val!
    }
    else {
      innerValue.value = val
    }
  },
})

// 监听标签页切换，更新当前选择器的值
watch(activeTab, (newTab) => {
  if (props.type === 'datetimerange' || props.type === 'daterange') {
    currentPickerValue.value = dateRange.value[newTab]
  }
})
</script>

<template>
  <BottomPopup
    :model-value="modelValue"
    :title="title"
    height="auto"
    @update:model-value="val => emits('update:modelValue', val)"
  >
    <view v-if="type === 'datetimerange' || type === 'daterange'" flex="~" p="x-4 t-4" gap="3">
      <view
        flex="~ 1 col items-center"
        p="y-2"
        rounded-md
        :class="[activeTab === 0 ? 'text-primary bg-primary/10' : 'bg-[#f7fafc]']"
        @click="activeTab = 0"
      >
        <view>开始时间</view>
        <view text="xs">
          {{ dayjs(dateRange[0]).format(format) }}
        </view>
      </view>
      <view
        flex="~ 1 col items-center"
        p="y-2"
        rounded-md
        :class="[activeTab === 1 ? 'text-primary bg-primary/10' : 'bg-[#f7fafc]']"
        @click="activeTab = 1"
      >
        <view>结束时间</view>
        <view text="xs">
          {{ dayjs(dateRange[1]).format(format) }}
        </view>
      </view>
    </view>
    <view p="t-4 x-0">
      <wd-datetime-picker-view
        v-model="pickerValue"
        :type="pickerType"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </view>
    <template #footer>
      <view flex="~" gap="4" p="4">
        <TButton type="default" full flex="1" size="large" @click="handleReset">
          重置
        </TButton>
        <TButton type="primary" full flex="1" size="large" @click="handleConfirm">
          确定
        </TButton>
      </view>
    </template>
  </BottomPopup>
</template>
