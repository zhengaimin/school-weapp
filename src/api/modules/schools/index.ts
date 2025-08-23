import type { Schools } from '@/api/interface/modules/schools'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

/** 获取学校列表 */
export function getSchoolsApi(params) {
  return http.get<Schools.ResGetSchoolsApi>(`${API}/public/schools`, params)
}

/** 获取年级列表 */
export function getGradesApi(schoolId: number) {
  return http.get<Schools.ResGetGradesApi>(`${API}/public/schools/${schoolId}/grades`)
}

/** 获取班级列表 */
export function getClassesApi(gradeId: number) {
  return http.get<Schools.ResClassesApi>(`${API}/public/grades/${gradeId}/classes`)
}
