import { computed } from 'vue'
import { useUserStore } from '@/store/user'

/**
 * @description 获取当前学生ID
 */
export function useStudentId() {
  const userStore = useUserStore()
  return computed(() => userStore.studentId)
}
