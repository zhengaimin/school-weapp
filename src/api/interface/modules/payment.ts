export namespace Payment {
  export namespace Recharge {
    export interface ReqPostRechargeApi {
      /** 充值金额（元） */
      amount: string
      /** 支付方式: MOCK | WECHAT */
      paymentMethod: string
      /** 设备类型: VIDEO-视频话机, DRYER-吹风机，不传默认VIDEO */
      deviceType?: string
      /** 客户端IP地址（可选，系统自动获取） */
      clientIp?: string
      /** 备注 */
      remark?: string
    }
    export interface ResPostRechargeApi {
      /** 订单号 */
      orderNo: string
      /** 学生ID */
      studentId: number
      /** 充值金额 */
      amount: string
      /** 支付参数 */
      payParams: {
        /** 应用ID */
        appId: string
        /** 时间戳 */
        timeStamp: string
        /** 随机字符串 */
        nonceStr: string
        /** 支付包 */
        package: string
        /** 签名类型 */
        signType: string
        /** 支付签名 */
        paySign: string
      }
      /** 过期时间 */
      expireAt: string
      /** 剩余时间（秒） */
      remainingTime: number
      /** 响应消息 */
      message: string
      /** 是否成功 */
      success: boolean
    }

    /** 继续支付订单-请求 */
    export interface ReqPostContinueApi {
      /** 订单号 */
      orderNo: string
      /** 支付方式 */
      paymentMethod: string
    }

    /** 继续支付订单-响应 */
    export type ResPostContinueApi = ResPostRechargeApi

    export interface ReqPostMockSuccessApi {
      /** 订单号 */
      orderNo: string
    }
  }

  export namespace Order {
    export interface ReqGetPaymentRecordsApi {
      /** 页码，默认1 */
      page?: number
      /** 每页数量，默认20 */
      pageSize?: number
      /** 支付方式筛选 */
      paymentMethod?: string
      /** 支付状态筛选 */
      status?: number
      /** 开始日期 (YYYY-MM-DD格式) */
      startDate?: string
      /** 结束日期 (YYYY-MM-DD格式) */
      endDate?: string
    }

    export interface ReqPostCancelPaymentRecordApi {
      /** 订单号 */
      orderNo: string
    }

    export interface IPaymentRecordVo {
      /** 订单金额 */
      amount: string
      /** 创建时间 */
      createdAt: string
      /** 订单ID */
      id: number
      /** 订单号 */
      orderNo: string
      /** 用户姓名 */
      userName: string
      /** 支付时间 */
      payTime: string
      /** 支付方式 */
      paymentMethod: string
      /** 支付状态 */
      status: number
      /** 状态文本 */
      statusText: string
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 交易ID */
      transactionId: string
      /** 用户ID */
      userId: number
    }

    export interface ResGetPaymentRecordsApi {
      /** 记录列表 */
      records: IPaymentRecordVo[]
      /** 总数 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
    }

    export interface ResGetPaymentDetailApi {
      /** 订单金额 */
      amount: string
      /** 创建时间 */
      createdAt: string
      /** 订单ID */
      id: number
      /** 订单号 */
      orderNo: string
      /** 支付时间 */
      payTime: string | null
      /** 支付方式 */
      paymentMethod: string
      /** 支付状态 */
      status: number
      /** 状态文本 */
      statusText: string
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 交易ID */
      transactionId: string | null
      /** 用户ID */
      userId: number
      /** 过期时间 */
      expireAt?: string | null
      /** 支付描述 */
      description?: string
      /** 学生学号 */
      studentCode: string
      /** 支付用户姓名 */
      userName: string
      /** 支付类型 */
      paymentType: string
      /** 商户号 */
      merchantNo: string | null
      /** 学校名称 */
      schoolName: string
      /** 班级名称 */
      className: string
      /** 更新时间 */
      updatedAt: string
    }

    export namespace Pending {
      /** 获取待支付订单-响应 */
      export interface ResGetPendingApi {
        amount: string
        hasPending: boolean
        message: string
      }
    }
  }

  export namespace Status {
    /** 获取支付状态-请求 */
    export interface ReqGetPaymentStatusApi {
      /** 订单号 */
      orderNo: string
    }

    /** 获取支付状态-响应 */
    export interface ResGetPaymentStatusApi {
      /** 订单号 */
      id: number
      /** 订单号 */
      orderNo: string
      /** 学生ID */
      studentId: number
      /** 充值金额 */
      amount: string
      /** 支付方式 */
      paymentMethod: string
      /** 支付状态：0-待支付，1-支付成功，2-支付失败，3-已退款，4-已取消，5-已过期 */
      status: number
      /** 状态文本 */
      statusText: string
      /** 第三方交易流水号 */
      transactionId: string
      /** 支付时间 */
      payTime: string
      /** 创建时间 */
      createdAt: string
    }
  }

  export namespace Limit {
    /** 获取支付金额限制-响应 */
    export interface ResGetPaymentLimitsApi {
      /** 是否有金额限制 */
      hasLimits: boolean
      /** 最小充值金额 */
      minAmount: string
      /** 最大充值金额 */
      maxAmount: string
      /** 限制信息描述 */
      message: string
    }
  }

  export namespace Config {
    /** 支付配置信息 */
    export interface IPaymentConfig {
      /** 固定金额选项列表（逗号分隔的字符串） */
      fixedAmounts: string
      /** 单笔支付最小金额 */
      minAmount: number | null
      /** 单笔支付最大金额 */
      maxAmount: number | null
      /** 默认推荐金额（通常为固定金额的第一个） */
      defaultAmount?: number | null
    }

    /** 获取支付配置 - 响应 */
    export interface ResGetPaymentConfigApi extends IPaymentConfig {}
  }
}
