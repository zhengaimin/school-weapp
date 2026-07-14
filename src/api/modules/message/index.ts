import type { Message } from '@/api/interface/modules/message'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const MESSAGE_API = {
  MESSAGES: `${API}/messages`,
  MESSAGES_SEND: `${API}/messages/send`,
  MESSAGE_DETAIL: (id: number) => `/messages/${id}`,
  MESSAGES_READ: `${API}/messages/read`,
  MESSAGES_UNREAD_COUNT: '/messages/unread-count',
}

/**
 * @description 获取留言/对话列表
 * @param {Message.ReqGetMessagesApi} params
 * @returns {Promise<Message.ResGetConversationListApi | Message.ResGetMessageListApi>}
 */
export function getMessagesApi(params: Message.ReqGetMessagesApi) {
  return http.get<Message.ResGetMessageListApi>(MESSAGE_API.MESSAGES, params)
}

/**
 * @description 发送留言
 * @param {Message.ReqPostMessageApi} data
 * @returns {Promise<Message.ResPostMessageApi>}
 */
export function postMessageApi(data: Message.ReqPostMessageApi) {
  return http.post<Message.ResPostMessageApi>(MESSAGE_API.MESSAGES_SEND, data)
}

/**
 * @description 获取留言详情
 * @param {number} id 留言ID
 * @returns {Promise<Message.IMessageItemVo>}
 */
export function getMessageDetailApi(id: number) {
  return http.get<Message.IMessageItemVo>(MESSAGE_API.MESSAGE_DETAIL(id))
}

/**
 * @description 批量标记留言为已读
 * @param {Message.MarkAsReadReq} data
 * @returns {Promise<Message.SuccessResponse>}
 */
export function putReadMessagesApi(data: Message.MarkAsReadReq) {
  return http.put<Message.SuccessResponse>(MESSAGE_API.MESSAGES_READ, data)
}

/**
 * @description 获取未读留言总数
 * @returns {Promise<Message.ResGetUnreadCountApi>}
 */
export function getUnreadCountApi() {
  return http.get<Message.ResGetUnreadCountApi>(MESSAGE_API.MESSAGES_UNREAD_COUNT)
}
