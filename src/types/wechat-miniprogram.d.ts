declare namespace WechatMiniprogram {
  interface DeviceGroupVoIPListItem {
    /** 微信设备组 ID */
    group_id?: string
    /** 授权状态：0-未授权，1-已授权 */
    status: 0 | 1
  }

  interface GetDeviceGroupVoIPListSuccessCallbackResult extends GeneralCallbackResult {
    /** 已申请音视频通话的设备或设备组 */
    list: DeviceGroupVoIPListItem[]
  }

  interface GetDeviceGroupVoIPListOption {
    /** 接口调用结束的回调函数 */
    complete?: (result: GeneralCallbackResult) => void
    /** 接口调用失败的回调函数 */
    fail?: (result: GeneralCallbackResult) => void
    /** 接口调用成功的回调函数 */
    success?: (result: GetDeviceGroupVoIPListSuccessCallbackResult) => void
  }

  interface RequestDeviceGroupVoIPOption {
    /** 微信设备组 ID */
    groupId: string
    /** 是否按设备组授权 */
    isGroup: true
    /** 接口调用结束的回调函数 */
    complete?: (result: GeneralCallbackResult) => void
    /** 接口调用失败的回调函数 */
    fail?: (result: GeneralCallbackResult) => void
    /** 接口调用成功的回调函数 */
    success?: (result: GeneralCallbackResult) => void
  }

  interface Wx {
    /** 查询当前用户授权的音视频通话设备或设备组 */
    getDeviceVoIPList?: (options?: GetDeviceGroupVoIPListOption) => void
    /** 请求用户授权与设备组进行音视频通话 */
    requestDeviceVoIP?: (options: RequestDeviceGroupVoIPOption) => void
  }
}
