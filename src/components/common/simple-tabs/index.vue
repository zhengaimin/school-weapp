<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  tabs: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
}>()

const activeIndex = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<template>
  <view h-11 w-full flex items-center justify-around>
    <view
      v-for="(item, index) in tabs"
      :key="index"
      relative
      h-full
      flex
      flex-1
      items-center
      justify-center
      text-sm
      transition-all
      :class="[activeIndex === index ? 'font-medium text-primary' : 'text-gray-500']"
      @click="activeIndex = index"
    >
      <text>{{ item }}</text>
      <view v-if="activeIndex === index" absolute bottom-0 h-0.5 w-6 rounded-full bg-primary />
    </view>
  </view>
</template>
