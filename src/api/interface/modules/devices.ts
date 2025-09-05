export namespace Devices {
  /** 设备组信息 */
  export interface DeviceGroupInfo {
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
    /** 设备组接口别名，保持向后兼容 */
    export interface IDeviceGroup extends DeviceGroupInfo {}

    /** 获取设备组列表 - 请求 */
    export interface ReqGetDeviceGroupsApi {
      page?: number
      pageSize?: number
    }

    /** 获取设备组列表 - 响应 */
    export interface ResGetDeviceGroupsApi {
      deviceGroups: DeviceGroupInfo[]
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
    /** 单个订阅信息 */
    export interface MySubscription {
      code: string
      currentDeviceCount: number
      description: string
      id: number
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
      subscribed: MySubscription[]
      unsubscribed: MySubscription[]
    }
  }
}
