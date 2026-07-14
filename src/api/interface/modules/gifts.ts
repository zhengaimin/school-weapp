import type { TDeviceType, TGiftSource } from '@/constant/modules'

export namespace Gifts {
  /** 有效赠费记录信息 */
  export interface ValidGiftRecord {
    /** 赠费记录ID */
    id: number
    /** 学生ID */
    studentId: number
    /** 学校ID */
    schoolId: number
    /** 设备类型 */
    deviceType: TDeviceType
    /** 设备类型文本 */
    deviceTypeText: string
    /** 总赠送分钟数 */
    totalMinutes: number
    /** 剩余分钟数 */
    remainingMinutes: number
    /** 已使用分钟数 */
    usedMinutes: number
    /** 生效时间 */
    startDate: string
    /** 过期时间 */
    expireDate: string
    /** 赠费来源 */
    source: TGiftSource
    /** 赠费来源文本 */
    sourceText: string
    /** 描述信息 */
    description?: string
    /** 剩余有效天数 */
    remainingDays: number
    /** 创建时间 */
    createdAt: string
  }

  export namespace Valid {
    /** 获取学生有效赠费记录 - 请求 */
    export interface ReqGetStudentValidGiftsApi {
      // 无需额外参数，通过Authorization获取当前学生信息
    }

    /** 获取学生有效赠费记录 - 响应 */
    export interface ResGetStudentValidGiftsApi {
      /** 有效赠费记录列表 */
      records: ValidGiftRecord[]
      /** 总记录数 */
      total: number
    }
  }

  export namespace SoonToExpire {
    /** 获取学生即将到期赠费记录 - 请求 */
    export interface ReqGetSoonToExpireGiftsApi {
      /** 天数，获取多少天内即将过期的记录 */
      days: number
    }

    /** 获取学生即将到期赠费记录 - 响应 */
    export interface ResGetSoonToExpireGiftsApi {
      /** 即将到期赠费记录列表 */
      records: ValidGiftRecord[]
      /** 总记录数 */
      total: number
    }
  }
}
