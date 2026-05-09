import type { Gifts } from '@/api/interface/modules/gifts'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const GIFTS_API = {
  VALID: `${API}/gifts/valid`,
  SOON_TO_EXPIRE: `${API}/gifts/soon-to-expire`,
}

/**
 * @description 获取学生有效赠费记录
 * @returns {Promise<Gifts.Valid.ResGetStudentValidGiftsApi>}
 */
export function getStudentValidGiftsApi() {
  return http.get<Gifts.Valid.ResGetStudentValidGiftsApi>(GIFTS_API.VALID)
}

/**
 * @description 获取学生即将到期赠费记录
 * @param {Gifts.SoonToExpire.ReqGetSoonToExpireGiftsApi} params
 * @returns {Promise<Gifts.SoonToExpire.ResGetSoonToExpireGiftsApi>}
 */
export function getSoonToExpireGiftsApi(params: Gifts.SoonToExpire.ReqGetSoonToExpireGiftsApi) {
  return http.get<Gifts.SoonToExpire.ResGetSoonToExpireGiftsApi>(GIFTS_API.SOON_TO_EXPIRE, params)
}
