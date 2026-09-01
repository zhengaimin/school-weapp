/**
 * 家长角色 Store
 * 用于存储家长登录后的角色特定数据
 * - 管理子女列表
 * - 当前选中的学生
 * - 绑定状态
 */
import type { Overview } from '@/api/interface/modules/overview'
import type { User } from '@/api/interface/modules/user'

import { defineStore } from 'pinia'
import { getOverviewStudentsApi } from '@/api/modules/overview'
import { useUserStore } from '@/store/user'

export const useParentStore = defineStore(
  'parent',
  () => {
    const userStore = useUserStore()
    const students = ref<Overview.IStudentVo[]>([])

    // 是否需要绑定学生
    const needBind = ref<boolean>(true)
    // 当前选中的学生ID
    const currentStudentId = ref<number | null>(null)

    const setStudents = (list: Overview.IStudentVo[]) => {
      students.value = list
    }
    const setNeedBind = (val: boolean) => {
      needBind.value = val
    }
    const setCurrentStudentId = (id: number | null) => {
      currentStudentId.value = id
    }

    const studentsIdMap = computed(() => {
      const map: Record<number, Overview.IStudentVo> = {}
      students.value.forEach((student) => {
        map[student.id] = student
      })
      return map
    })

    const axiosGetStudentListApi = async () => {
      const result = await getOverviewStudentsApi()

      if (result.code === 0) {
        const list = result.data.students || []
        setStudents(list)

        // 自动设置当前学生ID
        if (list.length) {
          const roleInfo = userStore.userInfo?.roleInfo as User.Common.IParentRoleInfoVo
          const currentChildId = roleInfo?.currentChild?.studentId
          const existingId = currentStudentId.value
          // profile 记录的是后台最后切换的学生，应优先于本地持久化值
          const nextId = currentChildId !== null
            && currentChildId !== undefined
            && list.some(s => s.id === currentChildId)
            ? currentChildId
            : existingId !== null && list.some(s => s.id === existingId) ? existingId : list[0].id
          setCurrentStudentId(nextId)
        } else {
          setCurrentStudentId(null)
        }

        await nextTick()
      }

      return result
    }

    return {
      needBind,
      students,
      currentStudentId,
      setStudents,
      setNeedBind,
      setCurrentStudentId,

      studentsIdMap,
      axiosGetStudentListApi,
    }
  },
  {
    persist: true,
  },
)
