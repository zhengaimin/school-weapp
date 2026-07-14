import type { Payment } from '@/api/interface/modules/payment'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const PAYMENT_STATUS_API = {
  STATUS: `${API}/payment/status`,
}

/**
 * @description 查询支付状态
 * @param {Status.ReqGetPaymentStatusApi} params
 * @returns {Promise<Status.ResGetPaymentStatusApi>}
 */
export function getPaymentStatusApi(params: Payment.Status.ReqGetPaymentStatusApi) {
  return http.get<Payment.Status.ResGetPaymentStatusApi>(PAYMENT_STATUS_API.STATUS, params)
}
