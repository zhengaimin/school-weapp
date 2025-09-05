import type { Message } from '@/api/interface/modules/message'
import type { InjectionKey, Ref } from 'vue'

/** 语音消息数据 */
export const voiceMessageDataKey: InjectionKey<Ref<Message.IMessageItemVo | null>> = Symbol('voiceMessageData')