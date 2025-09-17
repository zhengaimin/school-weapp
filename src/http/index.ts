import type { CustomRequestOptions } from '@/http/interceptor'
import { ERROR_CODES, getHttpStatusMessage, TOKEN_WHITE_LIST } from '@/constant/modules'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
// import { tokenManager } from './tokenManager'

// 原始的http请求函数（不带token检查）
function httpRequest<T>(options: CustomRequestOptions) {
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        const data = res.data as IResData<T>

        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.0 轻提示错误信息
          if (!options.hideErrorToast && data.code !== 0) {
            // 优先使用错误码对应的提示信息
            const errorCode = String(data.code)
            const errorMessage
              = (ERROR_CODES as Record<string, string>)[errorCode]
                || data.msg
                || '网络错误，请稍后重试'

            toast.info(errorMessage)
          }

          // 2.1 提取核心数据 res.data
          resolve(data)
        }
        else {
          // 接口级别错误 -> 使用 HTTP 状态码提示
          if (!options.hideErrorToast) {
            // 优先使用 HTTP 状态码对应的提示信息
            const httpStatusMessage = getHttpStatusMessage(res.statusCode)

            // 如果有对应的 HTTP 状态码提示，使用它；否则回退到业务错误码
            let errorMessage = httpStatusMessage
            if (httpStatusMessage === '未知错误') {
              const errorCode = String(data.code)
              errorMessage
                = (ERROR_CODES as Record<string, string>)[errorCode]
                  || data.msg
                  || '网络错误，请稍后重试'
            }

            toast.info(errorMessage)
          }

          // 特殊处理 401 错误
          if (res.statusCode === 401) {
            // 401错误 -> 清理用户信息，跳转到登录页
            // userStore.clearUserInfo()
            // uni.navigateTo({ url: '/pages/login/login' })
          }

          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

// 带token检查的http请求函数
export async function http<T>(options: CustomRequestOptions): Promise<IResData<T>> {
  const requestUrl = options.url || ''

  // 检查是否需要跳过token检查（如登录、刷新token等接口）
  const skipTokenCheck
    = TOKEN_WHITE_LIST.some(whiteUrl => requestUrl.includes(whiteUrl)) || options.skipTokenCheck

  if (!skipTokenCheck) {
    const userStore = useUserStore()
    // 确保token有效
    // const hasValidToken = await tokenManager.ensureValidToken()
    if (!userStore.token) {
      throw new Error(`Token无效，请重新登录, path: ${requestUrl}`)
    }
  }
  return httpRequest<T>(options)
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpGet<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    query,
    method: 'GET',
    header,
    ...options,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpPost<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    header,
    ...options,
  })
}
/**
 * PUT 请求
 */
export function httpPut<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    data,
    query,
    method: 'PUT',
    header,
    ...options,
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export function httpDelete<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    query,
    method: 'DELETE',
    header,
    ...options,
  })
}

http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete

// 支持与 alovaJS 类似的API调用
http.Get = httpGet
http.Post = httpPost
http.Put = httpPut
http.Delete = httpDelete

// 导出 token 管理器
// export { tokenManager } from './tokenManager'
