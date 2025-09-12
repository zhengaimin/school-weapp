<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "告知函"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import { computed, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { COMMON_SIGNATURE_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { toast } from '@/utils/toast'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()
// #endregion

// #region 定义响应式数据
const signatureImage = ref('')
// #endregion

// #region 定义计算属性
const hasSigned = computed(() => !!signatureImage.value)
const contentStyle = computed(() => {
  return getContentHeight(hasSigned.value ? '164rpx' : '0')
})
// #endregion

// #region 事件处理函数
// 同意
function handleAgree() {
  if (!hasSigned.value) {
    toast.show('请先签名')
    return
  }
  // TODO: 跳转到人脸采集页面
  console.log('同意')
}

// 重签
function handleClearSignature() {
  signatureImage.value = ''
  handleGoToSignature()
}

// 跳转到签名页面
function handleGoToSignature() {
  uni.navigateTo({
    url: COMMON_SIGNATURE_PATH,
  })
}

// 暴露方法供其他页面调用
function acceptParams(imgPath: string) {
  console.log(imgPath)
  signatureImage.value = imgPath
}

// 将方法暴露到全局，供页面间调用
defineExpose({
  acceptParams,
})
// #endregion
</script>

<template>
  <Page
    title="告知函"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view :style="contentStyle" :scroll-y="true">
      <view p="4" flex="~ col" gap="4">
        <WhiteCard>
          <view text="lg" font="bold" mb="2">
            尊敬的用户：
          </view>
          <view flex="~ col" gap="1">
            <view text="sm" color="gray-600" leading="relaxed">
              您好，感谢您对鑫智生活的支持! 现需要针对使用图像采集功能向您征求意见,
              在使用过程中将用到相机与存储权限, 用于采集、使用、保存您的脸部信息,
              进行人脸特征对比、人脸识别、建立人脸识别信息库以便通过人脸识别身份验证的方式向您提供更便利、更安全的服务。
            </view>
            <view text="sm" font="bold" color="gray-600" leading="relaxed">
              签名同意后表示您已了解并同意使用人脸进行就餐、出入校、宿舍考勤等服务。若您拒绝授权,
              将无法使用相关功能。
            </view>
          </view>
        </WhiteCard>

        <WhiteCard>
          <view flex="~ col" gap="2">
            <view flex="~ justify-between items-center">
              <view text="base" font="medium">
                签名区
              </view>
              <view v-if="hasSigned" text="sm red-500" @click="handleClearSignature">
                重签
              </view>
            </view>
            <view
              h="40"
              bg="gray-100"
              border="1 dashed gray-300 rounded-lg"
              flex="~ items-center justify-center"
              @click="handleGoToSignature"
            >
              <image v-if="signatureImage" :src="signatureImage" mode="aspectFit" h-full w-full />
              <text v-else color="gray-400">
                请在下方灰色框内进行签字
              </text>
            </view>
          </view>
        </WhiteCard>
      </view>
    </scroll-view>

    <view v-if="hasSigned" p="4" flex="~" gap="3">
      <TButton type="primary" size="large" full flex="1" @click="handleAgree">
        提交
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss">
// Page specific styles
</style>
