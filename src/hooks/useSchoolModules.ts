import { storeToRefs } from 'pinia'
import { computed } from 'vue'

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

/** 吹风机设备需要排除的模块 */
const DRYER_EXCLUDED_MODULES = [
  MINIAPP_MODULE_KEY_FAMILY_CONTACT,
  MINIAPP_MODULE_KEY_DEVICE_SUBSCRIPTION,
  MINIAPP_MODULE_KEY_MESSAGE,
]

export function useSchoolModules() {
  const currentStudentStore = useCurrentStudentStore()
  const { devices, modules } = storeToRefs(currentStudentStore)

  const primaryDeviceType = computed(() => devices.value?.[0]?.deviceType)

  /** 根据设备类型过滤后的模块列表 */
  const filteredModules = computed(() => {
    if (!modules.value?.length) return []
    if (primaryDeviceType.value !== DEVICE_TYPE.DRYER) return modules.value
    return modules.value.filter(m => !DRYER_EXCLUDED_MODULES.includes(m))
  })

  /** 是否存在账户模块 */
  const hasAccountModules = computed(() => {
    return filteredModules.value.includes(MINIAPP_MODULE_KEY_ACCOUNT_INFO)
  })

  /** 是否存在充值模块 */
  const hasRechargeModules = computed(() => {
    return filteredModules.value.includes(MINIAPP_MODULE_KEY_RECHARGE)
  })

  /** 是否存在选择充值金额模块 */
  const hasSelectRechargeAmountModules = computed(() => {
    return filteredModules.value.includes(MINIAPP_MODULE_KEY_SELECT_RECHARGE_AMOUNT)
  })

  /** 是否存在自定义充值金额模块 */
  const hasInputRechargeAmountModules = computed(() => {
    return filteredModules.value.includes(MINIAPP_MODULE_KEY_INPUT_RECHARGE_AMOUNT)
  })

  /** 是否存在套餐剩余分钟数模块 */
  const hasPackageMinutesModules = computed(() => {
    return filteredModules.value.includes(MINIAPP_MODULE_KEY_PACKAGE_MINUTES)
  })

  /** 根据学校模块配置过滤并排序的菜单列表 */
  const filteredMenuList = computed(() => {
    const moduleKeys = filteredModules.value
    if (!moduleKeys.length) return []

    const moduleKeySet = new Set(moduleKeys)

    return MENU_LIST.filter((item) => {
      if (item.id === MINIAPP_MODULE_KEY_FACE_COLLECTION) return false
      if (!item.id) return true
      return moduleKeySet.has(item.id)
    })
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
