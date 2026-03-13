import type { User } from '@/api/interface/modules/user'
import type { TDeviceType } from '@/constant/modules'

import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { getUserBalanceApi } from '@/api/modules/user'
import { DEVICE_TYPE } from '@/constant/modules'
import { useUserStore } from '@/store/user'

export function useBalance() {
  const userStore = useUserStore()
  const { token } = storeToRefs(userStore)
  const dryerBalanceInfo = ref<User.Parent.IBalanceInfo | null>(null)
  const videoBalanceInfo = ref<User.Parent.IBalanceInfo | null>(null)

  /** 格式化余额数据 */
  function formatBalanceInfo(info: User.Common.IStudentBalanceInfoVo): User.Parent.IBalanceInfo {
    const available = Number(info.availableBalance ?? 0)
    return {
      ...info,
      availableBalanceFormatted: Number.isNaN(available) ? '0.00' : available.toFixed(2),
      lastUpdateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
  }

  /** 获取余额（不带缓存逻辑） */
  async function axiosGetUserBalanceApi(deviceType: TDeviceType) {
    if (!token.value) {
      return { code: 0 }
    }

    try {
      const result = await getUserBalanceApi({ deviceType })

      if (result.code === 0) {
        const formatted = formatBalanceInfo(result.data)
        if (deviceType === DEVICE_TYPE.DRYER) {
          dryerBalanceInfo.value = formatted
        } else {
          videoBalanceInfo.value = formatted
        }
      }

      return result
    } catch (error) {
      return { code: -1 }
    }
  }

  /** 按设备类型获取余额（已有缓存则直接返回） */
  async function getBalanceByDeviceType(deviceType: TDeviceType) {
    const cached = deviceType === DEVICE_TYPE.DRYER
      ? dryerBalanceInfo.value
      : videoBalanceInfo.value

    if (cached) {
      return { code: 0, data: cached }
    }

    return axiosGetUserBalanceApi(deviceType)
  }

  return {
    axiosGetUserBalanceApi,
    getBalanceByDeviceType,
    dryerBalanceInfo,
    videoBalanceInfo,
  }
}
