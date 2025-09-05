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

/** 获取微信登录凭证 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}

/** 获取用户信息 */
export function getUserInfoApi() {
  return http.get<User.Common.IUserInfoVo>(USER_COMMON_API.PROFILE)
}

/** 微信登录 */
export function postWxLoginApi(data: User.Common.ReqWxLoginApi) {
  return http.post<User.Common.ResWxLoginApi>(USER_COMMON_API.WX_LOGIN, data)
}
/** 微信绑定的手机号 */
export function postWxPhoneApi(data: User.Common.ReqWxPhoneApi) {
  return http.post<User.Common.ResWxPhoneApi>(USER_COMMON_API.WX_BIND_PHONE, data)
}
/** 获取用户余额信息 */
export function getUserBalanceApi() {
  return http.get<User.Common.IStudentBalanceVo>(USER_COMMON_API.BALANCE)
}

/** 更新用户信息 */
export function putMeInfoApi(data: User.Common.ReqPutMeInfoApi) {
  return http.put(USER_COMMON_API.PROFILE, data)
}

/**
 * @description 获取资金流水明细
 * @param {Balance.ReqGetBalanceDetails} params 请求参数
 * @returns {Promise<Balance.ResGetBalanceDetails>} 资金流水明细响应
 */
export function getBalanceDetailsApi(params: User.Balance.ReqGetBalanceDetails) {
  return http.get<User.Balance.ResGetBalanceDetails>(USER_COMMON_API.BALANCE_DETAILS, params)
}
