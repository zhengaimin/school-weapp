<script setup lang="ts">
import type { Ref } from 'vue'
import type { File } from '@/api/interface/modules/file'
import type { Message } from '@/api/interface/modules/message'
import { computed, inject, ref } from 'vue'
import { postMessageApi } from '@/api/modules/message'
import Icon from '@/components/icon/index.vue'
import { FILE_TYPE } from '@/constant/modules'
import { uploadFileUrl, useFileUpload } from '@/utils/uploadFile'
import { voiceMessageDataKey } from '../provide'

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

// 定义事件
const emit = defineEmits<{
  sendVoice: [filePath: string, duration: number]
}>()

// 从父组件注入语音消息数据
const voiceMessageData = inject(voiceMessageDataKey, ref(null))

// 语音输入相关状态
const isRecording = ref(false) // 是否正在录音
const recordingTime = ref(0) // 录音时长
const recordingTimer = ref<NodeJS.Timeout | null>(null) // 录音计时器
const recorderManager = ref<UniNamespace.RecorderManager | null>(null) // 录音管理器
const isUploading = ref(false) // 是否正在上传
const isSending = ref(false) // 是否正在发送消息

// 初始化录音管理器
function initRecorderManager() {
  if (!recorderManager.value) {
    try {
      // 检查是否支持录音功能
      if (!uni.getRecorderManager) {
        console.warn('当前环境不支持录音功能')
        uni.showToast({
          title: '当前环境不支持录音功能',
          icon: 'none',
        })
        return false
      }

      recorderManager.value = uni.getRecorderManager()

      if (!recorderManager.value) {
        console.warn('录音管理器初始化失败')
        uni.showToast({
          title: '录音功能初始化失败',
          icon: 'none',
        })
        return false
      }

      // 录音开始事件
      recorderManager.value.onStart(() => {
        console.log('录音开始')
        isRecording.value = true
        recordingTime.value = 0
        startRecordingTimer()
      })

      // 录音结束事件
      recorderManager.value.onStop(async (result) => {
        console.log('录音结束', result)
        isRecording.value = false
        stopRecordingTimer()

        if (result.tempFilePath) {
          console.log('录音文件路径:', result.tempFilePath)
          console.log('录音时长:', result.duration, 'ms')

          const duration = Math.floor(result.duration / 1000)

          // 录音时间太短提示
          if (duration < 1) {
            uni.showToast({
              title: '录音时间太短',
              icon: 'none',
            })
            return
          }

          try {
            // 1. 上传文件到服务器
            isUploading.value = true
            uni.showLoading({
              title: '上传中...',
              mask: true,
            })

            const uploadResult = await uploadVoiceFile(result.tempFilePath, duration)
            uni.hideLoading()

            // 2. 发送消息
            isSending.value = true
            uni.showLoading({
              title: '发送中...',
              mask: true,
            })

            await sendVoiceMessage(uploadResult, duration)
            uni.hideLoading()

            // 3. 通知父组件
            emit('sendVoice', result.tempFilePath, duration)

            uni.showToast({
              title: '发送成功',
              icon: 'success',
            })
          }
          catch (error) {
            console.error('语音消息发送失败:', error)
            uni.hideLoading()
            uni.showToast({
              title: '发送失败，请重试',
              icon: 'none',
            })
          }
          finally {
            isUploading.value = false
            isSending.value = false
          }
        }
      })

      // 录音错误事件
      recorderManager.value.onError((error) => {
        console.error('录音错误:', error)
        isRecording.value = false
        stopRecordingTimer()
        uni.showToast({
          title: '录音失败',
          icon: 'none',
        })
      })
    }
    catch (error) {
      console.error('录音管理器初始化异常:', error)
      uni.showToast({
        title: '录音功能不可用',
        icon: 'none',
      })
      return false
    }
  }
  return true
}

// 开始录音计时器
function startRecordingTimer() {
  recordingTimer.value = setInterval(() => {
    recordingTime.value += 1

    // 达到60秒自动停止录音
    if (recordingTime.value >= 60) {
      handleStopRecording()
    }
  }, 1000)
}

// 停止录音计时器
function stopRecordingTimer() {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
    recordingTimer.value = null
  }
  recordingTime.value = 0
}

// 开始录音（按住说话）
function handleStartRecording() {
  if (isRecording.value)
    return

  const success = initRecorderManager()
  if (!success) {
    return
  }

  if (recorderManager.value) {
    try {
      recorderManager.value.start({
        duration: 60000, // 最大录音时长60秒
        format: 'mp3', // 录音格式
        sampleRate: 16000, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 48000, // 编码码率
        frameSize: 4096, // 指定帧大小
      })
    }
    catch (error) {
      console.error('开始录音失败:', error)
      uni.showToast({
        title: '录音启动失败',
        icon: 'none',
      })
    }
  }
  else {
    uni.showToast({
      title: '录音功能不可用',
      icon: 'none',
    })
  }
}

// 停止录音（松开按钮）
function handleStopRecording() {
  if (!isRecording.value || !recorderManager.value)
    return

  try {
    // 录音时间太短提示
    if (recordingTime.value < 1) {
      uni.showToast({
        title: '录音时间太短',
        icon: 'none',
      })
      recorderManager.value.stop()
      return
    }

    recorderManager.value.stop()
  }
  catch (error) {
    console.error('停止录音失败:', error)
    isRecording.value = false
    stopRecordingTimer()
    uni.showToast({
      title: '录音停止失败',
      icon: 'none',
    })
  }
}

// 格式化录音时间显示
const recordingTimeText = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60)
  const seconds = recordingTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 对外暴露停止录音方法，供父组件调用
function stopRecording() {
  if (isRecording.value) {
    handleStopRecording()
  }
}

// 上传语音文件
async function uploadVoiceFile(filePath: string, duration: number) {
  return new Promise<File.Upload.ResPostUploadApi>((resolve, reject) => {
    const { run } = useFileUpload<File.Upload.ResPostUploadApi>(
      uploadFileUrl.UPLOAD,
      filePath,
      { bizType: 'VOICE_MESSAGE' },
      {
        onSuccess: (resData) => {
          resolve(resData as File.Upload.ResPostUploadApi)
        },
        onError: (err) => {
          reject(err)
        },
      },
    )
    run()
  })
}

// 发送语音消息
async function sendVoiceMessage(uploadResult: any, duration: number) {
  try {
    const messageData: Message.ReqPostMessageApi = {
      content: '', // 语音消息内容为空
      fileType: FILE_TYPE.AUDIO,
      fileName: uploadResult.filename || '语音消息',
      fileUrl: `${import.meta.env.VITE_UPLOAD_BASEURL}${uploadResult.fileUrl || uploadResult.url}`,
      fileDuration: duration,
    }

    const result = await postMessageApi(messageData)

    if (result.code !== 0) {
      throw new Error(result.msg || '消息发送失败')
    }

    // 构造消息对象，添加到消息队列
    const messageItem: Message.IMessageItemVo = {
      id: result.data.messageId || Date.now(), // 使用API返回的messageId或临时ID
      content: messageData.content,
      fileUrl: messageData.fileUrl || '',
      fileType: messageData.fileType || 'audio',
      fileDuration: messageData.fileDuration || 0,
      fileName: messageData.fileName || '语音消息',
      fileSize: uploadResult.fileSize || 0, // 从上传结果获取文件大小
      isRead: false, // 新消息未读
      createdAt: new Date().toISOString(), // 当前时间
      readAt: null, // 未读，无阅读时间
      isSelf: true, // 自己发送的消息
      messageDirection: 'GUARDIAN_TO_STUDENT', // 家长发送给学生
      priority: 0, // 默认优先级
      status: 1, // 默认状态
      title: '', // 语音消息无标题
      guardianName: '', // 监护人姓名
      senderId: 0, // 发送方ID，由父组件填充
      senderName: '我', // 发送方姓名
      senderAvatar: '', // 发送方头像
      receiverId: 0, // 接收方ID，由父组件填充
      receiverName: '', // 接收方姓名
      receiverAvatar: '', // 接收方头像
    }

    // 设置录音消息数据，通过 provide/inject 传递给父组件
    voiceMessageData.value = messageItem

    return result.data
  }
  catch (error) {
    console.error('消息发送失败:', error)
    throw error
  }
}

// 暴露方法给父组件
defineExpose({
  stopRecording,
})
</script>

<template>
  <view
    class="voice-record-btn"
    flex="1 ~ items-center justify-center"
    h-64rpx
    rounded-md
    :class="{
      'bg-red-500': isRecording,
      'bg-blue-500': isUploading || isSending,
      'bg-gray-100': !isRecording && !isUploading && !isSending,
    }"
    :style="{
      pointerEvents: isUploading || isSending ? 'none' : 'auto',
    }"
    @touchstart="handleStartRecording"
    @touchend="handleStopRecording"
    @touchcancel="handleStopRecording"
  >
    <!-- 录音中状态 -->
    <view v-if="isRecording" flex="~ items-center" gap="2">
      <Icon name="voiceprint-line" icon-color="#ffffff" icon-size="32rpx" />
      <text text-sm color-white>
        {{ recordingTimeText }}
      </text>
      <text text-xs color-white>
        松开发送
      </text>
    </view>

    <!-- 上传中状态 -->
    <view v-else-if="isUploading" flex="~ items-center" gap="2">
      <Icon name="upload-cloud-line" icon-color="#ffffff" icon-size="32rpx" />
      <text text-sm color-white>
        上传中...
      </text>
    </view>

    <!-- 发送中状态 -->
    <view v-else-if="isSending" flex="~ items-center" gap="2">
      <Icon name="send-plane-line" icon-color="#ffffff" icon-size="32rpx" />
      <text text-sm color-white>
        发送中...
      </text>
    </view>

    <!-- 默认状态 -->
    <view v-else flex="~ items-center" gap="2">
      <Icon name="voiceprint-line" icon-color="#666666" icon-size="32rpx" />
      <text text-sm color-gray-600>
        按住说话
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.voice-record-btn {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:active {
    transform: scale(0.98);
  }
}
</style>
