import type { Schools } from '@/api/interface/modules/schools'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const SCHOOLS_API = {
  SCHOOLS: `${API}/public/schools`,
  GRADES: (schoolId: number) => `${API}/public/schools/${schoolId}/grades`,
  CLASSES: (gradeId: number) => `${API}/public/grades/${gradeId}/classes`,
  MODULES: `${API}/miniapp/modules`,
}

/** 获取学校列表 */
export function getSchoolsApi(params) {
  return http.get<Schools.ResGetSchoolsApi>(SCHOOLS_API.SCHOOLS, params)
}

/** 获取年级列表 */
export function getGradesApi(schoolId: number) {
  return http.get<Schools.ResGetGradesApi>(SCHOOLS_API.GRADES(schoolId))
}

/** 获取班级列表 */
export function getClassesApi(gradeId: number) {
  return http.get<Schools.ResClassesApi>(SCHOOLS_API.CLASSES(gradeId))
}

/**
 * @description 获取学校模块列表
 * @returns {Promise<Schools.Modules.ResGetModulesApi>}
 */
export function getSchoolModulesApi() {
  return http.get<Schools.Modules.ResGetModulesApi>(SCHOOLS_API.MODULES)
}
