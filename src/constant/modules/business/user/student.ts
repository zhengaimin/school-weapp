import type { IOption, TI18NMap } from '@/types'

// #region 学生搜索类型
// Types
export const SEARCH_TYPE = {
  CODE: 'studentCode',
  ID_CARD: 'idCard',
} as const

export type TSearchType = (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE]

// I18N
export const SEARCH_TYPE_I18N: TI18NMap<TSearchType> = {
  [SEARCH_TYPE.CODE]: '学号',
  [SEARCH_TYPE.ID_CARD]: '身份证号',
}

// Options
export const SEARCH_TYPE_OPTIONS: (IOption<TSearchType> & { maxLength: number })[] = [
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.CODE], value: SEARCH_TYPE.CODE, maxLength: 6 },
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.ID_CARD], value: SEARCH_TYPE.ID_CARD, maxLength: 6 },
]
// #endregion

// #region 人脸状态
// Types
export const FACE_STATUS = {
  NOT_COLLECTED: 0,
  COLLECTED: 1,
  AUDITING: 2,
  AUDIT_PASSED: 3,
  AUDIT_FAILED: 4,
} as const

export type TFaceStatus = (typeof FACE_STATUS)[keyof typeof FACE_STATUS]

// I18N
export const FACE_STATUS_I18N: TI18NMap<TFaceStatus> = {
  [FACE_STATUS.NOT_COLLECTED]: '未采集',
  [FACE_STATUS.COLLECTED]: '已采集',
  [FACE_STATUS.AUDITING]: '审核中',
  [FACE_STATUS.AUDIT_PASSED]: '审核通过',
  [FACE_STATUS.AUDIT_FAILED]: '审核失败',
}

// Options
export const FACE_STATUS_OPTIONS: IOption<TFaceStatus>[] = [
  { label: FACE_STATUS_I18N[FACE_STATUS.NOT_COLLECTED], value: FACE_STATUS.NOT_COLLECTED },
  { label: FACE_STATUS_I18N[FACE_STATUS.COLLECTED], value: FACE_STATUS.COLLECTED },
  { label: FACE_STATUS_I18N[FACE_STATUS.AUDITING], value: FACE_STATUS.AUDITING },
  { label: FACE_STATUS_I18N[FACE_STATUS.AUDIT_PASSED], value: FACE_STATUS.AUDIT_PASSED },
  { label: FACE_STATUS_I18N[FACE_STATUS.AUDIT_FAILED], value: FACE_STATUS.AUDIT_FAILED },
]
// #endregion
