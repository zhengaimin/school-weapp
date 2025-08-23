<script setup lang="ts">
import { usePage } from '@/hooks/usePage'

const { pageLoading, getContentHeight } = usePage()

const contentStyle = computed(() => {
  return {
    ...(getContentHeight('152rpx') as Record<string, any>),
    overflowY: pageLoading.value ? 'hidden' : 'auto',
  }
})
</script>

<template>
  <view class="box-border px-4 pb-4" :style="contentStyle">
    <!-- 头像骨架 -->
    <view class="my-4 flex flex-col items-center">
      <wd-skeleton theme="avatar" :row-col="[{ size: '80px', type: 'circle' }]" />
    </view>

    <!-- 表单骨架 -->
    <view class="form-skeleton rounded-4 bg-white p-4">
      <!-- 姓名输入框骨架 -->
      <view class="skeleton-field">
        <wd-skeleton theme="text" :row-col="[{ width: '40px', height: '16px' }]" />
        <view class="mt-3">
          <wd-skeleton :row-col="[{ width: '100%', height: '44px' }]" />
        </view>
      </view>

      <!-- 手机号输入框骨架 -->
      <view class="skeleton-field">
        <wd-skeleton theme="text" :row-col="[{ width: '48px', height: '16px' }]" />
        <view class="mt-3">
          <wd-skeleton :row-col="[{ width: '100%', height: '44px' }]" />
        </view>
      </view>

      <!-- 邮箱输入框骨架 -->
      <view class="skeleton-field">
        <wd-skeleton theme="text" :row-col="[{ width: '32px', height: '16px' }]" />
        <view class="mt-3">
          <wd-skeleton :row-col="[{ width: '100%', height: '44px' }]" />
        </view>
      </view>

      <!-- 单位名称文本域骨架 -->
      <view class="skeleton-field">
        <wd-skeleton theme="text" :row-col="[{ width: '56px', height: '16px' }]" />
        <view class="mt-3">
          <wd-skeleton :row-col="[{ width: '100%', height: '64px' }]" />
        </view>
      </view>

      <!-- 职业输入框骨架 -->
      <view class="skeleton-field">
        <wd-skeleton theme="text" :row-col="[{ width: '32px', height: '16px' }]" />
        <view class="mt-3">
          <wd-skeleton :row-col="[{ width: '100%', height: '44px' }]" />
        </view>
      </view>

      <!-- 部门输入框骨架 -->
      <view class="skeleton-field">
        <wd-skeleton theme="text" :row-col="[{ width: '32px', height: '16px' }]" />
        <view class="mt-3">
          <wd-skeleton :row-col="[{ width: '100%', height: '44px' }]" />
        </view>
      </view>
    </view>
  </view>

  <!-- 底部添加按钮骨架屏 -->
  <view class="fixed bottom-0 left-0 z-50 w-full flex items-center justify-center border-t py-4">
    <wd-skeleton
      animation="gradient"
      :row-col="[
        { width: '100%', height: '80rpx', borderRadius: '40rpx', backgroundColor: '#0ec69a' },
      ]"
      :custom-style="{ width: '90%' }"
    />
  </view>
</template>
