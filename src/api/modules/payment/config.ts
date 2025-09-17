import type { Payment } from '@/api/interface/modules/payment'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const PAYMENT_CONFIG_API = {
  CONFIG: `${API}/payment/config`,
}

/**
 * @description 获取支付配置
 * @returns {Promise<Payment.Config.ResGetPaymentConfigApi>}
 */
export function getPaymentConfigApi() {
  return http.get<Payment.Config.ResGetPaymentConfigApi>(PAYMENT_CONFIG_API.CONFIG)
}
