import type {
  TPackageBuyStatus,
  TPackageType,
  TPaymentMethod,
  TRefundStatus,
  TServiceType,
} from '@/constant/modules'

export namespace Pkg {
  // #region 套餐查询
  export namespace Query {
    // #region 获取可购买套餐列表
    /** 获取可购买套餐列表 - 请求 */
    export interface ReqGetAvailableApi {
      /** 页码，默认1 */
      page?: number
      /** 每页数量，默认20 */
      pageSize?: number
    }

    /** 套餐内容 */
    export interface IPackageContent {
      /** 视频通话分钟数 */
      videoCallMinutes: number
      /** 留言条数 */
      messageCount: number
    }

    /** 套餐信息 */
    export interface IPackage {
      /** 套餐ID */
      id: number
      /** 套餐编码 */
      templateCode: string
      /** 套餐名称 */
      packageName: string
      /** 套餐内容 */
      packageContent: IPackageContent
      /** 实际购买价格 */
      purchasePrice: number
      /** 基础月价格 */
      monthlyPrice: number
      /** 套餐总月数 */
      totalMonths: number
      /** 套餐说明 */
      templateDescription: string
      /** 使用规则 */
      usageRules: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 套餐开始时间（固定套餐专用） */
      startTime: string
      /** 套餐结束时间（固定套餐专用） */
      endTime: string
      /** 是否按月递减（固定套餐专用） */
      monthlyDecrease: boolean
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
    // #endregion

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
      /** 总月数 */
      totalMonths: number
      /** 是否按月重置 */
      monthlyReset: boolean
      /** 首月是否按比例计算 */
      firstMonthRatio: boolean
      /** 是否按月递减 */
      monthlyDecrease: boolean
    }

    // #region 获取套餐购买记录
    /** 套餐购买信息 */
    export interface IPackagePurchaseVo {
      /** 套餐记录ID */
      id: number
      /** 套餐ID */
      packageId: number
      /** 购买日期 */
      purchaseDate: string
      /** 购买价格 */
      purchasePrice: string
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
      /** 状态文本 */
      statusText: string
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
    }
    // #endregion

    // #region 获取学生当前正在使用的套餐
    /** 购买者信息 */
    export interface IPurchaserInfo {
      /** 用户ID */
      userId: number
      /** 用户名称 */
      userName: string
    }

    /** 活跃套餐信息 */
    export interface IStudentActivePackageVo {
      /** 套餐记录ID */
      id: number
      /** 套餐ID */
      packageId: number
      /** 购买日期 */
      purchaseDate: string
      /** 支付日期 */
      paymentDate: string | null
      /** 生效日期 */
      startDate: string
      /** 到期日期 */
      endDate: string
      /** 状态 */
      status: number
      /** 状态文本 */
      statusText: string
      /** 购买者信息 */
      purchaserInfo: IPurchaserInfo
      /** 快照信息 */
      snapshotInfo: ISnapshotInfo
      /** 套餐是否存在 */
      isPackageExists: boolean
      /** 当前模板 */
      currentTemplate: any
    }

    export interface ResGetStudentActiveApi {
      /** 学生ID */
      studentId: number
      /** 套餐总数 */
      totalCount: number
      /** 活跃套餐列表 */
      activePackages: IStudentActivePackageVo[]
      /** 待生效的套餐列表 */
      waitingPackages: IStudentActivePackageVo[]
    }
    // #endregion

    // #region 获取套餐详情
    /** 获取套餐详情 - 响应 */
    export interface ResGetPackageDetailApi {
      /** 套餐记录ID */
      id: number
      /** 套餐模板ID */
      packageTemplateId: number
      /** 模板代码 */
      templateCode: string
      /** 套餐类型 */
      packageType: TPackageType
      /** 套餐内容 */
      packageContent: {
        /** 留言条数 */
        messageCount: number
        /** 视频通话分钟数 */
        videoCallMinutes: number
      }
      /** 购买时间 */
      purchaseDate: string
      /** 购买价格 */
      purchasePrice: string
      /** 支付时间 */
      paymentDate: string | null
      /** 支付订单号 */
      paymentOrderNo: string
      /** 购买者信息 */
      purchaserInfo: any | null
      /** 开始时间 */
      startDate: string
      /** 结束时间 */
      endDate: string
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
      }
      /** 是否可退款 */
      canRefund: boolean
      /** 剩余可退款金额 */
      remainingRefundAmount: string
      /** 退款状态 */
      refundStatus: string
      /** 模板描述 */
      templateDescription: string
      /** 总月份 */
      totalMonths: number
      /** 使用规则 */
      usageRules: string
    }
    // #endregion

    // #region 获取基础费率
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
    // #endregion
  }
  // #endregion

  // #region 套餐支付
  export namespace Payment {
    // #region 购买套餐
    /** 购买套餐 - 请求 */
    export interface ReqPostPurchaseApi {
      /** 套餐ID */
      packageId: number
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
      /** 支付金额 */
      amount: number
      /** 支付参数 */
      paymentParams: IJsApiPayParams
    }
    // #endregion

    // #region 继续支付已存在的套餐订单
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
    // #endregion

    // #region 取消套餐购买订单
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
    // #endregion

    // #region 检查是否存在待支付的套餐订单
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
    // #endregion
  }
  // #endregion

  // #region 套餐退款
  export namespace Refund {
    // #region 申请套餐退费
    /** 申请套餐退费 - 请求 */
    export interface ReqPostApplyRefundApi {
      /** 套餐记录ID */
      packageRecordId: number
      /** 申请退费原因 */
      applyReason: string
    }

    /** 申请套餐退费 - 响应 */
    export interface ResPostApplyRefundApi {}
    // #endregion

    // #region 检查是否存在待审核的套餐退费申请
    /** 检查是否存在待审核的套餐退费申请 - 响应 */
    /** 待审核的套餐退费申请信息 */
    export interface IPendingApplication {
      /** 退费申请ID */
      refundApplicationId: number
      /** 退费单号 */
      refundNo: string
      /** 套餐记录ID */
      packageRecordId: number
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

    export interface ResGetPendingApi {
      /** 是否有待审核的申请 */
      hasPendingAudit: boolean
      /** 待审核的申请信息 */
      pendingApplication?: IPendingApplication
    }
    // #endregion

    // #region 取消套餐退费申请
    /** 取消套餐退费申请 - 响应 */
    export interface ResPostCancelApi {
      /** 提示信息 */
      message: string
      /** 退费申请ID */
      refundApplicationId: number
    }
    // #endregion

    // #region 获取套餐退费申请列表
    /** 获取套餐退费申请列表 - 请求 */
    export interface ReqGetListApi {
      /** 退费状态筛选 */
      status?: number
      /** 页码 */
      page?: number
      /** 每页数量 */
      pageSize?: number
    }

    /** 套餐退费申请记录 */
    export interface IRefundApplicationRecord {
      /** 申请ID */
      id: number
      /** 退费单号 */
      refundNo: string
      /** 套餐记录ID */
      packageRecordId: number
      /** 套餐名称 */
      packageName: string
      /** 套餐类型 */
      packageType: string
      /** 原始价格 */
      originalPrice: string
      /** 申请金额 */
      applyAmount: string
      /** 实际退款金额 */
      actualAmount: string
      /** 状态 */
      status: TRefundStatus
      /** 状态文本 */
      statusText: string
      /** 申请原因 */
      applyReason: string
      /** 管理员备注 */
      adminRemark: string
      /** 申請時間 */
      applyTime: string
      /** 审核时间 */
      auditTime: string | null
    }

    /** 获取套餐退费申请列表 - 响应 */
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
    // #endregion

    // #region 套餐退款预览
    /** 套餐退款预览 - 请求 */
    export interface ReqPostRefundPreviewApi {
      /** 套餐购买记录 ID */
      packageRecordId: number
    }

    /** 套餐退款预览 - 响应 */
    export interface ResPostRefundPreviewApi {
      /** 套餐购买记录 ID */
      packageRecordId: number
      /** 套餐名称 */
      packageName: string
      /** 购买价格 */
      purchasePrice: number
      /** 已使用价值 */
      usedValue: number
      /** 可退款金额 */
      refundableAmount: number
      /** 退款说明 */
      refundDescription: string
    }
    // #endregion
  }
  // #endregion
}
