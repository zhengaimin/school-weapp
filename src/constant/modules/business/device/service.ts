import type { TI18NMap, TOptions } from '@/types'

// Types
export const SERVICE_TYPE = {
  MESSAGE: 'MESSAGE',
  CALL: 'CALL',
  DRYER: 'DRYER',
} as const

export type TServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE]

// I18N
export const SERVICE_TYPE_I18N: TI18NMap<TServiceType> = {
  [SERVICE_TYPE.MESSAGE]: '留言',
  [SERVICE_TYPE.CALL]: '通话',
  [SERVICE_TYPE.DRYER]: '吹风机',
}

// Options
export const SERVICE_TYPE_OPTIONS: TOptions<TServiceType> = [
  { label: SERVICE_TYPE_I18N[SERVICE_TYPE.MESSAGE], value: SERVICE_TYPE.MESSAGE },
  { label: SERVICE_TYPE_I18N[SERVICE_TYPE.CALL], value: SERVICE_TYPE.CALL },
  { label: SERVICE_TYPE_I18N[SERVICE_TYPE.DRYER], value: SERVICE_TYPE.DRYER },
]
