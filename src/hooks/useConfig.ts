import { storeToRefs } from 'pinia'

import { getRelationshipOptionsApi } from '@/api/modules/family'
import { useConfigStore } from '@/store/config'

export function useConfig() {
  const configStore = useConfigStore()
  const { relationshipOptions } = storeToRefs(configStore)

  /**
   * @description 获取关系选项
   */
  async function axiosGetRelationshipOptionsApi() {
    if (relationshipOptions.value) {
      return { code: 0 }
    }
    const res = await getRelationshipOptionsApi()
    configStore.setRelationshipOptions(res.data.options)
    return res
  }

  return {
    relationshipOptions,
    axiosGetRelationshipOptionsApi,
  }
}
