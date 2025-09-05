<script lang="ts" setup>
// #region 导入
import type { User } from '@/api/interface/modules/user'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { SERVICE_TYPE, SERVICE_TYPE_I18N } from '@/constant/modules/device'
import { CONSUMPTION_SOURCE_I18N } from '@/constant/modules/user'
import { formatTime } from '@/utils/time'
// #endregion

// #region 属性定义
const props = defineProps<{
  record: User.Consumption.ConsumptionRecord
}>()
// #endregion

// #region 计算属性
const displayInfo = computed(() => {
  const serviceType = props.record.serviceType as keyof typeof SERVICE_TYPE_I18N
  const title = SERVICE_TYPE_I18N[serviceType] || '未知消费'

  const consumptionSource = props.record.consumptionSource as keyof typeof CONSUMPTION_SOURCE_I18N
  const sourceText = CONSUMPTION_SOURCE_I18N[consumptionSource]

  let detailsText = ''
  if (serviceType === SERVICE_TYPE.CALL && props.record.usageDuration) {
    const minutes = Math.ceil(props.record.usageDuration / 60)
    detailsText = `通话时长: ${minutes}分钟`
  }
  else if (serviceType === SERVICE_TYPE.MESSAGE) {
    detailsText = props.record.remark
  }

  const parts = []
  if (sourceText) {
    parts.push(sourceText)
  }
  if (detailsText) {
    parts.push(detailsText)
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
// #endregion

// #region 方法
// 格式化金额显示
function formatAmount(amount: string): string {
  return `-¥${amount}`
}
// #endregion
</script>

<template>
  <WhiteCard>
    <view flex="~ items-center justify-between">
      <view>
        <view text="sm text-primary" font="medium">
          {{ displayInfo.title }}
        </view>
        <view text="xs text-secondary" m="t-1">
          {{ displayInfo.subtitle }}
        </view>
      </view>
      <view text="right">
        <view
          text="sm"
          font="medium"
          class="text-red-600"
        >
          {{ formatAmount(record.amount) }}
        </view>
        <view text="xs text-muted" m="t-1">
          {{ formatTime(record.consumeTime) }}
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
