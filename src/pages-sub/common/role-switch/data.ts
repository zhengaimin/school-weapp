// 切换角色相关数据类型和模拟数据

// 角色类型
export type RoleType = 'student' | 'teacher' | 'parent'

// 角色信息接口
export interface RoleInfo {
  id: string
  type: RoleType
  name: string
  description: string
  school?: string
  grade?: string
  studentId?: string
  teacherRole?: string
  classes?: string[]
  children?: Array<{
    name: string
    class: string
    studentId: string
  }>
}

// 角色配置接口
export interface RoleConfig {
  name: string
  icon: string
  bgColor: string
  textColor: string
}

// 角色配置数据
export const roleConfigs: Record<RoleType, RoleConfig> = {
  student: {
    name: '学生身份',
    icon: 'graduation-cap-line',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  teacher: {
    name: '老师身份',
    icon: 'user-3-line',
    bgColor: 'bg-primary bg-opacity-10',
    textColor: 'text-primary',
  },
  parent: {
    name: '家长身份',
    icon: 'parent-line',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
}

// 学校名称映射
export const schoolNames: Record<string, string> = {
  school1: '实验小学',
  school2: '第一中学',
  school3: '育才小学',
  school4: '希望中学',
  school5: '阳光小学',
}

// 模拟角色数据
export const mockRoleData: Record<string, RoleInfo> = {
  student_school1: {
    id: 'student_school1',
    type: 'student',
    name: '张小明',
    description: '实验小学',
    school: 'school1',
    grade: '三年级二班',
    studentId: '2021001',
  },
  teacher_school1: {
    id: 'teacher_school1',
    type: 'teacher',
    name: '张老师',
    description: '实验小学',
    school: 'school1',
    teacherRole: '数学老师',
    classes: ['三年级一班', '三年级二班'],
  },
  parent_school1: {
    id: 'parent_school1',
    type: 'parent',
    name: '张女士',
    description: '实验小学',
    school: 'school1',
    children: [{
      name: '张小明',
      class: '三年级二班',
      studentId: '2021001',
    }],
  },
}

// 获取角色配置
export function getRoleConfig(roleType: RoleType): RoleConfig {
  return roleConfigs[roleType] || roleConfigs.student
}

// 获取学校名称
export function getSchoolName(schoolId: string): string {
  return schoolNames[schoolId] || '实验小学'
}

// 获取角色描述
export function getRoleDescription(roleInfo: RoleInfo): string {
  return getSchoolName(roleInfo.school || 'school1')
}

// 获取当前角色信息
export function getCurrentRoleInfo(): RoleInfo {
  // 固定返回学生角色作为当前角色
  return mockRoleData.student_school1
}

// 获取可切换角色列表
export function getAvailableRoles(currentRoleType: RoleType): RoleInfo[] {
  const availableRoles: RoleInfo[] = []

  Object.values(mockRoleData).forEach((roleData) => {
    // 排除当前身份
    if (roleData.type !== currentRoleType) {
      availableRoles.push({
        ...roleData,
        description: getRoleDescription(roleData),
      })
    }
  })

  return availableRoles
}

// 切换到指定角色
export function switchToRole(roleType: RoleType, roleId: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 模拟角色切换
    setTimeout(() => {
      const newUserInfo = mockRoleData[roleId]
      if (newUserInfo) {
        // 这里可以保存到本地存储或状态管理
        console.log('切换到角色:', newUserInfo)
        resolve(true)
      }
      else {
        resolve(false)
      }
    }, 500)
  })
}

// 获取角色首页路径
export function getRoleHomePage(roleType: RoleType): string {
  const homePages = {
    student: '/pages/index/index',
    teacher: '/pages/index/index',
    parent: '/pages/index/index',
  }
  return homePages[roleType] || '/pages/index/index'
}
