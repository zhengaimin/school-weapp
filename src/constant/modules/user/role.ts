// #region 角色类型
// Types
export const ROLE_TYPE = {
  // 家长 - 1
  PARENT: 1,
  // 教师 - 2
  TEACHER: 2,
  // 学生 - 3
  STUDENT: 3,
} as const

export type TRoleType = (typeof ROLE_TYPE)[keyof typeof ROLE_TYPE]

// I18N
export const ROLE_TYPE_I18N: Record<TRoleType, string> = {
  [ROLE_TYPE.PARENT]: '家长',
  [ROLE_TYPE.TEACHER]: '教师',
  [ROLE_TYPE.STUDENT]: '学生',
}

// Options
export const ROLE_TYPE_OPTIONS = [
  { label: ROLE_TYPE_I18N[ROLE_TYPE.PARENT], value: ROLE_TYPE.PARENT },
  { label: ROLE_TYPE_I18N[ROLE_TYPE.TEACHER], value: ROLE_TYPE.TEACHER },
  { label: ROLE_TYPE_I18N[ROLE_TYPE.STUDENT], value: ROLE_TYPE.STUDENT },
]
// #region 用户类型
// Types
export const USER_TYPE = {
  // 家长 - 'parent'
  PARENT: 'parent',
  // 教师 - 'teacher'
  TEACHER: 'teacher',
} as const

export type TUserType = (typeof USER_TYPE)[keyof typeof USER_TYPE]

// I18N
export const USER_TYPE_I18N: Record<TUserType, string> = {
  [USER_TYPE.PARENT]: '家长',
  [USER_TYPE.TEACHER]: '教师',
}

// Options
export const USER_TYPE_OPTIONS = [
  { label: USER_TYPE_I18N[USER_TYPE.PARENT], value: USER_TYPE.PARENT },
  { label: USER_TYPE_I18N[USER_TYPE.TEACHER], value: USER_TYPE.TEACHER },
]
// #endregion

// #endregion
