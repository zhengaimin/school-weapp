<script lang="ts" setup>
import type { ConsumptionRecordItemProps } from '../types'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE, DEVICE_TYPE_I18N } from '@/constant/modules'
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

const recordIconName = computed(() => {
  if (props.record.deviceType === DEVICE_TYPE.DRYER) {
    return 'windy-line'
  }

  if (props.record.deviceType === DEVICE_TYPE.VIDEO) {
    return 'customer-service-line'
  }

  return 'shopping-cart-line'
})
</script>

<template>
  <view relative overflow="hidden" @click.stop="e => emit('click', e)">
    <WhiteCard custom-class="pt-3 relative">
      <view absolute left--68rpx top-68rpx style="transform: translateY(-50%)">
        <Icon
          :name="recordIconName"
          icon-color="#ef4444"
          icon-size="256rpx"
          custom-class="opacity-10"
        />
      </view>

      <view relative z="10">
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ displayInfo.title }}
          </view>
          <view text="lg" font="bold" class="text-red-600" shrink-0 whitespace-nowrap>
            {{ formatAmount(record.amount) }}
          </view>
        </view>

        <view flex="~ justify-between items-start" gap="4">
          <view text="xs gray-600">
            <text v-if="props.showDeviceType && record.deviceType">
              {{ DEVICE_TYPE_I18N[record.deviceType] }} ·
            </text>
            {{ displayInfo.subtitle }}
          </view>
          <view text="xs gray-600" whitespace-nowrap>
            {{ formatTime(record.consumeTime) }}
          </view>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
