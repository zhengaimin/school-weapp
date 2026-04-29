import type { User } from '@/api/interface/modules/user'

/** 消费记录条目 */
export type ConsumptionRecord = User.Consumption.IConsumptionRecordVo

/** 消费记录查询参数 */
export type ConsumptionRecordsQuery = User.Consumption.ReqGetConsumptionRecords

/** 消费记录卡片展示信息 */
export interface RecordDisplayInfo {
  title: string
  subtitle: string
}

/** 消费记录卡片属性 */
export interface ConsumptionRecordItemProps {
  record: ConsumptionRecord
  showDeviceType?: boolean
}
