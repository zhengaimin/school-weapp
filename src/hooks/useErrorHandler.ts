import type { TErrorCode } from '@/constant/modules'
import { getErrorMessage, isKnownErrorCode } from '@/constant/modules'
import { toast } from '@/utils/toast'

/**
 * 业务错误类型
 */
export interface BusinessError extends Error {
  /** 错误码 */
  code: TErrorCode | string | number
  /** 原始错误消息 */
  msg?: string
}

/**
 * 错误处理 Hook
 */
export function useErrorHandler() {
  /**
   * 处理业务错误
   * @param error 错误对象
   * @param showToast 是否显示错误提示，默认为 true
   * @returns 处理后的错误信息
   */
  function handleBusinessError(error: BusinessError | Error, showToast = true): string {
    let errorMessage = '系统错误，请稍后重试'

    if ('code' in error && error.code) {
      // 业务错误，使用错误码获取提示信息
      errorMessage = isKnownErrorCode(error.code)
        ? getErrorMessage(error.code)
        : error.msg || error.message || '请求失败'
    } else {
      // 普通错误
      errorMessage = error.message || '系统错误，请稍后重试'
    }

    if (showToast) {
      toast.show(errorMessage)
    }

    return errorMessage
  }

  /**
   * 处理网络错误
   * @param error 错误对象
   * @param showToast 是否显示错误提示，默认为 true
   * @returns 处理后的错误信息
   */
  function handleNetworkError(error: any, showToast = true): string {
    const errorMessage = error?.message || '网络错误，请检查网络连接'

    if (showToast) {
      toast.show(errorMessage)
    }

    return errorMessage
  }

  /**
   * 通用错误处理方法
   * @param error 错误对象
   * @param showToast 是否显示错误提示，默认为 true
   * @returns 处理后的错误信息
   */
  function handleError(error: any, showToast = true): string {
    console.error('错误处理:', error)

    // 判断错误类型
    if (error && typeof error === 'object' && 'code' in error) {
      return handleBusinessError(error as BusinessError, showToast)
    } else {
      // 网络错误或其他系统错误
      return handleNetworkError(error, showToast)
    }
  }

  /**
   * 从HTTP响应中提取错误信息
   * @param response HTTP响应对象
   * @param showToast 是否显示错误提示，默认为 true
   * @returns 处理后的错误信息
   */
  function handleHttpError(response: IResData<any>, showToast = true): string {
    const error: BusinessError = {
      name: 'BusinessError',
      message: response.msg || '请求失败',
      code: response.code,
      msg: response.msg,
    }

    return handleBusinessError(error, showToast)
  }

  return {
    handleBusinessError,
    handleNetworkError,
    handleError,
    handleHttpError,
  }
}
