<script setup lang="ts">
import { computed } from 'vue'
import { rpxToPx } from '@/utils/app'

interface ChartDataItem {
  name: string
  value: number
  color: string
}

const props = withDefaults(
  defineProps<{
    data: ChartDataItem[]
    centerText?: string
    centerLabel?: string
    width?: number
    height?: number
    ringWidth?: number
  }>(),
  {
    centerText: '',
    centerLabel: '',
    width: 248,
    height: 248,
    ringWidth: 28,
  },
)

const GAP_ANGLE = 2

const widthPx = computed(() => rpxToPx(props.width))
const heightPx = computed(() => rpxToPx(props.height))
const ringWidthPx = computed(() => rpxToPx(props.ringWidth))
const innerSize = computed(() => widthPx.value - ringWidthPx.value * 2)

const total = computed(() => props.data.reduce((sum, item) => sum + Math.max(0, item.value), 0))

const gradientStyle = computed(() => {
  if (total.value === 0 || props.data.length === 0) {
    return { background: '#E2E8F0' }
  }

  const segments: string[] = []
  let currentAngle = 0
  const validItems = props.data.filter(item => item.value > 0)
  const gapCount = validItems.length

  validItems.forEach((item, index) => {
    const percent = item.value / total.value
    const sweepAngle = percent * 360 - (gapCount > 1 ? GAP_ANGLE : 0)

    if (sweepAngle > 0) {
      // 颜色段（硬边缘）
      segments.push(`${item.color} ${currentAngle}deg ${currentAngle + sweepAngle}deg`)
      currentAngle += sweepAngle

      // 透明间隙（硬边缘）
      if (gapCount > 1 && index < validItems.length - 1) {
        segments.push(`transparent ${currentAngle}deg ${currentAngle + GAP_ANGLE}deg`)
        currentAngle += GAP_ANGLE
      }
    }
  })

  if (segments.length === 0) {
    return { background: '#E2E8F0' }
  }

  // 最后一段到第一段之间的间隙
  if (gapCount > 1) {
    segments.push(`transparent ${currentAngle}deg 360deg`)
  }

  return { background: `conic-gradient(from -90deg, ${segments.join(', ')})` }
})

const legendItems = computed(() => {
  return props.data.filter(item => item.value !== undefined)
})
</script>

<template>
  <view class="chart-wrapper">
    <view class="chart-container" :style="{ width: `${widthPx}px`, height: `${heightPx}px` }">
      <view class="ring-outer" :style="[gradientStyle]">
        <view class="ring-inner" :style="{ width: `${innerSize}px`, height: `${innerSize}px` }">
          <text class="center-text">
            {{ centerText }}
          </text>
          <text class="center-label">
            {{ centerLabel }}
          </text>
        </view>
      </view>
    </view>
    <view v-if="legendItems.length > 0" class="legend">
      <view v-for="(item, index) in legendItems" :key="index" class="legend-item">
        <view class="legend-dot" :style="{ background: item.color }" />
        <text class="legend-text">
          {{ item.name }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-container {
  position: relative;
}

.ring-outer {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-inner {
  border-radius: 50%;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.center-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.center-label {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

.legend {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24rpx;
  margin-top: 16rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-dot {
  width: 24rpx;
  height: 16rpx;
  border-radius: 4rpx;
}

.legend-text {
  font-size: 20rpx;
  color: #666;
}
</style>
