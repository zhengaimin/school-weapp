import type { Parent } from '@/api/interface/modules/user'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

/** 家长注册并绑定孩子 */
export function postParentRegisterApi(params: Parent.IReqPostParentRegisterApi) {
  return http.post<Parent.IResPostParentRegisterApi>(`${API}/public/parent/register`, params)
}
