<script lang="ts" setup>
defineProps<{
  monthCount?: number
  monthAmount?: string
  totalRecharge?: string
  studentName?: string
  studentFullInfo?: string
}>()
</script>

<template>
  <view class="statistics-card">
    <view class="statistics-card__student">
      <text class="statistics-card__student-name">
        {{ studentName || '--' }}
      </text>
      <text v-if="studentFullInfo" class="statistics-card__student-info">
        {{ studentFullInfo }}
      </text>
    </view>

    <view class="statistics-card__panel">
      <view class="statistics-card__item">
        <text class="statistics-card__value">
          {{ monthCount ?? '--' }}
        </text>
        <text class="statistics-card__label">
          消费次数
        </text>
      </view>
      <view class="statistics-card__divider" />
      <view class="statistics-card__item">
        <text class="statistics-card__value">
          {{ monthAmount ?? '--' }}
        </text>
        <text class="statistics-card__label">
          消费金额
        </text>
      </view>
      <view class="statistics-card__divider" />
      <view class="statistics-card__item">
        <text class="statistics-card__value">
          {{ totalRecharge ?? '--' }}
        </text>
        <text class="statistics-card__label">
          累计充值
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.statistics-card {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.statistics-card__student {
  display: flex;
  min-width: 0;
  align-items: flex-end;
  justify-content: center;
  gap: 20rpx;
  flex-wrap: wrap;
}

.statistics-card__student-name {
  max-width: 180rpx;
  overflow: hidden;
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.statistics-card__student-info {
  color: rgba(255, 255, 255, 0.78);
  font-size: 26rpx;
  line-height: 1.25;
  text-align: center;
}

.statistics-card__panel {
  display: flex;
  align-items: center;
}

.statistics-card__item {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  flex-direction: column;
}

.statistics-card__value {
  max-width: 100%;
  overflow: hidden;
  color: #ffffff;
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.statistics-card__label {
  margin-top: 8rpx;
  color: rgba(255, 255, 255, 0.70);
  font-size: 24rpx;
  line-height: 1.2;
}

.statistics-card__divider {
  width: 1rpx;
  height: 80rpx;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.19);
}
</style>
