import { storeToRefs } from 'pinia'
import { getUserBalanceApi } from '@/api/modules/user'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'

export function useBalance() {
  const currentStudentStore = useCurrentStudentStore()
  const parentStore = useParentStore()
  const userStore = useUserStore()

  const { token } = storeToRefs(userStore)
  const { currentStudent } = storeToRefs(parentStore)

  /**
   * 获取余额
   * 如果用户未登录，则返回 { code: 0 }
   */
  async function axiosGetUserBalanceApi() {
    if (!token.value || !currentStudent.value) {
      return { code: 0 }
    }

    try {
      // 获取当前选择的设备类型
      const deviceType = currentStudentStore.deviceType

      // 调用 API 并传递设备类型参数
      const result = await getUserBalanceApi({ deviceType })

      if (result.code === 0) {
        currentStudentStore.setBalanceInfo(result.data)
      }

      return result
    }
    catch (error) {
      return { code: -1 }
    }
  }

  return {
    axiosGetUserBalanceApi,
  }
}
