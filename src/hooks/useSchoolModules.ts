import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'

import {
  MINIAPP_MODULE_KEY_ACCOUNT_INFO,
  MINIAPP_MODULE_KEY_INPUT_RECHARGE_AMOUNT,
  MINIAPP_MODULE_KEY_PACKAGE_MINUTES,
  MINIAPP_MODULE_KEY_RECHARGE,
  MINIAPP_MODULE_KEY_SELECT_RECHARGE_AMOUNT,
} from '@/constant/modules'
import { useConfigStore } from '@/store/config'

export function useSchoolModules() {
  const configStore = useConfigStore()
  const { schoolModules } = storeToRefs(configStore)

  // 是否存在账户模块
  const hasAccountModules = computed(() => {
    const { modules } = unref(schoolModules) || {}
    return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_ACCOUNT_INFO) || false
  })

  // 是否存在充值模块
  const hasRechargeModules = computed(() => {
    const { modules } = unref(schoolModules) || {}
    // 注意：'recharge' 是一个临时的硬编码，后续需要替换为常量
    return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_RECHARGE) || false
  })

  // 是否存在选择充值金额模块
  const hasSelectRechargeAmountModules = computed(() => {
    const { modules } = unref(schoolModules) || {}
    return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_SELECT_RECHARGE_AMOUNT) || false
  })

  // 是否存在自定义充值金额模块
  const hasInputRechargeAmountModules = computed(() => {
    const { modules } = unref(schoolModules) || {}
    return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_INPUT_RECHARGE_AMOUNT) || false
  })

  // 是否存在套餐剩余分钟数模块
  const hasPackageMinutesModules = computed(() => {
    const { modules } = unref(schoolModules) || {}
    return modules?.some(module => module.moduleKey === MINIAPP_MODULE_KEY_PACKAGE_MINUTES) || false
  })

  return {
    hasAccountModules,
    hasRechargeModules,
    hasSelectRechargeAmountModules,
    hasInputRechargeAmountModules,
    hasPackageMinutesModules,
  }
}
