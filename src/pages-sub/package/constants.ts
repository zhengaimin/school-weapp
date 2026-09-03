import type { TDeviceType } from '@/constant/modules'
import { DEVICE_TYPE } from '@/constant/modules'

/** 套餐标签类型：设备套餐按设备类型，平台套餐按计费模式，取不到时用 DEFAULT */
export type TPackageTag = TDeviceType | 'DECREASING' | 'FIXED_TOTAL' | 'DEFAULT'

/** 套餐标签配色，直接绑定到标签行内样式；套餐列表与套餐详情共用 */
export const PACKAGE_TAG_CONFIGS: Record<TPackageTag, { backgroundColor: string, color: string }> = {
  [DEVICE_TYPE.VIDEO]: { backgroundColor: '#eff6ff', color: '#2563eb' },
  [DEVICE_TYPE.DRYER]: { backgroundColor: '#fff7ed', color: '#c2410c' },
  DECREASING: { backgroundColor: '#f5f3ff', color: '#7c3aed' },
  FIXED_TOTAL: { backgroundColor: '#ecfdf5', color: '#047857' },
  DEFAULT: { backgroundColor: '#f1f5f9', color: '#64748b' },
}
