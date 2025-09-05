import { storeToRefs } from 'pinia'
import { getUserBalanceApi } from '@/api/modules/user'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'

export function useBalance() {
  const parentStore = useParentStore()
  const userStore = useUserStore()

  const { token } = storeToRefs(userStore)
  const { currentStudent } = storeToRefs(userStore)

  /**
   * 获取余额
   * 如果用户未登录，则返回 { code: 0 }
   */
  async function axiosGetUserBalanceApi() {
    if (!token.value || !currentStudent.value) {
      return { code: 0 }
    }

    try {
      const result = await getUserBalanceApi()

      if (result.code === 0) {
        parentStore.setBalanceInfo(result.data)
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
