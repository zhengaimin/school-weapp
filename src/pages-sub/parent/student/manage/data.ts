// 孩子信息接口
export interface ChildInfo {
  id: string
  name: string
  school: string
  grade: string
  studentId: string
  balance: string
  avatar: string
  avatarBg: string
  avatarColor: string
  faceStatus: 'success' | 'failed' | 'pending'
  faceMessage?: string
}

// 孩子列表数据
export const childrenData: ChildInfo[] = [
  {
    id: 'xiaoming',
    name: '张小明',
    school: '实验小学',
    grade: '三年级二班',
    studentId: '2021001',
    balance: '¥85.30',
    avatar: 'user-line',
    avatarBg: '#dbeafe',
    avatarColor: '#2563eb',
    faceStatus: 'success',
  },
  {
    id: 'xiaohong',
    name: '张小红',
    school: '育才小学',
    grade: '一年级一班',
    studentId: '2022001',
    balance: '¥43.20',
    avatar: 'user-line',
    avatarBg: '#fce7f3',
    avatarColor: '#ec4899',
    faceStatus: 'failed',
    faceMessage: '人脸识别验证失败，请重新进行人脸认证以确保账户安全',
  },
]

// 根据ID获取孩子信息
export function getChildById(id: string): ChildInfo | undefined {
  return childrenData.find(child => child.id === id)
}

// 获取所有孩子列表
export function getChildrenList(): ChildInfo[] {
  return childrenData
}

// 获取人脸识别失败的孩子列表
export function getFailedFaceChildren(): ChildInfo[] {
  return childrenData.filter(child => child.faceStatus === 'failed')
}

// 获取人脸识别成功的孩子列表
export function getSuccessFaceChildren(): ChildInfo[] {
  return childrenData.filter(child => child.faceStatus === 'success')
}
