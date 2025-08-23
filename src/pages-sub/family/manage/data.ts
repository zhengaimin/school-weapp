import type { 
  FamilyContact, 
  FamilyContactForm, 
  FamilyContactListResponse, 
  RelationshipOption,
  AddFamilyContactRequest,
  UpdateFamilyContactRequest
} from './types'

// 模拟数据
let mockFamilyContacts: FamilyContact[] = [
  {
    id: '1',
    relationship: '父亲',
    phoneNumber: '13800138001',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    relationship: '母亲',
    phoneNumber: '13800138002',
    createTime: '2024-01-16 14:20:00',
    updateTime: '2024-01-16 14:20:00',
  },
  {
    id: '3',
    relationship: '奶奶',
    phoneNumber: '13800138003',
    createTime: '2024-01-17 09:15:00',
    updateTime: '2024-01-17 09:15:00',
  },
]

// 关系选项
export function getRelationshipOptions(): RelationshipOption[] {
  return [
    { value: '父亲', label: '父亲' },
    { value: '母亲', label: '母亲' },
    { value: '爷爷', label: '爷爷' },
    { value: '奶奶', label: '奶奶' },
    { value: '外公', label: '外公' },
    { value: '外婆', label: '外婆' },
    { value: '其他', label: '其他' },
  ]
}

// 获取亲情号码列表
export async function getFamilyContactList(params: {
  page: number
  page_size: number
}): Promise<IResData<FamilyContactListResponse>> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const { page, page_size } = params
  const start = (page - 1) * page_size
  const end = start + page_size
  
  const list = mockFamilyContacts.slice(start, end)
  const total = mockFamilyContacts.length

  return {
    code: 0,
    message: '获取成功',
    data: {
      list,
      total,
    },
  }
}

// 添加亲情号码
export async function addFamilyContact(data: AddFamilyContactRequest): Promise<IResData<FamilyContact>> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(data.phoneNumber)) {
    return {
      code: 1,
      message: '手机号格式不正确',
      data: null,
    }
  }

  // 检查手机号是否已存在
  const existingContact = mockFamilyContacts.find(contact => contact.phoneNumber === data.phoneNumber)
  if (existingContact) {
    return {
      code: 1,
      message: '该手机号已存在',
      data: null,
    }
  }

  const newContact: FamilyContact = {
    id: Date.now().toString(),
    relationship: data.relationship,
    phoneNumber: data.phoneNumber,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN'),
  }

  mockFamilyContacts.unshift(newContact)

  return {
    code: 0,
    message: '添加成功',
    data: newContact,
  }
}

// 更新亲情号码
export async function updateFamilyContact(
  id: string, 
  data: UpdateFamilyContactRequest
): Promise<IResData<FamilyContact>> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(data.phoneNumber)) {
    return {
      code: 1,
      message: '手机号格式不正确',
      data: null,
    }
  }

  const contactIndex = mockFamilyContacts.findIndex(contact => contact.id === id)
  if (contactIndex === -1) {
    return {
      code: 1,
      message: '联系人不存在',
      data: null,
    }
  }

  // 检查手机号是否已被其他联系人使用
  const existingContact = mockFamilyContacts.find(
    contact => contact.phoneNumber === data.phoneNumber && contact.id !== id
  )
  if (existingContact) {
    return {
      code: 1,
      message: '该手机号已被其他联系人使用',
      data: null,
    }
  }

  const updatedContact: FamilyContact = {
    ...mockFamilyContacts[contactIndex],
    relationship: data.relationship,
    phoneNumber: data.phoneNumber,
    updateTime: new Date().toLocaleString('zh-CN'),
  }

  mockFamilyContacts[contactIndex] = updatedContact

  return {
    code: 0,
    message: '更新成功',
    data: updatedContact,
  }
}

// 删除亲情号码
export async function deleteFamilyContact(id: string): Promise<IResData<null>> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const contactIndex = mockFamilyContacts.findIndex(contact => contact.id === id)
  if (contactIndex === -1) {
    return {
      code: 1,
      message: '联系人不存在',
      data: null,
    }
  }

  mockFamilyContacts.splice(contactIndex, 1)

  return {
    code: 0,
    message: '删除成功',
    data: null,
  }
}
