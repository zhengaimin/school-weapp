import type { Payment } from '@/api/interface/modules/payment'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const PAYMENT_RECHARGE_API = {
  RECHARGE: `${API}/payment/recharge`,
  MOCK_SUCCESS: `${API}/payment/mock-success`,
  CONTINUE: `${API}/payment/continue`,
}

/** 发起充值 */
export function postRechargeApi(params: Payment.Recharge.ReqPostRechargeApi) {
  return http.post<Payment.Recharge.ResPostRechargeApi>(PAYMENT_RECHARGE_API.RECHARGE, params)
}

/** 模拟支付 */
export function postMockSuccessApi(params: Payment.Recharge.ReqPostMockSuccessApi) {
  return http.post(PAYMENT_RECHARGE_API.MOCK_SUCCESS, params)
}

/**
 * @description 继续支付订单
 * @param {Recharge.ReqPostContinueApi} params
 * @returns {Promise<Recharge.ResPostContinueApi>}
 */
export function postContinueApi(params: Payment.Recharge.ReqPostContinueApi) {
  return http.post<Payment.Recharge.ResPostContinueApi>(PAYMENT_RECHARGE_API.CONTINUE, params)
}
