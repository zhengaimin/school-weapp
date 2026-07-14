import type { TStatusTab } from './constants'
import type { Pkg } from '@/api/interface/modules/package'
import type { TDeviceType } from '@/constant/modules'

/** 可购买套餐条目 */
export type AvailablePackage = Pkg.Query.IPackage

/** 生效中/待生效套餐条目 */
export type ActivePackage = Pkg.Query.IStudentActivePackageVo

/** 套餐列表页设备类型 */
export type PackageListDeviceType = TDeviceType

/** 套餐列表页状态筛选类型 */
export type PackageListStatusTab = TStatusTab
