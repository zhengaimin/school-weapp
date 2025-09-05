import type { Pkg } from '@/api/interface/modules/package'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const PACKAGE_PAYMENT_API = {
  PURCHASE: `${API}/packages/purchase`,
  CONTINUE_PAYMENT: `${API}/packages/payment/continue`,
  CANCEL_PAYMENT: `${API}/packages/payment/cancel`,
  PENDING_PAYMENT: `${API}/packages/payment/pending`,
}

/**
 * @description 购买套餐
 * @param {Pkg.Payment.ReqPostPurchaseApi} params
 * @returns {Promise<Pkg.Payment.ResPostPurchaseApi>}
 */
export function postPurchasePackageApi(params: Pkg.Payment.ReqPostPurchaseApi) {
  return http.post<Pkg.Payment.ResPostPurchaseApi>(PACKAGE_PAYMENT_API.PURCHASE, params)
}

/**
 * @description 继续支付已存在的套餐订单
 * @param {Pkg.Payment.ReqPostContinuePaymentApi} params
 * @returns {Promise<Pkg.Payment.ResPostContinuePaymentApi>}
 */
export function postContinuePaymentApi(params: Pkg.Payment.ReqPostContinuePaymentApi) {
  return http.post<Pkg.Payment.ResPostContinuePaymentApi>(PACKAGE_PAYMENT_API.CONTINUE_PAYMENT, params)
}

/**
 * @description 取消套餐购买订单
 * @param {Pkg.Payment.ReqPostCancelPaymentApi} params
 * @returns {Promise<Pkg.Payment.ResPostCancelPaymentApi>}
 */
export function postCancelPaymentApi(params: Pkg.Payment.ReqPostCancelPaymentApi) {
  return http.post<Pkg.Payment.ResPostCancelPaymentApi>(PACKAGE_PAYMENT_API.CANCEL_PAYMENT, params)
}

/**
 * @description 检查是否存在待支付的套餐订单
 * @returns {Promise<Pkg.Payment.ResGetPendingPaymentApi>}
 */
export function getPendingPaymentApi() {
  return http.get<Pkg.Payment.ResGetPendingPaymentApi>(PACKAGE_PAYMENT_API.PENDING_PAYMENT)
}
