// 定义事件名称
const PACKAGE_REFUND_EVENT = 'package:refund'
const PACKAGE_TRANSACTION_EVENT = 'package:transaction'

// 定义事件回调函数的类型
type PackageRefundSuccessCallback = (id?: number) => void

type PackageTransactionSuccessCallback = () => void

/**
 * 监听套餐退款事件
 * @param callback 回调函数
 */
function onPackageRefund(callback: PackageRefundSuccessCallback) {
  uni.$on(PACKAGE_REFUND_EVENT, callback)

  // 返回一个取消监听的函数
  return () => {
    uni.$off(PACKAGE_REFUND_EVENT, callback)
  }
}

/**
 * 监听套餐交易事件
 * @param callback 回调函数
 */
function onPackageTransaction(callback: PackageTransactionSuccessCallback) {
  uni.$on(PACKAGE_TRANSACTION_EVENT, callback)

  // 返回一个取消监听的函数
  return () => {
    uni.$off(PACKAGE_TRANSACTION_EVENT, callback)
  }
}

/**
 * 发送套餐退款事件
 * @param id 退款记录ID（可选）
 */
function emitPackageRefund(id?: number) {
  uni.$emit(PACKAGE_REFUND_EVENT, id)
}

/**
 * 发送套餐交易事件
 * @param data 交易信息
 */
function emitPackageTransaction() {
  uni.$emit(PACKAGE_TRANSACTION_EVENT)
}

/**
 * 套餐相关的 hook
 */
export function usePackageEmitter() {
  return {
    onPackageRefund,
    onPackageTransaction,
    emitPackageRefund,
    emitPackageTransaction,
  }
}
