import type { Pkg } from '@/api/interface/modules/package'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const PACKAGE_QUERY_API = {
  AVAILABLE: `${API}/packages/available`,
  STUDENT: `${API}/packages/student`,
  STUDENT_ACTIVE: `${API}/packages/student/active`,
  BASE_RATES: `${API}/packages/base-rates`,
  STUDENT_DETAIL: (id: number) => `${API}/packages/student/${id}`,
}

/**
 * @description 获取可购买套餐列表，不传 packageKind 时返回普通设备套餐和平台组合套餐
 * @param {Pkg.Query.ReqGetAvailableApi} params
 * @returns {Promise<Pkg.Query.ResGetAvailableApi>}
 */
export function getAvailablePackagesApi(params: Pkg.Query.ReqGetAvailableApi) {
  return http.get<Pkg.Query.ResGetAvailableApi>(PACKAGE_QUERY_API.AVAILABLE, params)
}

/**
 * @description 获取学生套餐列表，平台套餐按支付单聚合成一条记录
 * @param {Pkg.Query.ReqGetStudentApi} params
 * @returns {Promise<Pkg.Query.ResGetStudentApi>}
 */
export function getStudentPackagesApi(params: Pkg.Query.ReqGetStudentApi) {
  return http.get<Pkg.Query.ResGetStudentApi>(PACKAGE_QUERY_API.STUDENT, params)
}

/**
 * @description 获取学生当前有效和待激活的套餐
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
 * @description 获取学生套餐详情
 * @param id 套餐记录 ID
 * @returns {Promise<Pkg.Query.ResGetPackageDetailApi>}
 */
export function getStudentPackageDetailApi(id: number) {
  return http.get<Pkg.Query.ResGetPackageDetailApi>(PACKAGE_QUERY_API.STUDENT_DETAIL(id))
}
