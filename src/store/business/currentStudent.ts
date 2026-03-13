/**
 * 当前操作的学生业务数据 Store
 * 用于存储当前正在操作的学生的业务数据
 * - 学生基本信息（从概览学生接口同步）
 * - 亲情号信息
 * - 设备列表
 *
 * 注意：
 * 1. 这不是"学生角色"的 store，而是"当前操作的学生数据"
 * 2. 在家长模式下，数据来自 parent.currentStudentId 对应的学生
 * 3. 在学生模式下，数据来自登录学生本人
 * 4. 切换学生时需要调用 clearStudentData() 清空旧数据
 */
import type { Family } from '@/api/interface/modules/family'
import type { Overview } from '@/api/interface/modules/overview'
import type { User } from '@/api/interface/modules/user'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, unref, watch } from 'vue'
import { getRelationshipOptionsApi } from '@/api/modules/family'
import { getFamilyContactsApi } from '@/api/modules/family/contacts'
import { useParentStore } from '@/store/auth/parent'
import { useUserStore } from '@/store/user'

type CurrentStudentInfo = Omit<User.Common.ICurrentChildVo, 'balanceInfo'> & {
  id?: number
  avatar?: string
  schoolName?: string
  modules?: string[]
}

/** 将家长学生信息映射为当前学生结构 */
function mapParentStudentToCurrentChild(student: Overview.IStudentVo | null) {
  if (!student) return null
  return {
    UUID: (student as any).UUID || '',
    id: student.id,
    studentId: student.id ?? null,
    studentName: student.name ?? null,
    studentCode: (student as any).studentCode ?? null,
    grade: student.grade ?? null,
    className: student.className ?? null,
    departmentName: (student as any).departmentName ?? null,
    schoolName: student.schoolName ?? null,
    avatar: student.avatar ?? null,
    modules: student.modules ?? [],
    balance: (student as any).balance ?? null,
    cardNumber: (student as any).cardNumber ?? null,
    relationship: (student as any).relationship ?? null,
    faceImageUrl: (student as any).faceImageUrl ?? null,
    faceStatus: (student as any).faceStatus ?? null,
    idCard: (student as any).idCard ?? null,
    gender: (student as any).gender ?? null,
    birthday: (student as any).birthday ?? null,
  }
}

export const useCurrentStudentStore = defineStore(
  'currentStudent',
  () => {
    const parentStore = useParentStore()
    const { currentStudentId, studentsIdMap } = storeToRefs(parentStore)
    // 学生基本信息（从概览学生接口同步）
    const studentInfo = ref<CurrentStudentInfo | null>(null)
    // 亲情号信息
    const contactInfo = ref<Family.Contact.ISelfContactVo | null>(null)
    // 亲情号列表缓存
    const familyContacts = ref<Family.Contact.ResGetFamilyContactsApi[]>([])
    // 亲情号关系选项
    const relationshipOptions = ref<Family.Relationship.IRelationshipOptionVo[] | null>(null)
    // 学生模块列表
    const modules = ref<string[]>([])
    // 学生设备列表
    const devices = ref<Overview.IDeviceVo[]>([])

    /** 设置学生基本信息 */
    const setStudentInfo = (info: CurrentStudentInfo | null) => {
      studentInfo.value = info
    }
    /** 设置亲情号信息 */
    const setContactInfo = (info: Family.Contact.ISelfContactVo | null) => {
      contactInfo.value = info
    }
    /** 设置亲情号列表缓存 */
    const setFamilyContacts = (contacts: Family.Contact.ResGetFamilyContactsApi[]) => {
      familyContacts.value = contacts
    }
    /** 设置亲情号关系选项 */
    const setRelationshipOptions = (options: Family.Relationship.IRelationshipOptionVo[] | null) => {
      relationshipOptions.value = options
    }
    /** 设置学生模块列表 */
    const setModules = (value: string[]) => {
      modules.value = value
    }
    /** 设置学生设备列表 */
    const setDevices = (value: Overview.IDeviceVo[]) => {
      devices.value = value
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
    // 亲情号关系选项 map
    const relationshipValueMap = computed(() => {
      const map: Record<number, Family.Relationship.IRelationshipOptionVo> = {}

      ;(unref(relationshipOptions) || [])?.forEach((r) => {
        map[r.value] = r
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

      return parts.join(' · ')
    })

    // 学生班级路径：年级·级部·班级（没有则不显示）
    const studentClassPath = computed(() => {
      if (!studentInfo.value) return ''
      const parts = [
        studentInfo.value.grade,
        studentInfo.value.departmentName,
        studentInfo.value.className,
      ].filter(Boolean)
      return parts.join(' · ')
    })

    /** 获取亲情号列表 */
    const axiosGetFamilyContactsApi = async () => {
      const result = await getFamilyContactsApi({})

      if (result.code === 0 && Array.isArray(result.data)) {
        setFamilyContacts(result.data)
      }

      return result
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
      } catch (error) {
        return { code: -1 }
      }
    }

    /** 同步当前学生基本信息 */
    function syncCurrentStudentInfo() {
      const student = currentStudentId.value
        ? studentsIdMap.value[currentStudentId.value] || null
        : null
      const mappedStudent = mapParentStudentToCurrentChild(student)
      setStudentInfo(mappedStudent)
      setModules(mappedStudent?.modules ?? [])
      setDevices(student?.devices ?? [])
    }

    watch([currentStudentId, studentsIdMap], () => {
      syncCurrentStudentInfo()
    }, { immediate: true })

    /**
     * 清空学生数据
     * 在切换学生时调用，清空旧学生的业务数据
     */
    const clearStudentData = () => {
      studentInfo.value = null
      contactInfo.value = null
      familyContacts.value = []
      modules.value = []
      devices.value = []
    }

    return {
      studentInfo,
      contactInfo,
      familyContacts,
      relationshipOptions,
      modules,
      devices,
      setStudentInfo,
      setContactInfo,
      setFamilyContacts,
      setRelationshipOptions,
      setModules,
      setDevices,

      familyContactsRelationshipMap,
      relationshipValueMap,
      studentFullInfo,
      studentClassPath,

      axiosGetFamilyContactsApi,
      axiosGetRelationshipOptionsApi,
      clearStudentData,
    }
  },
  {
    persist: true,
  },
)
