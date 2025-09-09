import type { User } from '@/api/interface/modules/user'
import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const USER_COMMON_API = {
  PROFILE: `${API}/user/profile`,
  WX_LOGIN: `${API}/public/wx/login`,
  WX_BIND_PHONE: `${API}/public/wx/bind-phone`,
  BALANCE: `${API}/user/balance`,
  BALANCE_DETAILS: `${API}/user/balance/details`,
}

/**
 * @description 获取微信登录凭证
 * @returns {Promise<UniApp.LoginRes>}
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}

/**
 * @description 获取用户信息
 * @returns {Promise<User.Common.IUserInfoVo>}
 */
export function getUserInfoApi() {
  return http.get<User.Common.IUserInfoVo>(USER_COMMON_API.PROFILE)
}

/**
 * @description 微信登录
 * @param {User.Common.ReqWxLoginApi} data
 * @returns {Promise<User.Common.ResWxLoginApi>}
 */
export function postWxLoginApi(data: User.Common.ReqWxLoginApi) {
  return http.post<User.Common.ResWxLoginApi>(USER_COMMON_API.WX_LOGIN, data)
}

/**
 * @description 获取微信绑定的手机号
 * @param {User.Common.ReqWxPhoneApi} data
 * @returns {Promise<User.Common.ResWxPhoneApi>}
 */
export function postWxPhoneApi(data: User.Common.ReqWxPhoneApi) {
  return http.post<User.Common.ResWxPhoneApi>(USER_COMMON_API.WX_BIND_PHONE, data)
}

/**
 * @description 获取用户余额信息
 * @returns {Promise<User.Common.IStudentBalanceVo>}
 */
export function getUserBalanceApi() {
  return http.get<User.Common.IStudentBalanceVo>(USER_COMMON_API.BALANCE)
}

/**
 * @description 更新用户信息
 * @param {User.Common.ReqPutMeInfoApi} data
 * @returns {Promise<any>}
 */
export function putMeInfoApi(data: User.Common.ReqPutMeInfoApi) {
  return http.put(USER_COMMON_API.PROFILE, data)
}

/**
 * @description 获取资金流水明细
 * @param {User.Balance.ReqGetBalanceDetails} params 请求参数
 * @returns {Promise<User.Balance.ResGetBalanceDetails>} 资金流水明细响应
 */
export function getBalanceDetailsApi(params: User.Balance.ReqGetBalanceDetails) {
  return http.get<User.Balance.ResGetBalanceDetails>(USER_COMMON_API.BALANCE_DETAILS, params)
}
