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
import { storeToRefs } from 'pinia'
// #region 导入
import { computed, ref } from 'vue'
import { putAgreementApi } from '@/api/modules/user/common'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { COMMON_SIGNATURE_PATH, FACE_COLLECTION_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/auth/parent'
import { useUserStore } from '@/store/user'
import { uploadBase64Promise, uploadFilePromise, uploadFileUrl } from '@/utils/file/upload'
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

// #region 使用 Store
const parentStore = useParentStore()
const userStore = useUserStore()
const { userInfo, currentStudent } = storeToRefs(userStore)
// #endregion

// #region 定义响应式数据
const signatureImage = ref('')
const submitLoading = ref(false)
// #endregion

// #region 定义计算属性
const hasSigned = computed(() => !!signatureImage.value)
const contentStyle = computed(() => {
  return getContentHeight(hasSigned.value ? '164rpx' : '0')
})
// #endregion

// #region 接口请求函数
async function axiosUploadSignatureImageApi(imageData: string): Promise<string> {
  try {
    // 生成文件名：用户id_学生id_时间戳+随机值.png
    const timestamp = Date.now()
    const randomValue = Math.random().toString(36).substring(2, 8)
    const fileName = `${unref(userInfo).userId}_${unref(currentStudent)?.studentId}_${timestamp}_${randomValue}.png`

    let uploadResult: { code: number, data: any }

    // #ifdef H5
    // H5 端使用 base64 上传
    uploadResult = await uploadBase64Promise(imageData, fileName, {
      bizType: 'signature', // 签名业务类型
    })
    // #endif

    // #ifdef MP-WEIXIN
    // 微信小程序使用文件上传
    uploadResult = await uploadFilePromise(
      uploadFileUrl.UPLOAD,
      imageData, // 在小程序中，这里应该是文件路径
      {
        bizType: 'signature', // 签名业务类型
      },
    )
    // #endif

    if (uploadResult.code === 0 && uploadResult.data?.fileUrl) {
      return import.meta.env.VITE_UPLOAD_BASEURL + uploadResult.data.fileUrl
    }
    else {
      throw new Error(`上传失败：${uploadResult.data || '未知错误'}`)
    }
  }
  catch (error) {
    console.error('上传签名图片失败:', error)
    throw error
  }
}

async function axiosPutAgreementApi(agreementUrl: string) {
  try {
    const result = await putAgreementApi({
      agreementUrl,
    })
    return result
  }
  catch (error) {
    console.error('提交协议失败:', error)
    throw error
  }
}
// #endregion

// #region 事件处理函数
async function handleSubmitAgreement() {
  if (!hasSigned.value) {
    toast.show('请先签名')
    return
  }

  try {
    submitLoading.value = true

    console.log(signatureImage.value)
    // 先上传签名图片，获取服务器 URL
    const signatureUrl = await axiosUploadSignatureImageApi(signatureImage.value)

    // 调用更新用户协议状态接口，使用上传后的 URL
    const result = await axiosPutAgreementApi(signatureUrl)

    if (result.code === 0) {
      toast.success('协议提交成功')

      // 成功后跳转到人脸采集页面
      uni.redirectTo({
        url: FACE_COLLECTION_PATH,
      })
    }
  }
  catch (error) {
    console.error('提交协议失败:', error)
    toast.show('提交失败，请重试')
  }
  finally {
    submitLoading.value = false
  }
}

function handleClearSignature() {
  signatureImage.value = ''
  handleGoToSignature()
}

function handleGoToSignature() {
  uni.navigateTo({
    url: COMMON_SIGNATURE_PATH,
  })
}

function handleAcceptParams(imgPath: string) {
  console.log(imgPath)
  signatureImage.value = imgPath
}

// 将方法暴露到全局，供页面间调用
defineExpose({
  acceptParams: handleAcceptParams,
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
              <image v-if="signatureImage" :src="signatureImage" mode="aspectFit" h-full w-full style="transform: rotate(-90deg);" />
              <text v-else color="gray-400">
                请在下方灰色框内进行签字
              </text>
            </view>
          </view>
        </WhiteCard>
      </view>
    </scroll-view>

    <view v-if="hasSigned" p="4" flex="~" gap="3">
      <TButton
        type="primary"
        size="large"
        full
        flex="1"
        :loading="submitLoading"
        @click="handleSubmitAgreement"
      >
        提交
      </TButton>
    </view>
  </Page>
</template>
