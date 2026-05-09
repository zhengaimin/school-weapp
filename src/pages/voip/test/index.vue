<route lang="jsonc" type="home">
{
  "layout": "default",
  "style": {
    "navigationBarTitleText": "VoIP 测试"
  }
}
</route>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

/** 插件检测状态文案 */
const statusText = ref('待检测')
/** 插件检测说明 */
const detailText = ref('页面加载后会自动检测 wmpf-voip 插件。')

/** 检测微信小程序 VoIP 插件是否可引入 */
function handleCheckPlugin() {
  // #ifdef MP-WEIXIN
  try {
    const wmpfVoip = requirePlugin('wmpf-voip').default
    console.log(wmpfVoip)
    statusText.value = wmpfVoip ? '引入成功' : '未获取到插件实例'
    detailText.value = wmpfVoip
      ? '控制台已输出 wmpfVoip，可继续验证插件方法。'
      : 'requirePlugin 已执行，但 default 为空。'
  } catch (error) {
    console.error('wmpf-voip 插件引入失败', error)
    statusText.value = '引入失败'
    detailText.value = '请确认插件已在 manifest 的 mp-weixin.plugins 中声明，并在微信开发者工具中运行。'
  }
  // #endif
  // #ifndef MP-WEIXIN
  statusText.value = '仅微信小程序可检测'
  detailText.value = '请使用 pnpm dev:mp-weixin 后在微信开发者工具打开此页面。'
  // #endif
}

onMounted(() => {
  handleCheckPlugin()
})
</script>

<template>
  <view class="voip-test-page">
    <view class="status-card">
      <text class="title">
        wmpf-voip
      </text>
      <text class="status">
        {{ statusText }}
      </text>
      <text class="detail">
        {{ detailText }}
      </text>
      <button class="check-button" @click="handleCheckPlugin">
        重新检测
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.voip-test-page {
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  background: #f6f7fb;
}

.status-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.title {
  color: #111827;
  font-size: 36rpx;
  font-weight: 600;
}

.status {
  color: #0f766e;
  font-size: 32rpx;
  font-weight: 600;
}

.detail {
  color: #4b5563;
  font-size: 28rpx;
  line-height: 1.6;
}

.check-button {
  margin: 16rpx 0 0;
  background: #0f766e;
  color: #ffffff;
  font-size: 30rpx;
}
</style>
