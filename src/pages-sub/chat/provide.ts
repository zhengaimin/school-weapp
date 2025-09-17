import type { InjectionKey, Ref } from 'vue'
import type { Message } from '@/api/interface/modules/message'

/** 语音消息数据 */
export const voiceMessageDataKey: InjectionKey<Ref<Message.IMessageItemVo | null>> = Symbol('voiceMessageData')
