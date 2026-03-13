<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "聊天"
  }
}
</route>

<script lang="ts" setup>
import { provide, watch } from 'vue'
import Page from '@/components/common/page/index.vue'
import ChatRefreshList from './components/ChatRefreshList.vue'
import MessageInput from './components/MessageInput.vue'
import MessageList from './components/MessageList.vue'
import { useChat } from './hooks/useChat'
import { VOICE_MESSAGE_DATA_KEY } from './provide'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const {
  pageLoading,
  pageError,
  handleLoginFail,
  handleLoginSuccess,
  studentName,
  listLoading,
  listLoaded,
  contentStyle,
  keyboardHeight,
  isKeyboardShow,
  inputHeight,
  messagesForComponent,
  sendConfig,
  inputRef,
  chatRefreshListRef,
  voiceMessageData,
  axiosLoadMoreMessages,
  handleResendMessage,
  handleSendText,
  handleSendMedia,
  handleInputFocus,
  handleInputBlur,
  handleInputChange,
  handleKeyboardHeightChange,
  handleVoiceMessageSent,
} = useChat()

// 处理点击消息列表区域时收起键盘
function handleHideKeyboard() {
  uni.hideKeyboard()
}

provide(VOICE_MESSAGE_DATA_KEY, voiceMessageData)

/**
 * @description 监听录音消息数据变化
 */
watch(
  voiceMessageData,
  (newMessageData) => {
    if (newMessageData) {
      handleVoiceMessageSent(newMessageData)
      // 重置数据，避免重复处理
      voiceMessageData.value = null
    }
  },
  { deep: true },
)
</script>

<template>
  <Page
    :title="studentName"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="handleLoginSuccess"
    @login:fail="handleLoginFail"
  >
    <!-- 聊天消息列表 -->
    <ChatRefreshList
      ref="chatRefreshListRef"
      :loading="listLoading"
      :loaded="listLoaded"
      :style="contentStyle"
      :keyboard-height="keyboardHeight"
      :is-keyboard-show="isKeyboardShow"
      :input-base-height="inputHeight"
      @load-more="axiosLoadMoreMessages"
    >
      <MessageList :messages="messagesForComponent" @resend="handleResendMessage" @click="handleHideKeyboard" />
    </ChatRefreshList>

    <!-- 消息输入组件 -->
    <MessageInput
      ref="inputRef"
      :config="sendConfig"
      @send-text="handleSendText"
      @send-media="handleSendMedia"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @input-change="handleInputChange"
      @keyboard-height-change="handleKeyboardHeightChange"
    />
  </Page>
</template>

<style scoped lang="scss"></style>
