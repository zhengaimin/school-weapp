/** 学生概览接口类型定义 */
import type { TDeviceType } from '@/constant/modules/business/package/common'

export namespace Overview {
  /** 设备信息 */
  export interface IDeviceVo {
    /** 设备类型 */
    deviceType: TDeviceType
    /** 设备名称 */
    deviceName: string
    /** 余额 */
    balance: string
    /** 赠费余额，可消费但不可退款 */
    giftBalance: string
    /** 剩余分钟数（套餐+赠送） */
    remainingMinutes: number
    /** 本月支出（前端 mock） */
    monthlyExpense?: number
    /** 本月充值（前端 mock - 用于计算图表比例） */
    monthlyRecharge?: number
    /** 套餐总量（前端 mock） */
    packageTotal?: number
    /** 待生效套餐数量（前端 mock） */
    packagePending?: number
  }

  /** 学生概览信息 */
  export interface IStudentVo {
    /** 学生ID */
    id: number
    /** 学生姓名 */
    name: string
    /** 头像URL */
    avatar: string
    /** 学校ID */
    schoolId: number
    /** 学校名称 */
    schoolName: string
    /** 年级 */
    grade: string
    /** 班级名称 */
    className: string
    /** 设备列表 */
    devices: IDeviceVo[]
    /** 学校支持的小程序模块key列表 */
    modules: string[]
  }

  export namespace Students {
    /** 获取概览学生列表 - 响应 */
    export interface ResGetListApi {
      students: IStudentVo[]
    }
  }
}
