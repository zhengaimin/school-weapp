<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "图标展示"
  }
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'
import Page from '@/components/common/page/index.vue'
import Icon from '@/components/icon/index.vue'
import { usePage } from '@/hooks/usePage'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

const iconList = ref([
  // arrows
  'arrow-left-right-fill',
  'arrow-right-s-line',
  'arrow-left-line',
  'arrow-down-s-line',
  'arrow-up-s-line',

  // buildings
  'home-3-line',

  // communication
  'feedback-line',
  'message-3-line',

  // document
  'file-list-3-line',
  'file-copy-line',
  'bill-line',
  'file-chart-line',

  // design
  'edit-line',

  // device
  'smartphone-line',
  'tablet-line',
  'keyboard-line',

  // media
  'stop-circle-line',
  'landscape-ai-line',
  'play-circle-line',
  'play-circle-fill',
  'pause-circle-line',
  'voiceprint-line',
  'camera-line',

  // finance
  'refund-2-line',
  'wallet-3-line',
  'money-cny-circle-line',
  'coupon-line',
  'shopping-cart-line',
  'refund-line',

  // health
  'heart-3-line',

  // system
  'add-line',
  'add-circle-line',
  'error-warning-line',
  'information-line',
  'settings-3-line',
  'history-line',
  'checkbox-circle-line',
  'close-circle-line',
  'check-line',
  'upload-2-line',
  'search-line',
  'time-line',
  'shield-check-line',
  'question-line',
  'delete-bin-line',
  'forbid-line',
  'reset-left-line',
  'lock-line',
  'lock-unlock-line',
  'alarm-warning-line',
  'alarm-warning-fill',
  'upload-cloud-line',

  // user
  'user-settings-line',
  'parent-line',
  'user-5-line',
  'user-smile-line',
  'user-add-line',
  'user-line',
])

// 复制图标名称
function handleCopyIconName(iconName: string) {
  uni.setClipboardData({
    data: iconName,
    success: () => {
      toast.show(`已复制`)
    },
    fail: () => {
      toast.show('复制失败')
    },
  })
}
</script>

<template>
  <Page
    title="图标展示"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 图标网格 -->
    <view grid="~ cols-4">
      <view
        v-for="iconName in iconList"
        :key="iconName"
        flex="~ col items-center justify-center"
        p="3"
        h="88px"
        box-border
        cursor="pointer"
        @click="handleCopyIconName(iconName)"
      >
        <Icon :name="iconName" icon-color="#0ec69a" icon-size="48rpx" />
        <view text="xs gray-600 center" m="t-2" break="all">
          {{ iconName }}
        </view>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
