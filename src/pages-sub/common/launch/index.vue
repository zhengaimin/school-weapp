<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
</route>

<script lang="ts" setup>
import Loading from '@/components/common/loading/index.vue'
import Page from '@/components/common/page/index.vue'

import { usePage } from '@/hooks/usePage'

defineOptions({
  options: {
    styleIsolation: 'apply-shared', // apply-shared shared
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
</script>

<template>
  <Page
    :show="false"
    :loading="false"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 启动页内容 -->
    <view
      min-h="screen"
      bg="bg-primary"
      flex="~ col items-center justify-center"
      relative
      overflow="hidden"
    >
      <!-- 背景装饰 -->
      <view
        w="80"
        h="80"
        bg="primary"
        border="rounded-full"
        absolute
        right--160rpx
        top--160rpx
        opacity-10
      />
      <view
        w="60"
        h="60"
        bg="primary-light"
        border="rounded-full"
        absolute
        left--120rpx
        top-240rpx
        opacity-15
      />
      <view
        w="40"
        h="40"
        bg="primary"
        border="rounded-full"
        absolute
        bottom-200rpx
        right-80rpx
        opacity-20
      />

      <!-- 主要内容区域 -->
      <view flex="~ col items-center justify-center">
        <!-- Logo 区域 -->
        <image src="@/static/images/logo.png" w="32" h="32" m="b-8" class="logo-container" />
      </view>

      <!-- 底部文字 -->
      <view x="-50%" absolute bottom="12" flex="~ row items-center" gap="2">
        <!-- Loading 指示器 -->
        <Loading loading-size="32rpx" loading-color="#9ca3af" />
        <!-- 底部文字 -->
        <text text="sm text-muted">
          鑫智生活服务
        </text>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
