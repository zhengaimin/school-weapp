<script lang="ts" setup>
// #region 导入
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
// #endregion

// #region 属性定义
const props = defineProps<{
  validGifts?: {
    records?: Array<{
      totalMinutes?: number
      remainingMinutes?: number
      remainingDays?: number
    }>
  }
}>()
// #endregion

// #region 定义计算属性
// 计算总时长(分钟)
const totalMinutes = computed(() => {
  if (!props.validGifts?.records?.length)
    return '--'
  return props.validGifts.records.reduce((total, gift) => total + (gift.totalMinutes || 0), 0)
})

// 计算剩余时长(分钟)
const remainingMinutes = computed(() => {
  if (!props.validGifts?.records?.length)
    return '--'
  return props.validGifts.records.reduce((total, gift) => total + (gift.remainingMinutes || 0), 0)
})

// 计算剩余天数(最小值)
const remainingDays = computed(() => {
  if (!props.validGifts?.records?.length)
    return '--'

  const minDays = props.validGifts.records.reduce(
    (min, gift) => (gift.remainingDays !== undefined ? Math.min(min, gift.remainingDays) : min),
    Number.MAX_SAFE_INTEGER,
  )

  return minDays === Number.MAX_SAFE_INTEGER ? '--' : minDays
})
// #endregion
</script>

<template>
  <WhiteCard>
    <view text="sm text-secondary" m="b-3">
      赠时长信息
    </view>
    <view grid="~ cols-3" gap="4">
      <view text="center">
        <view text="lg text-primary" font="medium">
          {{ totalMinutes }}
        </view>
        <view text="xs text-secondary">
          总时长(分钟)
        </view>
      </view>
      <view text="center">
        <view text="lg text-primary" font="medium">
          {{ remainingMinutes }}
        </view>
        <view text="xs text-secondary">
          剩余时长(分钟)
        </view>
      </view>
      <view text="center">
        <view text="lg text-primary" font="medium">
          {{ remainingDays }}
        </view>
        <view text="xs text-secondary">
          剩余天数
        </view>
      </view>
    </view>
  </WhiteCard>
</template>

<style scoped lang="scss"></style>
