<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "人脸采集"
  }
}
</route>

<script setup lang="ts">
import type { File } from '@/api/interface/modules/file'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { putStudentFaceApi } from '@/api/modules/students'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { FACE_STATUS } from '@/constant/modules'
import { FACE_CAMERA_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { uploadFilePromise, uploadFileUrl } from '@/utils/file'
import { toast } from '@/utils/toast'
import { FACE_STATUS_CONFIG } from './utils/business'

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail } = usePage()
const userStore = useUserStore()
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { studentInfo } = storeToRefs(currentStudentStore)

const uploadedImageInfo = ref<File.Upload.ResPostUploadApi | null>(null)
// 页面状态
const selectedMethod = ref<'upload' | 'camera' | null>(null)
const capturedPhoto = ref<string | null>(null)
const showImagePreview = ref(false)
const showLastImageModal = ref(false)
const previewImageUrl = ref('')
const showExternalImagePreview = ref(false)
const externalImageUrl = ref('')

// 人脸状态公告配置
const noticeConfig = computed(() => {
  const faceStatus = studentInfo.value?.faceStatus ?? FACE_STATUS.NOT_COLLECTED
  return FACE_STATUS_CONFIG[faceStatus]
})

// 重新拍照处理函数
function handleRetakePhoto() {
  externalImageUrl.value = ''
  showExternalImagePreview.value = false
  // 跳转到自动拍照页面
  uni.navigateTo({
    url: FACE_CAMERA_PATH,
  })
}

// 提交外部图片
async function handleSubmitExternalImage() {
  if (!externalImageUrl.value) {
    toast.show('缺少图片信息')
    return
  }

  try {
    uni.showLoading({ title: '正在上传...' })

    const uploadResult = await uploadFilePromise<File.Upload.ResPostUploadApi>(
      uploadFileUrl.UPLOAD,
      externalImageUrl.value,
      { bizType: 'FACE_COLLECTION' },
    ).finally(() => {
      uni.hideLoading()
    })

    if (uploadResult.code === 0) {
      const faceImageUrl = import.meta.env.VITE_UPLOAD_BASEURL + uploadResult.data.fileUrl
      // 调用更新用户信息接口
      const result = await putStudentFaceApi({ faceImageUrl })

      // 更新成功提示
      if (result.code === 0) {
        toast.show('人脸信息更新成功')
        showExternalImagePreview.value = false
        // 清空外部图片路径
        externalImageUrl.value = ''

        // 重新获取个人信息
        await userStore.getUserInfo()
        await parentStore.axiosGetStudentListApi()
      }
    } else {
      toast.show('图片上传失败，请重试')
    }
  } catch (error) {
    console.error('提交外部图片失败:', error)
    toast.show('图片上传失败，请重试')
  }
}

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

    const result = await uploadFilePromise<File.Upload.ResPostUploadApi>(
      uploadFileUrl.UPLOAD,
      tempFilePath,
      { bizType: 'FACE_COLLECTION' },
    ).finally(() => {
      uni.hideLoading()
    })

    if (result.code === 0) {
      uploadedImageInfo.value = result.data
      showImagePreview.value = true
    } else {
      toast.show('图片上传失败，请重试')
    }
  } catch (err: any) {
    if (err && err.errMsg && err.errMsg.includes('cancel')) {
      // User cancelled, do nothing
    } else {
      console.error('选择或上传失败:', err)
      toast.show('无法选择或上传照片，请稍后重试')
    }
  }
}

// 选择自动拍照方式
function selectCameraMethod() {
  selectedMethod.value = 'camera'
  // 跳转到自动拍照页面
  uni.navigateTo({
    url: FACE_CAMERA_PATH,
  })
}

// 暴露给其他页面调用的方法 - 接收图片路径并弹框显示
function acceptParams(imagePath: string) {
  externalImageUrl.value = imagePath
  showExternalImagePreview.value = true
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

      // 重新获取个人信息
      await userStore.getUserInfo()
      await parentStore.axiosGetStudentListApi()
    }
  } catch (error) {
    console.error('提交确认失败:', error)
    toast.show('更新用户信息时出错，请重试')
  } finally {
    // 删除图片数据
    uploadedImageInfo.value = null
    capturedPhoto.value = null
    selectedMethod.value = null
  }
}

function onLoginSuccess() {
  batchRequestHandler([userStore.getUserInfo()])
}

onShow(() => {
  // TODO: 增加逻辑，判断是否需要跳转到同意书页面
  // if (!userStore.isFaceConsentAgreed) {
  //   uni.navigateTo({ url: FACE_CONSENT_PATH })
  // }

  if (unref(pageLoaded)) {
    userStore.getUserInfo()
  }
})

// 通过 defineExpose 暴露方法（Vue 3 推荐方式）
defineExpose({
  acceptParams,
})
</script>

<template>
  <Page
    title="人脸采集"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2!" flex="~ col" gap="4">
      <!-- 人脸状态与图片区域 -->
      <WhiteCard
        v-if="currentStudent?.faceImageUrl"
        :custom-style="{
          backgroundColor: noticeConfig.bgColor,
          borderColor: noticeConfig.borderColor,
        }"
      >
        <view flex="~ col" gap="3">
          <view text="base gray-900" font="medium" :style="{ color: noticeConfig.textColor }">
            当前人脸图片
          </view>
          <view flex="~ justify-center">
            <image
              :src="currentStudent.faceImageUrl"
              mode="aspectFill"
              w="48"
              h="48"
              border="rounded-lg"
            />
          </view>
          <view text="center">
            <view text="sm gray-700" :style="{ color: noticeConfig.textColor }">
              {{ noticeConfig.content }}
            </view>
          </view>
        </view>
      </WhiteCard>

      <!-- 未上传时的提示 -->
      <WhiteCard
        v-else
        :custom-style="{
          backgroundColor: noticeConfig.bgColor,
          borderColor: noticeConfig.borderColor,
        }"
      >
        <view text="center" p="4">
          <view
            text="base gray-900"
            font="medium"
            m="b-2"
            :style="{ color: noticeConfig.textColor }"
          >
            {{ noticeConfig.title }}
          </view>
          <view text="sm gray-700" :style="{ color: noticeConfig.textColor }">
            {{ noticeConfig.content }}
          </view>
        </view>
      </WhiteCard>

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

      <!-- 自动拍照按钮 -->
      <WhiteCard @click="selectCameraMethod">
        <view flex="~ items-center">
          <view flex="1" text="left">
            <view text="base gray-900" font="medium" m="b-1">
              自动拍照
            </view>
            <view text="sm gray-500" leading="relaxed">
              智能识别人脸
              <br />
              自动拍摄清晰照片
            </view>
          </view>
          <view flex="shrink-0" m="l-4">
            <view
              w="16"
              h="16"
              bg="primary-50"
              border="rounded-xl"
              flex="~ items-center justify-center"
            >
              <Icon name="camera-line" icon-color="#3269dd" icon-size="48rpx" />
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

    <!-- 外部图片预览弹框 -->
    <BottomPopup v-model="showExternalImagePreview" title="图片预览" height="auto">
      <view p="4">
        <!-- 图片显示区域 -->
        <view m="b-4">
          <view flex="~ justify-center">
            <image
              :src="externalImageUrl"
              mode="aspectFit"
              w="full"
              h="64"
              border="rounded-lg gray-200"
            />
          </view>
        </view>

        <!-- 操作按钮 -->
        <view flex="~" gap="3">
          <TButton type="default" size="large" flex="1" full @click="handleRetakePhoto">
            重新拍照
          </TButton>
          <TButton type="primary" size="large" flex="1" full @click="handleSubmitExternalImage">
            提交
          </TButton>
        </view>
      </view>
    </BottomPopup>
  </Page>
</template>
