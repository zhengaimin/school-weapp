import type { AvailablePackage, PackageListDeviceType } from '../types'
import { DEVICE_TYPE } from '@/constant/modules'

/** 判断是否为有效设备类型 */
export function isValidDeviceType(value?: string): value is PackageListDeviceType {
  if (!value) return false
  return value === DEVICE_TYPE.VIDEO || value === DEVICE_TYPE.DRYER
}

/** 归一化可购买套餐设备类型，保证卡片可识别 */
export function normalizeAvailablePackage(
  item: AvailablePackage,
  fallbackDeviceType: PackageListDeviceType,
): AvailablePackage {
  const packageDeviceType = item?.deviceType
  if (isValidDeviceType(packageDeviceType)) {
    return {
      ...item,
      packageContent: {
        ...(item.packageContent || {}),
        deviceType: packageDeviceType,
      },
    }
  }

  const contentDeviceType = item?.packageContent?.deviceType
  if (isValidDeviceType(contentDeviceType)) {
    return {
      ...item,
      deviceType: contentDeviceType,
      packageContent: {
        ...(item.packageContent || {}),
        deviceType: contentDeviceType,
      },
    }
  }

  return {
    ...item,
    deviceType: fallbackDeviceType,
    packageContent: {
      ...(item.packageContent || {}),
      deviceType: fallbackDeviceType,
    },
  }
}
