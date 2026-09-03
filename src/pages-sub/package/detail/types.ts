import type { Pkg } from '@/api/interface/modules/package'
import type { TDeviceType, TPackageKind, TPackageType } from '@/constant/modules'

/** 套餐详情页展示模型：可购买套餐与已购套餐统一整理后的字段 */
export interface PackageDetail {
  /** 可购买套餐为套餐 ID，已购套餐为套餐记录 ID */
  id: number
  /** 套餐来源类型 */
  packageKind?: TPackageKind
  /** 套餐类型：通用套餐 / 固定套餐 */
  packageType?: TPackageType
  /** 套餐名称 */
  packageName: string
  /** 计费模式；仅平台套餐有该概念，普通套餐为空 */
  pricingMode?: 'DECREASING' | 'FIXED_TOTAL'
  /** 展示价格 */
  purchasePrice: number
  /** 套餐总月数 */
  totalMonths?: number
  /** 设备类型 */
  deviceType?: TDeviceType
  /** 平台套餐模块权益 */
  modules: Pkg.Platform.IModule[]
  /** 套餐内容 */
  packageContent?: Pkg.Query.IPackageContent
  /** 生效日期 */
  startDate?: string
  /** 到期日期 */
  endDate?: string
  /** 套餐说明 */
  description?: string
  /** 使用规则 */
  usageRules?: string
  /** 是否可购买 */
  purchasable: boolean
}
