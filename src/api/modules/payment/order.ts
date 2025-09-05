import type { Payment } from '@/api/interface/modules/payment'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const PAYMENT_ORDER_API = {
  RECORDS: `${API}/payment/records`,
  CANCEL: `${API}/payment/cancel`,
  DETAIL: (id: number) => `${API}/payment/detail/${id}`,
  PENDING: `${API}/payment/pending`,
}

/** 获取支付记录列表 - /api/payment/records */
export function getPaymentRecordsApi(params: Payment.Order.ReqGetPaymentRecordsApi) {
  return http.get<Payment.Order.ResGetPaymentRecordsApi>(PAYMENT_ORDER_API.RECORDS, params)
}

/** 取消支付记录 - /api/payment/records/cancel */
export function postCancelPaymentRecordApi(params: Payment.Order.ReqPostCancelPaymentRecordApi) {
  return http.post(PAYMENT_ORDER_API.CANCEL, params)
}

/** 获取支付详情 - /api/payment/detail/{id} */
export function getPaymentDetailApi(id: number) {
  return http.get<Payment.Order.ResGetPaymentDetailApi>(PAYMENT_ORDER_API.DETAIL(id))
}

/** 获取待处理订单 - /api/payment/pending */
export function getPendingPaymentApi() {
  return http.get<Payment.Order.Pending.ResGetPendingApi>(PAYMENT_ORDER_API.PENDING)
}
