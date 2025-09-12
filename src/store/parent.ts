import type { Family } from '@/api/interface/modules/family'
import type { Students } from '@/api/interface/modules/students'
import type { User } from '@/api/interface/modules/user'
import dayjs from 'dayjs'

import { defineStore, storeToRefs } from 'pinia'
import { getFamilyContactsApi } from '@/api/modules/family/contacts'
import { getStudentListByParentApi } from '@/api/modules/students'
import { useUserStore } from './user'

type IBalanceInfo = User.Common.IStudentBalanceVo & {
  availableBalanceFormatted: string
  lastUpdateTime: string
}

export const useParentStore = defineStore(
  'parent',
  () => {
    const userStore = useUserStore()
    const { userInfo } = storeToRefs(userStore)

    const students = ref<Students.IStudentVo[]>([])

    // 是否需要绑定学生
    const needBind = ref<boolean>(true)
    // 余额信息
    const balanceInfo = ref<IBalanceInfo | null>(null)
    // 亲情号信息
    const contactInfo = ref<Family.Contact.ISelfContactVo | null>(null)
    // 亲情号列表缓存
    const familyContacts = ref<Family.Contact.ResGetFamilyContactsApi[]>([])

    const setStudents = (list: Students.IStudentVo[]) => {
      students.value = list
    }
    const setNeedBind = (val: boolean) => {
      needBind.value = val
    }
    const setBalanceInfo = (info: User.Common.IStudentBalanceVo) => {
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

    const studentsIdMap = computed(() => {
      const map: Record<number, Students.IStudentVo> = {}
      students.value.forEach((student) => {
        map[student.id] = student
      })
      return map
    })
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

    const axiosGetStudentListByParentApi = async () => {
      const result = await getStudentListByParentApi()

      if (result.code === 0 && result.data.students?.length) {
        const list = result.data.students
        setStudents(list)

        await nextTick()
      }

      return result
    }

    const axiosGetFamilyContactsApi = async () => {
      const result = await getFamilyContactsApi({})

      if (result.code === 0 && Array.isArray(result.data)) {
        setFamilyContacts(result.data)
      }

      return result
    }

    return {
      needBind,
      students,
      balanceInfo,
      contactInfo,
      familyContacts,
      setStudents,
      setNeedBind,
      setBalanceInfo,
      setContactInfo,
      setFamilyContacts,

      studentsIdMap,
      familyContactsRelationshipMap,

      axiosGetStudentListByParentApi,
      axiosGetFamilyContactsApi,
    }
  },
  {
    persist: true,
  },
)
