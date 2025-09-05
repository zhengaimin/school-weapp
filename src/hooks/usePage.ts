import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useAppStore } from '@/store/app'

export interface BatchRequestResult<T = { code?: number }> {
  allSuccess: boolean
  results: T[]
}

export type BatchRequest = Promise<{ code?: number }>
export type TBatchRequestList = BatchRequest[]

export function usePage() {
  const appStore = useAppStore()
  const { navBarInfo } = storeToRefs(appStore)

  const pageLoading = ref(true)
  const pageError = ref('')
  const pageLoaded = ref(false)

  const getContentHeight = (px: string = '0', { tabbar = false } = {}) => {
    const { navBarHeight, windowHeight } = unref(navBarInfo)

    // navBarHeight -> 顶部导航栏高度 | env(safe-area-inset-bottom) -> 底部安全区高度(小横条)
    let calc = `${windowHeight} - ${navBarHeight}px - env(safe-area-inset-bottom)`

    if (px && px !== '0') {
      calc += ` - ${px}`
    }

    return {
      height: `calc(${calc})`,
      boxSizing: 'border-box',
    }
  }

  const onLoginFail = () => {
    pageLoading.value = false
    pageError.value = '网络异常，请稍后重试'
  }

  const onLoginSuccess = () => {
    pageLoading.value = false
    pageError.value = ''
    pageLoaded.value = true
  }

  const batchRequestHandler = async (
    apiCalls: TBatchRequestList,
    options: { auto?: boolean } = {},
  ): Promise<BatchRequestResult> => {
    const { auto = true } = options

    try {
      const res = await Promise.all(apiCalls)
      const allSuccess = res.every(item => item?.code === 0)

      if (auto) {
        pageError.value = allSuccess ? '' : '网络异常，请稍后重试'
      }

      return { allSuccess, results: res }
    }
    catch (error) {
      console.error('Page loading API calls failed:', error)

      if (auto) {
        pageError.value = '网络异常，请稍后重试'
      }

      return { allSuccess: false, results: [] }
    }
    finally {
      pageLoading.value = false
      pageLoaded.value = true
    }
  }

  return {
    pageLoading,
    pageError,
    pageLoaded,

    getContentHeight,

    onLoginSuccess,
    onLoginFail,

    batchRequestHandler,
  }
}
