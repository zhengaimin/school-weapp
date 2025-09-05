// Types
export const SEARCH_TYPE = {
  CODE: 'studentCode',
  ID_CARD: 'idCard',
} as const

export type TSearchType = (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE]

// I18N
export const SEARCH_TYPE_I18N: Record<TSearchType, string> = {
  [SEARCH_TYPE.CODE]: '学号',
  [SEARCH_TYPE.ID_CARD]: '身份证号',
}

// Options
export const SEARCH_TYPE_OPTIONS = [
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.CODE], value: SEARCH_TYPE.CODE, maxLength: 6 },
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.ID_CARD], value: SEARCH_TYPE.ID_CARD, maxLength: 6 },
]
