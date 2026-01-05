/**
 * 家长角色 Store
 * 用于存储家长登录后的角色特定数据
 * - 管理子女列表
 * - 当前选中的学生
 * - 绑定状态
 */
import type { Students } from '@/api/interface/modules/students'
import type { User } from '@/api/interface/modules/user'

import { defineStore } from 'pinia'
import { getStudentListByParentApi } from '@/api/modules/students'

export const useParentStore = defineStore(
  'parent',
  () => {
    const students = ref<Students.IStudentVo[]>([])

    // 是否需要绑定学生
    const needBind = ref<boolean>(true)
    // 当前选中的学生ID
    const currentStudentId = ref<number | null>(null)

    const setStudents = (list: Students.IStudentVo[]) => {
      students.value = list
    }
    const setNeedBind = (val: boolean) => {
      needBind.value = val
    }
    const setCurrentStudentId = (id: number | null) => {
      currentStudentId.value = id
    }

    const studentsIdMap = computed(() => {
      const map: Record<number, Students.IStudentVo> = {}
      students.value.forEach((student) => {
        map[student.id] = student
      })
      return map
    })

    // 当前选中的学生信息
    const currentStudent = computed(() => {
      if (currentStudentId.value === null) {
        return null
      }
      const student = studentsIdMap.value[currentStudentId.value]
      if (!student) {
        return null
      }

      const list = []
      if (student.grade) {
        list.push(student.grade)
      }
      if (student.departmentName) {
        list.push(student.departmentName)
      }
      if (student.className) {
        list.push(student.className)
      }

      return {
        ...student,
        fullClassName: list.join(' · '),
      }
    })

    const axiosGetStudentListByParentApi = async () => {
      const result = await getStudentListByParentApi()

      if (result.code === 0) {
        const list = result.data.students || []
        setStudents(list)

        // 自动设置当前学生ID
        if (list.length) {
          const existingId = currentStudentId.value
          // 如果当前ID存在且在列表中，保持不变；否则选择第一个
          const nextId = existingId !== null && list.some(s => s.id === existingId)
            ? existingId
            : list[0].id
          setCurrentStudentId(nextId)
        }
        else {
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
      currentStudent,

      axiosGetStudentListByParentApi,
    }
  },
  {
    persist: true,
  },
)
