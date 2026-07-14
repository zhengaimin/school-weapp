export const STATUS_TAB = {
  ACTIVE: 0,
  WAITING: 1,
  AVAILABLE: 2,
} as const

export type TStatusTab = (typeof STATUS_TAB)[keyof typeof STATUS_TAB]

export const STATUS_OPTIONS = [
  { label: '可购买', value: STATUS_TAB.AVAILABLE },
  { label: '生效中', value: STATUS_TAB.ACTIVE },
  { label: '待生效', value: STATUS_TAB.WAITING },
]
