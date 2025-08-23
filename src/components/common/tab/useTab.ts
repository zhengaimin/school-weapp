import { getCurrentInstance, ref } from 'vue'

import { useAppStore } from '@/store/app'

import { isMpWeixin } from '@/utils/platform'

export interface ITabPosition {
  value: string | number
  left: number
  preLeft: number
  width: number
}

// 定义 tab 项的类型
export interface ITabItem {
  label: string
  value: string | number
}

export function useTab() {
  const instance = getCurrentInstance()
  const appStore = useAppStore()

  const tabPositions = ref<ITabPosition[]>([])
  // 是否已经初始化位置信息
  const positionsInitialized = ref(false)

  // 初始化所有tab的位置信息
  function initTabPositions(tabs: ITabItem[]) {
    if (tabs.length === 0)
      return

    // 重置状态
    positionsInitialized.value = false
    tabPositions.value = []

    // 延迟执行，确保DOM完全渲染
    setTimeout(async () => {
      let query = uni.createSelectorQuery()

      // 在微信小程序中，需要指定组件实例上下文
      if (isMpWeixin && instance) {
        query = query.in(instance)
      }

      // 先添加scroll-view查询
      query.select('.tabs-scroll-view').boundingClientRect()

      // 再添加所有tab的查询
      tabs.forEach((tab) => {
        query.select(`#tab-${tab.value}`).boundingClientRect()
      })

      // 一次性执行所有查询
      query.exec((results) => {
        const scrollViewRect = results[0]

        if (!results || results.length < tabs.length + 1) {
          return
        }
        if (!scrollViewRect || Array.isArray(scrollViewRect)) {
          return
        }

        const baseLeft = scrollViewRect.left
        const positions: ITabPosition[] = []
        let prevTabWidth = 0 // 记录前一个tab的宽度

        // 处理每个tab的结果（从第二个结果开始）
        for (let i = 1; i < results.length; i++) {
          const tabRect = results[i]
          if (!tabRect || Array.isArray(tabRect)) {
            continue
          }

          const tabIndex = i - 1
          const tab = tabs[tabIndex]
          const left = tabRect.left - baseLeft

          positions[tabIndex] = {
            value: tab.value,
            left,
            preLeft: Math.max(0, left - prevTabWidth), // 当前位置减去前一个tab的宽度
            width: tabRect.width,
          }

          // 更新前一个tab的宽度，用于下一次循环
          prevTabWidth = tabRect.width
        }

        console.log('Final positions:', positions)

        // 更新位置信息
        tabPositions.value = positions
        positionsInitialized.value = true
      })
    }, 500) // 增加延迟时间，确保微信小程序DOM完全渲染
  }

  return {
    tabPositions,
    positionsInitialized,

    initTabPositions,
  }
}
