import type { TConsumptionSource, TFaceStatus, TServiceType, TUserType } from '@/constant/modules'

export namespace User {
  export namespace Common {
    // #region Common - 基本接口定义
    // #region 微信信息
    /** 微信信息 */
    export interface IWechatInfoVo {
      /** 用户 openid */
      MiniOpenID: string
      miniOpenID: string
      /** 微信昵称 */
      nickName: string
      /** 微信头像 */
      avatarUrl: string
    }
    // #endregion

    // #region 余额信息
    /** 余额信息 */
    export interface IBalanceInfoVo {
      /** 总余额 */
      totalBalance: string | null
      /** 可用余额 */
      availableBalance: string | null
      /** 冻结余额 */
      frozenBalance: string | null
      /** 累计充值 */
      totalRecharge: string | null
      /** 累计消费 */
      totalConsumption: string | null
      /** 累计退款 */
      totalRefund: string | null
      /** 余额状态：1-正常，0-冻结 */
      status: number | null
      /** 余额更新时间 */
      updatedAt: string | null
    }
    // #endregion

    // #endregion Common - 基本接口定义

    /** 当前孩子信息 */
    export interface ICurrentChildVo {
      UUID: string
      /** 学生ID */
      studentId: number | null
      /** 学生姓名 */
      studentName: string | null
      /** 学号 */
      studentCode: string | null
      /** 年级 */
      grade: string | null
      /** 班级名称 */
      className: string | null
      /** 级部名称 */
      departmentName: string | null
      /** 当前总余额 */
      balance: string | null
      /** 详细余额信息 */
      balanceInfo: IBalanceInfoVo | null
      /** IC卡号 */
      cardNumber: string | null
      /** 与孩子关系 */
      relationship: number | null
      /** 学生人脸图片地址 */
      faceImageUrl: string | null
      /** 人脸状态：0-未采集，1-已采集，2-审核中，3-审核通过，4-审核失败 */
      faceStatus: TFaceStatus | null
      /** 身份证号 */
      idCard: string | null
      /** 性别 */
      gender: string | null
      /** 生日 */
      birthday: string | null
    }

    /** 家长角色特定信息 */
    export interface IParentRoleInfoVo {
      /** 当前孩子信息 */
      currentChild: ICurrentChildVo
      /** 关联的孩子数量 */
      childrenCount: number
    }

    /** 教师角色特定信息 */
    export interface ITeacherRoleInfoVo {
      /** 教师编号 */
      teacherNumber: string
      /** 任教科目 */
      subject: string
      /** 职位 */
      position: string
      /** 管理的班级数量 */
      managedClassCount: number
    }

    /** 用户信息 */
    export interface IUserInfoVo {
      /** 用户ID */
      userId: number
      /** 用户姓名 */
      userName: string
      /** 用户类型: parent, teacher */
      userType: TUserType
      /** 手机号 */
      phone: string
      /** 租户ID */
      tenantId: number
      /** 学校ID */
      schoolId: number
      /** 学校名称 */
      schoolName: string
      /** 微信信息 */
      wechatInfo: IWechatInfoVo
      /** 角色特定信息 */
      roleInfo: IParentRoleInfoVo | ITeacherRoleInfoVo
      /** 账户状态 */
      status: number
      /** 最后登录时间 */
      lastLoginAt: string
    }

    /** 获取微信绑定的手机号 */
    export interface ReqWxPhoneApi {
      /** 点击 button 获取到的手机号 code */
      code: string
      /** 微信 code */
      loginCode: string
    }
    export interface ResWxPhoneApi {
      /** 国家代码 */
      countryCode: string
      /** 用户手机号 */
      phoneNumber: string
      /** 没有国家代码的手机号 */
      purePhoneNumber: string
    }

    export interface ReqWxLoginApi {
      code: string
    }
    /** 微信登录返回的信息 */
    export interface ResWxLoginApi {
      isNew: boolean
      needBind: boolean
      token?: string
    }

    export interface ReqPutMeInfoApi {
      name?: string
      phone?: string
      avatar?: string
    }

    // #region 获取用户余额
    /** 获取用户余额 */
    export interface IStudentBalanceVo {
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 学号 */
      studentCode: string
      /** 年级 */
      grade: string | null
      /** 班级名称 */
      className: string | null
      /** 院系/部门（可选） */
      departmentName?: string | null

      /** 总余额（字符串，保留两位小数） */
      totalBalance: string | null
      /** 可用余额 */
      availableBalance: string | null
      /** 冻结余额 */
      frozenBalance: string | null

      /** 累计充值 */
      totalRecharge: string | null
      /** 累计消费 */
      totalConsumption: string | null
      /** 累计退款 */
      totalRefund: string | null

      /** 套餐分钟数（可选） */
      packageMinutes?: number
      /** 已使用套餐分钟（可选） */
      packageMinutesUsed?: number
      /** 套餐消息数（可选） */
      packageMessageCount?: number
      /** 已使用套餐消息数（可选） */
      packageMessageCountUsed?: number

      /** 赠送分钟（可选） */
      giftMinutes?: number
      /** 已使用赠送分钟（可选） */
      giftMinutesUsed?: number
      /** 最后清零日期（可选） */
      lastClearDate?: string | null

      /** 状态：1-正常，0-冻结 */
      status: number
      /** 更新时间 */
      updatedAt: string | null

      [property: string]: any
    }
    // #endregion
  }

  export namespace Parent {
    export interface IChild {
      studentId: number
    }

    export interface IReqPostParentRegisterApi {
      loginCode: string
      chooseChildUserId: number
      children: IChild[]
    }
    export interface IResPostParentRegisterApi {
      currentUserId: number
      hasRegistered: boolean
      token: string
    }
    export interface IBalanceInfo extends Common.IStudentBalanceVo {
      availableBalanceFormatted: string
      lastUpdateTime: string
    }
  }

  export namespace Consumption {
    /** 消费统计 VO */
    export interface IConsumptionStatisticsVo {
      /** 最后消费时间 */
      lastConsumeAt?: string
      /** 本月消费 */
      monthAmount?: string
      /** 本月消费次数 */
      monthCount?: number
      /** 今日消费 */
      todayAmount?: string
      /** 今日消费次数 */
      todayCount?: number
      /** 总消费 */
      totalAmount?: string
      /** 总消费次数 */
      totalCount?: number
      /** 本周消费 */
      weekAmount?: string
      /** 本周消费次数 */
      weekCount?: number
    }

    export interface ReqGetConsumptionRecords {
      /**
       * 结束日期 (YYYY-MM-DD格式)
       */
      endDate?: string
      /**
       * 页码，从1开始
       */
      page: number
      /**
       * 每页数量，最大100
       */
      pageSize: number
      /**
       * 开始日期 (YYYY-MM-DD格式)
       */
      startDate?: string
    }

    export interface IConsumptionRecordVo {
      id: number
      consumeId: string
      serviceType: TServiceType
      amount: string
      unitPrice: string
      usageDuration: number
      usageDurationFormatted: string
      startTime: string
      endTime: string
      consumeTime: string
      isPackageUsage: boolean
      isFreeUsage: boolean
      giftMinutesUsed: number
      packageMinutesUsed: number
      balanceMinutesUsed: number
      consumptionSource: TConsumptionSource
      remark: string
    }

    export interface ResGetConsumptionRecords {
      records: IConsumptionRecordVo[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }

  export namespace Balance {
    /** 资金流水明细请求参数 */
    export interface ReqGetBalanceDetails {
      /** 开始日期 (YYYY-MM-DD格式) */
      startDate?: string
      /** 结束日期 (YYYY-MM-DD格式) */
      endDate?: string
      /** 金额类型过滤 */
      amountType?: AmountType
      /** 页码，从1开始 */
      page: number
      /** 每页数量，最大100 */
      pageSize: number
    }

    /** 金额类型枚举 */
    export type AmountType
      = | 'RECHARGE' // 充值
        | 'CONSUMPTION' // 消费
        | 'REFUND' // 退款
        | 'FREEZE' // 冻结
        | 'UNFREEZE' // 解冻
        | 'ADJUST' // 调整
        | 'PACKAGE_PURCHASE' // 套餐购买

    /** 资金流水明细记录 */
    export interface IBalanceDetailRecordVo {
      /** 记录ID */
      id: number
      /** 流水号 */
      transactionId: string
      /** 金额类型 */
      amountType: AmountType
      /** 金额类型名称 */
      amountTypeName: string
      /** 变动金额（正数为收入，负数为支出） */
      amount: string
      /** 变动后余额 */
      balanceAfter: string
      /** 变动前余额 */
      balanceBefore: string
      /** 交易描述 */
      description: string
      /** 交易时间 */
      transactionTime: string
      /** 关联订单号 */
      relatedOrderNo?: string
      /** 备注 */
      remark?: string
      /** 创建时间 */
      createdAt: string
    }

    /** 资金流水明细汇总信息 */
    export interface IBalanceSummaryVo {
      /** 总收入 */
      totalIncome: string
      /** 总支出 */
      totalExpense: string
      /** 净变动 */
      netChange: string
    }

    /** 资金流水明细响应 */
    export interface ResGetBalanceDetails {
      /** 流水记录列表 */
      records: IBalanceDetailRecordVo[]
      /** 总记录数 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 总页数 */
      totalPages: number
      /** 汇总信息 */
      summary?: IBalanceSummaryVo
    }
  }
}
