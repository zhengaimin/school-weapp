<script lang="ts" setup>
import type { User } from '@/api/interface/modules/user'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { CONSUMPTION_SOURCE_I18N, SERVICE_TYPE_I18N } from '@/constant/modules'
import { formatTime } from '@/utils/format'

const props = defineProps<{
  record: User.Consumption.IConsumptionRecordVo
}>()

const emit = defineEmits<{
  click: [event: Event]
}>()

/** 显示信息 */
const displayInfo = computed(() => {
  const serviceType = props.record.serviceType as keyof typeof SERVICE_TYPE_I18N
  const title = SERVICE_TYPE_I18N[serviceType] || '未知消费'

  const consumptionSource = props.record.consumptionSource as keyof typeof CONSUMPTION_SOURCE_I18N
  const sourceText = CONSUMPTION_SOURCE_I18N[consumptionSource]

  const parts = []
  if (sourceText) {
    parts.push(sourceText)
  }
  if (props.record.remark) {
    parts.push(props.record.remark)
  }

  let subtitle = parts.join('·')

  if (!subtitle) {
    subtitle = props.record.remark || '未知来源'
  }

  return {
    title,
    subtitle,
  }
})

/** 格式化金额显示 */
function formatAmount(amount: string): string {
  return `-¥${amount}`
}
</script>

<template>
  <WhiteCard @click.stop="e => emit('click', e)">
    <view flex="~ items-center justify-between gap-3">
      <view>
        <view text="sm text-primary" font="medium">
          {{ displayInfo.title }}
        </view>
        <view text="xs text-secondary" m="t-1">
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
