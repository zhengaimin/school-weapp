import type { ComputedRef } from 'vue'
import type { AvailablePackage, PackageListDeviceType } from '../types'
import { computed, ref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import { useRefresh } from '@/hooks/useRefresh'
import { isValidDeviceType, normalizeAvailablePackage } from '../utils/availablePackage'

/** 可购买套餐列表逻辑 */
export function useAvailablePackages(primaryDeviceType: ComputedRef<PackageListDeviceType>) {
  const availableFallbackDeviceType = ref<PackageListDeviceType>(primaryDeviceType.value)

  const refreshState = useRefresh<AvailablePackage>({
    get: getAvailablePackagesApi,
    immediate: false,
    formatItem: item => normalizeAvailablePackage(item, availableFallbackDeviceType.value),
    listField: 'packages',
  })

  const displayList = computed(() => {
    const selectedDeviceType = refreshState.query.value.deviceType as string | undefined
    if (!isValidDeviceType(selectedDeviceType)) return refreshState.list.value

    return refreshState.list.value.filter((item) => {
      const packageDeviceType = item?.deviceType ?? item?.packageContent?.deviceType
      return packageDeviceType === selectedDeviceType
    })
  })

  const displayEmpty = computed(() => {
    const noData = (displayList.value?.length ?? 0) === 0
    return noData && !refreshState.loading.value && !refreshState.refreshLoading.value
  })

  /** 同步可购买套餐设备类型兜底值 */
  function syncAvailableFallbackDeviceType(deviceType?: PackageListDeviceType) {
    if (isValidDeviceType(deviceType)) {
      availableFallbackDeviceType.value = deviceType
      return
    }

    availableFallbackDeviceType.value = primaryDeviceType.value
  }

  return {
    ...refreshState,
    displayList,
    displayEmpty,
    syncAvailableFallbackDeviceType,
  }
}
