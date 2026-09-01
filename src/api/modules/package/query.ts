import type { Pkg } from '@/api/interface/modules/package'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const PACKAGE_QUERY_API = {
  AVAILABLE: `${API}/packages/available`,
  STUDENT: `${API}/packages/student`,
  STUDENT_ACTIVE: `${API}/packages/student/active`,
  PLATFORM_AVAILABLE: `${API}/packages/platform/available`,
  PLATFORM_STUDENT: `${API}/packages/platform/student`,
  BASE_RATES: `${API}/packages/base-rates`,
  STUDENT_DETAIL: (id: number) => `${API}/packages/student/${id}`,
  PLATFORM_DETAIL: (id: number) => `${API}/packages/platform/${id}`,
}

/**
 * 获取可购买的平台套餐列表
 * @param params 分页参数
 * @returns 平台套餐列表
 */
export function getAvailablePlatformPackagesApi(params: Pkg.Platform.ReqGetAvailableApi) {
  return http.get<Pkg.Platform.ResGetAvailableApi>(PACKAGE_QUERY_API.PLATFORM_AVAILABLE, params).then((result) => {
    if (result.code !== 0 || !result.data) return result as never
    return {
      ...result,
      data: {
        ...result.data,
        packages: result.data.packages.map(item => ({
          ...item,
          name: item.name || item.packageName,
          modules: item.modules || [],
          pricingMode: item.pricingMode || 'FIXED_TOTAL',
        })),
      },
    } as unknown as IResData<Pkg.Platform.ResGetAvailableApi>
  })
}

/**
 * 获取学生已购买的平台套餐
 * @param params 分页和状态参数
 * @returns 学生平台套餐列表
 */
export function getStudentPlatformPackagesApi(params: Pkg.Platform.ReqGetStudentApi) {
  return http.get<Pkg.Platform.ResGetStudentApi>(PACKAGE_QUERY_API.PLATFORM_STUDENT, params).then((result) => {
    if (result.code !== 0 || !result.data) return result as never
    return {
      ...result,
      data: {
        ...result.data,
        packages: result.data.packages.map(item => ({
          ...item,
          paymentId: item.paymentId ?? 0,
          platformPackageId: item.platformPackageId,
          packageRecordIds: item.packageRecordIds || [],
          name: item.name || '套餐',
          modules: item.modules || [],
          pricingMode: item.pricingMode || (item.monthlyDecrease ? 'DECREASING' : 'FIXED_TOTAL'),
          isPackageExists: item.isPackageExists !== false,
        })),
      },
    } as unknown as IResData<Pkg.Platform.ResGetStudentApi>
  })
}

/**
 * 获取平台套餐详情
 * @param id 平台套餐 ID
 * @returns 平台套餐详情
 */
export function getPlatformPackageDetailApi(id: number) {
  return http.get<Pkg.Platform.ResGetPlatformPackageDetailApi>(PACKAGE_QUERY_API.PLATFORM_DETAIL(id)).then((result) => {
    if (result.code !== 0 || !result.data) return result as never
    return {
      ...result,
      data: {
        ...result.data,
        name: result.data.name || result.data.packageName || '套餐',
        modules: result.data.modules || [],
        pricingMode: result.data.pricingMode || 'FIXED_TOTAL',
        purchasable: result.data.purchasable !== false,
      },
    } as unknown as IResData<Pkg.Platform.ResGetPlatformPackageDetailApi>
  })
}

/**
 * @description 获取可购买套餐列表
 * @param {Pkg.Query.ReqGetAvailableApi} params
 * @returns {Promise<Pkg.Query.ResGetAvailableApi>}
 */
export function getAvailablePackagesApi(params: Pkg.Query.ReqGetAvailableApi) {
  return http.get<Pkg.Query.ResGetAvailableApi>(PACKAGE_QUERY_API.AVAILABLE, params)
}

/**
 * @description 获取学生套餐列表
 * @param {Pkg.Query.ReqGetStudentApi} params
 * @returns {Promise<Pkg.Query.ResGetStudentApi>}
 */
export function getStudentPackagesApi(params: Pkg.Query.ReqGetStudentApi) {
  return http.get<Pkg.Query.ResGetStudentApi>(PACKAGE_QUERY_API.STUDENT, params)
}

/**
 * @description 获取学生当前正在使用的套餐
 * @param {Pkg.Query.ReqGetStudentActiveApi} params
 * @returns {Promise<Pkg.Query.ResGetStudentActiveApi>}
 */
export function getStudentActivePackageApi(params?: Pkg.Query.ReqGetStudentActiveApi) {
  return http.get<Pkg.Query.ResGetStudentActiveApi>(PACKAGE_QUERY_API.STUDENT_ACTIVE, params)
}

/**
 * @description 获取基础费率
 * @returns {Promise<Pkg.Query.ResGetBaseRatesApi>}
 */
export function getBaseRatesApi() {
  return http.get<Pkg.Query.ResGetBaseRatesApi>(PACKAGE_QUERY_API.BASE_RATES)
}

/**
 * @description 获取学生已购买套餐详情
 * @param id 学生套餐记录 ID
 * @returns {Promise<Pkg.Query.ResGetPackageDetailApi>}
 */
export function getStudentPackageDetailApi(id: number) {
  return http.get<Pkg.Query.ResGetPackageDetailApi>(PACKAGE_QUERY_API.STUDENT_DETAIL(id))
}
