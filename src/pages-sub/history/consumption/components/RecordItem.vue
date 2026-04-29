<script lang="ts" setup>
import type { ConsumptionRecordItemProps } from '../types'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE_I18N } from '@/constant/modules'
import { formatTime } from '@/utils/format'
import { buildRecordDisplayInfo, formatAmount } from '../utils/record'

const props = defineProps<ConsumptionRecordItemProps>()

const emit = defineEmits<{
  click: [event: Event]
}>()

/** 显示信息 */
const displayInfo = computed(() => {
  return buildRecordDisplayInfo(props.record)
})
</script>

<template>
  <WhiteCard @click.stop="e => emit('click', e)">
    <view flex="~ items-center justify-between gap-3">
      <view>
        <view text="sm text-primary" font="medium">
          {{ displayInfo.title }}
        </view>
        <view text="xs text-secondary" m="t-1">
          <text v-if="props.showDeviceType && record.deviceType">
            {{ DEVICE_TYPE_I18N[record.deviceType] }} ·
          </text>
          {{ displayInfo.subtitle }}
        </view>
      </view>
      <view text="right" shrink-0 whitespace-nowrap>
        <view text="sm" font="medium" class="text-red-600">
          {{ formatAmount(record.amount) }}
        </view>
        <view text="xs text-muted" m="t-1">
          {{ formatTime(record.consumeTime) }}
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
