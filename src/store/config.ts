import type { Family } from '@/api/interface/modules/family'
import type { Schools } from '@/api/interface/modules/schools'
import { defineStore } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getRelationshipOptionsApi } from '@/api/modules/family'
import { getSchoolModulesApi } from '@/api/modules/schools'

export const useConfigStore = defineStore(
  'config',
  () => {
    const relationshipOptions = ref<Family.Relationship.IRelationshipOptionVo[] | null>(null)
    const schoolModules = ref<Schools.Modules.ResGetModulesApi>()

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

    // 获取学校模块列表
    async function axiosGetSchoolModulesApi() {
      try {
        const result = await getSchoolModulesApi()

        if (result.code === 0) {
          schoolModules.value = result.data
        }

        return result
      }
      catch (error) {
        console.error('获取学校模块列表失败:', error)
        return { code: -1 }
      }
    }

    return {
      relationshipValueMap,
      relationshipOptions,
      setRelationshipOptions,
      axiosGetRelationshipOptionsApi,

      schoolModules,
      axiosGetSchoolModulesApi,
    }
  },
  {
    persist: true,
  },
)
