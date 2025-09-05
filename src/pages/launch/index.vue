<route lang="jsonc" type="home">
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

const { pageError, onLoginSuccess, onLoginFail } = usePage()
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
    <view min-h="screen" flex="~ col items-center justify-center" relative overflow="hidden">
      <!-- 模糊气泡背景 -->
      <view
        absolute
        right--10
        top-10
        h-32
        w-32
        rounded-full
        bg-primary
        opacity-10
        style="filter: blur(30px)"
      />
      <view
        top-1_2
        absolute
        left--12
        h-40
        w-40
        rounded-full
        bg-primary-light
        opacity-15
        style="filter: blur(40px)"
      />
      <view
        top-3_4
        absolute
        right--20
        h-28
        w-28
        rounded-full
        bg-primary
        opacity-10
        style="filter: blur(25px)"
      />

      <!-- 主要内容区域 -->
      <view flex="~ col items-center justify-center">
        <!-- Logo 区域 -->
        <image src="@/static/images/logo.png" w="32" h="32" m="b-8" class="logo-container" />
      </view>

      <!-- 底部文字 -->
      <view style="transform: translateX(-50%);" left="50%" absolute bottom="12" flex="~ row items-center" gap="2">
        <!-- Loading 指示器 -->
        <Loading loading-size="24rpx" loading-color="#9ca3af" />
        <!-- 底部文字 -->
        <text text="sm text-muted">
          鑫智服务
        </text>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
