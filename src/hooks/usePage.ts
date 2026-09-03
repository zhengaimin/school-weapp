import { storeToRefs } from 'pinia'
import { ref, unref } from 'vue'

import { useAppStore } from '@/store/app'

import { getLastPage } from '@/utils/index'

export interface BatchRequestResult<T = { code?: number }> {
  allSuccess: boolean
  results: T[]
}

export type BatchRequest = Promise<{ code?: number }>
export type TBatchRequestList = BatchRequest[]

export function usePage() {
  const appStore = useAppStore()
  const { navBarInfo } = storeToRefs(appStore)
  const currentPage = getLastPage()

  const pageLoading = ref(true)
  const pageError = ref('')
  const pageLoaded = ref(false)

  const getContentHeight = (px: string = '0', { tabbar = false } = {}) => {
    const { navBarHeight } = unref(navBarInfo)

    // 100vh -> 页面视口高度，与 Page 组件的 h-screen 保持同一来源
    // iOS 微信在 onLaunch 时取到的 windowHeight 按默认导航栏计算，比页面视口小 状态栏+导航栏 的高度，不能用于定高
    // navBarHeight -> 顶部导航栏高度 | env(safe-area-inset-bottom) -> 底部安全区高度(小横条)
    let calc = `100vh - ${navBarHeight}px - env(safe-area-inset-bottom)`

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
    } catch (error) {
      console.error('Page loading API calls failed:', error)

      if (auto) {
        pageError.value = '网络异常，请稍后重试'
      }

      return { allSuccess: false, results: [] }
    } finally {
      pageLoading.value = false
      pageLoaded.value = true
    }
  }

  // #ifdef MP-WEIXIN
  // onShareAppMessage(() => {
  //   return {
  //     title: '鑫智生活',
  //     path: LAUNCH_PATH,
  //     // imageUrl: 'https://example.com/image.png', // 自定义分享图片
  //   }
  // })

  // onShareTimeline(() => {
  //   return {
  //     title: '鑫智生活',
  //     path: LAUNCH_PATH,
  //     // imageUrl: 'https://example.com/image.png', // 自定义分享图片
  //   }
  // })

  // wx.showShareMenu({
  //   withShareTicket: true,
  //   menus: ['shareAppMessage', 'shareTimeline'],
  // })
  // #endif

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
