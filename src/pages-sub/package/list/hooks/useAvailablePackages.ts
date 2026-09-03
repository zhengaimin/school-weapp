import type { AvailablePackage } from '../types'
import { computed } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import { useRefresh } from '@/hooks/useRefresh'

/** 可购买套餐列表逻辑 */
export function useAvailablePackages() {
  const refreshState = useRefresh<AvailablePackage>({
    get: getAvailablePackagesApi,
    immediate: false,
    listField: 'packages',
  })

  // 套餐已不按设备拆分，接口返回的所有套餐直接展示。
  const displayList = computed(() => refreshState.list.value)

  const displayEmpty = computed(() => {
    const noData = (displayList.value?.length ?? 0) === 0
    return noData && !refreshState.loading.value && !refreshState.refreshLoading.value
  })

  return {
    ...refreshState,
    displayList,
    displayEmpty,
  }
}
