import type { User } from '@/api/interface/modules/user'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const USER_PARENT_API = {
  REGISTER: `${API}/public/parent/register`,
}

/** 家长注册并绑定孩子 */
export function postParentRegisterApi(params: User.Parent.IReqPostParentRegisterApi) {
  return http.post<User.Parent.IResPostParentRegisterApi>(USER_PARENT_API.REGISTER, params)
}
