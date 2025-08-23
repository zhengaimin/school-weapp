<script setup lang="ts">
import { string } from 'vue-types'

defineProps({
  loadingSize: string().def('48rpx'),
  loadingColor: string().def('#3269dd'),
})
</script>

<template>
  <view
    class="loading-spinner"
    :style="{ width: loadingSize, height: loadingSize, borderColor: loadingColor }"
  />
</template>

<style scoped lang="scss">
.loading-spinner {
  border-style: solid;
  border-width: 4rpx;
  border-top-color: transparent !important;
  border-radius: 50%;
  animation: spinner-rotation 0.8s linear infinite;
}

@keyframes spinner-rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
