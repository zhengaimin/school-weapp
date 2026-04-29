import type { THomeMenuItem } from '../types'
import type { User } from '@/api/interface/modules/user'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, unref } from 'vue'
import { getCheckSelfApi } from '@/api/modules/family/contacts'
import { postParentSwitchChildApi } from '@/api/modules/students'
import {
  DEVICE_TYPE,
  MENU_LIST,
  MINIAPP_MODULE_KEY_ACCOUNT_INFO,
  MINIAPP_MODULE_KEY_FACE_COLLECTION,
  MINIAPP_MODULE_KEY_MESSAGE,
  MINIAPP_MODULE_KEY_PARENT_MESSAGE,
  MINIAPP_MODULE_KEY_RECHARGE,
} from '@/constant/modules'
import {
  BALANCE_RECHARGE_PATH,
  COMMON_FOLLOW_PATH,
  FACE_CONSENT_PATH,
} from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useDeviceType } from '@/hooks/useDeviceType'
import { usePage } from '@/hooks/usePage'
import { useAppStore } from '@/store/app'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
import {
  HOME_CONTENT_OFFSET,
  HOME_HEADER_HEIGHT,
  HOME_HEADER_INFO_TOP,
  MESSAGE_CONTACT_REQUIRED_TEXT,
  PARENT_MESSAGE_URL_MISSING_TEXT,
  SHOW_BALANCE_SECTION,
} from '../constants'
import { navigateToParentMessage, navigateToScore } from '../utils/navigation'

/**
 * 首页业务逻辑
 * @returns 首页页面状态与事件处理方法
 */
export function useHome() {
  const { pageLoading, pageError, pageLoaded, getContentHeight, batchRequestHandler, onLoginFail }
    = usePage()

  const userStore = useUserStore()
  const parentStore = useParentStore()
  const currentStudentStore = useCurrentStudentStore()
  const { userInfo, phone } = storeToRefs(userStore)
  const { students } = storeToRefs(parentStore)
  const { studentInfo, devices } = storeToRefs(currentStudentStore)
  const { navBarInfo } = storeToRefs(useAppStore())
  const { dryerBalanceInfo, videoBalanceInfo } = useBalance()
  const { defaultDeviceType } = useDeviceType()

  const consumptionStats = ref<User.Consumption.IConsumptionStatisticsVo>()
  const isInFamilyContact = ref<boolean>(false)

  const showBalanceSection = SHOW_BALANCE_SECTION

  const headerHeight = computed(() => {
    return `calc(${HOME_HEADER_HEIGHT} + ${navBarInfo.value.navBarHeight}px)`
  })
  const headerInfoTop = computed(() => {
    return `calc(${HOME_HEADER_INFO_TOP} + ${navBarInfo.value.navBarHeight}px)`
  })
  const contentHeight = computed(() => {
    return getContentHeight(HOME_CONTENT_OFFSET)
  })
  const showOfficialAccountNotice = computed(() => {
    const info = unref(userInfo) as any
    if (!info) return false

    const subscribed = info?.wechatSubscribed
    return subscribed === undefined ? true : !subscribed
  })
  const hasAgreementSigned = computed(() => {
    const info = unref(userInfo) as any
    return !!info?.agreementUrl
  })
  const studentModules = computed(() => {
    return studentInfo.value?.modules || []
  })
  const primaryDeviceType = computed(() => {
    return devices.value?.[0]?.deviceType || defaultDeviceType.value || DEVICE_TYPE.VIDEO
  })
  const currentBalanceInfo = computed(() => {
    if (primaryDeviceType.value === DEVICE_TYPE.DRYER) {
      return dryerBalanceInfo.value
    }
    return videoBalanceInfo.value
  })
  const hasAccountModules = computed(() => {
    return studentModules.value.includes(MINIAPP_MODULE_KEY_ACCOUNT_INFO)
  })
  const hasRechargeModules = computed(() => {
    return studentModules.value.includes(MINIAPP_MODULE_KEY_RECHARGE)
  })
  const filteredMenuList = computed(() => {
    const modules = new Set(studentModules.value)
    return MENU_LIST.filter((item) => {
      if (item.id === MINIAPP_MODULE_KEY_FACE_COLLECTION) return false
      if (!item.id) return true
      return modules.has(item.id)
    })
  })
  const accountInfoMenuItem = computed(() => {
    return filteredMenuList.value.find(item => item.id === MINIAPP_MODULE_KEY_ACCOUNT_INFO) || null
  })
  const otherMenuList = computed(() => {
    return filteredMenuList.value.filter(item => item.id !== MINIAPP_MODULE_KEY_ACCOUNT_INFO)
  })
  const selectedStudentId = computed<number | null>({
    get: () => studentInfo.value?.studentId ?? null,
    set: (id) => {
      if (id == null || id === studentInfo.value?.studentId) return
      handleStudentChange(id)
    },
  })

  /** 查询手机号是否存在于亲情号列表中 */
  async function axiosGetCheckSelfApi() {
    try {
      const result = await getCheckSelfApi({ phone: unref(phone) || unref(userInfo).phone })

      if (result.code === 0) {
        const { exists, contactInfo: selfContactInfo } = result.data
        isInFamilyContact.value = exists

        if (exists && selfContactInfo) {
          currentStudentStore.setContactInfo(selfContactInfo)
        }
      }

      return result
    } catch (error) {
      console.error('获取联系人信息失败:', error)
      isInFamilyContact.value = false
      return { code: -1 }
    }
  }

  /** 关注公众号 */
  function handleGoToOfficialAccount() {
    uni.navigateTo({
      url: COMMON_FOLLOW_PATH,
    })
  }

  /** 获取第三方页面 onlyCode 参数 */
  function getStudentOnlyCode() {
    const { UUID } = unref(studentInfo) || {}
    return UUID || ''
  }

  /** 页面跳转 */
  function handleNavigationToPath(path: string, item: THomeMenuItem = null) {
    if (item && item.id === MINIAPP_MODULE_KEY_MESSAGE && !isInFamilyContact.value) {
      toast.show(MESSAGE_CONTACT_REQUIRED_TEXT)
      return
    }

    if (item && (item.id === 'face' || item.title === '人脸采集') && !hasAgreementSigned.value) {
      uni.navigateTo({
        url: FACE_CONSENT_PATH,
      })
      return
    }

    if (item && item.id === 'score') {
      const { scoreUrl, schoolName, roleInfo } = unref(userInfo)
      const { currentChild } = roleInfo as User.Common.IParentRoleInfoVo
      navigateToScore({
        scoreUrl,
        schoolName,
        onlyCode: currentChild!.UUID,
        // 成绩页默认显示“返回小程序”按钮
        rt: 0,
      })
      return
    }

    if (item && item.id === MINIAPP_MODULE_KEY_PARENT_MESSAGE) {
      const { scoreUrl, schoolName, userName, roleInfo } = unref(userInfo) || {}
      const tel = unref(phone) || unref(userInfo)?.phone || ''
      const { currentChild } = roleInfo as User.Common.IParentRoleInfoVo

      if (!scoreUrl) {
        toast.show(PARENT_MESSAGE_URL_MISSING_TEXT)
        return
      }

      navigateToParentMessage({
        scoreUrl,
        schoolName: schoolName || '',
        onlyCode: currentChild!.UUID,
        tel,
        nickname: userName || '',
        // 家长留言页默认显示“返回小程序”按钮
        rt: 0,
      })
      return
    }

    uni.navigateTo({
      url: path,
    })
  }

  /** 切换学生和设备 */
  async function handleStudentChange(childId: number) {
    pageError.value = ''
    pageLoading.value = true

    try {
      const previousStudentId = parentStore.currentStudentId
      const result = await postParentSwitchChildApi({ childUserId: childId })

      if (result.code === 0) {
        if (previousStudentId !== childId) {
          currentStudentStore.clearStudentData()
        }

        parentStore.setCurrentStudentId(childId)
        const selectedStudent = students.value.find(student => student.id === childId)
        currentStudentStore.setDevices(selectedStudent?.devices ?? [])

        const { token } = result.data
        if (token) {
          userStore.setToken(token)
          await userStore.getUserInfo()
        }

        await nextTick()
        await batchRequestHandler([axiosGetCheckSelfApi()], {
          auto: false,
        })
      }
    } catch (error) {
      console.error('切换学生失败', error)
    } finally {
      pageError.value = ''
      pageLoading.value = false
    }
  }

  /** 登录成功处理 */
  async function handleLoginSuccess() {
    await batchRequestHandler([axiosGetCheckSelfApi()])
  }

  onShow(() => {
    if (unref(pageLoaded)) {
      batchRequestHandler([userStore.getUserInfo(), axiosGetCheckSelfApi()])
    }
  })

  return {
    BALANCE_RECHARGE_PATH,
    pageLoading,
    pageError,
    onLoginFail,
    userInfo,
    students,
    selectedStudentId,
    showOfficialAccountNotice,
    showBalanceSection,
    currentBalanceInfo,
    hasAccountModules,
    consumptionStats,
    accountInfoMenuItem,
    hasRechargeModules,
    otherMenuList,
    headerHeight,
    headerInfoTop,
    contentHeight,
    handleGoToOfficialAccount,
    handleNavigationToPath,
    handleLoginSuccess,
  }
}
