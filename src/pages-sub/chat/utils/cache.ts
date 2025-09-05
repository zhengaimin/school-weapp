import type { Message } from '@/api/interface/modules/message'

// 缓存相关常量
const CACHE_KEY_PREFIX = 'chat_messages_'
const MAX_CACHE_MESSAGES = 500 // 最多缓存500条消息

/**
 * 聊天消息缓存工具类
 */
export class MessageCache {
  /**
   * 从缓存获取消息
   * @param studentId 学生ID
   * @returns 缓存的消息列表
   */
  static getCachedMessages(studentId: number): Message.IMessageItemVo[] {
    try {
      const cached = uni.getStorageSync(`${CACHE_KEY_PREFIX}${studentId}`)
      if (cached && Array.isArray(cached)) {
        return cached
      }
    }
    catch (error) {
      console.error('获取缓存消息失败:', error)
    }
    return []
  }

  /**
   * 保存消息到缓存
   * @param studentId 学生ID
   * @param messageList 消息列表
   */
  static saveCachedMessages(studentId: number, messageList: Message.IMessageItemVo[]): void {
    try {
      // 限制缓存数量，保留最新的消息
      const messagesToCache = messageList.slice(-MAX_CACHE_MESSAGES)
      uni.setStorageSync(`${CACHE_KEY_PREFIX}${studentId}`, messagesToCache)
    }
    catch (error) {
      console.error('保存缓存消息失败:', error)
    }
  }

  /**
   * 清除指定学生的缓存消息
   * @param studentId 学生ID
   */
  static clearCachedMessages(studentId: number): void {
    try {
      uni.removeStorageSync(`${CACHE_KEY_PREFIX}${studentId}`)
    }
    catch (error) {
      console.error('清除缓存消息失败:', error)
    }
  }

  /**
   * 清除所有聊天缓存
   */
  static clearAllCachedMessages(): void {
    try {
      const storageInfo = uni.getStorageInfoSync()
      const keysToRemove = storageInfo.keys.filter(key =>
        key.startsWith(CACHE_KEY_PREFIX),
      )

      keysToRemove.forEach((key) => {
        uni.removeStorageSync(key)
      })
    }
    catch (error) {
      console.error('清除所有缓存消息失败:', error)
    }
  }

  /**
   * 获取缓存统计信息
   * @returns 缓存统计信息
   */
  static getCacheStats(): { studentCount: number, totalMessages: number } {
    try {
      const storageInfo = uni.getStorageInfoSync()
      const chatKeys = storageInfo.keys.filter(key =>
        key.startsWith(CACHE_KEY_PREFIX),
      )

      let totalMessages = 0
      chatKeys.forEach((key) => {
        const messages = uni.getStorageSync(key)
        if (Array.isArray(messages)) {
          totalMessages += messages.length
        }
      })

      return {
        studentCount: chatKeys.length,
        totalMessages,
      }
    }
    catch (error) {
      console.error('获取缓存统计失败:', error)
      return {
        studentCount: 0,
        totalMessages: 0,
      }
    }
  }

  /**
   * 添加单条消息到缓存
   * @param studentId 学生ID
   * @param message 新消息
   */
  static addMessageToCache(studentId: number, message: Message.IMessageItemVo): void {
    const cachedMessages = this.getCachedMessages(studentId)

    // 检查消息是否已存在，避免重复
    const existsIndex = cachedMessages.findIndex(m => m.id === message.id)
    if (existsIndex !== -1) {
      // 如果消息已存在，更新它
      cachedMessages[existsIndex] = message
    }
    else {
      // 如果消息不存在，添加到末尾
      cachedMessages.push(message)
    }

    this.saveCachedMessages(studentId, cachedMessages)
  }

  /**
   * 更新缓存中的消息状态
   * @param studentId 学生ID
   * @param messageId 消息ID
   * @param updates 要更新的字段
   */
  static updateMessageInCache(
    studentId: number,
    messageId: string | number,
    updates: Partial<Message.IMessageItemVo>,
  ): void {
    const cachedMessages = this.getCachedMessages(studentId)
    const messageIndex = cachedMessages.findIndex(m => m.id === messageId)

    if (messageIndex !== -1) {
      cachedMessages[messageIndex] = {
        ...cachedMessages[messageIndex],
        ...updates,
      }
      this.saveCachedMessages(studentId, cachedMessages)
    }
  }

  /**
   * 从缓存中删除消息
   * @param studentId 学生ID
   * @param messageId 消息ID
   */
  static removeMessageFromCache(studentId: number, messageId: string | number): void {
    const cachedMessages = this.getCachedMessages(studentId)
    const filteredMessages = cachedMessages.filter(m => m.id !== messageId)

    if (filteredMessages.length !== cachedMessages.length) {
      this.saveCachedMessages(studentId, filteredMessages)
    }
  }
}
