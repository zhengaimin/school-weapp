<script lang="ts" setup>
interface Props {
  // 是否显示边框
  showBorder?: boolean
  // 自定义类名
  customClass?: string
  // 自定义样式
  customStyle?: string
}

withDefaults(defineProps<Props>(), {
  showBorder: true,
  customClass: '',
  customStyle: '',
})
</script>

<template>
  <view
    bg="white"
    border="rounded-xl"
    p="4"
    overflow-hidden
    :class="[showBorder ? 'border border-bg-muted border-solid' : '', customClass]"
    :style="customStyle"
  >
    <slot />
  </view>
</template>

<style lang="scss" scoped>
// 卡片基础样式
</style>
