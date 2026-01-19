import type ChatRefreshList from '../components/ChatRefreshList.vue'
import type { MessageSendConfig } from '../components/MessageInput.vue'
import type MessageInput from '../components/MessageInput.vue'
import type { IMessage } from '../components/MessageList.vue'
import type { Message } from '@/api/interface/modules/message'
// #region 导入
import { storeToRefs } from 'pinia'
import { computed, nextTick, reactive, ref } from 'vue'
import { getMessagesApi, postMessageApi, putReadMessagesApi } from '@/api/modules/message'
import { usePage } from '@/hooks/usePage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { isNumber } from '@/utils/is'
import { MessageCache } from '../utils/cache'
// #endregion

export function useChat() {
  // #region 使用 Hooks
  const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
  // #endregion

  // #region 使用 Store
  const currentStudentStore = useCurrentStudentStore()
  const { studentInfo } = storeToRefs(currentStudentStore)
  // #endregion

  // #region 定义响应式数据
  const voiceMessageData = ref<Message.IMessageItemVo | null>(null)

  // 扩展 API 消息类型以包含前端状态
  type ChatMessage = Message.IMessageItemVo & { _status?: 'sending' | 'sent' | 'failed' }

  const inputRef = ref<InstanceType<typeof MessageInput>>()
  const chatRefreshListRef = ref<InstanceType<typeof ChatRefreshList>>()
  const isInputFocused = ref<boolean>(false)
  const inputHeight = ref<string>('100rpx') // 输入框高度
  const keyboardHeight = ref<number>(0) // 键盘高度
  const isKeyboardShow = ref<boolean>(false) // 键盘是否显示

  // 消息列表相关状态
  const messages = ref<ChatMessage[]>([])
  const listLoading = ref<boolean>(false)
  const listLoaded = ref<boolean>(false)

  // API 请求参数
  interface IQueryParams {
    page: 1
    pageSize: number
    loadMoreMessages: boolean // 是否为加载更多
    lastMessageId?: number | string
  }
  const queryParams = reactive<IQueryParams>({
    page: 1,
    pageSize: 10,
    loadMoreMessages: false,
  })

  // 消息输入框配置
  const sendConfig: MessageSendConfig = {
    canSendText: true,
    maxTextLength: 1000,
  }
  // #endregion

  // #region 定义计算属性
  // 当前学生信息
  const studentName = computed(() => studentInfo.value?.studentName || '聊天')
  const studentId = computed(() => studentInfo.value?.studentId)

  /** 内容区域样式 */
  const contentStyle = computed(() => {
    return getContentHeight(inputHeight.value)
  })

  /** 转换给 MessageList 组件的消息 */
  const messagesForComponent = computed(() => {
    return messages.value.map(transformApiMessageToComponentMessage)
  })
  // #endregion

  // #region 接口请求函数
  /**
   * @description 加载初始消息 (缓存 + API)
   */
  async function axiosLoadInitialMessages(): Promise<{ code: number, data?: any, error?: any }> {
    if (!studentId.value) {
      return { code: -1 }
    }

    queryParams.loadMoreMessages = false
    listLoading.value = true

    // 1. 从缓存加载消息
    const cachedMessages = getCachedMessages(studentId.value)
    if (cachedMessages.length > 0) {
      messages.value = cachedMessages
      scrollToBottom()
      pageLoading.value = false // 有缓存，不显示整页加载
    }
    else {
      pageLoading.value = true // 无缓存，显示整页加载
    }

    try {
      // 2. 同时从接口加载最新消息
      const result = await getMessagesApi({ ...queryParams, lastMessageId: undefined })

      if (result.code === 0 && result.data) {
        const data = result.data

        // 验证接口返回数据结构
        if ('list' in data && Array.isArray(data.list) && 'total' in data) {
          const apiMessages = data.list

          console.log(apiMessages, messages.value)
          // 3. 合并、去重和排序
          messages.value = mergeAndSortMessages(apiMessages, messages.value)
          console.log(messages.value)

          await nextTick()
          scrollToBottom()

          listLoaded.value = messages.value.length >= data.total

          // 4. 标记未读消息为已读
          await markMessagesAsRead(apiMessages)

          // 5. 保存最新消息到缓存
          saveCachedMessages(studentId.value, messages.value)
        }
      }
      return result
    }
    catch (error) {
      console.error('加载初始消息失败:', error)
      listLoaded.value = true // 即使接口失败，也要确保 loaded 状态为 true，防止无限上拉
      return { code: -1, error }
    }
    finally {
      listLoading.value = false
      pageLoading.value = false
    }
  }

  /**
   * @description 加载更多历史消息
   */
  async function axiosLoadMoreMessages(): Promise<void> {
    if (listLoading.value || listLoaded.value || !studentId.value) {
      return
    }

    queryParams.loadMoreMessages = true
    listLoading.value = true

    const oldFirstMessageId = messages.value[0]?.id

    try {
      const res = await getMessagesApi({
        ...queryParams,
        lastMessageId: Number(oldFirstMessageId),
      })

      if (res.code === 0 && res.data) {
        const data = res.data
        // 验证接口返回数据结构
        if ('list' in data && Array.isArray(data.list) && 'total' in data) {
          const newMessages = data.list

          // 合并并处理重复消息
          messages.value = mergeAndSortMessages(newMessages, messages.value)
          listLoaded.value = messages.value.length >= data.total

          // 标记未读消息为已读
          await markMessagesAsRead(newMessages)

          // 更新缓存
          saveCachedMessages(studentId.value, messages.value)

          // 滚动到之前的第一条消息位置，保持视图稳定
          if (oldFirstMessageId) {
            await nextTick()
            chatRefreshListRef.value?.scrollTo(`message-${oldFirstMessageId}`)
          }
        }
      }
    }
    catch (error) {
      console.error('加载更多消息失败:', error)
      queryParams.loadMoreMessages = false
    }
    finally {
      listLoading.value = false
    }
  }

  /**
   * @description 标记未读消息为已读
   * @param messages - 消息列表
   */
  async function markMessagesAsRead(messages: Message.IMessageItemVo[]) {
    if (!studentId.value) {
      return
    }

    // 筛选出未读的消息 ID
    const unreadMessageIds = messages
      .filter(msg => !msg.isRead && !msg.isSelf) // 过滤掉自己发送的消息
      .map(msg => msg.id)

    if (unreadMessageIds.length === 0) {
      return
    }

    try {
      // 批量标记为已读
      await putReadMessagesApi({
        messageIds: unreadMessageIds,
      })

      // 更新本地消息状态为已读
      messages.forEach((msg) => {
        if (unreadMessageIds.includes(msg.id)) {
          msg.isRead = true
          msg.readAt = new Date().toISOString()
        }
      })

      // 更新缓存
      saveCachedMessages(studentId.value, messages as ChatMessage[])
    }
    catch (error) {
      console.error('标记消息为已读失败:', error)
    }
  }
  // #endregion

  // #region 方法定义
  /**
   * @description 从缓存获取消息
   * @param studentId - 学生ID
   * @returns 消息列表
   */
  function getCachedMessages(studentId: number): Message.IMessageItemVo[] {
    const cachedMessages = MessageCache.getCachedMessages(studentId) as Message.IMessageItemVo[]
    return cachedMessages || []
  }

  /**
   * @description 保存消息到缓存
   * @param studentId - 学生ID
   * @param messageList - 消息列表
   */
  function saveCachedMessages(studentId: number, messageList: ChatMessage[]) {
    // 移除前端状态字段，只缓存标准 API V_o
    const messageListForCache = messageList.map((msg) => {
      const { _status, ...rest } = msg
      return rest as Message.IMessageItemVo
    })
    MessageCache.saveCachedMessages(studentId, messageListForCache)
  }

  /**
   * @description 将API返回的消息数据转换为组件所需的消息格式
   * @param apiMessage - API返回的单个消息对象
   * @returns 组件所需的IMessage格式对象
   */
  function transformApiMessageToComponentMessage(apiMessage: Message.IMessageItemVo): IMessage {
    if (!apiMessage || typeof apiMessage !== 'object') {
      throw new Error('Invalid API message object')
    }

    let messageType: IMessage['type'] = 'text'
    const validTypes: Array<IMessage['type']> = ['text', 'image', 'video', 'gif', 'file']
    if (apiMessage.fileType === 'audio') {
      messageType = 'voice'
    }
    else if (validTypes.includes(apiMessage.fileType as any)) {
      messageType = apiMessage.fileType as IMessage['type']
    }

    return {
      id: apiMessage.id,
      type: messageType,
      content: apiMessage.content || apiMessage.fileUrl || '',
      isMine: Boolean(apiMessage.isSelf),
      avatar: apiMessage?.sender?.avatar || apiMessage.senderAvatar || '',
      username: apiMessage?.sender?.name || apiMessage.senderName || '',
      timestamp: apiMessage.createdAt || new Date().toISOString(),
      status: (apiMessage as ChatMessage)._status || 'sent',
      fileDuration: apiMessage.fileDuration,
      isRead: apiMessage.isRead,
    }
  }

  /**
   * @description 合并两个消息数组，去重并按时间排序
   * @param listA - 消息数组A
   * @param listB - 消息数组B (可选)
   * @returns 处理后的消息数组
   */
  function mergeAndSortMessages(
    apiMessages: ChatMessage[],
    localMessages?: ChatMessage[],
  ): ChatMessage[] {
    if (!Array.isArray(apiMessages)) {
      throw new TypeError('apiMessages must be an array')
    }

    let allMessages: ChatMessage[] = []

    // 如果只传入接口数据，直接返回
    if (!localMessages || localMessages.length === 0) {
      allMessages = [...apiMessages]
    }
    else {
      if (!Array.isArray(localMessages)) {
        throw new TypeError('localMessages must be an array')
      }

      // 合并并去重，接口有的用接口的，接口没有的才用本地的
      const messageMap = new Map<string | number, ChatMessage>()

      // 首先添加本地数据
      localMessages.forEach((message) => {
        if (message && message.id) {
          messageMap.set(message.id, message)
        }
      })

      // 然后用接口数据覆盖已存在的消息
      apiMessages.forEach((message) => {
        if (message && message.id) {
          messageMap.set(message.id, message)
        }
      })

      allMessages = Array.from(messageMap.values())
    }

    // 按时间戳排序 (从旧到新)
    return allMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }

  /**
   * @description 滚动到消息列表底部
   */
  async function scrollToBottom() {
    await nextTick()
    if (messages.value.length > 0) {
      chatRefreshListRef.value?.scrollToBottom()
    }
  }
  // #endregion

  // #region 事件处理函数
  /**
   * @description 处理发送文本消息事件
   * @param content - 文本内容
   */
  async function handleSendText(content: string): Promise<void> {
    if (!studentId.value) {
      return
    }

    const tempId = Date.now()
    const newMessage: ChatMessage = {
      id: tempId,
      content,
      fileType: 'text',
      isSelf: true,
      senderName: '我',
      senderAvatar: '', // TODO: 获取当前用户头像
      createdAt: new Date().toISOString(),
      _status: 'sending',
    } as ChatMessage

    messages.value.push(newMessage)
    scrollToBottom()

    // 立即更新缓存（包含发送中的消息）
    saveCachedMessages(studentId.value, messages.value)

    try {
      const res = await postMessageApi({
        content,
        fileType: 'text',
      })

      // 更新消息状态和ID
      const sentMessage = messages.value.find(m => m.id === tempId)
      if (sentMessage) {
        Object.assign(sentMessage, res.data) // 使用API返回的数据更新消息
        sentMessage.id = res.data.messageId
        sentMessage._status = 'sent'

        saveCachedMessages(studentId.value, messages.value)
      }

      // 发送成功后收起键盘
      uni.hideKeyboard()
    }
    catch (error) {
      const failedMessage = messages.value.find(m => m.id === tempId)
      if (failedMessage) {
        failedMessage._status = 'failed'
        saveCachedMessages(studentId.value, messages.value) // 更新缓存为失败状态
      }
    }
  }

  /**
   * @description 处理重新发送消息事件
   * @param messageId - 消息ID
   */
  async function handleResendMessage(messageId: string | number): Promise<void> {
    if (!studentId.value) {
      return
    }

    const failedMessage = messages.value.find(m => m.id === messageId)
    if (!failedMessage || failedMessage._status !== 'failed') {
      return
    }

    failedMessage._status = 'sending'

    try {
      let apiFileType: 'text' | 'audio' | 'image' | 'video' = 'text'
      apiFileType = failedMessage.fileType

      const res = await postMessageApi({
        content: failedMessage.content,
        fileType: apiFileType,
      })

      // 更新消息状态和ID
      Object.assign(failedMessage, res.data)
      failedMessage.id = res.data.messageId
      failedMessage._status = 'sent'
      saveCachedMessages(studentId.value, messages.value)
    }
    catch (error) {
      failedMessage._status = 'failed' // 重发失败，状态回到失败
      saveCachedMessages(studentId.value, messages.value)
      uni.showToast({ title: '重新发送失败', icon: 'none' })
    }
  }

  /**
   * @description 处理输入框获取焦点事件
   */
  function handleInputFocus() {
    isInputFocused.value = true
    scrollToBottom()
  }

  /**
   * @description 处理输入框失去焦点事件
   */
  function handleInputBlur() {
    isInputFocused.value = false
  }

  /**
   * @description 处理键盘高度变化事件
   * @param height - 键盘高度
   * @param isShow - 键盘是否显示
   */
  function handleKeyboardHeightChange(height: number, isShow: boolean) {
    keyboardHeight.value = height
    isKeyboardShow.value = isShow

    // 键盘状态变化后，调整布局并滚动到底部
    setTimeout(
      () => {
        scrollToBottom()
      },
      isShow ? 300 : 0,
    )
  }

  /**
   * @description 处理输入框内容或高度变化事件
   */
  async function handleInputChange(height) {
    if (isNumber(height)) {
      inputHeight.value = `${height}px` // 更新输入框高度
      scrollToBottom() // 触发滚动
    }
  }

  /**
   * @description 处理语音消息发送成功事件
   * @param messageData - 语音消息数据
   */
  async function handleVoiceMessageSent(messageData: Message.IMessageItemVo) {
    if (!studentId.value) {
      return
    }

    // 添加消息到消息队列
    const newMessage: ChatMessage = {
      ...messageData,
      _status: 'sent', // 标记为已发送状态
      senderId: userStore.userInfo?.userId || 0, // 设置发送方ID为当前用户ID
      receiverId: studentId.value, // 设置接收方ID为当前学生ID
      senderName: userStore.userInfo?.userName || '我', // 设置发送方姓名
      senderAvatar: userStore.userInfo?.wechatInfo?.avatarUrl || '', // 设置发送方头像
      receiverName: studentInfo.value.studentName, // 设置接收方姓名
      receiverAvatar: studentInfo.value.faceImageUrl || '', // 设置接收方头像
    }

    // 添加到消息列表
    messages.value.push(newMessage)

    // 滚动到底部
    scrollToBottom()

    // 更新缓存
    saveCachedMessages(studentId.value, messages.value)
  }
  // #endregion

  // #region 生命周期钩子
  /**
   * @description 登录成功后的初始化加载
   */
  async function onLoginSuccess() {
    batchRequestHandler([axiosLoadInitialMessages()])
  }
  // #endregion

  return {
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
  }
}
