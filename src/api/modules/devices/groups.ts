import type { Devices } from '@/api/interface/modules/devices'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const DEVICES_GROUPS_API = {
  GROUPS: `${API}/devices/groups`,
  SUBSCRIBE_PREPARE: `${API}/devices/subscribe/prepare`,
  SUBSCRIBE_CONFIRM: `${API}/devices/subscribe/confirm`,
  UNSUBSCRIBE: `${API}/devices/unsubscribe`,
  SUBSCRIPTIONS: `${API}/devices/subscriptions`,
}

/**
 * 获取可订阅设备组列表
 * @param params 分页与名称搜索条件
 * @returns 可订阅设备组列表
 */
export function getDeviceGroupsApi(params?: Devices.Group.ReqGetDeviceGroupsApi) {
  return http.get<Devices.Group.ResGetDeviceGroupsApi>(DEVICES_GROUPS_API.GROUPS, params)
}

/**
 * 校验设备组订阅并获取微信授权参数
 * @param params 设备组标识
 * @returns 微信设备组授权参数
 */
export function postPrepareDeviceGroupSubscriptionApi(
  params: Devices.Group.ReqPostPrepareDeviceGroupSubscriptionApi,
) {
  return http.post<Devices.Group.ResPostPrepareDeviceGroupSubscriptionApi>(
    DEVICES_GROUPS_API.SUBSCRIBE_PREPARE,
    params,
  )
}

/**
 * 确认设备组订阅
 * @param params 设备组标识
 * @returns 确认订阅请求结果
 */
export function postConfirmDeviceGroupSubscriptionApi(
  params: Devices.Group.ReqPostConfirmDeviceGroupSubscriptionApi,
) {
  return http.post<Devices.Group.ResPostConfirmDeviceGroupSubscriptionApi>(
    DEVICES_GROUPS_API.SUBSCRIBE_CONFIRM,
    params,
  )
}

/**
 * 取消订阅设备组
 * @param params 亲情号联系人和设备组标识
 * @returns 取消订阅请求结果
 */
export function postUnsubscribeDeviceGroupApi(params: Devices.Group.ReqPostUnsubscribeDeviceGroupApi) {
  return http.post<null>(DEVICES_GROUPS_API.UNSUBSCRIBE, params)
}

/**
 * @description 获取我的订阅列表
 * @param {Devices.Subscription.ReqGetMySubscriptionsApi} params
 * @returns {Promise<Devices.Subscription.ResGetMySubscriptionsApi>}
 */
export function getDeviceSubscriptionsApi(params: Devices.Subscription.ReqGetMySubscriptionsApi) {
  return http.get<Devices.Subscription.ResGetMySubscriptionsApi>(DEVICES_GROUPS_API.SUBSCRIPTIONS, params)
}
