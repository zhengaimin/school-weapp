import type { Students } from '@/api/interface/modules/students'
import { defineStore } from 'pinia'

import { getStudentListByParentApi } from '@/api/modules/students'

export const useParentStore = defineStore(
  'parent',
  () => {
    const students = ref<Students.IStudentVo[]>([])
    // 当前选择的学生 id
    const studentId = ref<number>(0)

    const setStudents = (list: Students.IStudentVo[]) => {
      students.value = list
    }
    const setStudentId = (id: number) => {
      studentId.value = id
    }

    const currentStudent = computed(() => {
      return students.value.find(item => item.id === studentId.value)
    })

    const axiosGetStudentListByParentApi = async () => {
      try {
        const result = await getStudentListByParentApi()

        if (result.code === 0 && result.data.students?.length) {
          const list = result.data.students
          setStudents(list)

          await nextTick()
          // 如果当前学生不存在，则设置第一个学生为当前学生
          !currentStudent.value && setStudentId(list[0].id)

          console.log(students, studentId)
        }

        return result
      } catch (error) {
        console.log(error)

        return { code: -1 }
      }
    }

    return {
      students,
      studentId,
      setStudents,
      setStudentId,
      currentStudent,

      axiosGetStudentListByParentApi
    }
  },
  {
    persist: true
  }
)
