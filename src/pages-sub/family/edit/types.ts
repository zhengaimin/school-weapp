import type { Family } from '@/api/interface/modules/family'

/**
 * 亲情号编辑表单
 * 未选择关系时 relationship 为 undefined，与 Picker v-model 及接口请求类型区分开
 */
export type FamilyContactFormData = Omit<Family.Contact.ReqPostFamilyContactApi, 'relationship'> & {
  /** 称谓类型，未选择时为 undefined */
  relationship?: number
}
