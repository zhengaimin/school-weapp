import type { Family } from '@/api/interface/modules/family'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getRelationshipOptionsApi } from '@/api/modules/family'

export const useConfigStore = defineStore(
  'config',
  () => {
    const relationshipOptions = ref<Family.Relationship.IRelationshipOptionVo[] | null>(null)

    const setRelationshipOptions = (val: Family.Relationship.IRelationshipOptionVo[] | null) => {
      relationshipOptions.value = val
    }

    /**
     * 获取关系选项
     * @param enforce 强制请求接口
     */
    async function axiosGetRelationshipOptionsApi(enforce: boolean = false) {
      try {
        if (!enforce && relationshipOptions.value?.length) {
          return { code: 0, data: { options: relationshipOptions.value } }
        }
        const res = await getRelationshipOptionsApi()

        if (res.code === 0) {
          setRelationshipOptions(res.data.options)
        }

        return res
      }
      catch (error) {
        return { code: -1 }
      }
    }

    const relationshipValueMap = computed(() => {
      const map: Record<number, Family.Relationship.IRelationshipOptionVo> = {}

      ;(unref(relationshipOptions) || [])?.forEach((r) => {
        map[r.value] = r
      })
      return map
    })

    return {
      relationshipValueMap,

      relationshipOptions,
      setRelationshipOptions,

      axiosGetRelationshipOptionsApi,
    }
  },
  {
    persist: true,
  },
)
