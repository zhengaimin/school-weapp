// 亲情号码管理相关类型定义

// 亲情号码信息
export interface FamilyContact {
  /** 联系人ID */
  id: string
  /** 关系 */
  relationship: string
  /** 手机号 */
  phoneNumber: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

// 亲情号码表单数据
export interface FamilyContactForm {
  /** 关系 */
  relationship: string
  /** 手机号 */
  phoneNumber: string
}

// 关系选项
export interface RelationshipOption {
  /** 选项值 */
  value: string
  /** 选项标签 */
  label: string
}

// API 响应数据
export interface FamilyContactListResponse {
  /** 联系人列表 */
  list: FamilyContact[]
  /** 总数 */
  total: number
}

// 添加/更新亲情号码请求参数
export interface AddFamilyContactRequest extends FamilyContactForm {}
export interface UpdateFamilyContactRequest extends FamilyContactForm {}
