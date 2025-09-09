<script lang="ts" setup>
// #region 导入
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
const emit = defineEmits<{
  success: [result: PhotoResult]
  cancel: []
  error: [error: any]
}>()

// #endregion

// #region 属性定义
interface PhotoResult {
  tempImagePath: string
}

// #endregion

// #region 定义响应式数据
const cameraContext = ref<any>(null)
const countdown = ref(5)
const isCountingDown = ref(false)
const capturedPhoto = ref<string | null>(null)
const showPreview = ref(false)
const cameraAuthorized = ref(false)
const countdownTimer = ref<any>(null)
// #endregion

// #region 定义计算属性
const countdownText = computed(() => {
  return countdown.value > 0 ? countdown.value.toString() : '拍照'
})

const isCameraReady = computed(() => {
  return cameraAuthorized.value && !isCountingDown.value && !capturedPhoto.value
})

const countdownDisplay = computed(() => {
  return countdown.value > 0 ? countdown.value.toString() : ''
})
// #endregion

// #region 方法定义
// 初始化摄像头
async function initCamera() {
  try {
    // 请求摄像头权限
    await uni.authorize({
      scope: 'scope.camera',
    })

    cameraAuthorized.value = true

    // 创建摄像头上下文
    cameraContext.value = uni.createCameraContext()

    // 开始倒计时
    startCountdown()
  }
  catch (error) {
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
  if (isCountingDown.value)
    return

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
  if (!cameraContext.value)
    return

  cameraContext.value.takePhoto({
    quality: 'high',
    success: (res: any) => {
      capturedPhoto.value = res.tempImagePath
      showPreview.value = true
      isCountingDown.value = false
    },
    fail: (error: any) => {
      console.error('拍照失败:', error)
      emit('error', error)
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
  if (!capturedPhoto.value)
    return

  emit('success', { tempImagePath: capturedPhoto.value })
}

// 取消拍照
function cancelPhoto() {
  emit('cancel')
}

// 清理定时器
function cleanupTimer() {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
}
// #endregion

// #region 事件处理函数
function handleCameraError(error: any) {
  console.error('摄像头错误:', error)
  cameraAuthorized.value = false
  emit('error', error)
}
// #endregion

// #region 生命周期钩子
onMounted(() => {
  initCamera()
})

onUnmounted(() => {
  cleanupTimer()
})
// #endregion
</script>

<template>
  <view class="auto-camera-container">
    <!-- 摄像头预览区域 -->
    <view v-if="!showPreview" class="camera-container">
      <!-- 摄像头组件 -->
      <camera
        v-if="cameraAuthorized"
        device-position="front"
        flash="off"
        class="camera"
        @error="handleCameraError"
      />

      <!-- 人脸引导圆圈 -->
      <view v-if="isCameraReady || isCountingDown" class="face-guide-area">
        <view class="face-circle" :class="{ counting: isCountingDown }"></view>
      </view>

      <!-- 底部信息面板 -->
      <view v-if="cameraAuthorized" class="info-panel">
        <!-- 准备状态 -->
        <view v-if="!isCountingDown" class="ready-state">
          <view class="main-tip">
            请将人脸放入圆形区域
          </view>
          <view class="sub-tip">
            系统将自动检测并拍照
          </view>
        </view>

        <!-- 倒计时状态 -->
        <view v-if="isCountingDown" class="countdown-state">
          <view class="countdown-number">
            {{ countdownDisplay }}
          </view>
          <view class="main-tip">
            {{ countdown > 0 ? '秒后自动拍照' : '正在拍照...' }}
          </view>
          <view class="sub-tip">
            {{ countdown > 0 ? '请保持姿势不动' : '' }}
          </view>
        </view>
      </view>

      <!-- 取消按钮 -->
      <view class="cancel-btn">
        <TButton
          type="default"
          size="medium"
          @click="cancelPhoto"
        >
          取消
        </TButton>
      </view>

      <!-- 权限提示 -->
      <view v-if="!cameraAuthorized" class="permission-tip">
        <view class="permission-icon">
          📷
        </view>
        <view class="permission-text">
          需要摄像头权限
        </view>
        <view class="permission-desc">
          请允许使用摄像头以进行自动拍照
        </view>
      </view>
    </view>

    <!-- 照片预览区域 -->
    <view v-if="showPreview" class="preview-container">
      <view class="preview-title">
        拍照成功
      </view>
      <image
        :src="capturedPhoto"
        class="preview-image"
        mode="aspectFit"
      />
      <view class="preview-actions">
        <TButton
          type="default"
          size="large"
          @click="retakePhoto"
        >
          重新拍照
        </TButton>
        <TButton
          type="primary"
          size="large"
          @click="confirmUpload"
        >
          确认使用
        </TButton>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.auto-camera-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.camera-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
}

.camera {
  width: 100%;
  height: 100%;
}

// 人脸引导区域
.face-guide-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 240px;
  height: 240px;
  pointer-events: none;
}

.face-circle {
  width: 100%;
  height: 100%;
  border: 3px solid #3269dd;
  border-radius: 50%;
  animation: pulse 2s infinite;
  position: relative;

  &.counting {
    animation: pulse-fast 0.8s infinite, rotate 5s linear infinite;
    border-color: #3269dd;
    border-width: 4px;
  }
}

// 底部信息面板
.info-panel {
  position: fixed;
  bottom: 80px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  color: white;
  text-align: center;
  z-index: 10;
}

.ready-state,
.countdown-state {
  .main-tip {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #ffffff;
  }

  .sub-tip {
    font-size: 14px;
    opacity: 0.8;
    color: #e5e7eb;
  }
}

.countdown-state {
  .countdown-number {
    font-size: 32px;
    font-weight: bold;
    color: #3269dd;
    margin-bottom: 8px;
    text-shadow: 0 0 8px rgba(50, 105, 221, 0.5);
  }
}

// 取消按钮
.cancel-btn {
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 20;
}

.permission-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
}

.permission-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.permission-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.permission-desc {
  font-size: 14px;
  opacity: 0.8;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
  background: #f8fafc;
}

.preview-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
}

.preview-image {
  width: 100%;
  max-width: 300px;
  height: 300px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-actions {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 300px;
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
