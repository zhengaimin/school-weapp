import type { TStatusTab } from './constants'
import type { Pkg } from '@/api/interface/modules/package'

/** 可购买套餐条目 */
export type AvailablePackage = Pkg.Platform.IPackage

/** 已购套餐条目 */
export type ActivePackage = Pkg.Platform.IStudentPackage

/** 套餐列表页状态筛选类型 */
export type PackageListStatusTab = TStatusTab
