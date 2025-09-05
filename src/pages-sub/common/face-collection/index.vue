<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "身份认证"
  }
}
</route>

<script setup lang="ts">
// #region 导入
import type { File } from '@/api/interface/modules/file'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { putStudentFaceApi } from '@/api/modules/students'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { usePage } from '@/hooks/usePage'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
import { uploadFileUrl, useFileUpload } from '@/utils/uploadFile'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
const userStore = useUserStore()
const { currentStudent } = storeToRefs(userStore)
// #endregion

// #region 定义响应式数据
const uploadedImageInfo = ref<File.Upload.ResPostUploadApi | null>(null)
// 页面状态
const selectedMethod = ref<'upload' | null>(null)
const capturedPhoto = ref<string | null>(null)
const showImagePreview = ref(false)
const showLastImageModal = ref(false)
const previewImageUrl = ref('')
// #endregion

// #region 事件处理函数
// 选择上传照片方式
async function selectUploadMethod() {
  selectedMethod.value = 'upload'
  try {
    const chooseRes = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    const tempFilePath = chooseRes.tempFilePaths[0]
    capturedPhoto.value = tempFilePath
    previewImageUrl.value = tempFilePath

    uni.showLoading({ title: '正在上传...' })

    const result = await new Promise<{ code: number, data: File.Upload.ResPostUploadApi }>(
      (resolve, reject) => {
        const { run } = useFileUpload<File.Upload.ResPostUploadApi>(
          uploadFileUrl.UPLOAD,
          tempFilePath,
          { bizType: 'FACE_COLLECTION' },
          {
            onSuccess: (resData) => {
              console.log(resData)
              resolve({ code: 0, data: resData as File.Upload.ResPostUploadApi })
            },
            onError: (err) => {
              reject(err)
            },
          },
        )
        run()
      },
    ).finally(() => {
      uni.hideLoading()
    })

    if (result.code === 0) {
      uploadedImageInfo.value = result.data
      showImagePreview.value = true
    }
    else {
      toast.show('图片上传失败，请重试')
    }
  }
  catch (err: any) {
    if (err && err.errMsg && err.errMsg.includes('cancel')) {
      // User cancelled, do nothing
    }
    else {
      console.error('选择或上传失败:', err)
      toast.show('无法选择或上传照片，请稍后重试')
    }
  }
}

// 查看上次上传的图片
function handleLastImage() {
  showLastImageModal.value = true
}

// 重新选择图片
function reSelectImage() {
  showImagePreview.value = false
  capturedPhoto.value = null
  selectedMethod.value = null
}

// 确认提交图片
async function confirmSubmitImage() {
  if (!capturedPhoto.value || !uploadedImageInfo.value) {
    toast.show('缺少必要的图片信息')
    return
  }

  try {
    const faceImageUrl = import.meta.env.VITE_UPLOAD_BASEURL + uploadedImageInfo.value.fileUrl
    // 调用更新用户信息接口
    const result = await putStudentFaceApi({ faceImageUrl })

    // 更新成功提示
    if (result.code === 0) {
      toast.show('人脸信息更新成功')
      showImagePreview.value = false
    }
  }
  catch (error) {
    console.error('提交确认失败:', error)
    toast.show('更新用户信息时出错，请重试')
  }
  finally {
    // 删除图片数据
    uploadedImageInfo.value = null
    capturedPhoto.value = null
    selectedMethod.value = null
  }
}

// #endregion

// #region 生命周期钩子
onMounted(() => {
  pageLoading.value = false
})
// #endregion
</script>

<template>
  <Page
    title="身份认证"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template v-if="currentStudent?.faceImageUrl" #header-right>
      <view flex="~ row items-center justify-center" h-full gap="4">
        <Icon
          name="landscape-ai-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="handleLastImage"
        />
      </view>
    </template>

    <view p="4 t-2!" flex="~ col" gap="4">
      <!-- 上传照片按钮 -->
      <WhiteCard @click="selectUploadMethod">
        <view flex="~ items-center">
          <view flex="1" text="left">
            <view text="base gray-900" font="medium" m="b-1">
              上传照片
            </view>
            <view text="sm gray-500" leading="relaxed">
              选择清晰的照片
              <br />
              支持JPG、PNG格式
            </view>
          </view>
          <view flex="shrink-0" m="l-4">
            <view
              w="16"
              h="16"
              bg="purple-50"
              border="rounded-xl"
              flex="~ items-center justify-center"
            >
              <Icon name="upload-2-line" icon-color="#7c3aed" icon-size="48rpx" />
            </view>
          </view>
        </view>
      </WhiteCard>
    </view>

    <!-- 图片预览弹框 -->
    <BottomPopup v-model="showImagePreview" title="图片预览">
      <view p="6">
        <!-- 图片预览区域 -->
        <view m="b-6">
          <view flex="~ justify-center">
            <image
              :src="previewImageUrl"
              mode="aspectFit"
              w="full"
              h="64"
              border="rounded-lg gray-200"
            />
          </view>
        </view>

        <!-- 操作按钮 -->
        <view flex="~" gap="3">
          <TButton type="default" size="large" flex="1" full @click="reSelectImage">
            重新选择
          </TButton>
          <TButton type="primary" size="large" flex="1" full @click="confirmSubmitImage">
            确认提交
          </TButton>
        </view>
      </view>
    </BottomPopup>

    <!-- 查看上次上传图片弹框 -->
    <BottomPopup v-model="showLastImageModal" title="上次上传的图片">
      <view p="4">
        <!-- 图片显示区域 -->
        <view m="b-4">
          <view flex="~ justify-center">
            <image
              :src="currentStudent?.faceImageUrl"
              mode="aspectFit"
              w="full"
              h="64"
              border="rounded-lg gray-200"
            />
          </view>
        </view>
      </view>
    </BottomPopup>
  </Page>
</template>

<style scoped lang="scss">
.picture-footer {
  :deep(.button) {
    width: 50%;
  }
}
</style>
