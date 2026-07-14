// 定义事件名称
const REFUND_SUCCESS_EVENT = 'refund:success'

// 定义事件回调函数的类型
type RefundSuccessCallback = (data: { id: string, status: string, amount: number }) => void

/**
 * 监听退款成功事件
 * @param callback 回调函数
 */
function onRefundSuccess(callback: RefundSuccessCallback) {
  uni.$on(REFUND_SUCCESS_EVENT, callback)

  // 返回一个取消监听的函数
  return () => {
    uni.$off(REFUND_SUCCESS_EVENT, callback)
  }
}

/**
 * 发送退款成功事件
 * @param data 退款信息
 */
function emitRefundSuccess(data: { id: string, status: string, amount: number }) {
  uni.$emit(REFUND_SUCCESS_EVENT, data)
}

/**
 * 退款相关的 hook
 */
export function useRefundEmitter() {
  return {
    onRefundSuccess,
    emitRefundSuccess,
  }
}
