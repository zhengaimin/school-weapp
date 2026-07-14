/**
 * 学生角色 Store
 * 用于存储学生登录后的角色特定数据
 *
 * 设计说明：
 * - 这是"学生角色的身份数据"，不是"当前操作的学生业务数据"
 * - 学生登录后直接操作自己的数据，不需要"选择学生"
 * - 学生的业务数据（余额、亲情号等）存储在 business/currentStudent.ts 中
 *
 * 与 business/currentStudent.ts 的区别：
 * - auth/student.ts：学生角色的身份信息、权限配置等
 * - business/currentStudent.ts：当前操作的学生的业务数据（余额、亲情号等）
 *
 * 未来实现时可能包含：
 * - 学生的班级信息
 * - 学生的权限配置
 * - 学生的个人设置
 */
import { defineStore } from 'pinia'

export const useStudentRoleStore = defineStore(
  'studentRole',
  () => {
    // TODO: 实现学生角色相关的状态管理
    // 示例字段：
    // const classInfo = ref<ClassInfo | null>(null)
    // const permissions = ref<Permission[]>([])

    return {
      // TODO: 导出状态和方法
    }
  },
  {
    persist: true,
  },
)
