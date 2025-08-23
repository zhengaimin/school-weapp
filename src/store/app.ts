import { defineStore } from 'pinia'
import { ref } from 'vue'

import { isMpWeixin } from '@/utils/platform'

interface INavBarInfo {
  statusBarHeight: number
  navBarHeight: number
  top: number
  width: number
  menuBottom: number
  menuRight: number
  menuHeight: number
  title?: string
  className?: string
}

export const useAppStore = defineStore(
  'app',
  () => {
    const navBarInfo = ref<INavBarInfo>(null)

    /** 初始化导航栏信息 */
    const initNavBarInfo = () => {
      if (!isMpWeixin) {
        navBarInfo.value = {
          menuBottom: 0,
          menuHeight: 56,
          menuRight: 16,
          navBarHeight: 56,
          statusBarHeight: 0,
          top: 0,
          width: 0,
        }
        return null
      }

      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const { statusBarHeight } = uni.getWindowInfo()
      const { screenWidth } = uni.getWindowInfo()
      const { top, height, right, width } = menuButtonInfo

      // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
      const navBarHeight = (top - statusBarHeight) * 2 + height + statusBarHeight

      navBarInfo.value = {
        statusBarHeight,
        navBarHeight,
        top,
        width,
        menuBottom: top - statusBarHeight,
        menuRight: screenWidth - right,
        menuHeight: height,
      }
    }

    return {
      navBarInfo,

      initNavBarInfo,
    }
  },
  {
    persist: true,
  },
)
