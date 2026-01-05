/**
 * 老师角色 Store
 * 用于存储老师登录后的角色特定数据
 *
 * 设计说明：
 * - 老师可以直接查看所有学生的数据，不需要"选择学生"的概念
 * - 老师可能需要管理多个班级
 * - 老师的操作权限与家长不同
 *
 * 未来实现时可能包含：
 * - 管理的班级列表
 * - 班级学生列表
 * - 老师的权限配置
 */
import { defineStore } from 'pinia'

export const useTeacherStore = defineStore(
  'teacher',
  () => {
    // TODO: 实现老师角色相关的状态管理
    // 示例字段：
    // const classes = ref<ClassInfo[]>([])
    // const permissions = ref<Permission[]>([])

    return {
      // TODO: 导出状态和方法
    }
  },
  {
    persist: true,
  },
)
