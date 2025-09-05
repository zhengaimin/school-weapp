import type { Payment } from '@/api/interface/modules/payment'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const PAYMENT_LIMITS_API = {
  LIMITS: `${API}/payment/limits`,
}

/**
 * @description 获取支付金额限制
 * @returns {Promise<Limit.ResGetPaymentLimitsApi>}
 */
export function getPaymentLimitsApi() {
  return http.get<Payment.Limit.ResGetPaymentLimitsApi>(PAYMENT_LIMITS_API.LIMITS)
}
