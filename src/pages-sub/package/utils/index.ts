import dayjs from 'dayjs'
import { PACKAGE_BUY_STATUS, PACKAGE_STATUS } from '@/constant/modules'

interface CheckRefundButtonParams {
  status: number
  endDate?: string
  hasPendingRefund?: boolean
}

/** 套餐内容摘要字段 */
interface PackageContentSummary {
  /** 视频通话分钟数 */
  videoCallMinutes?: number | null
  /** 留言条数（-1 表示无限制） */
  messageCount?: number | null
  /** 吹风机分钟数 */
  dryerMinutes?: number | null
}

/**
 * 格式化普通设备套餐的内容摘要
 * @param content 套餐内容或套餐内容快照
 * @returns 设备额度摘要，没有可展示内容时返回空字符串
 */
export function formatPackageContentSummary(content?: PackageContentSummary | null): string {
  if (!content) return ''

  const items: string[] = []
  if (content.videoCallMinutes) items.push(`通话 ${content.videoCallMinutes} 分钟`)
  if (content.messageCount) {
    items.push(content.messageCount === -1 ? '留言不限条' : `留言 ${content.messageCount} 条`)
  }
  if (content.dryerMinutes) items.push(`吹风 ${content.dryerMinutes} 分钟`)
  return items.join('、')
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
