<script setup lang="ts"></script>

<template>
  <view class="px-4" :style="{ paddingBottom: '152rpx' }">
    <view class="mt-2 space-y-3">
      <!-- 消息骨架屏 - 左侧 -->
      <view class="flex items-start gap-2">
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '80rpx', height: '80rpx', borderRadius: '50%' },
          ]"
        />
        <view class="flex-1 space-y-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '40%', height: '32rpx' },
              { width: '60%', height: '32rpx', marginTop: '8rpx' },
            ]"
          />
        </view>
      </view>

      <!-- 消息骨架屏 - 右侧 -->
      <view class="flex flex-row-reverse items-start gap-2">
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '80rpx', height: '80rpx', borderRadius: '50%' },
          ]"
        />
        <view class="flex-1 space-y-2 items-end">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '40%', height: '32rpx' },
              { width: '60%', height: '32rpx', marginTop: '8rpx' },
            ]"
          />
        </view>
      </view>

      <!-- 消息骨架屏 - 左侧 -->
      <view class="flex items-start gap-2">
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '80rpx', height: '80rpx', borderRadius: '50%' },
          ]"
        />
        <view class="flex-1 space-y-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '50%', height: '32rpx' },
              { width: '70%', height: '32rpx', marginTop: '8rpx' },
            ]"
          />
        </view>
      </view>
    </view>
  </view>
</template>