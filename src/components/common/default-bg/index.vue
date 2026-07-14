<script lang="ts" setup>
import { computed } from 'vue'
import { array } from 'vue-types'

const props = defineProps({
  /**
   * 气泡颜色
   */
  colors: array<string>().def(['bg-green-200', 'bg-blue-200', 'bg-cyan-100']),
})

const bubbleClass = computed(() => {
  const bubbles = [
    'absolute right--10 top-10 h-32 w-32 rounded-full opacity-20 blur-30px',
    'absolute top-[50%] transform-translate-y-[-50%] left--12 h-40 w-40 rounded-full opacity-15 blur-40px',
    'absolute top-[75%] transform-translate-y-[-50%] right--20 h-28 w-28 rounded-full opacity-25 blur-25px',
  ]

  return bubbles.map((bubble, index) => {
    return `${bubble} ${props.colors[index] || ''}`
  })
})
</script>

<template>
  <!-- 模糊气泡背景 -->
  <view v-for="(bubble, index) in bubbleClass" :key="index" :class="bubble" />
</template>

<style lang="scss" scoped></style>
