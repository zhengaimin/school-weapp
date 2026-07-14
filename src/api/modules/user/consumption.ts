import type { User } from '@/api/interface/modules/user'
import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const USER_CONSUMPTION_API = {
  STATISTICS: `${API}/user/consumption/statistics`,
  RECORDS: `${API}/user/consumption/records`,
}

/** 获取消费统计 */
export function getConsumptionStatisticsApi() {
  return http.get<User.Consumption.IConsumptionStatisticsVo>(USER_CONSUMPTION_API.STATISTICS)
}

/** 获取消费记录列表 */
export function getConsumptionRecordsApi(params: User.Consumption.ReqGetConsumptionRecords) {
  return http
    .get<User.Consumption.ResGetConsumptionRecords>(USER_CONSUMPTION_API.RECORDS, params)
}
