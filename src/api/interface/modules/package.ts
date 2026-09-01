import type {
  TDeviceType,
  TPackageBuyStatus,
  TPackageKind,
  TPackageRefundSource,
  TPackageType,
  TPaymentMethod,
  TRefundStatus,
  TServiceType,
} from '@/constant/modules'

export namespace Pkg {
  /** 平台套餐接口模型 */
  export namespace Platform {
    /** 平台套餐模块权益 */
    export interface IModule {
      /** 模块标识 */
      moduleKey: string
      /** 模块名称 */
      name: string
      /** 模块类型 */
      kind: 'BILLING' | 'FEATURE'
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 服务类型 */
      serviceType?: string
      /** 每月赠送分钟数 */
      monthlyGiftMinutes?: number
      /** 是否月末清零 */
      monthlyClear: boolean
    }

    /** 平台套餐信息 */
    export interface IPackage {
      /** 平台套餐 ID */
      id: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 平台套餐 ID（统一接口字段） */
      platformPackageId?: number | null
      /** 统一接口套餐名称 */
      packageName?: string
      /** 套餐名称 */
      name: string
      /** 套餐模块 */
      modules: IModule[]
      /** 单设备套餐类型（旧套餐兼容） */
      deviceType?: TDeviceType
      /** 计费模式 */
      pricingMode: 'DECREASING' | 'FIXED_TOTAL'
      /** 月价格 */
      monthlyPrice: number
      /** 购买价格 */
      purchasePrice: number
      /** 套餐总月数 */
      totalMonths: number
      /** 剩余月数 */
      remainingMonths?: number
      /** 开始日期 */
      startDate?: string
      /** 结束日期 */
      endDate?: string
      /** 套餐说明 */
      description?: string
      /** 旧套餐内容快照 */
      packageContent?: Query.IAvailablePackageContent
      /** 旧套餐说明 */
      templateDescription?: string
      /** 旧套餐使用规则 */
      usageRules?: string
      /** 是否可购买 */
      purchasable?: boolean
    }

    /** 获取平台套餐详情 - 响应 */
    export interface ResGetPlatformPackageDetailApi extends IPackage {
      /** 平台套餐状态 */
      status: number
      /** 平台套餐状态中文文案 */
      statusText: string
    }

    /** 可购买平台套餐列表请求 */
    export interface ReqGetAvailableApi {
      /** 页码 */
      page?: number
      /** 每页数量 */
      pageSize?: number
    }

    /** 可购买平台套餐列表响应 */
    export interface ResGetAvailableApi {
      /** 总数量 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 学生 ID */
      studentId: number
      /** 学校 ID */
      schoolId: number
      /** 套餐列表 */
      packages: IPackage[]
    }

    /** 学生已购买的平台套餐 */
    export interface IStudentPackage {
      /** 支付记录 ID */
      paymentId: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 平台套餐 ID */
      platformPackageId: number
      /** 关联套餐记录 ID */
      packageRecordIds: number[]
      /** 套餐名称 */
      name: string
      /** 套餐模块 */
      modules: IModule[]
      /** 计费模式 */
      pricingMode?: 'DECREASING' | 'FIXED_TOTAL'
      /** 是否按月递减（兼容旧接口字段） */
      monthlyDecrease?: boolean
      /** 购买价格 */
      purchasePrice: number
      /** 购买时间 */
      purchaseDate: string
      /** 支付时间 */
      paymentDate: string | null
      /** 支付订单号 */
      paymentOrderNo: string
      /** 开始日期 */
      startDate: string
      /** 结束日期 */
      endDate: string
      /** 套餐状态 */
      status: TPackageBuyStatus
      /** 状态文本 */
      statusText: string
      /** 套餐是否存在 */
      isPackageExists: boolean
    }

    /** 学生平台套餐列表请求 */
    export interface ReqGetStudentApi {
      /** 页码 */
      page?: number
      /** 每页数量 */
      pageSize?: number
      /** 套餐状态 */
      status?: TPackageBuyStatus
    }

    /** 平台套餐月清设备汇总余额 */
    export interface IMonthlyBalance {
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 剩余分钟数 */
      remainingMinutes: number
      /** 已用分钟数 */
      usedMinutes: number
    }

    /** 学生平台套餐列表响应 */
    export interface ResGetStudentApi {
      /** 总数量 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 学生 ID */
      studentId: number
      /** 套餐列表 */
      packages: IStudentPackage[]
      /** 是否展示平台套餐月清剩余分钟 */
      showRemainingMinutes: boolean
      /** 当前学生的平台套餐月清设备汇总余额 */
      monthlyBalances: IMonthlyBalance[]
    }
  }

  export namespace Query {
    /** 获取可购买套餐列表 - 请求 */
    export interface ReqGetAvailableApi {
      /** 页码，默认1 */
      page?: number
      /** 每页数量，默认20 */
      pageSize?: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 设备类型 */
      deviceType?: TDeviceType
    }

    /**
     * 套餐内容
     * 话机 - 视频通话分钟数 | 留言条数
     * 吹风机 - 吹风机分钟数
     */
    export interface IPackageContent {
      deviceType: TDeviceType
      /** 视频通话分钟数 */
      videoCallMinutes: number
      /** 留言条数 */
      messageCount: number
      /** 吹风机分钟数 */
      dryerMinutes: number
      firstMonthRatio: boolean
      monthlyDecrease: boolean
      monthlyReset: boolean
      packageCode: string
      packageType: string
      totalMonths: number
    }

    /** 可购买套餐内容（按 OpenAPI 同步，字段按需可选） */
    export interface IAvailablePackageContent {
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 视频通话分钟数 */
      videoCallMinutes?: number
      /** 留言条数 */
      messageCount?: number
      /** 吹风机分钟数 */
      dryerMinutes?: number
      [property: string]: unknown
    }

    /** 套餐信息 */
    export interface IPackage {
      /** 套餐ID */
      id: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 套餐编码 */
      templateCode: string
      /** 套餐名称 */
      packageName: string
      /** 平台套餐兼容名称 */
      name?: string
      /** 套餐内容 */
      packageContent?: IAvailablePackageContent
      /** 实际购买价格 */
      purchasePrice: number
      /** 基础月价格 */
      monthlyPrice: number
      /** 套餐总月数 */
      totalMonths: number
      /** 套餐说明 */
      templateDescription?: string
      /** 使用规则 */
      usageRules?: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 平台套餐模块权益 */
      modules?: Platform.IModule[]
      /** 平台套餐计费模式 */
      pricingMode?: 'DECREASING' | 'FIXED_TOTAL'
      /** 是否可购买 */
      purchasable?: boolean
      /** 套餐开始时间（固定套餐专用） */
      startTime?: string
      /** 套餐结束时间（固定套餐专用） */
      endTime?: string
      /** 是否按月递减（固定套餐专用） */
      monthlyDecrease?: boolean
    }

    /** 获取可购买套餐列表 - 响应 */
    export interface ResGetAvailableApi {
      /** 总数量 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 学生ID */
      studentId: number
      /** 学校ID */
      schoolId: number
      /** 年级ID */
      gradeId: number
      /** 套餐列表 */
      packages: IPackage[]
    }

    /** 快照信息 */
    export interface ISnapshotInfo {
      /** 套餐名称 */
      packageName: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 设备类型 */
      deviceType: string
      /** 视频通话分钟数 */
      videoCallMinutes: number
      /** 留言条数 */
      messageCount: number
      /** 吹风机分钟数 */
      dryerMinutes: number
      /** 总月数 */
      totalMonths: number
      /** 是否按月重置 */
      monthlyReset: boolean
      /** 首月是否按比例计算 */
      firstMonthRatio: boolean
      /** 是否按月递减 */
      monthlyDecrease: boolean
    }

    /** 剩余额度信息 */
    export interface IRemainingAmount {
      /** 套餐剩余分钟数 */
      packageMinutes: number
      /** 套餐剩余留言条数 */
      packageMessageCount: number
      /** 赠送剩余分钟数 */
      giftMinutes: number
    }

    /** 套餐购买信息 */
    export interface IPackagePurchaseVo {
      /** 套餐记录ID */
      id: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 同支付单下的套餐记录 ID 列表 */
      packageRecordIds?: number[]
      /** 套餐模板ID */
      packageId: number
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 支付记录 ID */
      paymentId?: number | null
      /** 套餐名称 */
      packageName: string
      /** 平台套餐兼容名称 */
      name?: string
      /** 套餐内容快照 */
      packageContent: IPackageContent
      /** 平台套餐模块权益 */
      modules?: Platform.IModule[]
      /** 购买日期 */
      purchaseDate: string
      /** 购买价格 */
      purchasePrice: number
      /** 支付日期 */
      paymentDate: string | null
      /** 支付订单号 */
      paymentOrderNo: string
      /** 开始日期 */
      startDate: string
      /** 结束日期 */
      endDate: string
      /** 状态 */
      status: TPackageBuyStatus
      /** 状态编码 */
      statusCode?: string
      /** 状态文本 */
      statusText: string
      /** 剩余额度 */
      remainingAmount: IRemainingAmount
      /** 购买者信息 */
      purchaserInfo: IPurchaserInfo | null
      /** 快照信息 */
      snapshotInfo: {
        /** 套餐编码 */
        packageCode: string
        /** 套餐类型 */
        packageType: TPackageType
        /** 设备类型 */
        deviceType: string
        /** 视频通话分钟数 */
        videoCallMinutes: number
        /** 留言条数 */
        messageCount: number
        /** 总月数 */
        totalMonths: number
        /** 是否按月重置 */
        monthlyReset: boolean
        /** 首月是否按比例计算 */
        firstMonthRatio: boolean
        /** 是否按月递减 */
        monthlyDecrease: boolean
      }
      /** 套餐是否存在 */
      isPackageExists: boolean
      /** 是否可退款 */
      canRefund: boolean
      /** 当前模板 */
      currentTemplate: {
        /** 模板ID */
        id: number
        /** 租户ID */
        tenantId: number
        /** 学校ID */
        schoolId: number
        /** 模板编码 */
        templateCode: string
        /** 套餐类型 */
        packageType: TPackageType
        /** 套餐内容 */
        packageContent: string
        /** 基础价格 */
        basePrice: number
        /** 总月数 */
        totalMonths: number
        /** 是否按月重置 */
        monthlyReset: boolean
        /** 首月是否按比例计算 */
        firstMonthRatio: boolean
        /** 是否按月递减 */
        monthlyDecrease: boolean
        /** 开始时间 */
        startTime: string | null
        /** 结束时间 */
        endTime: string | null
        /** 是否默认 */
        isDefault: boolean
        /** 模板描述 */
        templateDescription: string
        /** 使用规则 */
        usageRules: string
        /** 状态 */
        status: TPackageBuyStatus
        /** 排序 */
        sortOrder: number
        /** 创建时间 */
        createdAt: string
        /** 更新时间 */
        updatedAt: string
      }
    }

    /** 获取套餐购买记录 - 请求 */
    export interface ReqGetStudentApi {
      /** 页码，默认1 */
      page?: number
      /** 每页数量，默认10 */
      pageSize?: number
      /** 套餐状态筛选 */
      status?: TPackageBuyStatus
      /** 购买人ID筛选（支付人用户ID） */
      purchaserId?: number
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 套餐来源类型 */
      packageKind?: TPackageKind
    }

    /** 获取套餐购买记录 - 响应 */
    export interface ResGetStudentApi {
      /** 总数量 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 学生ID */
      studentId: number
      /** 套餐列表 */
      packages: IPackagePurchaseVo[]
      /** 平台套餐月清设备汇总余额 */
      monthlyBalances?: Platform.IMonthlyBalance[]
      /** 是否展示平台套餐月清剩余分钟 */
      showRemainingMinutes?: boolean
    }

    /** 购买者信息 */
    export interface IPurchaserInfo {
      /** 用户ID */
      userId: number
      /** 用户名称 */
      userName: string
    }

    /** 套餐内容快照 */
    export interface IPackageSnapshotData {
      /** 套餐编码 */
      packageCode: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 设备类型 */
      deviceType: TDeviceType
      /** 视频通话分钟数 */
      videoCallMinutes: number | null
      /** 语音通话分钟数 */
      voiceCallMinutes: number | null
      /** 留言条数（-1表示无限制） */
      messageCount: number | null
      /** 吹风机使用分钟数 */
      dryerMinutes: number | null
      /** 套餐总月数 */
      totalMonths: number
      /** 是否月末清零 */
      monthlyReset: boolean
      /** 首月比例扣款 */
      firstMonthRatio: boolean
      /** 是否按月递减计费 */
      monthlyDecrease: boolean
      /** 固定套餐开始时间 */
      startTime: string | null
      /** 固定套餐结束时间 */
      endTime: string | null
    }

    /** 活跃套餐信息 */
    export interface IStudentActivePackageVo {
      /** 套餐记录ID */
      id: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 同支付单下的套餐记录 ID 列表 */
      packageRecordIds?: number[]
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 套餐模板ID */
      packageId: number
      /** 套餐名称 */
      packageName: string
      /** 套餐内容快照 */
      packageContent: IPackageSnapshotData
      /** 购买日期 */
      purchaseDate: string
      /** 支付日期 */
      paymentDate: string | null
      /** 支付订单号 */
      paymentOrderNo: string
      /** 套餐快照信息 */
      snapshotInfo: IPackageSnapshotData | null
      /** 套餐模板是否还存在 */
      isPackageExists: boolean
      /** 当前最新的套餐模板信息 */
      currentTemplate: any | null
      /** 生效日期 */
      startDate: string
      /** 到期日期 */
      endDate: string
      /** 状态 */
      status: TPackageBuyStatus
      /** 状态编码 */
      statusCode?: string
      /** 状态文本 */
      statusText: string
      /** 购买价格 */
      purchasePrice: number
      /** 是否可退款 */
      canRefund: boolean
      /** 不可退款原因 */
      refundReason?: string
      /** 剩余额度 */
      remainingAmount: IRemainingAmount
      /** 购买人信息 */
      purchaserInfo: IPurchaserInfo
    }

    /** 获取学生当前正在使用的套餐 - 请求 */
    export interface ReqGetStudentActiveApi {
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 套餐来源类型 */
      packageKind?: TPackageKind
    }

    /** 获取学生当前正在使用的套餐 - 响应 */
    export interface ResGetStudentActiveApi {
      /** 学生ID */
      studentId: number
      /** 已激活的套餐列表 */
      activePackages: IStudentActivePackageVo[]
      /** 待激活的套餐列表 */
      waitingPackages: IStudentActivePackageVo[] | null
      /** 总数量（已激活+待激活） */
      totalCount: number
    }

    /** 使用情况信息 */
    export interface IUsageInfo {
      /** 总视频通话分钟数 */
      totalVideoCallMinutes: number
      /** 已使用视频通话分钟数 */
      usedVideoCallMinutes: number
      /** 总语音通话分钟数 */
      totalVoiceCallMinutes: number
      /** 已使用语音通话分钟数 */
      usedVoiceCallMinutes: number
      /** 总留言条数 */
      totalMessageCount: number
      /** 已使用留言条数 */
      usedMessageCount: number
    }

    /** 获取学生已购买套餐详情 - 响应 */
    export interface ResGetPackageDetailApi {
      /** 套餐记录ID */
      id: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 同支付单下的套餐记录 ID 列表 */
      packageRecordIds?: number[]
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 套餐模板ID */
      packageTemplateId: number | null
      /** 套餐名称 */
      packageName?: string
      /** 模板代码 */
      templateCode: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 设备类型 */
      deviceType: TDeviceType
      /** 平台套餐模块权益 */
      modules?: Platform.IModule[]
      /** 平台套餐计费模式 */
      pricingMode?: 'DECREASING' | 'FIXED_TOTAL'
      /** 是否可购买 */
      purchasable?: boolean
      /** 套餐内容 */
      packageContent: {
        /** 留言条数 */
        messageCount?: number
        /** 视频通话分钟数 */
        videoCallMinutes?: number
        /** 吹风机分钟数 */
        dryerMinutes?: number
      }
      /** 套餐总月数 */
      totalMonths: number
      /** 购买时间 */
      purchaseDate: string
      /** 购买价格 */
      purchasePrice: number
      /** 支付时间 */
      paymentDate: string | null
      /** 支付订单号 */
      paymentOrderNo: string
      /** 购买者信息 */
      purchaserInfo: IPurchaserInfo | null
      /** 开始时间 */
      startDate: string | null
      /** 结束时间 */
      endDate: string | null
      /** 套餐状态 */
      status?: TPackageBuyStatus
      /** 状态编码 */
      statusCode?: string
      /** 状态文本 */
      statusText?: string
      /** 套餐是否存在 */
      isPackageExists: boolean
      /** 当前模板信息 */
      currentTemplate: {
        /** 基础价格 */
        basePrice: number
        /** 模板ID */
        id: number
        /** 套餐类型 */
        packageType: TPackageType
        /** 模板代码 */
        templateCode: string
      } | null
      /** 使用情况 */
      usageInfo?: IUsageInfo | null
      /** 是否可退款 */
      canRefund: boolean
      /** 剩余可退款金额 */
      remainingRefundAmount: string
      /** 退款状态 */
      refundStatus: string
      /** 模板描述 */
      templateDescription: string
      /** 使用规则 */
      usageRules: string
    }

    /** 费率信息 */
    export interface IRateInfo {
      /** 服务类型 */
      serviceType: TServiceType
      /** 费率值 */
      rate: number
      /** 费率单位 */
      rateUnit: 'MINUTE' | 'ITEM'
      /** 费率说明 */
      description: string
    }

    /** 获取基础费率 - 响应 */
    export interface ResGetBaseRatesApi {
      /** 学校ID */
      schoolId: number
      /** 年级ID */
      gradeId: number
      /** 费率列表 */
      rates: IRateInfo[]
    }
  }

  export namespace Payment {
    /** 平台套餐购买请求 */
    export interface ReqPostPlatformPurchaseApi {
      /** 平台套餐 ID */
      platformPackageId: number
    }

    /** 购买套餐 - 请求 */
    export interface ReqPostPurchaseApi {
      /** 套餐ID */
      packageId: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 支付方式 */
      paymentMethod: TPaymentMethod
    }

    /** 微信JSAPI支付参数 */
    export interface IJsApiPayParams {
      /** 微信小程序AppID */
      appId: string
      /** 时间戳 */
      timeStamp: string
      /** 随机字符串 */
      nonceStr: string
      /** 订单详情扩展字符串 */
      package: string
      /** 签名方式 */
      signType: string
      /** 签名 */
      paySign: string
      /** 预支付交易会话ID */
      prepayId: string
      /** 商户号 */
      partnerId: string
    }

    /** 购买套餐 - 响应 */
    export interface ResPostPurchaseApi {
      /** 订单号 */
      orderId: string
      /** 套餐ID */
      packageId: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 同支付单下的套餐记录 ID 列表 */
      packageRecordIds?: number[]
      /** 支付金额 */
      amount: number
      /** 支付参数 */
      paymentParams: IJsApiPayParams
    }

    /** 平台套餐购买响应 */
    export type ResPostPlatformPurchaseApi = ResPostPurchaseApi

    /** 继续支付已存在的套餐订单 - 请求 */
    export interface ReqPostContinuePaymentApi {
      /** 订单号 */
      orderNo: string
      /** 支付方式 */
      paymentMethod: TPaymentMethod
    }

    /** 继续支付已存在的套餐订单 - 响应 */
    export interface ResPostContinuePaymentApi {
      /** 订单号 */
      orderId: string
      /** 套餐ID */
      packageId: number
      /** 支付金额 */
      amount: number
      /** 支付参数 */
      paymentParams: IJsApiPayParams
    }

    /** 取消套餐购买订单 - 请求 */
    export interface ReqPostCancelPaymentApi {
      /** 订单号 */
      orderNo: string
    }

    /** 取消套餐购买订单 - 响应 */
    export interface ResPostCancelPaymentApi {
      /** 操作结果消息 */
      message: string
    }

    /** 检查是否存在待支付的套餐订单 - 请求 */
    export interface ReqGetPendingPaymentApi {
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 套餐来源类型 */
      packageKind?: TPackageKind
    }

    /** 检查是否存在待支付的套餐订单 - 响应 */
    export interface ResGetPendingPaymentApi {
      /** 是否有待支付订单 */
      hasPending: boolean
      /** 订单号 */
      orderNo?: string
      /** 学生ID */
      studentId?: number
      /** 套餐ID */
      packageId?: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 同支付单下的套餐记录 ID 列表 */
      packageRecordIds?: number[]
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 平台套餐模块权益 */
      modules?: Platform.IModule[]
      /** 套餐名称 */
      packageName?: string
      /** 订单金额 */
      amount?: number
      /** 支付方式 */
      paymentMethod?: TPaymentMethod
      /** 支付类型 */
      paymentType?: 'PACKAGE_PURCHASE'
      /** 创建时间 */
      createdAt?: string
      /** 过期时间 */
      expireAt?: string
      /** 剩余时间（秒） */
      remainingTime?: number
      /** 提示消息 */
      message: string
    }

    /** 获取套餐订单详情 - 请求 */
    export interface ReqGetOrderDetailApi {
      /** 订单号 */
      orderNo: string
    }

    /** 获取套餐订单详情 - 响应 */
    export interface ResGetOrderDetailApi {
      /** 订单号 */
      orderNo: string
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 学号 */
      studentCode: string
      /** 订单金额 */
      amount: string
      /** 支付方式 */
      paymentMethod: TPaymentMethod
      /** 订单状态 */
      status: number
      /** 状态文本 */
      statusText: string
      /** 交易号 */
      transactionId: string | null
      /** 支付时间 */
      payTime: string | null
      /** 过期时间 */
      expireAt: string | null
      /** 剩余有效时间（秒） */
      remainingTime: number
      /** 创建时间 */
      createdAt: string
      /** 套餐模板ID */
      packageId: number | null
      /** 套餐名称 */
      packageName: string
      /** 套餐模块权益 */
      modules?: Platform.IModule[]
      /** 套餐内容快照 */
      packageContent?: Query.IPackageSnapshotData | null
      /** 学生购买套餐的记录ID（支付成功后才有值） */
      packageRecordId: number | null
      /** 同支付单下的套餐记录 ID 列表 */
      packageRecordIds?: number[]
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 状态编码 */
      statusCode?: string
      /** 是否可以退款 */
      canRefund: boolean
      /** 不可退款原因（当canRefund为false时返回具体原因） */
      refundReason?: string
      /** 套餐总月数 */
      totalMonths: number
      /** 预计开始日期 */
      startDate: string | null
      /** 预计结束日期 */
      endDate: string | null
      /** 套餐说明 */
      templateDescription: string
      /** 使用规则 */
      usageRules: string
      /** 学校名称 */
      schoolName: string
      /** 班级名称 */
      className: string
    }
  }

  export namespace Refund {
    /** 申请平台套餐退费 - 请求 */
    export interface ReqPostApplyRefundApi {
      /** 套餐记录ID */
      packageRecordId: number
      /** 申请退费原因 */
      applyReason: string
      /** 套餐来源类型 */
      packageKind?: TPackageKind
    }

    /** 申请平台套餐退费 - 响应 */
    export interface ResPostApplyRefundApi {
      /** 退费申请ID */
      refundApplicationId: number
      /** 退费流水号 */
      refundNo: string
      /** 申请退费金额 */
      applyAmount: string
      /** 退费状态 */
      status: TRefundStatus
      /** 退费计算明细 */
      refundCalculation?: IRefundCalculation | null
    }

    /** 检查是否存在待审核的平台套餐退费申请 - 请求 */
    export interface ReqGetPendingApi {
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 设备类型 */
      deviceType?: TDeviceType
    }

    /** 待审核的平台套餐退费申请信息 */
    export interface IPendingApplication {
      /** 退费申请ID */
      refundApplicationId: number
      /** 退费单号 */
      refundNo: string
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 套餐记录ID */
      packageRecordId?: number
      /** 同支付单下的套餐记录ID列表 */
      packageRecordIds?: number[]
      /** 套餐退款来源 */
      packageSource?: TPackageRefundSource
      /** 是否平台套餐退款 */
      isPlatformPackage?: boolean
      /** 平台套餐ID */
      platformPackageId?: number | null
      /** 套餐名称 */
      packageName?: string
      /** 平台套餐兼容名称 */
      name?: string
      /** 平台套餐模块列表 */
      modules?: Platform.IModule[]
      /** 申请金额 */
      applyAmount: string
      /** 申请时间 */
      applyTime: string
      /** 申请原因 */
      applyReason: string
      /** 状态 */
      status: TRefundStatus
      /** 状态文本 */
      statusText: string
    }

    /** 检查是否存在待审核的平台套餐退费申请 - 响应 */
    export interface ResGetPendingApi {
      /** 是否有待审核的申请 */
      hasPendingAudit: boolean
      /** 待审核的申请信息 */
      pendingApplication?: IPendingApplication | null
    }

    /** 取消平台套餐退费申请 - 响应 */
    export interface ResPostCancelApi {
      /** 提示信息 */
      message: string
      /** 退费申请ID */
      refundApplicationId: number
    }

    /** 获取平台套餐退费申请列表 - 请求 */
    export interface ReqGetListApi {
      /** 退费状态筛选 */
      status?: TRefundStatus
      /** 页码 */
      page?: number
      /** 每页数量 */
      pageSize?: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
    }

    /** 套餐退费申请记录 */
    export interface IRefundApplicationRecord {
      /** 申请ID */
      id: number
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 退费单号 */
      refundNo: string
      /** 套餐记录ID */
      packageRecordId: number
      /** 套餐名称 */
      packageName: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 套餐记录列表 */
      packageRecordIds?: number[]
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 套餐退款来源 */
      packageSource?: TPackageRefundSource
      /** 是否平台套餐退款 */
      isPlatformPackage?: boolean
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 平台套餐模块列表 */
      modules?: Platform.IModule[]
      /** 原始价格 */
      originalPrice: string
      /** 申请金额 */
      applyAmount: string
      /** 实际退款金额 */
      actualAmount: string | null
      /** 状态 */
      status: TRefundStatus
      /** 状态文本 */
      statusText: string
      /** 申请原因 */
      applyReason: string
      /** 管理员备注 */
      adminRemark: string
      /** 申请时间 */
      applyTime: string
      /** 审核时间 */
      auditTime: string | null
    }

    /** 获取平台套餐退费申请列表 - 响应 */
    export interface ResGetListApi {
      /** 列表 */
      list: IRefundApplicationRecord[]
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 总数量 */
      total: number
      /** 总页数 */
      totalPages: number
    }

    /** 平台套餐退款预览 - 请求 */
    export interface ReqPostRefundPreviewApi {
      /** 套餐购买记录 ID */
      packageRecordId: number
      /** 套餐来源类型 */
      packageKind?: TPackageKind
    }

    /** 平台套餐退款计算明细 */
    export interface IRefundCalculation {
      /** 套餐原价 */
      originalPrice: string
      /** 套餐总天数 */
      totalDays: number
      /** 剩余天数 */
      remainingDays: number
      /** 时间比例 */
      timeRatio: number
      /** 已使用价值 */
      usedValue: string
      /** 基础退费金额 */
      baseRefundAmount: string
      /** 最终退费金额 */
      refundAmount: string
    }

    /** 平台套餐退款预览 - 响应 */
    export interface ResPostRefundPreviewApi {
      /** 是否可退款 */
      canRefund: boolean
      /** 不可退款原因 */
      refundReason: string
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 预估退费金额 */
      refundAmount: string
      /** 退费计算明细 */
      calculation?: IRefundCalculation | null
    }

    /** 套餐内容 */
    export interface IRefundPackageContent {
      /** 视频通话分钟数 */
      videoCallMinutes?: number
      /** 留言条数 */
      messageCount?: number
      /** 吹风机分钟数 */
      dryerMinutes?: number
    }

    /** 获取平台套餐退款详情 - 响应 */
    export interface ResGetDetailApi {
      /** 退款申请ID */
      id: number
      /** 退款流水号 */
      refundNo: string
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 学号 */
      studentCode: string
      /** 申请退款金额 */
      applyAmount: string
      /** 实际退款金额 */
      actualAmount: string | null
      /** 退款状态 */
      status: TRefundStatus
      /** 状态文本 */
      statusText: string
      /** 申请原因 */
      applyReason: string
      /** 管理员备注 */
      adminRemark: string
      /** 申请时间 */
      applyTime: string
      /** 审核时间 */
      auditTime: string | null
      /** 完成时间 */
      completeTime: string | null
      /** 套餐记录ID */
      packageRecordId: number
      /** 同支付单下的套餐记录ID列表 */
      packageRecordIds?: number[]
      /** 套餐来源类型 */
      packageKind?: TPackageKind
      /** 套餐退款来源 */
      packageSource?: TPackageRefundSource
      /** 是否平台套餐退款 */
      isPlatformPackage?: boolean
      /** 平台套餐 ID */
      platformPackageId?: number | null
      /** 套餐名称 */
      packageName: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 设备类型 */
      deviceType: TDeviceType
      /** 平台套餐模块列表 */
      modules?: Platform.IModule[]
      /** 套餐内容 */
      packageContent?: IRefundPackageContent | null
      /** 购买价格 */
      purchasePrice: string
      /** 购买日期 */
      purchaseDate: string
      /** 套餐开始日期 */
      startDate: string
      /** 套餐结束日期 */
      endDate: string
      /** 套餐说明 */
      templateDescription: string
      /** 退费计算明细 */
      refundCalculation?: IRefundCalculation | null
      /** 学校名称 */
      schoolName: string
      /** 班级名称 */
      className: string
      /** 申请人姓名 */
      applicantUserName: string
    }
  }
}
