import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useAppStore } from '@/store/app'
import { isH5, isMpWeixin } from '@/utils/platform'

export function usePage() {
  const appStore = useAppStore()
  const { navBarInfo } = storeToRefs(appStore)

  const pageLoading = ref(true)
  const pageError = ref('')

  const getContentHeight = (px: string = '0', { tabbar = false } = {}) => {
    const { navBarHeight } = unref(navBarInfo)

    let calc = `100vh - ${navBarHeight}px - ${px}`

    if (tabbar) {
      if (isH5) {
        calc += ' - 112rpx'
      }
      else if (isMpWeixin) {
        calc += ' - env(safe-area-inset-bottom)'
      }
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
    console.log('onLoginSuccess')
    pageLoading.value = false
    pageError.value = ''
  }

  return {
    pageLoading,
    pageError,

    getContentHeight,

    onLoginSuccess,
    onLoginFail,
  }
}
