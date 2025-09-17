import type { Family } from '@/api/interface/modules/family'
import type { Schools } from '@/api/interface/modules/schools'
import { defineStore } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getRelationshipOptionsApi } from '@/api/modules/family'
import { getSchoolModulesApi } from '@/api/modules/schools'
import {
  MENU_LIST,
  MINIAPP_MODULE_KEY_ACCOUNT_INFO,
  MINIAPP_MODULE_KEY_RECHARGE,
} from '@/constant/modules'

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

    // 根据学校模块动态过滤和排序菜单
    const filteredMenuList = computed(() => {
      const { modules } = unref(schoolModules) || {}

      if (!modules) {
        return [] // 如果没有模块数据，什么都不显示
      }

      // 创建模块key到模块信息的映射
      const moduleInfoMap = new Map(modules.map(module => [module.moduleKey, module]))

      // 过滤出启用的菜单项并添加排序信息
      const enabledMenus = MENU_LIST.filter((menuItem) => {
        // 如果菜单项没有ID，则显示（兼容没有ID的菜单项）
        if (!menuItem.id) {
          return true
        }

        // 检查该模块是否在启用的模块列表中（现在MENU_LIST已经和moduleKey一一对应）
        return moduleInfoMap.has(menuItem.id)
      }).map((menuItem) => {
        // 获取对应的模块信息
        const moduleInfo = moduleInfoMap.get(menuItem.id!)

        return {
          ...menuItem,
          sortOrder: moduleInfo?.sort || 999, // 没有排序信息的放到最后
        }
      })

      // 根据sort字段进行排序
      return enabledMenus.sort((a, b) => a.sortOrder - b.sortOrder)
    })

    // 是否存在账户模块
    const hasAccountModules = computed(() => {
      const { modules } = unref(schoolModules) || {}
      return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_ACCOUNT_INFO) || false
    })
    // 是否存在充值模块
    const hasRechargeModules = computed(() => {
      const { modules } = unref(schoolModules) || {}
      return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_RECHARGE) || false
    })

    return {
      relationshipValueMap,
      relationshipOptions,
      setRelationshipOptions,
      axiosGetRelationshipOptionsApi,

      schoolModules,
      axiosGetSchoolModulesApi,
      filteredMenuList,
    }
  },
  {
    persist: true,
  },
)
