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
import dayjs from 'dayjs'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import Icon from '@/components/icon/index.vue'
import StudentSelector from './components/StudentSelector.vue'
import { getGreeting } from './data'
import { useHome } from './hooks/useHome'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const {
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
} = useHome()
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
          <view grid="~ cols-4 gap-4">
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
