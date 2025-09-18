<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "关注公众号"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
// #endregion
</script>

<template>
  <Page
    title="关注公众号"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view flex="~ col items-center justify-center" h-full>
      <view text-center>
        <image src="/static/images/qr-code-placeholder.png" style="width: 200px; height: 200px;" />
        <view mt-4 text-lg text-gray-600>
          长按识别二维码，关注我们
        </view>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
