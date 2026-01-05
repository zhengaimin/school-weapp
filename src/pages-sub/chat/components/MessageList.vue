<script lang="ts" setup>
import { storeToRefs } from 'pinia'
// #region 导入
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Loading from '@/components/common/loading/index.vue'
import Icon from '@/components/icon/index.vue'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useCachedMedia } from '@/utils/file'
import { formatTime } from '@/utils/format'
// #endregion

// #region 类型定义
export interface IMessage {
  id?: string | number
  type: 'text' | 'image' | 'video' | 'gif' | 'voice' | 'file'
  content: string
  isMine: boolean
  avatar?: string
  username?: string
  timestamp?: number | string | Date
  fileName?: string // 文件消息专用
  fileSize?: number // 文件消息专用
  status?: 'sending' | 'sent' | 'failed'
  fileDuration?: number // 文件时长（语音、视频）
  isRead?: boolean
}
// #endregion

// #region 属性定义
withDefaults(
  defineProps<{
    messages?: IMessage[]
  }>(),
  {
    messages: () => [],
  },
)

const emit = defineEmits<{
  resend: [messageId: string | number]
  click: []
}>()
// #endregion

const currentStudentStore = useCurrentStudentStore()
const { studentInfo } = storeToRefs(currentStudentStore)

// #region 响应式数据
const showVideoPlayer = ref(false)
const currentVideoUrl = ref('')
const playingMessageId = ref<string | number | null>(null)
let innerAudioContext: UniApp.InnerAudioContext | null = null
// #endregion

// #region 方法
// 格式化文件大小
function formatFileSize(bytes?: number): string {
  if (!bytes)
    return '未知大小'
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

// 预览图片
function previewImage(url: string) {
  uni.previewImage({
    urls: [url],
    current: url,
  })
}

// 打开视频播放器
function openVideoPlayer(url: string) {
  currentVideoUrl.value = url
  showVideoPlayer.value = true
}

// 关闭视频播放器
function closeVideoPlayer() {
  showVideoPlayer.value = false
  currentVideoUrl.value = ''
}

function getCachedPath(url: string) {
  return useCachedMedia(url).localPath.value
}
// #endregion

// #region 语音处理
const isPlaying = computed(() => (messageId: string | number) => {
  return playingMessageId.value === messageId
})

// 播放语音
function handlePlayVoice(message: IMessage) {
  if (!innerAudioContext || !message.content)
    return

  const messageId = message.id!
  const isCurrentlyPlaying = playingMessageId.value === messageId

  // 如果有音频正在播放，先停止它
  if (playingMessageId.value !== null)
    innerAudioContext.stop()

  // 如果点击的不是当前播放的语音，则开始播放新的语音
  if (!isCurrentlyPlaying) {
    const cachedPath = getCachedPath(message.content)
    // 优先使用缓存路径，如果不存在则使用原始 URL
    // useCachedMedia 会在后台下载并缓存，下次点击即可使用缓存
    const audioSrc = cachedPath || message.content
    innerAudioContext.src = audioSrc
    innerAudioContext.play()
    playingMessageId.value = messageId
  }
  else {
    // 如果点击的是当前播放的语音，我们已经停止了它，所以只需清除ID
    playingMessageId.value = null
  }
}

// 获取语音时长
function getDurationText(duration?: number) {
  if (duration)
    return `${Math.ceil(duration)}"`

  return ''
}
// #endregion

// #region 生命周期
onMounted(() => {
  innerAudioContext = uni.createInnerAudioContext()
  innerAudioContext.autoplay = false

  innerAudioContext.onPlay(() => {})

  innerAudioContext.onEnded(() => {
    playingMessageId.value = null
  })

  innerAudioContext.onError((res) => {
    console.error('语音播放失败:', res.errMsg)
    playingMessageId.value = null
    uni.showToast({
      title: '语音播放失败',
      icon: 'none',
    })
  })
})

onUnmounted(() => {
  if (innerAudioContext) {
    innerAudioContext.destroy()
    innerAudioContext = null
  }
})
// #endregion
</script>

<template>
  <view class="message-list" @click="emit('click')">
    <view v-for="item in messages" :id="`message-${item.id}`" :key="item.id">
      <view class="message-item-wrapper" p="x-4 y-2">
        <view flex :class="[item.isMine ? 'justify-end' : 'justify-start']">
          <!-- 他人消息在左边 -->
          <view v-if="!item.isMine" flex items-start gap-2>
            <!-- 头像 -->
            <view
              h-10
              w-10
              flex
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-gray-200
            >
              <image
                v-if="studentInfo?.faceImageUrl"
                :src="studentInfo.faceImageUrl"
                mode="aspectFill"
                lazy-load
                h-full
                w-full
              />
              <text v-else text-sm text-gray-500>
                头像
              </text>
            </view>

            <!-- 消息内容区域 -->
            <view flex flex-col items-start>
              <!-- 用户名 -->
              <text v-if="studentInfo?.studentName" mb-1 text-xs text-gray-500>
                {{ studentInfo.studentName }}
              </text>

              <!-- 消息内容 -->
              <view
                class="message-content"
                max-w="[60vw]"
                m="t-1"
                :class="{
                  'rounded-lg bg-white p-3 ': item.type === 'text',
                }"
              >
                <!-- 文字消息 -->
                <text v-if="item.type === 'text'" text-sm text-gray-800>
                  {{ item.content }}
                </text>

                <!-- 图片消息 -->
                <image
                  v-else-if="item.type === 'image'"
                  :src="getCachedPath(item.content)"
                  mode="widthFix"
                  lazy-load
                  max-h-200rpx
                  max-w-200rpx
                  rounded-lg
                  @click="previewImage(item.content)"
                  @load="() => {}"
                />

                <!-- 视频消息 -->
                <view
                  v-else-if="item.type === 'video'"
                  relative
                  h-240rpx
                  w="[40vw]"
                  overflow-hidden
                  rounded-lg
                  bg-black
                  @click="openVideoPlayer(item.content)"
                >
                  <image
                    :src="`${getCachedPath(item.content)}?vframe/jpg/offset/1`"
                    mode="aspectFill"
                    lazy-load
                    h-full
                    w-full
                    rounded-lg
                    @load="() => {}"
                  />
                  <view
                    bg="black opacity-20"
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  >
                    <Icon name="play-circle-fill" icon-size="64rpx" icon-color="#ffffff" />
                  </view>
                </view>

                <!-- 动图消息 -->
                <image
                  v-else-if="item.type === 'gif'"
                  :src="getCachedPath(item.content)"
                  mode="widthFix"
                  lazy-load
                  max-h-200rpx
                  max-w-200rpx
                  rounded-lg
                  @click="previewImage(item.content)"
                  @load="() => {}"
                />
                <!-- 语音消息 -->
                <view
                  v-else-if="item.type === 'voice'"
                  flex="~ items-center"
                  gap="2"
                  rounded-lg
                  bg-white
                  p-3
                  @click="handlePlayVoice(item)"
                >
                  <Icon
                    :name="isPlaying(item.id!) ? 'pause-circle-line' : 'play-circle-line'"
                    icon-size="40rpx"
                    :icon-color="item.isMine ? '#fff' : '#000'"
                  />
                  <text text-sm text-gray-600>
                    {{ getDurationText(item.fileDuration) }}
                  </text>
                </view>

                <!-- 文件消息 -->
                <view v-else-if="item.type === 'file'" rounded-lg bg-white p-3>
                  <view flex items-center gap-2>
                    <text i-file-text-fill text-lg text-green-500 />
                    <view flex-1>
                      <text block truncate text-sm text-gray-800>
                        {{ item.fileName || '未知文件' }}
                      </text>
                      <text text-xs text-gray-400>
                        {{ formatFileSize(item.fileSize) }}
                      </text>
                    </view>
                  </view>
                  <text mt-1 block text-xs text-blue-500>
                    点击下载
                  </text>
                </view>
              </view>

              <!-- 时间戳 -->
              <text v-if="item.timestamp" mt-1 text-xs text-gray-400>
                {{ formatTime(item.timestamp) }}
              </text>
            </view>
          </view>

          <!-- 自己消息在右边 -->
          <view v-else flex flex-row-reverse items-start gap-2>
            <!-- 头像 -->
            <view
              h-10
              w-10
              flex
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-primary
            >
              <image
                v-if="item.avatar"
                :src="item.avatar"
                mode="aspectFill"
                lazy-load
                h-full
                w-full
              />
              <text v-else text-sm text-white>
                我
              </text>
            </view>

            <!-- 消息内容区域 -->
            <view flex flex-col items-end>
              <!-- 消息内容 -->
              <view flex items-center gap-2>
                <!-- 发送状态 -->
                <view v-if="item.isMine" flex items-center>
                  <Loading v-if="item.status === 'sending'" loading-size="24rpx" />
                  <Icon
                    v-if="item.status === 'failed'"
                    name="reset-left-line"
                    icon-size="32rpx"
                    icon-color="#f43f5e"
                    @click="emit('resend', item.id!)"
                  />
                </view>
                <view
                  class="message-content"
                  max-w="[60vw]"
                  :class="{
                    'rounded-lg bg-primary p-3 ': item.type === 'text',
                  }"
                >
                  <!-- 文字消息 -->
                  <text v-if="item.type === 'text'" break-words text-sm text-white>
                    {{ item.content }}
                  </text>

                  <!-- 图片消息 -->
                  <image
                    v-else-if="item.type === 'image'"
                    :src="getCachedPath(item.content)"
                    mode="widthFix"
                    lazy-load
                    max-h-200rpx
                    max-w-200rpx
                    rounded-lg
                    @click="previewImage(item.content)"
                    @load="() => {}"
                  />

                  <!-- 视频消息 -->
                  <view
                    v-else-if="item.type === 'video'"
                    relative
                    h-240rpx
                    w="[40vw]"
                    overflow-hidden
                    rounded-lg
                    bg-black
                    @click="openVideoPlayer(item.content)"
                  >
                    <image
                      :src="`${getCachedPath(item.content)}?vframe/jpg/offset/1`"
                      mode="aspectFill"
                      lazy-load
                      h-full
                      w-full
                      rounded-lg
                      @load="() => {}"
                    />
                    <view
                      bg="black opacity-20"
                      pointer-events-none
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                    >
                      <Icon name="play-circle-fill" icon-size="64rpx" icon-color="#ffffff" />
                    </view>
                  </view>

                  <!-- 动图消息 -->
                  <image
                    v-else-if="item.type === 'gif'"
                    :src="getCachedPath(item.content)"
                    mode="widthFix"
                    lazy-load
                    max-h-200rpx
                    max-w-200rpx
                    rounded-lg
                    @click="previewImage(item.content)"
                    @load="() => {}"
                  />
                  <!-- 语音消息 -->
                  <view
                    v-else-if="item.type === 'voice'"
                    flex="~ items-center"
                    gap-2
                    rounded-lg
                    bg-primary
                    p-3
                    @click="handlePlayVoice(item)"
                  >
                    <Icon
                      :name="isPlaying(item.id!) ? 'pause-circle-line' : 'play-circle-line'"
                      icon-size="40rpx"
                      :icon-color="item.isMine ? '#fff' : '#000'"
                    />
                    <text text-sm text-white>
                      {{ getDurationText(item.fileDuration) }}
                    </text>
                  </view>

                  <!-- 文件消息 -->
                  <view v-else-if="item.type === 'file'" rounded-lg bg-primary p-3>
                    <view flex items-center gap-2>
                      <text i-file-text-fill text-lg text-white />
                      <view flex-1>
                        <text block truncate text-sm text-white>
                          {{ item.fileName || '未知文件' }}
                        </text>
                        <text text-xs text-white opacity-70>
                          {{ formatFileSize(item.fileSize) }}
                        </text>
                      </view>
                    </view>
                    <text mt-1 block text-xs text-white opacity-70>
                      点击下载
                    </text>
                  </view>
                </view>
              </view>

              <!-- 时间戳和已读状态 -->
              <view flex="~ items-center justify-end" mt-1 gap-2 text-xs text-gray-400>
                <text v-if="item.isMine" :class="item.isRead ? 'text-gray-400' : 'text-blue-500'">
                  {{ item.isRead ? '已读' : '未读' }}
                </text>
                <text v-if="item.timestamp">
                  {{ formatTime(item.timestamp) }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 语音播放器 -->

  <!-- 视频播放器 -->
  <wd-popup
    v-model="showVideoPlayer"

    custom-class="bg-transparent!"
    closable root-portal
    @close="closeVideoPlayer"
  >
    <view h-screen w-screen flex items-center justify-center bg-black>
      <video
        v-if="showVideoPlayer"
        :src="getCachedPath(currentVideoUrl)"
        autoplay
        controls
        h-500rpx
        max-h-full
        w-full
        @ended="closeVideoPlayer"
      />
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
.message-list {
  min-height: 100rpx;
  padding-bottom: 32rpx;

  // 确保图片显示正常
  image,
  video {
    display: block;
  }

  // 视频播放器样式
  video {
    object-fit: contain;
  }
}
</style>
