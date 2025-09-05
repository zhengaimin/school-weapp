// #region 服务类型
// Types
export const SERVICE_TYPE = {
  MESSAGE: 'MESSAGE',
  CALL: 'CALL',
} as const

export type TServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE]

// I18N
export const SERVICE_TYPE_I18N: Record<TServiceType, string> = {
  [SERVICE_TYPE.MESSAGE]: '留言',
  [SERVICE_TYPE.CALL]: '通话',
}

// Options
export const SERVICE_TYPE_OPTIONS = [
  { label: SERVICE_TYPE_I18N[SERVICE_TYPE.MESSAGE], value: SERVICE_TYPE.MESSAGE },
  { label: SERVICE_TYPE_I18N[SERVICE_TYPE.CALL], value: SERVICE_TYPE.CALL },
]
// #endregion
