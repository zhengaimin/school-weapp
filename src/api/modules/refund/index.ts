import type { Refund } from '@/api/interface/modules/refund'
import { API } from '@/api/config/servicePort'
// src/api/modules/refund/index.ts
import { http } from '@/http'

const REFUND_API = {
  APPLY: `${API}/refund/apply`,
  APPLICATIONS: `${API}/refund/applications`,
  APPLICATION_DETAIL: (id: number) => `${API}/refund/applications/${id}`,
  APPLICATION_CANCEL: (id: number | string) => `${API}/refund/applications/${id}/cancel`,
  PENDING: `${API}/refund/pending`,
}

/**
 * @description 申请退款
 * @param {Refund.Application.ReqPostApplyApi} params
 * @returns {Promise<Refund.Application.ResPostApplyApi>}
 */
export function postApplyRefundApi(params: Refund.Application.ReqPostApplyApi) {
  return http.post<Refund.Application.ResPostApplyApi>(REFUND_API.APPLY, params)
}

/**
 * @description 获取退款申请列表
 * @param {Refund.Application.ReqGetListApi} params
 * @returns {Promise<Refund.Application.ResGetListApi>}
 */
export function getRefundApplicationsApi(params: Refund.Application.ReqGetListApi) {
  return http.get<Refund.Application.ResGetListApi>(REFUND_API.APPLICATIONS, params)
}

/**
 * @description 获取退款申请详情
 * @param {number} id - 退款申请ID
 * @returns {Promise<Refund.Application.ResGetDetailApi>}
 */
export function getRefundApplicationDetailApi(id: number) {
  return http.get<Refund.Application.ResGetDetailApi>(REFUND_API.APPLICATION_DETAIL(id))
}

/**
 * @description 用户取消退款申请
 * @param {number | string} id - 退款申请ID
 * @returns {Promise<Refund.Application.ResPostCancelApi>}
 */
export function postCancelRefundApplicationApi(id: number | string) {
  return http.post<Refund.Application.ResPostCancelApi>(REFUND_API.APPLICATION_CANCEL(id))
}

/**
 * @description 检查是否存在待审核的退款申请
 * @returns {Promise<Refund.Application.ResGetPendingApi>}
 */
export function getPendingRefundApi() {
  return http.get<Refund.Application.ResGetPendingApi>(REFUND_API.PENDING)
}
