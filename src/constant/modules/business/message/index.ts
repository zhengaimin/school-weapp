/**
 * @file 消息相关的常量
 */

// Types
export const FILE_TYPE = {
  /** 文本 */
  TEXT: 'text',
  /** 音频 */
  AUDIO: 'audio',
  /** 图片 */
  IMAGE: 'image',
  /** 视频 */
  VIDEO: 'video',
} as const

export type TFileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE]

// I18N
export const FILE_TYPE_I18N: Record<TFileType, string> = {
  [FILE_TYPE.TEXT]: '文本',
  [FILE_TYPE.AUDIO]: '语音',
  [FILE_TYPE.IMAGE]: '图片',
  [FILE_TYPE.VIDEO]: '视频',
}

// Options
export const FILE_TYPE_OPTIONS = [
  { label: FILE_TYPE_I18N[FILE_TYPE.TEXT], value: FILE_TYPE.TEXT },
  { label: FILE_TYPE_I18N[FILE_TYPE.AUDIO], value: FILE_TYPE.AUDIO },
  { label: FILE_TYPE_I18N[FILE_TYPE.IMAGE], value: FILE_TYPE.IMAGE },
  { label: FILE_TYPE_I18N[FILE_TYPE.VIDEO], value: FILE_TYPE.VIDEO },
]

// Types
export const MESSAGE_DIRECTION = {
  /** 学生到家长 */
  STUDENT_TO_GUARDIAN: 'STUDENT_TO_GUARDIAN',
  /** 家长到学生 */
  GUARDIAN_TO_STUDENT: 'GUARDIAN_TO_STUDENT',
} as const

export type TMessageDirection = (typeof MESSAGE_DIRECTION)[keyof typeof MESSAGE_DIRECTION]

// I18N
export const MESSAGE_DIRECTION_I18N: Record<TMessageDirection, string> = {
  [MESSAGE_DIRECTION.STUDENT_TO_GUARDIAN]: '学生发送',
  [MESSAGE_DIRECTION.GUARDIAN_TO_STUDENT]: '家长发送',
}

// Options
export const MESSAGE_DIRECTION_OPTIONS = [
  { label: MESSAGE_DIRECTION_I18N[MESSAGE_DIRECTION.STUDENT_TO_GUARDIAN], value: MESSAGE_DIRECTION.STUDENT_TO_GUARDIAN },
  { label: MESSAGE_DIRECTION_I18N[MESSAGE_DIRECTION.GUARDIAN_TO_STUDENT], value: MESSAGE_DIRECTION.GUARDIAN_TO_STUDENT },
]
