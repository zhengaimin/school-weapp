<script lang="ts" setup>
import type { Devices } from '@/api/interface/modules/devices'
import WhiteCard from '@/components/common/white-card/index.vue'

defineProps<{
  device: Devices.Subscription.MySubscription
  subscribing: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-subscription', device: Devices.Group.IDeviceGroup): void
}>()
</script>

<template>
  <WhiteCard>
    <view flex="~ items-center justify-between">
      <view flex="1" min-w="0" m="r-3">
        <view text="sm gray-900" font="medium">
          {{ device.name }}
        </view>
        <view v-if="device.description" text="xs gray-500" m="t-1">
          {{ device.description }}
        </view>
      </view>
      <view flex="shrink-0">
        <!-- 只展示已订阅状态 -->
        <view text="xs primary" font="medium">
          已订阅
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
