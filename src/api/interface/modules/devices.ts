export namespace Devices {
  /** 设备组信息 */
  export interface IDeviceGroupVo {
    id: number
    code: string
    name: string
    description?: string
    maxDeviceCount: number
    currentDeviceCount: number
    allowVideoCall: boolean
    allowVoiceCall: boolean
    notificationEnabled: boolean
    status: number
    isVoipGroup: boolean
    provinceId?: number | null
    cityId?: number | null
    locationText: string
    createdAt: string
    updatedAt: string
    subscriptionStatus?: number
  }

  export namespace Group {
    /** 获取设备组列表 - 请求 */
    export interface ReqGetDeviceGroupsApi {
      page?: number
      pageSize?: number
    }

    /** 获取设备组列表 - 响应 */
    export interface ResGetDeviceGroupsApi {
      deviceGroups: IDeviceGroupVo[]
      total: number
    }

    /** 订阅设备组 - 请求 */
    export interface ReqPostSubscribeDeviceGroupApi {
      deviceGroupId: number
    }

    /** 订阅设备组 - 响应 */
    export interface ResPostSubscribeDeviceGroupApi {
      subscriptionId: number
      message: string
      subscribedAt: string
    }

    /** 取消订阅设备组 - 请求 */
    export interface ReqPostUnsubscribeDeviceGroupApi {
      deviceGroupId: number
    }

    /** 取消订阅设备组 - 响应 */
    export interface ResPostUnsubscribeDeviceGroupApi {
      success: boolean
      message: string
    }
  }
  /** 取消订阅设备组 - 响应 */
  export interface ResPostUnsubscribeDeviceGroupApi {
    success: boolean
    message: string
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
