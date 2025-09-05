// src/api/interface/modules/message.ts

import type { TFileType, TMessageDirection } from '@/constant/modules/message'

export namespace Message {
  /** 留言发送者信息 */
  export interface IMessageSenderVo {
    /** 发送方ID (可能是学生ID或家长用户ID) */
    id: number
    /** 发送方名称 */
    name: string
    /** 发送方头像URL */
    avatar: string
    /** 发送方类型: STUDENT, PARENT */
    type: 'STUDENT' | 'PARENT'
  }

  /** 单条留言信息 */
  export interface IMessageItemVo {
    /** 留言ID */
    id: number
    /** 留言内容 */
    content: string
    /** 文件URL */
    fileUrl: string
    /** 文件类型: text, audio, image, video */
    fileType: TFileType
    /** 文件时长（秒） */
    fileDuration: number
    /** 文件名 */
    fileName: string
    /** 文件大小（字节） */
    fileSize: number
    /** 是否已读（对接收方而言） */
    isRead: boolean
    /** 创建时间 */
    createdAt: string
    /** 阅读时间 */
    readAt: string | null
    /** 是否是当前用户（家长）自己发送的留言 */
    isSelf: boolean
    /** 消息方向 */
    messageDirection: TMessageDirection
    /** 优先级 */
    priority: number
    /** 状态 */
    status: number
    /** 标题 */
    title: string
    /** 监护人姓名 */
    guardianName: string
    /** 发送方ID */
    senderId: number
    /** 发送方姓名 */
    senderName: string
    /** 发送方头像URL */
    senderAvatar: string
    /** 接收方ID */
    receiverId: number
    /** 接收方姓名 */
    receiverName: string
    /** 接收方头像URL */
    receiverAvatar: string
    /** 发送者信息（兼容旧版本） */
    sender?: IMessageSenderVo
  }
  /** 获取留言/对话列表 - 请求 */
  export interface ReqGetMessagesApi {
    /** 学生ID，不传则获取对话列表 */
    studentId?: number
    /** 上次看到的最后一条留言ID，用于增量获取 */
    lastMessageId?: number
    /** 留言方向筛选: STUDENT_TO_GUARDIAN, GUARDIAN_TO_STUDENT */
    messageDirection?: TMessageDirection
    /** 是否已读筛选 */
    isRead?: boolean
    /** 文件类型筛选 */
    fileType?: TFileType
    /** 开始时间 */
    startTime?: string
    /** 结束时间 */
    endTime?: string
    /** 页码 */
    page?: number
    /** 每页数量 */
    pageSize?: number
  }

  /** 获取特定对话的留言列表 - 响应 */
  export interface ResGetMessageListApi {
    /** 总留言数 */
    total: number
    /** 当前页码 */
    page: number
    /** 每页数量 */
    pageSize: number
    /** 留言列表 */
    list: IMessageItemVo[]
  }

  /** 发送留言 - 请求 */
  export interface ReqPostMessageApi {
    /** 留言内容 */
    content: string
    /** 文件类型 */
    fileType?: TFileType
    /** 文件名 */
    fileName?: string
    /** 文件URL */
    fileUrl?: string
    /** 文件时长（秒），语音或视频时需要 */
    fileDuration?: number
  }

  /** 发送留言 - 响应 */
  export interface ResPostMessageApi {
    /** 留言内容 */
    content: string
    /** 文件时长（秒） */
    fileDuration?: number
    /** 文件名 */
    fileName?: string
    /** 文件类型 */
    fileType?: TFileType
    /** 文件URL */
    fileUrl?: string
    /** 学生ID */
    studentId: number
    [property: string]: any
  }

  /** 批量标记留言为已读 - 请求 */
  export interface ReqPutReadApi {
    /** 学生ID，标记与该学生的所有留言为已读 */
    studentId?: number
    /** 留言ID列表，标记指定留言为已读 */
    messageIds?: number[]
  }

  /** 获取未读留言总数 - 响应 */
  export interface ResGetUnreadCountApi {
    /** 所有对话的未读留言总数 */
    totalUnreadCount: number
  }
  // 批量标记留言为已读 - 请求
  export interface MarkAsReadReq {
    studentId?: number // 标记与某学生的所有对话留言
    messageIds?: number[] // 标记指定的留言
  }

  // 操作成功的标准响应
  export interface SuccessResponse {
    message: string // 操作结果信息
  }
}
