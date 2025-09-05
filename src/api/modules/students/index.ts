import type { Students } from '@/api/interface/modules/students'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const STUDENTS_API = {
  SEARCH: `${API}/public/student/search`,
  LIST: `${API}/student/list`,
  SWITCH_CHILD: `${API}/parent/switch-child`,
  BIND: `${API}/student/bind`,
  FACE: `${API}/student/face`,
}

/** 搜索学生 - 公共接口 */
export function postPublicStudentApi(params: Students.ReqPostPublicStudentApi) {
  return http.post<Students.ResPostPublicStudentApi>(STUDENTS_API.SEARCH, params)
}
/** 获取家长的绑定的孩子列表 */
export function getStudentListByParentApi() {
  return http.get<Students.ResGetStudentListByParent>(STUDENTS_API.LIST)
}

/** 家长切换当前学生 */
export function postParentSwitchChildApi(params: Students.ReqPostParentSwitchChildApi) {
  return http.post<Students.ResPostParentSwitchChildApi>(STUDENTS_API.SWITCH_CHILD, params)
}

/** 家长绑定学生 */
export function postBindStudentApi(data: Students.ReqPostBindStudentApi) {
  return http.post<Students.ResPostBindStudentApi>(STUDENTS_API.BIND, data)
}

/** 更新学生人脸 */
export function putStudentFaceApi(params: Students.ReqPutStudentFaceApi) {
  return http.put<Students.ResPutStudentFaceApi>(STUDENTS_API.FACE, params)
}
