import type { TDeviceType } from '@/constant/modules'

import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { DEVICE_TYPE, DEVICE_TYPE_I18N } from '@/constant/modules'
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

  /** 默认设备类型（优先 VIDEO，其次 DRYER） */
  const defaultDeviceType = computed<TDeviceType>(() => {
    if (supportedDeviceTypes.value.includes(DEVICE_TYPE.VIDEO)) return DEVICE_TYPE.VIDEO
    if (supportedDeviceTypes.value.includes(DEVICE_TYPE.DRYER)) return DEVICE_TYPE.DRYER
    return DEVICE_TYPE.VIDEO
  })

  /** 设备类型单选列表 */
  const deviceTypeRadioOptions = computed(() => {
    // 只有一种设备就不需要下拉选项了
    if (!hasVideoDevice.value || !hasDryerDevice.value) return null

    return [
      {
        label: DEVICE_TYPE_I18N[DEVICE_TYPE.VIDEO],
        value: DEVICE_TYPE.VIDEO,
        disabled: !hasVideoDevice.value,
      },
      {
        label: DEVICE_TYPE_I18N[DEVICE_TYPE.DRYER],
        value: DEVICE_TYPE.DRYER,
        disabled: !hasDryerDevice.value,
      },
    ]
  })

  return {
    supportedDeviceTypes,
    isDeviceTypeSupported,
    hasVideoDevice,
    hasDryerDevice,
    defaultDeviceType,
    deviceTypeRadioOptions,
  }
}
