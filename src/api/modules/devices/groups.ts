import type { Devices } from '@/api/interface/modules/devices'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const DEVICES_GROUPS_API = {
  GROUPS: `${API}/devices/groups`,
  SUBSCRIBE: `${API}/devices/groups/subscribe`,
  UNSUBSCRIBE: `${API}/devices/groups/unsubscribe`,
  SUBSCRIPTIONS: `${API}/devices/subscriptions`,
}

/**
 * @description 获取设备组列表
 * @param {Devices.Group.ReqGetDeviceGroupsApi} params
 * @returns {Promise<Devices.Group.ResGetDeviceGroupsApi>}
 */
export function getDeviceGroupsApi(params: Devices.Group.ReqGetDeviceGroupsApi) {
  return http.get<Devices.Group.ResGetDeviceGroupsApi>(DEVICES_GROUPS_API.GROUPS, params)
}

/**
 * @description 订阅设备组
 * @param {Devices.Group.ReqPostSubscribeDeviceGroupApi} params
 * @returns {Promise<Devices.Group.ResPostSubscribeDeviceGroupApi>}
 */
export function postSubscribeDeviceGroupApi(params: Devices.Group.ReqPostSubscribeDeviceGroupApi) {
  return http.post<Devices.Group.ResPostSubscribeDeviceGroupApi>(DEVICES_GROUPS_API.SUBSCRIBE, params)
}

/**
 * @description 取消订阅设备组
 * @param {Devices.Group.ReqPostUnsubscribeDeviceGroupApi} params
 * @returns {Promise<Devices.Group.ResPostUnsubscribeDeviceGroupApi>}
 */
export function postUnsubscribeDeviceGroupApi(params: Devices.Group.ReqPostUnsubscribeDeviceGroupApi) {
  return http.post<Devices.Group.ResPostUnsubscribeDeviceGroupApi>(DEVICES_GROUPS_API.UNSUBSCRIBE, params)
}

/**
 * @description 获取我的订阅列表
 * @param {Devices.Subscription.ReqGetMySubscriptionsApi} params
 * @returns {Promise<Devices.Subscription.ResGetMySubscriptionsApi>}
 */
export function getDeviceSubscriptionsApi(params: Devices.Subscription.ReqGetMySubscriptionsApi) {
  return http.get<Devices.Subscription.ResGetMySubscriptionsApi>(DEVICES_GROUPS_API.SUBSCRIPTIONS, params)
}
