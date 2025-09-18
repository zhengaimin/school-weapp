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
// #region 导入
import type { User } from '@/api/interface/modules/user'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, unref } from 'vue'
import { getCheckSelfApi } from '@/api/modules/family/contacts'
import { postParentSwitchChildApi } from '@/api/modules/students'
import { getConsumptionStatisticsApi } from '@/api/modules/user/consumption'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import Icon from '@/components/icon/index.vue'
import { BALANCE_RECHARGE_PATH, COMMON_FOLLOW_PATH, FACE_CONSENT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { usePage } from '@/hooks/usePage'
import { useSchoolModules } from '@/hooks/useSchoolModules'
import { useAppStore } from '@/store/app'
import { useConfigStore } from '@/store/config'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'
import StudentSelect from './components/StudentSelect.vue'
import { getGreeting } from './data'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, pageLoaded, getContentHeight, batchRequestHandler, onLoginFail }
  = usePage()
const { axiosGetUserBalanceApi } = useBalance()
const { hasAccountModules, hasRechargeModules } = useSchoolModules()
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const configStore = useConfigStore()
const { currentStudent, userInfo, phone } = storeToRefs(userStore)
const { balanceInfo } = storeToRefs(parentStore)
const { navBarInfo } = storeToRefs(useAppStore())
const { filteredMenuList } = storeToRefs(configStore)
// #endregion

// #region 定义响应式数据
const showStudentSelector = ref(false)
const consumptionStats = ref<User.Consumption.IConsumptionStatisticsVo>()
const isInFamilyContact = ref<boolean>(false)
// #endregion

// #region 定义计算属性
const headerHeight = computed(() => {
  return `calc(260rpx + ${navBarInfo.value.navBarHeight}px)`
})
const headerInfoTop = computed(() => {
  return `calc(16rpx + ${navBarInfo.value.navBarHeight}px)`
})
const contentHeight = computed(() => {
  return getContentHeight('(260rpx - 48rpx)')
})
const showOfficialAccountNotice = computed(() => {
  const info = unref(userInfo) as any

  if (!info)
    return false

  // 检查微信公众号关注状态
  const subscribed
    = info?.wechatSubscribed
      ?? info?.officialAccountSubscribed
      ?? info?.isOfficialAccountSubscribed
      ?? info?.wechatInfo?.officialAccountSubscribed
      ?? info?.wechatInfo?.subscribeOfficialAccount
      ?? info?.wechatInfo?.subscribedOfficialAccount

  return subscribed === undefined ? true : !subscribed
})

// 检查是否已签名授权
const hasAgreementSigned = computed(() => {
  const info = unref(userInfo) as any
  return !!(info?.agreementUrl)
})
// #endregion

// #region 接口请求函数
// 获取统计数据
async function axiosGetConsumptionStatisticsApi() {
  try {
    const result = await getConsumptionStatisticsApi()

    if (result.code === 0) {
      consumptionStats.value = result.data
    }

    return result
  }
  catch (error) {
    console.error('获取消费统计失败:', error)
    return { code: -1 }
  }
}

// 查询手机号是否存在于亲情号列表中
async function axiosGetCheckSelfApi() {
  try {
    const result = await getCheckSelfApi({ phone: unref(phone) || unref(userInfo).phone })

    if (result.code === 0) {
      const { exists, contactInfo: selfContactInfo } = result.data
      // 保存是否存在于亲情号中的状态
      isInFamilyContact.value = exists

      // 如果存在亲情号信息，则存储到 store
      if (exists && selfContactInfo) {
        parentStore.setContactInfo(selfContactInfo)
      }
    }

    return result
  }
  catch (error) {
    console.error('获取联系人信息失败:', error)
    isInFamilyContact.value = false
    return { code: -1 }
  }
}

// #endregion

// #region 事件处理函数
// 关注公众号
function handleGoToOfficialAccount() {
  uni.navigateTo({
    url: COMMON_FOLLOW_PATH,
  })
}

// 页面跳转
function handleNavigationToPath(path: string, item: any = null) {
  // 检查是否点击留言功能
  if (item && item.id === 'message' && !isInFamilyContact.value) {
    toast.show('您的手机号未在亲情号中，无法使用留言功能')
    return
  }

  // 检查是否点击人脸采集功能
  if (item && (item.id === 'face' || item.title === '人脸采集') && !hasAgreementSigned.value) {
    // 如果没有签名授权，直接跳转到同意授权页面
    uni.navigateTo({
      url: FACE_CONSENT_PATH,
    })
    return
  }

  uni.navigateTo({
    url: path,
  })
}

// 显示切换学生弹框
function handleShowStudentSelector() {
  showStudentSelector.value = true
}

// 切换学生
async function handleStudentChange(childId: number) {
  pageError.value = ''
  pageLoading.value = true

  try {
    const result = await postParentSwitchChildApi({ childUserId: childId })

    if (result.code === 0) {
      const { token } = result.data

      if (token) {
        userStore.setToken(token)
        await userStore.getUserInfo()
        await axiosGetUserBalanceApi()
      }
      // 切换学生成功后，清除亲情号信息
      parentStore.setContactInfo(null)

      await nextTick()
      await batchRequestHandler(
        [
          configStore.axiosGetSchoolModulesApi(),
          axiosGetConsumptionStatisticsApi(),
          axiosGetCheckSelfApi(),
        ],
        {
          auto: false,
        },
      )
    }
  }
  catch (error) {
    console.error('切换学生失败', error)
  }
  finally {
    pageError.value = ''
    pageLoading.value = false
  }
}
// #endregion

// #region 生命周期钩子
// 登录成功处理
async function handleLoginSuccess() {
  // 批量处理其他接口
  await batchRequestHandler([
    configStore.axiosGetSchoolModulesApi(),
    axiosGetConsumptionStatisticsApi(),
    axiosGetCheckSelfApi(),
  ])
}

onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([
      userStore.getUserInfo(),
      axiosGetConsumptionStatisticsApi(),
      axiosGetCheckSelfApi(),
      axiosGetUserBalanceApi(),
    ])
  }
})
// #endregion
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

            <!-- 孩子切换区域 - 绝对定位在右上角 -->
            <view relative flex="~ items-center" @click="handleShowStudentSelector">
              <text text="sm white" font="medium">
                {{ currentStudent?.studentName }}
              </text>
              <view m="l-1" h-5 w-5 flex="~ items-center justify-center" border="rounded-full">
                <Icon name="arrow-left-right-fill" icon-color="#ffffff" icon-size="36rpx" />
              </view>
            </view>
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

      <!-- 学生选择器组件 -->
      <StudentSelect v-model="showStudentSelector" @change="handleStudentChange" />

      <!-- 学生账户信息 - 简略 -->
      <view relative z-10 mt--6 border="rounded-t-2xl" bg="gray-50">
        <scroll-view scroll-y :style="contentHeight">
          <view flex="~ col" gap="4" p="4 t-6">
            <Notice
              v-if="showOfficialAccountNotice"
              type="warning"
              title="尚未关注公众号"
              content="关注后可及时接收通知，点击前往关注"
              @click="handleGoToOfficialAccount"
            />
            <!-- 当前孩子账户信息 -->
            <view border="~ bg-muted solid rounded-2xl" bg="white" p="4">
              <!-- 当前孩子账户 -->
              <view flex="~ items-center justify-between" m="b-3">
                <view flex="1">
                  <view text="sm gray-900" font="medium">
                    {{ currentStudent?.studentName }}
                  </view>
                  <view text="xs gray-500">
                    {{ currentStudent?.fullClassName }}
                  </view>
                </view>
                <TButton
                  v-if="hasRechargeModules"
                  size="small"
                  type="primary"
                  custom-class="w-auto!"
                  @click="handleNavigationToPath(`${BALANCE_RECHARGE_PATH}`)"
                >
                  充值
                </TButton>
              </view>

              <!-- 余额和消费信息 -->
              <view
                v-if="balanceInfo && hasAccountModules"
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
                      ￥{{ balanceInfo.availableBalanceFormatted }}
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
                        balanceInfo.updatedAt
                          ? dayjs(balanceInfo.updatedAt).format('YYYY-MM-DD')
                          : '--'
                      }}
                    </text>
                  </view>
                </view>
              </view>

              <!-- 冻结金额信息 -->
              <view
                v-if="Number(balanceInfo?.frozenBalance) > 0"
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
                    ￥{{ Number(balanceInfo?.frozenBalance).toFixed(2) }}
                  </view>
                </view>
              </view>
            </view>

            <!-- 功能按钮网格 -->
            <view grid="~ cols-4 gap-4">
              <view
                v-for="(item, index) in filteredMenuList"
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
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </Page>
</template>

<style lang="scss" scoped>
// 顶部背景区域
.header-bg {
  background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%);
}

// 深层样式
:deep(.wd-skeleton) {
  box-sizing: border-box;
}
</style>
