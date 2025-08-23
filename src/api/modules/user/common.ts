import type { Common } from '@/api/interface/modules/user'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

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
  return http.get<Common.IUserInfoVo>(`${API}/user/profile`)
}

/** 微信登录 */
export function postWxLoginApi(data: Common.ReqWxLoginApi) {
  return http.post<Common.ResWxLoginApi>(`${API}/public/wx/login`, data)
}
/** 获取微信绑定的手机号 */
export function postWxPhoneApi(data: Common.ReqWxPhoneApi) {
  return http.post<Common.ResWxPhoneApi>(`${API}/public/wx/bind-phone`, data)
}

/** 更新用户信息 */
export function putMeInfoApi(data: Common.IUserInfoVo) {
  return http.put(`${API}/user/info`, data)
}

/** 刷新token */
export function postRefreshTokenApi(data: { refresh_token: string }) {
  return http.post<Common.ResWxLoginApi>(`${API}/user/refresh-token`, data)
}
