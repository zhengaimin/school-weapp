/**
 * 当前操作的学生业务数据 Store
 * 用于存储当前正在操作的学生的业务数据
 * - 学生基本信息（从 profile 接口的 roleInfo.currentChild 获取）
 * - 余额信息
 * - 亲情号信息
 * - 设备类型选择
 *
 * 注意：
 * 1. 这不是"学生角色"的 store，而是"当前操作的学生数据"
 * 2. 在家长模式下，数据来自 parent.currentStudentId 对应的学生
 * 3. 在学生模式下，数据来自登录学生本人
 * 4. 切换学生时需要调用 clearStudentData() 清空旧数据
 */
import type { Family } from '@/api/interface/modules/family'
import type { User } from '@/api/interface/modules/user'
import type { TDeviceType } from '@/constant/modules'

import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getFamilyContactsApi } from '@/api/modules/family/contacts'
import { useUserStore } from '@/store/user'

type IBalanceInfo = User.Common.IStudentBalanceInfoVo & {
  availableBalanceFormatted: string
  lastUpdateTime: string
}

export const useCurrentStudentStore = defineStore(
  'currentStudent',
  () => {
    // 学生基本信息（从 profile 接口的 roleInfo.currentChild 获取）
    const studentInfo = ref<User.Common.ICurrentChildVo | null>(null)
    // 余额信息
    const balanceInfo = ref<IBalanceInfo | null>(null)
    // 亲情号信息
    const contactInfo = ref<Family.Contact.ISelfContactVo | null>(null)
    // 亲情号列表缓存
    const familyContacts = ref<Family.Contact.ResGetFamilyContactsApi[]>([])
    // 选中的设备类型
    const deviceType = ref<TDeviceType | null>(null)

    const setStudentInfo = (info: User.Common.ICurrentChildVo | null) => {
      studentInfo.value = info
    }
    const setBalanceInfo = (info: User.Common.IStudentBalanceInfoVo) => {
      balanceInfo.value = {
        ...info,
        availableBalanceFormatted: Number(info.availableBalance).toFixed(2),
        lastUpdateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
    }
    const setContactInfo = (info: Family.Contact.ISelfContactVo | null) => {
      contactInfo.value = info
    }
    const setFamilyContacts = (contacts: Family.Contact.ResGetFamilyContactsApi[]) => {
      familyContacts.value = contacts
    }
    const setDeviceType = (type: TDeviceType) => {
      deviceType.value = type
    }

    // 亲情号关系 map：根据 relationship 字段创建 map 结构
    const familyContactsRelationshipMap = computed(() => {
      const map: Record<number, Family.Contact.ResGetFamilyContactsApi> = {}
      familyContacts.value.forEach((contact) => {
        if (contact.relationship) {
          map[contact.relationship] = contact
        }
      })
      return map
    })

    // 学生完整信息：学校名称·年级名称·级部名称·班级名称（没有则不显示）
    const studentFullInfo = computed(() => {
      if (!studentInfo.value) return ''

      const userStore = useUserStore()
      const parts = [
        userStore.userInfo?.schoolName,
        studentInfo.value.grade,
        studentInfo.value.departmentName,
        studentInfo.value.className,
      ].filter(Boolean)

      return parts.join('·')
    })

    const axiosGetFamilyContactsApi = async () => {
      const result = await getFamilyContactsApi({})

      if (result.code === 0 && Array.isArray(result.data)) {
        setFamilyContacts(result.data)
      }

      return result
    }

    /**
     * 清空学生数据
     * 在切换学生时调用，清空旧学生的业务数据
     */
    const clearStudentData = () => {
      studentInfo.value = null
      balanceInfo.value = null
      contactInfo.value = null
      familyContacts.value = []
      deviceType.value = null
    }

    return {
      studentInfo,
      balanceInfo,
      contactInfo,
      familyContacts,
      deviceType,
      setStudentInfo,
      setBalanceInfo,
      setContactInfo,
      setFamilyContacts,
      setDeviceType,

      familyContactsRelationshipMap,
      studentFullInfo,

      axiosGetFamilyContactsApi,
      clearStudentData,
    }
  },
  {
    persist: true,
  },
)
