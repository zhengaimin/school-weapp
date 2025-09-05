<script setup lang="ts">
import type { Message } from '@/api/interface/modules/message'
import { computed, getCurrentInstance, inject, nextTick, provide, ref, watch } from 'vue'
import Icon from '@/components/icon/index.vue'
import { boundingClientRect } from '@/utils/dom'
import VoiceInput from './VoiceInput.vue'

// 定义消息发送配置接口
export interface MessageSendConfig {
  canSendText: boolean
  maxTextLength: number
}

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

// 定义组件props
const props = withDefaults(
  defineProps<{
    config?: Partial<MessageSendConfig>
  }>(),
  {
    config: () => ({
      canSendText: true,
      maxTextLength: 60,
    }),
  },
)

// 定义事件
const emit = defineEmits<{
  sendText: [content: string]
  sendVoice: [filePath: string, duration: number]
  focus: []
  blur: []
  inputChange: [height: number]
  keyboardHeightChange: [height: number, isShow: boolean]
}>()

const instance = getCurrentInstance()

// 键盘高度和显示状态
const keyboardHeight = ref(0)
const isKeyboardShow = ref(false)

// 注入录音消息数据
const voiceMessageDataFromChild = inject<Ref<Message.IMessageItemVo | null>>('voiceMessageData', ref(null))

// 注入滚动到底部方法
const scrollToBottom = inject<() => void>('scrollToBottom', () => {})

// 提供录音消息数据给父组件
const voiceMessageDataToParent = ref<Message.IMessageItemVo | null>(null)
provide('voiceMessageDataToParent', voiceMessageDataToParent)

const inputValue = ref('')

// 语音输入相关状态
const isVoiceMode = ref(false) // 是否为语音输入模式

// 语音输入组件引用
const voiceInputRef = ref<InstanceType<typeof VoiceInput> | null>(null)

// 发送按钮是否禁用
const isSendButtonDisabled = computed(() => {
  return !inputValue.value.trim()
})

// 发送文本消息
function sendTextMessage() {
  if (isSendButtonDisabled.value)
    return

  const content = inputValue.value.trim()
  if (!content) {
    uni.showToast({ title: '消息内容不能为空', icon: 'none' })
    return
  }

  if (content.length > props.config.maxTextLength) {
    uni.showToast({
      title: `消息长度不能超过${props.config.maxTextLength}个字符`,
      icon: 'none',
    })
    return
  }

  emit('sendText', content)
  inputValue.value = ''
}

// 监听输入内容变化
async function handleInput() {
  await nextTick()
  const rect: any = await boundingClientRect('.input-area', instance)

  if (rect && rect.height)
    emit('inputChange', rect.height)
}

// 处理键盘高度变化
function handleKeyboardHeightChange(event: { detail: { height: number } }) {
  const height = event?.detail?.height
  keyboardHeight.value = height
  isKeyboardShow.value = height > 0
  emit('keyboardHeightChange', height, height > 0)
}

// 监听键盘收起事件（适用于小程序）
function handleKeyboardHide() {
  keyboardHeight.value = 0
  isKeyboardShow.value = false
  emit('keyboardHeightChange', 0, false)
}

// 切换输入模式
function handleToggleInputMode() {
  if (!isVoiceMode.value) {
    // 检查是否支持录音功能
    if (!uni.getRecorderManager) {
      uni.showToast({
        title: '当前环境不支持录音功能',
        icon: 'none',
      })
      return
    }
  }

  isVoiceMode.value = !isVoiceMode.value

  if (isVoiceMode.value) {
    // 切换到语音模式，隐藏键盘
    uni.hideKeyboard()
  }
  else {
    // 切换到文本模式时，如果正在录音，停止录音
    if (voiceInputRef.value) {
      voiceInputRef.value.stopRecording()
    }
    scrollToBottom()
  }
}

// 处理语音发送
function handleSendVoice(filePath: string, duration: number) {
  emit('sendVoice', filePath, duration)
}

// 监听子组件的录音消息数据变化
watch(voiceMessageDataFromChild, (newMessageData) => {
  if (newMessageData) {
    // 将数据传递给父组件
    voiceMessageDataToParent.value = newMessageData
    // 重置子组件的数据
    voiceMessageDataFromChild.value = null
  }
}, { deep: true })
</script>

<template>
  <view
    ref="containerRef"
    class="message-input-container"
    :class="{ 'keyboard-show': isKeyboardShow }"
    bg="white"
    border-t="bg-muted solid"
    position="fixed"
    :style="{ bottom: isKeyboardShow ? `${keyboardHeight}px` : '0' }"
    left="0"
    right="0"
    z="1000"
  >
    <!-- 输入区域 -->
    <view class="input-area" p="x-3 y-2" flex="~ items-center" gap="3">
      <!-- 语音/文本切换按钮 -->
      <view class="mode-switch" flex="shrink-0">
        <view
          class="mode-btn"
          flex="~ items-center justify-center"
          h-64rpx
          w-64rpx
          rounded-md
          bg-gray-100
          @click="handleToggleInputMode"
        >
          <Icon
            :name="isVoiceMode ? 'keyboard-line' : 'voiceprint-line'"
            icon-color="#666666"
            icon-size="40rpx"
          />
        </view>
      </view>

      <!-- 文本输入框 -->
      <scroll-view
        v-if="!isVoiceMode"
        class="input-wrapper"
        style=""
        flex="1"
        scroll-y
        relative
        max-h-400rpx
        rounded-md
        bg-gray-100
      >
        <view p="x-2" flex="~ items-center" min-h-64rpx overflow-hidden rounded-lg>
          <wd-textarea
            v-model="inputValue"
            size="small"
            placeholder="输入消息..."
            auto-height
            custom-class="w-full"
            :show-confirm-bar="false"
            :disabled="!config.canSendText"
            :maxlength="config.maxTextLength"
            :show-word-limit="false"
            :adjust-position="true"
            :hold-keyboard="true"
            @input="handleInput"
            @focus="emit('focus')"
            @blur="emit('blur')"
            @keyboardheightchange="handleKeyboardHeightChange"
            @confirm="sendTextMessage"
          />
        </view>
      </scroll-view>

      <!-- 语音录音按钮 -->
      <VoiceInput v-else ref="voiceInputRef" style="width: 100%;" @send-voice="handleSendVoice" />

      <!-- 发送按钮 -->
      <view v-if="!isVoiceMode" class="action-button" h-64rpx flex="shrink-0">
        <wd-button
          type="primary"
          size="small"
          custom-class="send-btn"
          :disabled="isSendButtonDisabled"
          @click="sendTextMessage"
        >
          发送
        </wd-button>
      </view>
    </view>

    <view style="height: env(safe-area-inset-bottom)"></view>

    <!-- 监听键盘收起 -->
    <!-- #ifdef APP-PLUS || H5 -->
    <view v-if="isKeyboardShow" class="keyboard-overlay" @tap="handleKeyboardHide"></view>
    <!-- #endif -->
  </view>
</template>

<style scoped lang="scss">
.message-input-container {
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
  transition: bottom 0.3s ease;

  &.keyboard-show {
    // 键盘弹出时添加特殊样式
    border-top-color: rgba(0, 0, 0, 0.1);
  }

  :deep(.wd-textarea) {
    @apply bg-transparent!;

    &::after {
      content: none !important;
    }

    .wd-textarea__value {
      @apply bg-transparent!;
    }
  }

  :deep(.send-btn) {
    height: 64rpx !important;
    border-radius: 12rpx !important;

    .wd-button__text {
      font-size: 28rpx;
    }
  }
}

.keyboard-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 999;
}

// 语音输入相关样式
.mode-btn {
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
