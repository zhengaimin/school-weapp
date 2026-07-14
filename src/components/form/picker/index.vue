<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, inject, ref } from 'vue'
import Icon from '@/components/icon/index.vue'
import SelectorPopup from '@/components/popup/selector-popup/index.vue'

interface Option {
  label: string
  value: string | number
  [property: string]: any
}

const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择',
  },
  title: {
    type: String,
    default: '请选择',
  },
  options: {
    type: Array as PropType<Option[]>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  prop: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change'])

const modelValue = defineModel<string | number>({
  default: '',
})

const showSelector = ref(false)

const form = inject<any>('form')

const displayLabel = computed(() => {
  const selectedOption = props.options.find(option => option.value === modelValue.value)
  return selectedOption ? selectedOption.label : ''
})

function handleConfirm(value: string | number) {
  modelValue.value = value
  emit('change', value)
  showSelector.value = false
  if (form && props.prop) {
    form.value.validateField(props.prop)
  }
}

function handleCancel() {
  showSelector.value = false
}

function handleClick() {
  if (props.disabled) return
  showSelector.value = true
}
</script>

<template>
  <view
    p="x-3"
    border="1 rounded-lg solid [#d1d5db]"
    flex="~ items-center justify-between"
    :class="{ 'bg-gray-100 opacity-70': disabled }"
    @click="handleClick"
  >
    <text
      text="sm"
      leading-9
      :class="[modelValue ? 'text-gray-900' : 'text-gray-400', { 'text-gray-500': disabled }]"
    >
      {{ displayLabel || placeholder }}
    </text>
    <Icon name="arrow-down-s-line" icon-color="#9ca3af" icon-size="32rpx" />
  </view>

  <SelectorPopup
    v-model="showSelector"
    :title="title"
    :options="options"
    :value="modelValue"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
