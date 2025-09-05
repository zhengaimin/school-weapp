import type { Pkg } from '@/api/interface/modules/package'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const PACKAGE_REFUND_API = {
  REFUND_APPLY: `${API}/packages/refund/apply`,
  REFUND_LIST: `${API}/packages/refund/list`,
  REFUND_PREVIEW: `${API}/packages/refund/preview`,
  REFUND_PENDING: `${API}/packages/refund/pending`,
  REFUND_CANCEL: (id: number) => `${API}/packages/refund/applications/${id}/cancel`,
}

/**
 * @description 申请套餐退费
 * @param {Pkg.Refund.ReqPostApplyRefundApi} params
 * @returns {Promise<Pkg.Refund.ResPostApplyRefundApi>}
 */
export function postApplyPackageRefundApi(params: Pkg.Refund.ReqPostApplyRefundApi) {
  return http.post<Pkg.Refund.ResPostApplyRefundApi>(PACKAGE_REFUND_API.REFUND_APPLY, params)
}

/**
 * @description 获取套餐退费申请列表
 * @param {Pkg.Refund.ReqGetListApi} params
 * @returns {Promise<Pkg.Refund.ResGetListApi>}
 */
export function getPackageRefundListApi(params: Pkg.Refund.ReqGetListApi) {
  return http.get<Pkg.Refund.ResGetListApi>(PACKAGE_REFUND_API.REFUND_LIST, params)
}

/**
 * @description 检查是否存在待审核的套餐退费申请
 * @returns {Promise<Pkg.Refund.ResGetPendingApi>}
 */
export function getCheckPendingApi() {
  return http.get<Pkg.Refund.ResGetPendingApi>(PACKAGE_REFUND_API.REFUND_PENDING)
}

/**
 * @description 取消套餐退费申请
 * @param {number} id
 * @returns {Promise<Pkg.Refund.ResPostCancelApi>}
 */
export function postCancelPackageRefundApi(id: number) {
  return http.post<Pkg.Refund.ResPostCancelApi>(PACKAGE_REFUND_API.REFUND_CANCEL(id))
}

/**
 * @description 套餐退款预览
 * @param {Pkg.Refund.ReqPostRefundPreviewApi} params
 * @returns {Promise<Pkg.Refund.ResPostRefundPreviewApi>}
 */
export function postRefundPreviewApi(params: Pkg.Refund.ReqPostRefundPreviewApi) {
  return http.post<Pkg.Refund.ResPostRefundPreviewApi>(PACKAGE_REFUND_API.REFUND_PREVIEW, params)
}
