<script lang="ts" setup>
interface Props {
  // 是否显示边框
  showBorder?: boolean
  // 自定义类名
  customClass?: string
  // 自定义样式
  customStyle?: string | Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  showBorder: true,
  customClass: '',
  customStyle: '',
})
const emit = defineEmits(['click'])
</script>

<template>
  <view
    bg="white"
    p="4"
    overflow-hidden
    rounded-xl
    :class="[props.showBorder ? 'border border-bg-muted border-solid' : '', props.customClass]"
    :style="props.customStyle"
    @click="e => emit('click', e)"
  >
    <slot />
  </view>
</template>

<style lang="scss" scoped>
// 卡片基础样式
</style>
