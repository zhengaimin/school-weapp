import type { Students } from '@/api/interface/modules/students'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

/** 搜索学生 - 公共接口 */
export function postPublicStudentApi(params: Students.ReqPostPublicStudentApi) {
  return http.post<Students.ResPostPublicStudentApi>(`${API}/public/student/search`, params)
}
/** 获取家长的绑定的孩子列表 */
export function getStudentListByParentApi() {
  return http.get<Students.ResGetStudentListByParent>(`${API}/student/list`)
}
