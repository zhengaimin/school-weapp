export namespace Devices {
  /** 设备组信息 */
  export interface IDeviceGroupVo {
    /** 设备组 ID */
    id: number
    /** 设备组编码 */
    code: string
    /** 设备组名称 */
    name: string
    /** 设备组描述 */
    description?: string
    /** 最大设备数 */
    maxDeviceCount: number
    /** 当前设备数 */
    currentDeviceCount: number
    /** 状态，小程序只返回启用状态 */
    status: number
    /** 是否为 VOIP 设备组 */
    isVoipGroup: boolean
    /** 省份 ID */
    provinceId?: number | null
    /** 城市 ID */
    cityId?: number | null
    /** 地理位置显示文本 */
    locationText: string
    /** 创建时间 */
    createdAt: string
    /** 更新时间 */
    updatedAt: string
    /** 是否已订阅 */
    isSubscribed: boolean
    /** 订阅 ID，已订阅时返回 */
    subscriptionId?: number | null
    /** 订阅时间，已订阅时返回 */
    subscribedAt?: string | null
  }

  export namespace Group {
    /** 获取可订阅设备组列表 - 请求 */
    export interface ReqGetDeviceGroupsApi {
      /** 页码，默认 1 */
      page?: number
      /** 每页数量，默认 20，最大 100 */
      pageSize?: number
      /** 设备组名称，支持不区分大小写的模糊搜索 */
      name?: string
    }

    /** 获取可订阅设备组列表 - 响应 */
    export interface ResGetDeviceGroupsApi {
      /** 可订阅设备组列表 */
      deviceGroups: IDeviceGroupVo[]
      /** 总数量 */
      total: number
    }

    /** 准备订阅设备组 - 请求 */
    export interface ReqPostPrepareDeviceGroupSubscriptionApi {
      /** 亲情号联系人 ID */
      familyContactId: number
      /** 设备组 ID */
      deviceGroupId: number
    }

    /** 准备订阅设备组 - 响应 */
    export interface ResPostPrepareDeviceGroupSubscriptionApi {
      /** 设备组名称 */
      deviceGroupName: string
      /** 微信设备组授权参数 */
      wechatAuth: {
        /** 微信设备组 ID */
        groupId: string
      }
    }

    /** 确认订阅设备组 - 请求 */
    export interface ReqPostConfirmDeviceGroupSubscriptionApi {
      /** 亲情号联系人 ID */
      familyContactId: number
      /** 设备组 ID */
      deviceGroupId: number
    }

    /** 确认订阅设备组 - 响应 */
    export interface ResPostConfirmDeviceGroupSubscriptionApi {
      /** 订阅 ID */
      subscriptionId: number
      /** 订阅或重激活时间 */
      subscribedAt: string
      /** 是否为取消后的重激活 */
      reactivated: boolean
    }

    /** 取消订阅设备组 - 请求 */
    export interface ReqPostUnsubscribeDeviceGroupApi {
      /** 亲情号联系人 ID */
      familyContactId: number
      /** 设备组 ID */
      deviceGroupId: number
    }
  }
  export namespace Subscription {
    /** 订阅信息 */
    export interface ISubscriptionVo {
      /** 设备组微信 VOIP 标识 */
      groupId?: string
      code: string
      currentDeviceCount: number
      description: string
      id: number
      /** 是否允许视频通话 */
      allowVideoCall?: boolean
      /** 是否允许语音通话 */
      allowVoiceCall?: boolean
      /** 是否已开启语音/视频通话提醒 */
      notificationEnabled?: boolean
      isSubscribed: boolean
      isVoipGroup: boolean
      locationText: string
      maxDeviceCount: number
      name: string
      status: number
    }

    /** 获取我的订阅列表 - 请求 */
    export interface ReqGetMySubscriptionsApi {
      page?: number
      pageSize?: number
    }

    /** 获取我的订阅列表 - 响应 */
    export interface ResGetMySubscriptionsApi {
      subscribed: ISubscriptionVo[]
      unsubscribed: ISubscriptionVo[]
    }
  }
}
