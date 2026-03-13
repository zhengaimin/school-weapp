<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "请签字"
  }
}
</route>

<script lang="ts" setup>
import type { SignatureResult } from '@/uni_modules/wot-design-uni/components/wd-signature/types'
import { computed, ref } from 'vue'
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
import { pause } from '@/uni_modules/wot-design-uni/components/common/util'
import WdButton from '@/uni_modules/wot-design-uni/components/wd-button/wd-button.vue'
import WdSignature from '@/uni_modules/wot-design-uni/components/wd-signature/wd-signature.vue'
import { boundingClientRect } from '@/utils/dom'
import { getPrevPageExposed } from '@/utils/index'
import { toast } from '@/utils/toast'

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()

const height = ref(0)
const width = ref(0)
const inited = ref(false)

const contentStyle = computed(() => {
  return getContentHeight()
})

function handleConfirm(result: SignatureResult) {
  if (result && result.success) {
    // 使用 getPrevPageExposed 方法调用上一个页面的方法
    const prevPageExposed = getPrevPageExposed()

    prevPageExposed?.acceptParams(result.tempFilePath)
    uni.navigateBack()
  } else {
    toast.show('获取签名失败')
  }
}

async function onLoginSuccess() {
  await batchRequestHandler([])

  const rect: any = await boundingClientRect('.signature-wrapper')
  if (rect) {
    width.value = rect.width - 48
    height.value = rect.height - 32
    await pause(100)
    inited.value = true
  }
}
</script>

<template>
  <Page
    title="请签字"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view class="signature-wrapper landscape-signature" pt="4" pr="4" :style="contentStyle">
      <WdSignature
        v-if="inited"
        :height="height"
        :width="width"
        enable-history
        pressure
        background-color="#f5f5f5"
        @confirm="handleConfirm"
      >
        <template #footer="{ clear, confirm, restore, revoke, canUndo, canRedo }">
          <view class="custom-actions">
            <view class="button-group">
              <WdButton size="small" plain :disabled="!canUndo" @click="revoke">
                撤回
              </WdButton>
              <WdButton size="small" plain :disabled="!canRedo" @click="restore">
                恢复
              </WdButton>
              <WdButton size="small" plain @click="clear">
                清除
              </WdButton>
              <WdButton size="small" type="primary" @click="confirm">
                完成
              </WdButton>
            </view>
          </view>
        </template>
      </WdSignature>
    </view>
  </Page>
</template>

<style lang="scss" scoped>
.landscape-signature {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-left: 48px;
  box-sizing: border-box;

  .custom-actions {
    position: fixed;
    left: 0;
    top: 50%;
    width: 48px;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
    z-index: 10;

    .button-group {
      display: flex;
      flex-direction: row;
      gap: 12px;
      white-space: nowrap;
      width: max-content;
      transform: translateX(-50%);
    }
  }
}
</style>
