<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@/hooks/usePage'

const { getContentHeight } = usePage()

const contentStyle = computed(() => {
  return {
    ...(getContentHeight('152rpx') as Record<string, any>),
    overflowY: 'hidden',
  }
})
</script>

<template>
  <!-- 孩子管理页面骨架屏 -->
  <view class="box-border px-4 pb-20" :style="contentStyle">
    <!-- 孩子卡片骨架屏 -->
    <view
      v-for="index in 2"
      :key="index"
      class="mb-4 border border-gray-200 rounded-xl bg-white p-4"
    >
      <!-- 头部信息骨架 -->
      <view class="mb-3 flex items-center justify-between">
        <view class="flex items-center">
          <!-- 头像骨架 -->
          <view class="mr-3 h-12 w-12 shrink-0">
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '96rpx', height: '96rpx', borderRadius: '50%' }]"
            />
          </view>

          <!-- 姓名和学校信息骨架 -->
          <view class="flex-1">
            <view class="mb-1">
              <wd-skeleton
                animation="gradient"
                :row-col="[{ width: '120rpx', height: '32rpx', borderRadius: '4rpx' }]"
              />
            </view>
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '200rpx', height: '24rpx', borderRadius: '4rpx' }]"
            />
          </view>
        </view>

        <!-- 箭头骨架 -->
        <view class="h-4 w-4 shrink-0">
          <wd-skeleton
            animation="gradient"
            :row-col="[{ width: '32rpx', height: '32rpx', borderRadius: '4rpx' }]"
          />
        </view>
      </view>

      <!-- 人脸识别警告骨架（第二个卡片显示） -->
      <view v-if="index === 2" class="mb-3">
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '100%', height: '80rpx', borderRadius: '12rpx' }]"
        />
      </view>

      <!-- 学号和余额信息骨架 -->
      <view class="rounded-md bg-gray-50 p-3">
        <view class="grid grid-cols-2 gap-4">
          <view>
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '140rpx', height: '24rpx', borderRadius: '4rpx' }]"
            />
          </view>
          <view>
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '120rpx', height: '24rpx', borderRadius: '4rpx' }]"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮骨架屏 -->
    <view class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
      <view class="mx-auto max-w-sm">
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '100%', height: '96rpx', borderRadius: '12rpx' }]"
        />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
// 骨架屏样式
</style>
