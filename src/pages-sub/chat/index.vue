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
// #region 导入
import { provide, watch } from 'vue'
import Page from '@/components/common/page/index.vue'
import ChatRefreshList from './components/ChatRefreshList.vue'
import MessageInput from './components/MessageInput.vue'
import MessageList from './components/MessageList.vue'
import { useChat } from './hooks/useChat'
import { voiceMessageDataKey } from './provide'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const {
  pageLoading,
  pageError,
  onLoginFail,
  onLoginSuccess,
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
  handleInputFocus,
  handleInputBlur,
  handleInputChange,
  handleKeyboardHeightChange,
  handleVoiceMessageSent,
} = useChat()

// #region 方法定义
// 处理点击消息列表区域时收起键盘
function handleHideKeyboard() {
  uni.hideKeyboard()
}
// #endregion
// #endregion

// #region provide
provide(voiceMessageDataKey, voiceMessageData)
// #endregion

// #region 监听
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
// #endregion
</script>

<template>
  <Page
    :title="studentName"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
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
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @input-change="handleInputChange"
      @keyboard-height-change="handleKeyboardHeightChange"
    />
  </Page>
</template>

<style scoped lang="scss"></style>
