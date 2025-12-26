import type { Demo } from '@/api/interface/modules/demo'
import { http } from '@/http'

const DEMO_API = {
  LOGIN: 'https://test.hainanxinyang.net/Student/Account/DirectLogin',
}

/**
 * @description 测试登录接口
 * @param {Demo.Login.ReqPostLoginApi} params
 * @returns {Promise<Demo.Login.ResPostLoginApi>}
 */
export function postDemoLoginApi(params: Demo.Login.ReqPostLoginApi) {
  return http.post<Demo.Login.ResPostLoginApi>(DEMO_API.LOGIN, params)
}
