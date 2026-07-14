import type { ConsumptionRecord, RecordDisplayInfo } from '../types'
import { CONSUMPTION_SOURCE_I18N, SERVICE_TYPE_I18N } from '@/constant/modules'

const UNKNOWN_CONSUMPTION_TITLE = '未知消费'
const UNKNOWN_CONSUMPTION_SOURCE = '未知来源'

/**
 * 构建消费记录展示信息
 * @param record 消费记录条目
 * @returns 卡片展示信息
 */
export function buildRecordDisplayInfo(
  record: ConsumptionRecord,
): RecordDisplayInfo {
  const serviceType = record.serviceType as keyof typeof SERVICE_TYPE_I18N
  const title = SERVICE_TYPE_I18N[serviceType] || UNKNOWN_CONSUMPTION_TITLE

  const consumptionSource = record.consumptionSource as keyof typeof CONSUMPTION_SOURCE_I18N
  const sourceText = CONSUMPTION_SOURCE_I18N[consumptionSource]
  const parts = [sourceText, record.remark].filter(Boolean)
  const subtitle = parts.join('·') || record.remark || UNKNOWN_CONSUMPTION_SOURCE

  return {
    title,
    subtitle,
  }
}

/**
 * 格式化金额显示
 * @param amount 消费金额（字符串）
 * @returns 带负号与人民币符号的展示文案
 */
export function formatAmount(amount: string): string {
  const numAmount = Number.parseFloat(amount)
  const value = Number.isFinite(numAmount) ? Math.abs(numAmount).toFixed(2) : amount
  return `-¥${value}`
}
