import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'

import {
  DEVICE_TYPE,
  MENU_LIST,
  MINIAPP_MODULE_KEY_ACCOUNT_INFO,
  MINIAPP_MODULE_KEY_DEVICE_SUBSCRIPTION,
  MINIAPP_MODULE_KEY_FACE_COLLECTION,
  MINIAPP_MODULE_KEY_FAMILY_CONTACT,
  MINIAPP_MODULE_KEY_INPUT_RECHARGE_AMOUNT,
  MINIAPP_MODULE_KEY_MESSAGE,
  MINIAPP_MODULE_KEY_PACKAGE_MINUTES,
  MINIAPP_MODULE_KEY_RECHARGE,
  MINIAPP_MODULE_KEY_SELECT_RECHARGE_AMOUNT,
} from '@/constant/modules'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useConfigStore } from '@/store/config'

/** 吹风机设备需要排除的模块 */
const DRYER_EXCLUDED_MODULES = [
  MINIAPP_MODULE_KEY_FAMILY_CONTACT,
  MINIAPP_MODULE_KEY_DEVICE_SUBSCRIPTION,
  MINIAPP_MODULE_KEY_MESSAGE,
]

export function useSchoolModules() {
  const configStore = useConfigStore()
  const currentStudentStore = useCurrentStudentStore()
  const { schoolModules } = storeToRefs(configStore)
  const { deviceType } = storeToRefs(currentStudentStore)

  /** 根据设备类型过滤后的模块列表 */
  const filteredModules = computed(() => {
    const { modules } = unref(schoolModules) || {}
    if (!modules) return []
    if (deviceType.value !== DEVICE_TYPE.DRYER) return modules
    return modules.filter(m => !DRYER_EXCLUDED_MODULES.includes(m.moduleKey))
  })

  /** 是否存在账户模块 */
  const hasAccountModules = computed(() => {
    return filteredModules.value.some(m => m.moduleKey === MINIAPP_MODULE_KEY_ACCOUNT_INFO)
  })

  /** 是否存在充值模块 */
  const hasRechargeModules = computed(() => {
    return filteredModules.value.some(m => m.moduleKey === MINIAPP_MODULE_KEY_RECHARGE)
  })

  /** 是否存在选择充值金额模块 */
  const hasSelectRechargeAmountModules = computed(() => {
    return filteredModules.value.some(m => m.moduleKey === MINIAPP_MODULE_KEY_SELECT_RECHARGE_AMOUNT)
  })

  /** 是否存在自定义充值金额模块 */
  const hasInputRechargeAmountModules = computed(() => {
    return filteredModules.value.some(m => m.moduleKey === MINIAPP_MODULE_KEY_INPUT_RECHARGE_AMOUNT)
  })

  /** 是否存在套餐剩余分钟数模块 */
  const hasPackageMinutesModules = computed(() => {
    return filteredModules.value.some(m => m.moduleKey === MINIAPP_MODULE_KEY_PACKAGE_MINUTES)
  })

  /** 根据学校模块配置过滤并排序的菜单列表 */
  const filteredMenuList = computed(() => {
    const modules = filteredModules.value
    if (!modules.length) return []

    const moduleInfoMap = new Map(modules.map(m => [m.moduleKey, m]))

    return MENU_LIST.filter((item) => {
      if (item.id === MINIAPP_MODULE_KEY_FACE_COLLECTION) return false
      if (!item.id) return true
      return moduleInfoMap.has(item.id)
    }).map(item => ({
      ...item,
      sortOrder: moduleInfoMap.get(item.id!)?.sort || 999,
    })).sort((a, b) => a.sortOrder - b.sortOrder)
  })

  return {
    filteredMenuList,
    hasAccountModules,
    hasRechargeModules,
    hasSelectRechargeAmountModules,
    hasInputRechargeAmountModules,
    hasPackageMinutesModules,
  }
}
