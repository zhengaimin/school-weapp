<script setup lang="ts">
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

defineProps<{
  icon: string
  iconBgClass: string
  iconColor: string
  title: string
  colSpan2?: boolean
}>()
</script>

<template>
  <view
    bg="gray-50"
    rounded-xl
    p-3
    border="~ gray-100"
    :class="colSpan2 ? 'col-span-2' : ''"
  >
    <view flex="~ items-center justify-between">
      <view flex="~ items-center" gap-2 pb-2>
        <view
          h-6
          w-6
          rounded-lg
          :class="iconBgClass"
          flex="~ items-center justify-center"
        >
          <Icon :name="icon" :icon-color="iconColor" icon-size="28rpx" />
        </view>
        <text text="xs gray-700" font-bold>
          {{ title }}
        </text>
      </view>
      <slot name="header-right" />
    </view>
    <view flex="~ items-center justify-center">
      <slot />
    </view>
  </view>
</template>
