import type { TPaymentStatus } from '@/constant/modules/payment'

// 定义事件名称
const RECHARGE_SUCCESS_EVENT = 'balance:rechargeSuccess'

// 定义事件回调函数的类型
type RechargeSuccessCallback = (data: {
  orderNo: string
  amount: number
  status: TPaymentStatus
}) => void

/**
 * 监听充值成功事件
 * @param callback 回调函数
 */
function onRechargeSuccess(callback: RechargeSuccessCallback) {
  uni.$on(RECHARGE_SUCCESS_EVENT, callback)

  // 返回一个取消监听的函数
  return () => {
    uni.$off(RECHARGE_SUCCESS_EVENT, callback)
  }
}

/**
 * 发送充值成功事件
 * @param data 充值信息
 */
function emitRechargeSuccess(data: { orderNo: string, amount: number, status: TPaymentStatus }) {
  uni.$emit(RECHARGE_SUCCESS_EVENT, data)
}

/**
 * 余额相关的 hook
 */
export function useBalanceEmitter() {
  return {
    onRechargeSuccess,
    emitRechargeSuccess,
  }
}
