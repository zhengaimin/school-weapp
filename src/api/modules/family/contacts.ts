import type { Family } from '@/api/interface/modules/family'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const FAMILY_CONTACTS_API = {
  CONTACTS: `${API}/family-contacts`,
  CONTACT_DETAIL: (id: number) => `${API}/family-contacts/${id}`,
  CHECK_SELF: `${API}/family-contacts/check-self`,
}

/**
 * @description 获取学生的亲情号列表
 * @param {Family.Contact.ReqGetFamilyContactsApi} params
 * @returns {Promise<Family.Contact.ResGetFamilyContactsApi>}
 */
export function getFamilyContactsApi(params: Family.Contact.ReqGetFamilyContactsApi) {
  return http.get<Family.Contact.ResGetFamilyContactsApi>(FAMILY_CONTACTS_API.CONTACTS, params)
}

/**
 * @description 创建亲情号
 * @param {Family.Contact.ReqPostFamilyContactApi} params
 * @returns {Promise<any>}
 */
export function postFamilyContactApi(params: Family.Contact.ReqPostFamilyContactApi) {
  return http.post(FAMILY_CONTACTS_API.CONTACTS, params)
}

/**
 * @description 更新亲情号
 * @param {number} id - 亲情号ID
 * @param {Family.Contact.ReqPutFamilyContactApi} params
 * @returns {Promise<any>}
 */
export function putFamilyContactApi(id: number, params: Family.Contact.ReqPutFamilyContactApi) {
  return http.put(FAMILY_CONTACTS_API.CONTACT_DETAIL(id), params)
}

/**
 * @description 删除亲情号
 * @param {number} id - 亲情号ID
 * @returns {Promise<any>}
 */
export function deleteFamilyContactApi(id: number) {
  return http.delete(FAMILY_CONTACTS_API.CONTACT_DETAIL(id))
}

/**
 * @description 获取亲情号详情
 * @param {number} id - 亲情号ID
 * @returns {Promise<Family.Contact.ResGetFamilyContactDetailApi>}
 */
export function getFamilyContactDetailApi(id: number) {
  return http.get<Family.Contact.ResGetFamilyContactDetailApi>(FAMILY_CONTACTS_API.CONTACT_DETAIL(id))
}

/**
 * @description 检查本人是否存在亲情号列表中
 * @param {any} params - 请求参数
 * @returns {Promise<Family.Contact.ResGetCheckSelfApi>}
 */
export function getCheckSelfApi(params?: any) {
  return http.get<Family.Contact.ResGetCheckSelfApi>(FAMILY_CONTACTS_API.CHECK_SELF, params)
}
