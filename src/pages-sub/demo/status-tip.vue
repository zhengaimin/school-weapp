<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "StatusTip 示例"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import Page from '@/components/common/page/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
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
    title="StatusTip 示例"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4" space="y-4">
      <WhiteCard title="默认状态">
        <StatusTip />
      </WhiteCard>

      <WhiteCard title="自定义提示文案">
        <StatusTip tip="暂无相关数据" />
      </WhiteCard>

      <WhiteCard title="自定义图片和大小">
        <StatusTip image="order" image-size="200rpx" tip="没有订单记录" />
      </WhiteCard>

      <WhiteCard title="空状态">
        <StatusTip image="empty" tip="这里什么都没有" />
      </WhiteCard>

      <WhiteCard title="网络错误">
        <StatusTip image="network" tip="网络出错了，请稍后再试" />
      </WhiteCard>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
