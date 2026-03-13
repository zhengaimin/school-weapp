import { storeToRefs } from 'pinia'

import { useCurrentStudentStore } from '@/store/business/currentStudent'

export function useConfig() {
  const currentStudentStore = useCurrentStudentStore()
  const { relationshipOptions } = storeToRefs(currentStudentStore)

  /**
   * @description 获取关系选项
   */
  async function axiosGetRelationshipOptionsApi() {
    if (relationshipOptions.value) {
      return { code: 0 }
    }
    return currentStudentStore.axiosGetRelationshipOptionsApi()
  }

  return {
    relationshipOptions,
    axiosGetRelationshipOptionsApi,
  }
}
