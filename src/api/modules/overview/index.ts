import type { Overview } from '@/api/interface/modules/overview'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const OVERVIEW_API = {
  STUDENTS: `${API}/overview/students`,
}

/**
 * @description 获取概览学生列表
 * @returns {Promise<Overview.Students.ResGetListApi>}
 */
export function getOverviewStudentsApi() {
  return http.get<Overview.Students.ResGetListApi>(OVERVIEW_API.STUDENTS)
}
