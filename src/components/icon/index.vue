<script setup>
import { computed } from 'vue'
import { string } from 'vue-types'
import { loadSvg } from './index'

const props = defineProps({
  name: string().isRequired,
  iconColor: string().def('#3269dd'),
  iconSize: string().def('24rpx'),
  customClass: string().def(''),
})

const emit = defineEmits(['click'])

const data = computed(() => {
  return loadSvg(props.name, props.iconColor)
})

const style = computed(() => {
  return {
    width: props.iconSize,
    height: props.iconSize,
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: '0',
  }
})

// 处理点击事件
function handleClick(event) {
  emit('click', event)
}
</script>

<template>
  <image :src="data" :style="style" :class="customClass" mode="aspectFit" @click="handleClick" />
</template>
