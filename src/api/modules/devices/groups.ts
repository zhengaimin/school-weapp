import type { Devices } from '@/api/interface/modules/devices'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const DEVICES_GROUPS_API = {
  GROUPS: `${API}/devices/groups`,
  SUBSCRIBE: `${API}/devices/groups/subscribe`,
  UNSUBSCRIBE: `${API}/devices/groups/unsubscribe`,
  SUBSCRIPTIONS: `${API}/devices/subscriptions`,
}

/** 获取设备组列表 */
export function getDeviceGroupsApi(params: Devices.Group.ReqGetDeviceGroupsApi) {
  return http.get<Devices.Group.ResGetDeviceGroupsApi>(DEVICES_GROUPS_API.GROUPS, params)
}

/** 订阅设备组 */
export function postSubscribeDeviceGroupApi(params: Devices.Group.ReqPostSubscribeDeviceGroupApi) {
  return http.post<Devices.Group.ResPostSubscribeDeviceGroupApi>(DEVICES_GROUPS_API.SUBSCRIBE, params)
}

/** 取消订阅设备组 */
export function postUnsubscribeDeviceGroupApi(params: Devices.Group.ReqPostUnsubscribeDeviceGroupApi) {
  return http.post<Devices.Group.ResPostUnsubscribeDeviceGroupApi>(DEVICES_GROUPS_API.UNSUBSCRIBE, params)
}

/** 获取我的订阅列表 */
export function getDeviceSubscriptionsApi(params: Devices.Subscription.ReqGetMySubscriptionsApi) {
  return http.get<Devices.Subscription.ResGetMySubscriptionsApi>(DEVICES_GROUPS_API.SUBSCRIPTIONS, params)
}
