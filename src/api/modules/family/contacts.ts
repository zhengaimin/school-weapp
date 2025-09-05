import type { Family } from '@/api/interface/modules/family'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const FAMILY_CONTACTS_API = {
  CONTACTS: `${API}/family-contacts`,
  CONTACT_DETAIL: (id: number) => `${API}/family-contacts/${id}`,
  CHECK_SELF: `${API}/family-contacts/check-self`,
}

/** 获取学生的亲情号列表 */
export function getFamilyContactsApi(params: Family.Contact.ReqGetFamilyContactsApi) {
  return http.get<Family.Contact.ReqGetFamilyContactsApi>(FAMILY_CONTACTS_API.CONTACTS, params)
}

/** 创建亲情号 */
export function postFamilyContactApi(params: Family.Contact.ReqPostFamilyContactApi) {
  return http.post(FAMILY_CONTACTS_API.CONTACTS, params)
}

/** 更新亲情号 */
export function putFamilyContactApi(id: number, params: Family.Contact.ReqPutFamilyContactApi) {
  return http.put(FAMILY_CONTACTS_API.CONTACT_DETAIL(id), params)
}

/** 删除亲情号 */
export function deleteFamilyContactApi(id: number) {
  return http.delete(FAMILY_CONTACTS_API.CONTACT_DETAIL(id))
}

/** 获取亲情号详情 */
export function getFamilyContactDetailApi(id: number) {
  return http.get<Family.Contact.IFamilyContactVo>(FAMILY_CONTACTS_API.CONTACT_DETAIL(id))
}

/** 检查本人是否存在亲情号列表中 */
export function getCheckSelfApi(prams) {
  return http.get<Family.Contact.ResGetCheckSelfApi>(FAMILY_CONTACTS_API.CHECK_SELF, prams)
}
