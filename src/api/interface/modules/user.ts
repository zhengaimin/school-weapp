/** 用户接口类型定义 */
import type {
  TAmountType,
  TBalanceBusinessType,
  TConsumptionSource,
  TDeviceType,
  TFaceStatus,
  TServiceType,
  TUserType,
} from '@/constant/modules'

export namespace User {
  export namespace Common {
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

    /** 余额信息 */
    export interface IBalanceInfoVo {
      /** 总余额 */
      totalBalance: string | null
      /** 可用余额 */
      availableBalance: string | null
      /** 赠费余额，可消费但不可退款 */
      giftBalance: string | null
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
      /** 赠费余额，可消费但不可退款 */
      giftBalance: string | null
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
      /** 当前总余额 */
      balance: string
      /** 赠费余额，可消费但不可退款 */
      giftBalance: string
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
      /** 客服电话 */
      customerServicePhone: string
      /** 成绩h5页面地址 */
      scoreUrl: string
      /** 学校支持的设备类型列表（VIDEO-话机，DRYER-吹风机等） */
      supportedDeviceTypes: string[]
      /** 微信信息 */
      wechatInfo: IWechatInfoVo
      /** 角色特定信息 */
      roleInfo: IParentRoleInfoVo | ITeacherRoleInfoVo
      /** 账户状态 */
      status: number
      /** 最后登录时间 */
      lastLoginAt: string
      /** 协议图片URL或内容 */
      agreementUrl: string
      /** 协议同意时间 */
      agreementAcceptedAt: string
      /** 是否关注微信服务号 */
      wechatSubscribed: boolean
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

    /** 更新微信用户信息 */
    export interface ReqPutUpdateWxUserInfoApi {
      /** 微信用户信息加密数据 */
      encryptedData: string
      /** 初始向量 */
      iv: string
    }

    /** 更新微信用户信息响应 */
    export interface ResPutUpdateWxUserInfoApi {}

    /** 获取用户余额 - 请求参数 */
    export interface ReqGetBalanceApi {
      /** 设备类型：VIDEO-视频话机，DRYER-吹风机 */
      deviceType?: TDeviceType
    }

    /** 用户余额接口返回的设备类型 */
    export type UserBalanceDeviceType = 'phone' | 'hair_dryer'

    /** 学生余额信息 */
    export interface IStudentBalanceInfoVo {
      /** 可用余额 */
      availableBalance?: string
      /** 赠费余额，可消费但不可退款 */
      giftBalance?: string
      /** 班级名称 */
      className?: string
      /** 冻结余额 */
      frozenBalance?: string
      /** 年级 */
      grade?: string
      /** 余额状态：1-正常，0-冻结 */
      status?: number
      /** 学号 */
      studentCode?: string
      /** 学生ID */
      studentId?: number
      /** 学生姓名 */
      studentName?: string
      /** 总余额 */
      totalBalance?: string
      /** 累计消费 */
      totalConsumption?: string
      /** 累计充值 */
      totalRecharge?: string
      /** 累计退款 */
      totalRefund?: string
      /** 余额更新时间 */
      updatedAt?: string
      [property: string]: any
    }

    /** 获取用户余额响应 */
    export type ResGetBalanceApi = IStudentBalanceInfoVo
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
    export interface IBalanceInfo extends Common.IStudentBalanceInfoVo {
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
      /** 设备类型（VIDEO-话机，DRYER-吹风机） */
      deviceType: TDeviceType
      /** 开始日期 (YYYY-MM-DD格式) */
      startDate?: string
      /** 结束日期 (YYYY-MM-DD格式) */
      endDate?: string
      /** 服务类型 */
      serviceType?: 'call' | 'message'
      /** 最小金额 */
      minAmount?: string
      /** 最大金额 */
      maxAmount?: string
      /** 是否使用套餐 (true-套餐消费, false-余额消费) */
      isPackageUsage?: boolean
      /** 页码，从1开始 */
      page: number
      /** 每页数量，最大100 */
      pageSize: number
    }

    export interface IConsumptionRecordVo {
      id: number
      consumeId: string
      /** 设备类型 */
      deviceType?: TDeviceType
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
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 开始日期 (YYYY-MM-DD格式) */
      startDate?: string
      /** 结束日期 (YYYY-MM-DD格式) */
      endDate?: string
      /** 金额类型过滤 */
      amountType?: TAmountType
      /** 业务类型过滤 */
      businessType?: TBalanceBusinessType
      /** 页码，从1开始 */
      page: number
      /** 每页数量，最大100 */
      pageSize: number
    }

    export type AmountType = TAmountType
    export type BusinessType = TBalanceBusinessType

    /** 资金流水明细记录 */
    export interface IBalanceDetailRecordVo {
      /** 明细ID */
      id: number
      /** 明细流水号 */
      detailNo: string
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 金额类型 */
      amountType: TAmountType
      /** 金额类型文本 */
      amountTypeText: string
      /** 变动金额 */
      amount: string
      /** 变动前总余额 */
      totalBalanceBefore: string
      /** 变动后总余额 */
      totalBalanceAfter: string
      /** 变动前可用余额 */
      availableBalanceBefore: string
      /** 变动后可用余额 */
      availableBalanceAfter: string
      /** 关联业务类型 */
      relatedBusinessType: string
      /** 关联业务ID */
      relatedBusinessId: number | null
      /** 操作人类型 */
      operatorType: string
      /** 操作人姓名 */
      operatorName: string
      /** 变动描述 */
      description: string
      /** 操作时间 */
      operationTime: string
      /** 创建时间 */
      createdAt: string
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
    }
  }

  export namespace Agreement {
    /** 更新协议状态请求参数 */
    export interface ReqPutAgreementApi {
      /** 协议内容URL */
      agreementUrl: string
    }

    /** 更新协议状态响应 */
    export interface ResPutAgreementApi {
      /** 更新结果消息 */
      message: string
    }
  }
}
