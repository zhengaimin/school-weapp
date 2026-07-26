<script lang="ts" setup>
import type { Devices } from '@/api/interface/modules/devices'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'

const props = defineProps<{
  device: Devices.IDeviceGroupVo
  loading: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  'toggle-subscription': [device: Devices.IDeviceGroupVo]
}>()

/** 切换订阅状态 */
function handleToggleSubscription() {
  emit('toggle-subscription', props.device)
}
</script>

<template>
  <WhiteCard>
    <view flex="~ items-center justify-between" gap="3">
      <view flex="1" min-w="0">
        <view text="sm gray-900" font="medium">
          {{ device.name }}
        </view>
        <view v-if="device.description" text="xs gray-500" m="t-1">
          {{ device.description }}
        </view>
      </view>

      <TButton
        :type="device.isSubscribed ? 'danger' : 'primary'"
        size="small"
        plain
        :loading="loading"
        :disabled="disabled"
        custom-style="min-width: 144rpx"
        @click="handleToggleSubscription"
      >
        {{ device.isSubscribed ? '取消订阅' : '订阅' }}
      </TButton>
    </view>
  </WhiteCard>
</template>
