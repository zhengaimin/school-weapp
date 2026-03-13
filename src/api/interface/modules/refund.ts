import type { TDeviceType, TRefundStatus } from '@/constant/modules'

// src/api/interface/modules/refund.ts
export namespace Refund {
  /** 单个退款申请信息 */
  export interface IRefundApplicationVo {
    /** 退款申请ID */
    id: number
    /** 退款申请单号 */
    refundNo: string
    /** 设备类型 */
    deviceType?: TDeviceType
    /** 申请退款金额 */
    applyAmount: string
    /** 实际退款金额 */
    actualAmount: string | null
    /** 状态：0-待审核，1-审核通过，2-退款处理中，3-退款完成，4-部分退款完成，5-审核拒绝，6-用户取消 */
    status: TRefundStatus
    /** 状态文本 */
    statusText: string
    /** 申请原因 */
    applyReason: string
    /** 管理员备注 */
    adminRemark: string | null
    /** 申请时间 */
    applyTime: string
    /** 审核时间 */
    auditTime: string | null
    /** 完成时间 */
    completeTime: string | null
  }

  /** 退款明细信息 */
  export interface IRefundDetailVo {
    /** 退款详情ID */
    id: number
    /** 本笔退款金额 */
    refundAmount: string
    /** 原充值金额 */
    originalAmount: string
    /** 原支付方式 */
    originalPaymentMethod: string
    /** 原第三方交易流水号 */
    originalTransactionId: string | null
    /** 原支付时间 */
    originalPayTime: string | null
    /** 第三方退款流水号 */
    thirdPartyRefundId: string | null
    /** 退款状态：0-待退款，1-退款成功，2-退款失败 */
    refundStatus: number
    /** 退款状态文本 */
    refundStatusText: string
    /** 退款失败原因 */
    refundFailReason: string | null
  }

  export namespace Application {
    /** 申请退款 - 请求 */
    export interface ReqPostApplyApi {
      /** 设备类型：VIDEO-视频话机，DRYER-吹风机，不传默认VIDEO */
      deviceType?: 'VIDEO' | 'DRYER'
      /** 退款类型: FULL-全额退款, SINGLE-单笔退款 */
      refundType: 'FULL' | 'SINGLE'
      /** 充值订单ID（单笔退款时必填） */
      paymentId?: number
      /** 申请原因 */
      applyReason: string
    }

    /** 申请退款 - 响应 */
    export interface ResPostApplyApi {
      /** 退款申请单号 */
      refundNo: string
      /** 申请退款金额 */
      applyAmount: string
      /** 状态：0-待审核，1-审核通过，2-审核拒绝，3-退款完成 */
      status: number
      /** 申请时间 */
      applyTime: string
    }

    /** 获取退款申请列表 - 请求 */
    export interface ReqGetListApi {
      /** 页码，默认1 */
      page?: number
      /** 每页数量，默认10，最大100 */
      pageSize?: number
      /** 退款状态筛选：0-待审核，1-审核通过，2-退款处理中，3-退款完成，4-部分退款完成，5-审核拒绝，6-用户取消 */
      status?: TRefundStatus
      /** 设备类型筛选：VIDEO-视频话机，DRYER-吹风机 */
      deviceType?: TDeviceType
      /** 退款类型筛选：FULL-全额退款，SINGLE-单笔退款 */
      refundType?: 'FULL' | 'SINGLE'
      /** 开始时间筛选（格式：YYYY-MM-DD HH:mm:ss） */
      startTime?: string
      /** 结束时间筛选（格式：YYYY-MM-DD HH:mm:ss） */
      endTime?: string
      /** 最小金额筛选 */
      minAmount?: string
      /** 最大金额筛选 */
      maxAmount?: string
    }

    /** 获取退款申请列表 - 响应 */
    export interface ResGetListApi {
      list: IRefundApplicationVo[]
      /** 总记录数 */
      total: number
      /** 当前页码 */
      page: number
      /** 每页数量 */
      pageSize: number
      /** 总页数 */
      totalPages: number
    }

    /** 获取退款申请详情 - 响应 */
    export interface ResGetDetailApi extends IRefundApplicationVo {
      /** 设备类型 */
      deviceType?: TDeviceType
      /** 退款详情列表 */
      refundDetails: IRefundDetailVo[]
    }

    /** 用户取消退款申请 - 响应 */
    export interface ResPostCancelApi {
      /** 操作结果消息 */
      message: string
      /** 退款申请ID */
      refundApplicationId: number
    }

    /** 检查待审核退款申请 - 请求 */
    export interface ReqGetPendingApi {
      /** 设备类型：VIDEO-视频话机，DRYER-吹风机 */
      deviceType?: 'VIDEO' | 'DRYER'
    }

    /** 检查待审核退款申请 - 响应 */
    export interface ResGetPendingApi {
      /** 是否存在待审核的退款申请 */
      hasPending: boolean
      /** 退款申请ID（当存在待审核申请时返回） */
      applicationId?: number
      /** 退款金额（当存在待审核申请时返回） */
      refundAmount?: string
      /** 退款类型（当存在待审核申请时返回） */
      refundType?: string
      /** 退款类型名称（当存在待审核申请时返回） */
      refundTypeName?: string
      /** 申请状态（当存在待审核申请时返回） */
      status?: number
      /** 状态文本（当存在待审核申请时返回） */
      statusText?: string
      /** 申请原因（当存在待审核申请时返回） */
      reason?: string
      /** 提交时间（当存在待审核申请时返回） */
      submittedAt?: string
      /** 提交天数（当存在待审核申请时返回） */
      submittedDays?: number
      /** 响应消息 */
      message: string
    }
  }
}
