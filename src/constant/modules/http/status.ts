export const HTTP_STATUS_CODES = {
  // 4xx 客户端错误
  400: '请求参数错误',
  401: '未授权访问',
  403: '禁止访问',
  404: '资源不存在',
  405: '方法不允许',
  408: '请求超时',
  409: '资源冲突',
  410: '资源已删除',
  413: '请求实体过大',
  414: '请求URI过长',
  415: '不支持的媒体类型',
  422: '请求参数无效',
  429: '请求过于频繁',

  // 5xx 服务器错误
  500: '服务器内部错误',
  501: '功能未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不支持',
} as const

export type THttpStatusCode = keyof typeof HTTP_STATUS_CODES

/**
 * 获取 HTTP 状态码对应的消息
 * @param code HTTP 状态码
 * @returns 对应的错误消息
 */
export function getHttpStatusMessage(code: THttpStatusCode | string | number): string {
  const statusCode = String(code)
  return (HTTP_STATUS_CODES as Record<string, string>)[statusCode] || '未知错误'
}

/**
 * 判断是否为已知的 HTTP 状态码
 * @param code HTTP 状态码
 * @returns 是否为已知状态码
 */
export function isKnownHttpStatusCode(code: THttpStatusCode | string | number): code is THttpStatusCode {
  const statusCode = String(code)
  return statusCode in HTTP_STATUS_CODES
}

/**
 * 判断是否为客户端错误 (4xx)
 * @param code HTTP 状态码
 * @returns 是否为客户端错误
 */
export function isClientError(code: number): boolean {
  return code >= 400 && code < 500
}

/**
 * 判断是否为服务器错误 (5xx)
 * @param code HTTP 状态码
 * @returns 是否为服务器错误
 */
export function isServerError(code: number): boolean {
  return code >= 500 && code < 600
}
