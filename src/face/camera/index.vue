<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "自动拍照"
  }
}
</route>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
import { getPrevPageExposed } from '@/utils/index'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

const cameraContext = ref<any>(null)
const countdown = ref(3)
const isCountingDown = ref(false)
const capturedPhoto = ref<string | null>(null)
const showPreview = ref(false)
const cameraAuthorized = ref(false)
const countdownTimer = ref<any>(null)

const countdownText = computed(() => {
  return countdown.value > 0 ? countdown.value.toString() : '拍照'
})

const isCameraReady = computed(() => {
  return cameraAuthorized.value && !isCountingDown.value && !capturedPhoto.value
})

const countdownDisplay = computed(() => {
  return countdown.value > 0 ? countdown.value.toString() : ''
})

// 初始化摄像头
async function initCamera() {
  try {
    // 请求摄像头权限
    const authResult = await uni.authorize({
      scope: 'scope.camera',
    })

    cameraAuthorized.value = true

    // 创建摄像头上下文
    cameraContext.value = uni.createCameraContext()

    // 开始倒计时
    startCountdown()
  } catch (error) {
    console.error('摄像头权限获取失败:', error)
    cameraAuthorized.value = false
    uni.showModal({
      title: '权限提示',
      content: '请允许使用摄像头权限以进行自动拍照',
      showCancel: false,
    })
  }
}

// 开始倒计时
function startCountdown() {
  if (isCountingDown.value) return

  isCountingDown.value = true
  countdown.value = 5

  countdownTimer.value = setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value)
      takePhoto()
    }
  }, 1000)
}

// 拍照
function takePhoto() {
  if (!cameraContext.value) return

  cameraContext.value.takePhoto({
    quality: 'high',
    success: (res: any) => {
      const { errMsg, tempImagePath } = res

      if (errMsg === 'takePhoto:ok' || errMsg === 'operateCamera:ok') {
        capturedPhoto.value = tempImagePath

        const exposed = getPrevPageExposed()
        exposed?.acceptParams(tempImagePath)
        uni.navigateBack()
      }
    },
    fail: (error: any) => {
      console.error('拍照失败:', error)
      uni.showToast({
        title: '拍照失败，请重试',
        icon: 'none',
      })
      isCountingDown.value = false
    },
  })
}

// 重新拍照
function retakePhoto() {
  capturedPhoto.value = null
  showPreview.value = false
  startCountdown()
}

// 确认上传照片
function confirmUpload() {
  if (!capturedPhoto.value) return

  try {
    // 使用 getPrevPageExposed 调用上一个页面的方法
    const prevPageExposed = getPrevPageExposed()

    if (prevPageExposed && prevPageExposed.acceptParams) {
      // 调用上一个页面暴露的 showImageDialog 方法
      prevPageExposed.acceptParams(capturedPhoto.value)
    } else {
      // 兼容旧的调用方式
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]

      if (prevPage) {
        prevPage.$vm?.handleCameraResult?.({ tempImagePath: capturedPhoto.value })
      }
    }

    // 返回上一页
    uni.navigateBack()
  } catch (error) {
    console.error('调用上一页方法失败:', error)
    uni.navigateBack()
  }
}

// 取消拍照
function cancelPhoto() {
  uni.navigateBack()
}

// 清理定时器
function cleanupTimer() {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
}

function handleCameraError(error: any) {
  console.error('摄像头错误:', error)
  cameraAuthorized.value = false
  uni.showToast({
    title: '摄像头启动失败',
    icon: 'none',
  })
}

onMounted(() => {
  pageLoading.value = false
  initCamera()
})

onUnmounted(() => {
  cleanupTimer()
})
</script>

<template>
  <Page
    :show="false"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 摄像头预览区域 -->
    <view v-if="!showPreview" relative h-screen w-full bg-black>
      <!-- 摄像头组件 -->
      <camera
        v-if="cameraAuthorized"
        device-position="front"
        flash="off"
        h-full
        w-full
        @error="handleCameraError"
      />

      <!-- 人脸引导圆圈（简化版本） -->
      <view
        v-if="isCameraReady || isCountingDown"
        top="50%"
        left="50%"
        class="face-guide-area"
        pointer-events-none
        absolute
        h-60
        w-60
      >
        <view
          relative
          h-full
          w-full
          border-3
          border-primary
          rounded-full
          border-solid
          class="face-circle"
          :class="{ counting: isCountingDown }"
        />
      </view>

      <!-- 底部信息面板 -->
      <view
        v-if="cameraAuthorized"
        absolute
        bottom-20
        left-5
        right-5
        z-10
        rounded-4
        bg-black
        bg-opacity-70
        p-5
        text-center
        color-white
        backdrop-blur-lg
      >
        <!-- 准备状态 -->
        <view v-if="!isCountingDown" flex="~ col" gap-2>
          <view text-lg color-white font-semibold>
            请将人脸放入圆形区域内
          </view>
          <view text-sm color-gray-300 opacity-80>
            5秒后将自动拍照
          </view>
        </view>

        <!-- 倒计时状态 -->
        <view v-if="isCountingDown" flex="~ col" gap-2>
          <view text-lg color-white font-semibold>
            {{ countdown > 0 ? `${countdown}秒后自动拍照` : '正在拍照...' }}
          </view>
          <view text-sm color-gray-300 opacity-80>
            {{ countdown > 0 ? '请将人脸放入区域内，保持姿势不动！' : '' }}
          </view>
        </view>
      </view>

      <!-- 权限提示 -->
      <view
        v-if="!cameraAuthorized"
        absolute
        top="50%"
        left="50%"
        class="permission-tip"
        text-center
        color-white
      >
        <view mb-2 text-lg font-bold>
          需要摄像头权限
        </view>
        <view text-sm opacity-80>
          请允许使用摄像头以进行自动拍照
        </view>
      </view>
    </view>

    <!-- 照片预览区域 -->
    <view v-if="showPreview" flex="~ col items-center" h-screen bg-gray-50 p-5>
      <view mb-5 text-6 color-gray-800 font-bold>
        拍照成功
      </view>
      <image
        :src="capturedPhoto"
        mb-7.5
        h-75
        max-w-75
        w-full
        rounded-3
        shadow-lg
        mode="aspectFit"
      />
      <view flex="~" max-w-75 w-full gap-4>
        <TButton type="default" size="large" @click="retakePhoto">
          重新拍照
        </TButton>
        <TButton type="primary" size="large" @click="confirmUpload">
          确认上传
        </TButton>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss">
// 人脸引导区域定位
.face-guide-area {
  transform: translate(-50%, -60%); // 上移一些，为底部面板留空间
}

// 人脸圆圈动画
.face-circle {
  animation: pulse 2s infinite;

  &.counting {
    animation:
      pulse-fast 0.8s infinite,
      rotate 3s linear infinite;
    border-color: #3269dd !important; // 主色调
    border-width: 4px !important;
  }
}

// 权限提示定位
.permission-tip {
  transform: translate(-50%, -50%);
}

// 倒计时数字阴影效果
.countdown-number {
  text-shadow: 0 0 8px rgba(50, 105, 221, 0.5);
}

// 动画效果
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(50, 105, 221, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(50, 105, 221, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(50, 105, 221, 0);
  }
}

@keyframes pulse-fast {
  0% {
    box-shadow: 0 0 0 0 rgba(50, 105, 221, 0.8);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(50, 105, 221, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(50, 105, 221, 0);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
