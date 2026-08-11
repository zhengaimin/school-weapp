<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页"
  }
}
</route>

<script setup lang="ts">
import type { THomeMenuItem } from './types'
import type { User } from '@/api/interface/modules/user'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, unref } from 'vue'
import { getCheckSelfApi } from '@/api/modules/family/contacts'
import { postParentSwitchChildApi } from '@/api/modules/students'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import Icon from '@/components/icon/index.vue'
import CustomerService from '@/components/popup/customer-service/index.vue'
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
import StudentSelector from './components/StudentSelector.vue'
import {
  HOME_CONTENT_OFFSET,
  HOME_HEADER_HEIGHT,
  HOME_HEADER_INFO_TOP,
  MESSAGE_CONTACT_REQUIRED_TEXT,
  PARENT_MESSAGE_URL_MISSING_TEXT,
  SHOW_BALANCE_SECTION,
} from './constants'
import { getGreeting } from './data'
import { navigateToParentMessage, navigateToScore } from './utils/navigation'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

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

/** 是否展示余额区域 */
const showBalanceSection = SHOW_BALANCE_SECTION
/** 是否展示首页客服入口 */
const showCustomerServiceEntry = false
/** 当前学生的消费统计 */
const consumptionStats = ref<User.Consumption.IConsumptionStatisticsVo>()
/** 当前手机号是否已加入亲情号 */
const isInFamilyContact = ref<boolean>(false)
/** 是否展示客服电话弹窗 */
const showCustomerService = ref(false)

/** 包含系统导航栏高度的首页头部高度 */
const headerHeight = computed(() => {
  return `calc(${HOME_HEADER_HEIGHT} + ${navBarInfo.value.navBarHeight}px)`
})
/** 首页头部信息的顶部位置 */
const headerInfoTop = computed(() => {
  return `calc(${HOME_HEADER_INFO_TOP} + ${navBarInfo.value.navBarHeight}px)`
})
/** 客服悬浮按钮的可拖动边界，顶部避开系统导航栏 */
const customerServiceGap = computed(() => ({
  top: (navBarInfo.value?.navBarHeight || 0) + 8,
  right: 0,
  bottom: 32,
  left: 0,
}))
/** 是否展示客服入口和弹窗 */
const hasCustomerServicePhone = computed(() => {
  return !!userInfo.value?.customerServicePhone?.trim()
})
/** 首页滚动内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight(HOME_CONTENT_OFFSET)
})
/** 是否展示服务号关注提醒 */
const showOfficialAccountNotice = computed(() => {
  const info = unref(userInfo) as any
  if (!info) return false

  const subscribed = info?.wechatSubscribed
  // 未返回关注状态时仍展示提醒，避免遗漏关注引导
  return subscribed === undefined ? true : !subscribed
})
/** 当前用户是否已签署人脸采集协议 */
const hasAgreementSigned = computed(() => {
  const info = unref(userInfo) as any
  return !!info?.agreementUrl
})
/** 当前学生已开通的功能模块 */
const studentModules = computed(() => {
  return studentInfo.value?.modules || []
})
/** 当前余额对应的设备类型 */
const primaryDeviceType = computed(() => {
  return devices.value?.[0]?.deviceType || defaultDeviceType.value || DEVICE_TYPE.VIDEO
})
/** 当前设备类型对应的余额信息 */
const currentBalanceInfo = computed(() => {
  if (primaryDeviceType.value === DEVICE_TYPE.DRYER) {
    return dryerBalanceInfo.value
  }
  return videoBalanceInfo.value
})
/** 当前学生是否开通账户信息模块 */
const hasAccountModules = computed(() => {
  return studentModules.value.includes(MINIAPP_MODULE_KEY_ACCOUNT_INFO)
})
/** 当前学生是否开通充值模块 */
const hasRechargeModules = computed(() => {
  return studentModules.value.includes(MINIAPP_MODULE_KEY_RECHARGE)
})
/** 当前学生可见的首页菜单 */
const filteredMenuList = computed(() => {
  const modules = new Set(studentModules.value)
  return MENU_LIST.filter((item) => {
    if (item.id === MINIAPP_MODULE_KEY_FACE_COLLECTION) return false
    if (!item.id) return true
    return modules.has(item.id)
  })
})
/** 账户信息菜单项 */
const accountInfoMenuItem = computed(() => {
  return filteredMenuList.value.find(item => item.id === MINIAPP_MODULE_KEY_ACCOUNT_INFO) || null
})
/** 除账户信息外的首页菜单项 */
const otherMenuList = computed(() => {
  return filteredMenuList.value.filter(item => item.id !== MINIAPP_MODULE_KEY_ACCOUNT_INFO)
})
/** 当前学生 ID，修改时同步切换学生上下文 */
const selectedStudentId = computed<number | null>({
  get: () => studentInfo.value?.studentId ?? null,
  set: (id) => {
    if (id == null || id === studentInfo.value?.studentId) return
    handleStudentChange(id)
  },
})

/**
 * 查询当前手机号是否存在于亲情号列表中
 * @returns 查询结果，请求失败时返回失败状态码
 */
async function axiosGetCheckSelfApi() {
  try {
    const result = await getCheckSelfApi({ phone: unref(phone) || unref(userInfo).phone })

    if (result.code === 0) {
      const { exists, contactInfo: selfContactInfo } = result.data
      isInFamilyContact.value = exists

      if (exists && selfContactInfo) {
        currentStudentStore.setContactInfo(selfContactInfo)
      } else {
        currentStudentStore.setContactInfo(null)
        await uni.showModal({
          title: '提示',
          content: '当前手机号不在该学生亲情号中，请先添加亲情号',
          showCancel: false,
          confirmText: '确定',
        })
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
/**
 * 按菜单业务规则执行页面跳转
 * @param path 普通菜单的目标路径
 * @param item 当前菜单项
 */
async function handleNavigationToPath(path?: string, item: THomeMenuItem = null) {
  if (item && item.id === MINIAPP_MODULE_KEY_MESSAGE && !isInFamilyContact.value) {
    await uni.showModal({
      title: '提示',
      content: MESSAGE_CONTACT_REQUIRED_TEXT,
      showCancel: false,
      confirmText: '确定',
    })
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

  if (!path) return

  uni.navigateTo({
    url: path,
  })
}
/**
 * 切换当前学生并刷新关联数据
 * @param childId 目标学生用户 ID
 */
async function handleStudentChange(childId: number) {
  pageError.value = ''
  pageLoading.value = true

  try {
    const previousStudentId = parentStore.currentStudentId
    const result = await postParentSwitchChildApi({ childUserId: childId })

    if (result.code === 0) {
      if (previousStudentId !== childId) {
        // 清理上一名学生的缓存，避免设备和业务数据串用
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

      // 等待学生上下文更新后再查询依赖当前学生的亲情号状态
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
  // 首次数据由登录成功回调加载，页面再次显示时才刷新
  if (unref(pageLoaded)) {
    batchRequestHandler([userStore.getUserInfo(), axiosGetCheckSelfApi()])
  }
})
</script>

<template>
  <Page
    :show="false"
    :scroll-y="false"
    :show-back="false"
    :loading="pageLoading"
    :error="pageError"
    @login:success="handleLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 主内容区 -->
    <view relative z-10>
      <!-- 顶部背景区域 -->
      <view :style="{ height: headerHeight }" relative class="header-bg">
        <!-- 装饰性圆形背景 -->
        <view absolute right-8 top-4 h-16 w-16 rounded-full bg="white opacity-10" />
        <view absolute right-16 top-8 h-10 w-10 rounded-full bg="white opacity-15" />
        <view absolute bottom-8 left-6 h-12 w-12 rounded-full bg="white opacity-10" />

        <!-- 顶部信息 -->
        <view p="x-6" text="white" :style="{ paddingTop: headerInfoTop }">
          <view m="b-1" flex="~ row align-center justify-between">
            <text text="2xl white" font="bold">
              {{ getGreeting() }}
            </text>
          </view>
          <text text="lg white" font="medium">
            {{ userInfo?.userName }}
          </text>
        </view>

        <!-- 可爱的卡通形象 -->
        <view absolute bottom-1 right-4>
          <view relative h-20 w-20>
            <!-- 花瓣 -->
            <view absolute inset-0 rounded-full bg-orange-400 />
            <view absolute bottom-1 left-1 right-1 top-1 rounded-full bg-yellow-300 />
            <!-- 脸部 -->
            <view absolute left="1/2" top="1/2" transform="~ translate-x--1/2 translate-y--1/2">
              <!-- 眼睛 -->
              <view mb-1 flex="~" gap-1>
                <view h-1.5 w-1.5 rounded-full bg-black />
                <view h-1.5 w-1.5 rounded-full bg-black />
              </view>
              <!-- 嘴巴 -->
              <view h-2 w-4 rounded-full bg-red-600 />
              <!-- 牙齿 -->
              <view mt-0.5 flex="~ justify-center" gap-x-0.5>
                <view h-0.5 w-0.5 bg-white />
                <view h-0.5 w-0.5 bg-white />
              </view>
            </view>
          </view>
        </view>
      </view>

      <view relative z-10 mt--6 border="rounded-t-2xl" bg="gray-50">
        <scroll-view scroll-y :style="contentHeight">
          <view flex="~ col" gap="4" p="4 t-6">
            <!-- 学生信息模块 -->
            <StudentSelector
              v-if="students.length"
              v-model="selectedStudentId"
              :students="students"
            />
            <Notice
              v-if="showOfficialAccountNotice"
              type="warning"
              title="尚未关注服务号"
              content="关注后可及时接收通知，点击前往关注"
              @click="handleGoToOfficialAccount"
            />

            <!-- 余额和消费信息（暂不展示） -->
            <view
              v-if="showBalanceSection && currentBalanceInfo && hasAccountModules"
              border="rounded-xl"
              bg="bg-secondary"
              p="3"
            >
              <view flex="~ items-center justify-between">
                <view>
                  <view m="b-1" text="xs primary" font="medium">
                    账户余额
                  </view>
                  <view text="xl gray-900" font="bold">
                    ￥{{ currentBalanceInfo.availableBalanceFormatted }}
                  </view>
                </view>
                <view text="right">
                  <view text="xs gray-500">
                    今日消费
                  </view>
                  <view text="sm gray-700" font="medium">
                    ￥{{ consumptionStats?.todayAmount || '--' }}
                  </view>
                </view>
              </view>

              <view m="t-2" p="t-2" border-t="1 bg-muted solid">
                <view flex="~ justify-between" text="xs gray-500">
                  <text>本月消费: ￥{{ consumptionStats?.monthAmount || '--' }}</text>
                  <text>
                    上次充值:
                    {{
                      currentBalanceInfo.updatedAt
                        ? dayjs(currentBalanceInfo.updatedAt).format('YYYY-MM-DD')
                        : '--'
                    }}
                  </text>
                </view>
              </view>
            </view>

            <!-- 冻结金额信息（暂不展示） -->
            <view
              v-if="showBalanceSection && Number(currentBalanceInfo?.frozenBalance) > 0"
              m="t-3"
              p="2"
              border="rounded-lg"
              bg="orange-50"
            >
              <view flex="~ items-center justify-between">
                <view flex="~ items-center" gap="2">
                  <Icon name="lock-line" icon-color="#f59e0b" icon-size="24rpx" />
                  <view text="xs #f59e0b">
                    冻结金额
                  </view>
                </view>
                <view text="sm #f59e0b">
                  ￥{{ Number(currentBalanceInfo?.frozenBalance).toFixed(2) }}
                </view>
              </view>
            </view>
          </view>

          <!-- 功能按钮网格 -->
          <view grid="~ cols-4 gap-4" p-b="4">
            <!-- 账户信息 -->
            <view
              v-if="accountInfoMenuItem"
              flex="~ col items-center"
              @click="handleNavigationToPath(accountInfoMenuItem.path, accountInfoMenuItem)"
            >
              <view
                flex="~ col items-center justify-center"
                border="rounded-2xl"
                m="b-2"
                h-12
                w-12
                :style="{ backgroundColor: accountInfoMenuItem.bgColor }"
              >
                <Icon
                  :name="accountInfoMenuItem.icon"
                  :icon-color="accountInfoMenuItem.color"
                  icon-size="36rpx"
                />
              </view>
              <text text="xs gray-700" font="medium">
                {{ accountInfoMenuItem.title }}
              </text>
            </view>

            <!-- 充值 -->
            <view
              v-if="hasRechargeModules"
              flex="~ col items-center"
              @click="handleNavigationToPath(`${BALANCE_RECHARGE_PATH}`)"
            >
              <view
                flex="~ col items-center justify-center"
                border="rounded-2xl"
                m="b-2"
                h-12
                w-12
                :style="{ backgroundColor: '#dbeafe' }"
              >
                <Icon name="wallet-3-line" icon-color="#3b82f6" icon-size="36rpx" />
              </view>
              <text text="xs gray-700" font="medium">
                充值
              </text>
            </view>
            <!-- 其他菜单项 -->
            <view
              v-for="(item, index) in otherMenuList"
              :key="index"
              flex="~ col items-center"
              @click="handleNavigationToPath(item.path, item)"
            >
              <view
                flex="~ col items-center justify-center"
                border="rounded-2xl"
                m="b-2"
                h-12
                w-12
                :style="{ backgroundColor: item.bgColor }"
              >
                <Icon :name="item.icon" :icon-color="item.color" icon-size="36rpx" />
              </view>
              <text text="xs gray-700" font="medium">
                {{ item.title }}
              </text>
            </view>
            <!-- 成绩按钮 -->
            <!-- <view flex="~ col items-center" @click="handleNavigationToWebview">
                <view
                  flex="~ col items-center justify-center"
                  border="rounded-2xl"
                  m="b-2"
                  h-12
                  w-12
                  :style="{ backgroundColor: MENU_SCORE.bgColor }"
                >
                  <Icon :name="MENU_SCORE.icon" :icon-color="MENU_SCORE.color" icon-size="36rpx" />
                </view>
                <text text="xs gray-700" font="medium">
                  {{ MENU_SCORE.title }}
                </text>
              </view> -->
          </view>
        </scroll-view>
      </view>
    </view>
    <wd-fab
      v-if="showCustomerServiceEntry && hasCustomerServicePhone"
      position="right-center"
      :draggable="true"
      :expandable="false"
      :gap="customerServiceGap"
      :z-index="30"
    >
      <template #trigger>
        <view
          class="customer-service-trigger"
          flex="~ items-center justify-center"
          aria-label="联系客服"
          @click="showCustomerService = true"
        >
          <Icon name="customer-service-line" icon-color="#fff" icon-size="36rpx" />
        </view>
      </template>
    </wd-fab>
    <CustomerService
      v-if="showCustomerServiceEntry && hasCustomerServicePhone"
      v-model="showCustomerService"
      :phone="userInfo?.customerServicePhone || ''"
    />
  </Page>
</template>

<style lang="scss" scoped>
// 顶部背景区域
.header-bg {
  background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%);
}

.customer-service-trigger {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgb(50 105 221 / 95%);
  box-shadow: 0 8rpx 20rpx rgb(15 31 57 / 20%);
}

// 深层样式
:deep(.wd-skeleton) {
  box-sizing: border-box;
}
</style>
