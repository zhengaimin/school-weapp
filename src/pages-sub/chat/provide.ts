import type { InjectionKey, Ref } from 'vue'
import type { Message } from '@/api/interface/modules/message'

/** 语音消息数据 */
export const VOICE_MESSAGE_DATA_KEY: InjectionKey<Ref<Message.IMessageItemVo | null>> = Symbol('voiceMessageData')
