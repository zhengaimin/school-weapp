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
import { computed, onMounted, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { usePage } from '@/hooks/usePage'
import { useToast } from '@/uni_modules/wot-design-uni'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const toast = useToast()
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 页面状态
const selectedMethod = ref<'camera' | 'upload' | null>(null)
const capturedPhoto = ref<string | null>(null)
const showImagePreview = ref(false)
const showLastImageModal = ref(false)
const previewImageUrl = ref('')

// 质量检测提示
const qualityTip = ref({
  show: false,
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  title: '',
  message: '',
})

// 上次上传的图片数据
const lastUploadedImage = ref<{
  dataUrl: string
  method: string
  timestamp: string
  size: number
} | null>(null)

// 计算属性
const hasLastImage = computed(() => !!lastUploadedImage.value)

// 选择人脸识别方式
function selectCameraMethod() {
  selectedMethod.value = 'camera'
  startCamera()
}

// 选择上传照片方式
function selectUploadMethod() {
  selectedMethod.value = 'upload'
  // 触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/jpg,image/png'
  input.onchange = handleFileSelect
  input.click()
}

// 启动摄像头
async function startCamera() {
  try {
    showQualityTip('info', '人脸识别已启动', '请正对摄像头，确保五官清晰可见')

    // 在实际应用中，这里会调用摄像头API
    // 这里模拟摄像头启动
    setTimeout(() => {
      // 模拟拍照成功
      const mockImageUrl
        = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
      capturedPhoto.value = mockImageUrl
      previewImageUrl.value = mockImageUrl
      showImagePreview.value = true
    }, 2000)
  }
  catch (error) {
    console.error('摄像头启动失败:', error)
    showQualityTip('error', '摄像头启动失败', '请检查摄像头权限或尝试上传照片方式')
  }
}

// 处理文件选择
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return

  // 检查文件类型
  if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
    showQualityTip('error', '文件格式不支持', '请选择 JPG 或 PNG 格式的照片')
    return
  }

  // 检查文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showQualityTip('error', '文件过大', '请选择小于 5MB 的照片文件')
    return
  }

  // 读取文件
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    capturedPhoto.value = result
    previewImageUrl.value = result
    showImagePreview.value = true
  }
  reader.readAsDataURL(file)
}

// 显示质量提示
function showQualityTip(
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message: string,
) {
  qualityTip.value = {
    show: true,
    type,
    title,
    message,
  }

  // 3秒后自动隐藏
  setTimeout(() => {
    qualityTip.value.show = false
  }, 3000)
}

// 重新选择图片
function reSelectImage() {
  showImagePreview.value = false
  capturedPhoto.value = null
  selectedMethod.value = null
}

// 确认提交图片
async function confirmSubmitImage() {
  if (!capturedPhoto.value)
    return

  try {
    showQualityTip('info', '提交中...', '正在上传照片，请稍候')

    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 保存到本地存储
    const imageData = {
      dataUrl: capturedPhoto.value,
      method: selectedMethod.value || 'upload',
      timestamp: new Date().toISOString(),
      size: Math.round(capturedPhoto.value.length * 0.75),
    }

    // 保存到本地存储
    uni.setStorageSync('lastUploadedImage', imageData)
    lastUploadedImage.value = imageData

    showImagePreview.value = false

    // 显示成功提示
    uni.showModal({
      title: '提交成功',
      content: '人脸采集提交成功！\n\n照片已上传，等待审核。审核结果将在1-2个工作日内通知您。',
      confirmText: '返回首页',
      cancelText: '继续采集',
      success: (res) => {
        if (res.confirm) {
          uni.reLaunch({
            url: '/pages/index/index',
          })
        }
        else {
          reSelectImage()
        }
      },
    })
  }
  catch (error) {
    console.error('提交失败:', error)
    showQualityTip('error', '提交失败', '网络错误，请重试')
  }
}

// 查看上次上传的图片
function handleLastImage() {
  showLastImageModal.value = true
}

// 重新使用上次的图片
function reuseLastImage() {
  if (!lastUploadedImage.value)
    return

  capturedPhoto.value = lastUploadedImage.value.dataUrl
  selectedMethod.value = lastUploadedImage.value.method as 'camera' | 'upload'
  previewImageUrl.value = lastUploadedImage.value.dataUrl

  showLastImageModal.value = false
  showImagePreview.value = true
}

// 格式化日期时间
function formatDateTime(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 格式化文件大小
function formatFileSize(bytes: number) {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// 页面初始化
onMounted(() => {
  // 加载上次上传的图片
  try {
    const savedData = uni.getStorageSync('lastUploadedImage')
    if (savedData) {
      lastUploadedImage.value = savedData
    }
  }
  catch (error) {
    console.error('加载本地图片数据失败:', error)
  }

  pageLoading.value = false
})
</script>

<template>
  <Page
    title="身份认证"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template v-if="lastUploadedImage" #header-right>
      <Icon
        name="landscape-ai-line"
        :icon-color="NAVIGATION_SUFFIX_COLOR"
        :icon-size="NAVIGATION_SUFFIX_SIZE"
        @click="handleLastImage"
      />
    </template>

    <view p="4 t-2!" flex="~ col" gap="4">
      <!-- 人脸识别按钮 -->
      <WhiteCard p="4" @click="selectCameraMethod">
        <view flex="~ items-center">
          <view flex="1" text="left">
            <view text="base gray-900" font="medium" m="b-1">
              人脸识别
            </view>
            <view text="sm gray-500" leading="relaxed">
              正对相机
              <br />
              五官需清晰可见
            </view>
          </view>
          <view flex="shrink-0" m="l-4">
            <view
              w="16"
              h="16"
              bg="blue-50"
              border="rounded-xl"
              flex="~ items-center justify-center"
            >
              <Icon name="user-smile-line" icon-color="#2563eb" icon-size="48rpx" />
            </view>
          </view>
        </view>
      </WhiteCard>

      <!-- 上传照片按钮 -->
      <WhiteCard p="4" @click="selectUploadMethod">
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

      <!-- 质量检测提示 -->
      <view
        v-if="qualityTip.show"
        border="rounded-xl"
        p="3"
        :class="{
          'bg-amber-50 border-l-4 border-amber-400':
            qualityTip.type === 'info' || qualityTip.type === 'warning',
          'bg-green-50 border-l-4 border-green-400': qualityTip.type === 'success',
          'bg-red-50 border-l-4 border-red-400': qualityTip.type === 'error',
        }"
      >
        <view flex="~ items-start">
          <Icon
            :name="
              qualityTip.type === 'success'
                ? 'check-line'
                : qualityTip.type === 'error'
                  ? 'error-warning-line'
                  : 'information-line'
            "
            :icon-color="
              qualityTip.type === 'success'
                ? '#10b981'
                : qualityTip.type === 'error'
                  ? '#ef4444'
                  : '#f59e0b'
            "
            icon-size="36rpx"
            m="r-2 t-0.5"
          />
          <view>
            <view
              text="sm"
              font="medium"
              :class="{
                'text-amber-800': qualityTip.type === 'info' || qualityTip.type === 'warning',
                'text-green-800': qualityTip.type === 'success',
                'text-red-800': qualityTip.type === 'error',
              }"
            >
              {{ qualityTip.title }}
            </view>
            <view
              text="xs"
              m="t-1"
              :class="{
                'text-amber-700': qualityTip.type === 'info' || qualityTip.type === 'warning',
                'text-green-700': qualityTip.type === 'success',
                'text-red-700': qualityTip.type === 'error',
              }"
            >
              {{ qualityTip.message }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 图片预览弹框 -->
    <wd-action-sheet v-model="showImagePreview" title="图片预览" @close="showImagePreview = false">
      <view p="6">
        <!-- 图片预览区域 -->
        <view m="b-6">
          <view flex="~ justify-center">
            <image
              :src="previewImageUrl"
              mode="aspectFit"
              w="full"
              max-h="64"
              border="rounded-lg gray-200"
            />
          </view>
        </view>

        <!-- 操作按钮 -->
        <view flex="~ gap-3">
          <TButton type="default" size="large" block @click="reSelectImage">
            重新选择
          </TButton>
          <TButton type="primary" size="large" block @click="confirmSubmitImage">
            确认提交
          </TButton>
        </view>
      </view>
    </wd-action-sheet>

    <!-- 查看上次上传图片弹框 -->
    <wd-action-sheet
      v-model="showLastImageModal"
      title="上次上传的图片"
      @close="showLastImageModal = false"
    >
      <view p="4">
        <!-- 图片显示区域 -->
        <view m="b-4">
          <view v-if="lastUploadedImage" flex="~ justify-center">
            <image
              :src="lastUploadedImage.dataUrl"
              mode="aspectFit"
              w="full"
              max-h="64"
              border="rounded-lg gray-200"
            />
          </view>
          <view v-else text="center gray-500" p="y-8">
            <Icon name="file-list-3-line" icon-color="#9ca3af" icon-size="80rpx" m="b-2" />
            <text text="sm">
              暂无上传记录
            </text>
          </view>
        </view>

        <!-- 图片信息 -->
        <view
          v-if="lastUploadedImage"
          bg="gray-50"
          border="rounded-lg"
          p="3"
          m="b-4"
          text="xs gray-600"
        >
          <view flex="~ justify-between" m="b-1">
            <text>上传时间：</text>
            <text>{{ formatDateTime(lastUploadedImage.timestamp) }}</text>
          </view>
          <view flex="~ justify-between" m="b-1">
            <text>采集方式：</text>
            <text>{{ lastUploadedImage.method === 'camera' ? '人脸识别' : '上传照片' }}</text>
          </view>
          <view flex="~ justify-between">
            <text>文件大小：</text>
            <text>{{ formatFileSize(lastUploadedImage.size) }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view flex="~ gap-3">
          <TButton type="default" size="large" block @click="showLastImageModal = false">
            关闭
          </TButton>
          <TButton
            v-if="lastUploadedImage"
            type="primary"
            size="large"
            block
            @click="reuseLastImage"
          >
            重新使用
          </TButton>
        </view>
      </view>
    </wd-action-sheet>
  </Page>
</template>
