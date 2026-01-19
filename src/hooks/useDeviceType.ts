import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useUserStore } from '@/store/user'

/**
 * 设备类型管理 Hook
 */
export function useDeviceType() {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  /** 学校支持的设备类型列表 */
  const supportedDeviceTypes = computed(() => {
    return userInfo.value?.supportedDeviceTypes || []
  })

  /** 检查指定设备类型是否支持 */
  const isDeviceTypeSupported = (deviceType: string) => {
    return supportedDeviceTypes.value.includes(deviceType)
  }

  /** 是否支持视频话机 */
  const hasVideoDevice = computed(() => {
    return supportedDeviceTypes.value.includes('VIDEO')
  })

  /** 是否支持吹风机 */
  const hasDryerDevice = computed(() => {
    return supportedDeviceTypes.value.includes('DRYER')
  })

  return {
    supportedDeviceTypes,
    isDeviceTypeSupported,
    hasVideoDevice,
    hasDryerDevice,
  }
}
