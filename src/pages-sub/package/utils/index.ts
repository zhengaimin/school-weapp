import dayjs from 'dayjs'
import { PACKAGE_BUY_STATUS, PACKAGE_STATUS } from '@/constant/modules'

interface CheckRefundButtonParams {
  status: number
  endDate?: string
  hasPendingRefund?: boolean
}

/** 判断是否显示退款按钮 */
export function canShowRefundButton(params: CheckRefundButtonParams): boolean {
  const { status, endDate, hasPendingRefund } = params

  if (hasPendingRefund && status !== PACKAGE_BUY_STATUS.REFUND_PENDING) {
    return false
  }
  if (status === PACKAGE_STATUS.WAITING_ACTIVE) {
    return true
  }
  if (status === PACKAGE_STATUS.ACTIVE && endDate) {
    const monthsDiff = dayjs(endDate).diff(dayjs(), 'month', true)
    return monthsDiff > 1
  }
  return false
}
