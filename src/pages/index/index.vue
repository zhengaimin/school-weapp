<route lang="jsonc" type="home">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页"
  }
}
</route>

<script setup lang="ts">
import type { UserInfo } from './data'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Page from '@/components/common/page/index.vue'

import Icon from '@/components/icon/index.vue'
import { COMMON_FACE_COLLECTION_PATH, PARENT_STUDENT_DETAIL_PATH } from '@/constant/router'

import { usePage } from '@/hooks/usePage'
import { useAppStore } from '@/store/app'

// import Skeleton from './components/Skeleton.vue'
import StudentSelect from './components/StudentSelect.vue'

import {
  childrenData,
  defaultChildId,
  functionButtons,
  getChildById,
  getCurrentUserInfo
} from './data'

const { pageLoading, pageError, getContentHeight, onLoginSuccess, onLoginFail } = usePage()
const { navBarInfo } = storeToRefs(useAppStore())

const childSelectorRef = ref()

// 当前选中的孩子
const currentChildId = ref(defaultChildId)
const currentChild = computed(() => getChildById(currentChildId.value))

// 用户信息
const userInfo = ref<UserInfo>(getCurrentUserInfo())

// 孩子列表
const childrenList = computed(() => Object.values(childrenData))

// 通知横幅显示状态
const showNotificationBanner = computed(() => {
  return currentChild.value?.faceCollectionStatus === 'failed'
})

const headerHeight = computed(() => {
  return `calc(260rpx + ${navBarInfo.value.navBarHeight}px)`
})
const headerInfoTop = computed(() => {
  return `calc(16rpx + ${navBarInfo.value.navBarHeight}px)`
})
const contentHeight = computed(() => {
  // 蓝色背景 + margin: -24px
  return getContentHeight('(260rpx - 48rpx)')
})

function navigationToPath(path: string) {
  uni.navigateTo({
    url: path
  })
}

// 切换学生选择器
function onChildSelector() {
  console.log(childSelectorRef.value.acceptParams)
  childSelectorRef.value.acceptParams()
}
// 处理学生选择
function handleChildSelected(childId: string) {
  currentChildId.value = childId
}
</script>

<template>
  <Page
    :show="false"
    :scroll-y="false"
    :show-back="false"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 主内容区 -->
    <view class="relative" z-10>
      <!-- 顶部背景区域 -->
      <view :style="{ height: headerHeight }" relative class="header-bg">
        <!-- 装饰性圆形背景 -->
        <view class="absolute right-8 top-4 h-16 w-16 rounded-full bg-white bg-opacity-10" />
        <view class="absolute right-16 top-8 h-10 w-10 rounded-full bg-white bg-opacity-15" />
        <view class="absolute bottom-8 left-6 h-12 w-12 rounded-full bg-white bg-opacity-10" />

        <!-- 顶部信息 -->
        <view p="x-6" text="white" :style="{ paddingTop: headerInfoTop }">
          <view m="b-1" flex="~ row align-center justify-between">
            <text text="2xl white" font="bold">
              {{ userInfo.greeting }}
            </text>

            <!-- 孩子切换区域 - 绝对定位在右上角 -->
            <view relative flex="~ items-center" @click="onChildSelector">
              <text text="sm white" font="medium">
                {{ currentChild?.name }}
              </text>
              <view m="l-1" h-5 w-5 flex="~ items-center justify-center" border="rounded-full">
                <Icon name="arrow-left-right-fill" icon-color="#ffffff" icon-size="36rpx" />
              </view>
            </view>
          </view>
          <text class="text-lg text-white font-medium">
            {{ userInfo.name }}
          </text>
        </view>

        <!-- 可爱的卡通形象 -->
        <view class="absolute bottom-1 right-4">
          <view class="relative h-20 w-20">
            <!-- 花瓣 -->
            <view class="absolute inset-0 rounded-full bg-orange-400" />
            <view class="absolute bottom-1 left-1 right-1 top-1 rounded-full bg-yellow-300" />
            <!-- 脸部 -->
            <view class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <!-- 眼睛 -->
              <view class="mb-1 flex space-x-1">
                <view class="h-1.5 w-1.5 rounded-full bg-black" />
                <view class="h-1.5 w-1.5 rounded-full bg-black" />
              </view>
              <!-- 嘴巴 -->
              <view class="h-2 w-4 rounded-full bg-red-600" />
              <!-- 牙齿 -->
              <view class="mt-0.5 flex justify-center">
                <view class="h-0.5 w-0.5 bg-white" />
                <view class="ml-0.5 h-0.5 w-0.5 bg-white" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 学生选择器组件 -->
      <StudentSelect
        :id="currentChildId"
        ref="childSelectorRef"
        :children="childrenList"
        @selected="handleChildSelected"
      />

      <!-- 白色卡片区域 -->
      <view relative z-10 mt--6 border="rounded-t-2xl" bg="gray-50">
        <scroll-view scroll-y :style="contentHeight">
          <view flex="~ col" gap="4" p="4 t-6">
            <!-- showNotificationBanner 公告通知组件 -->
            <view
              border="1 solid orange-200 rounded-2xl"
              bg="orange-50"
              p="4"
              @click="navigationToPath(COMMON_FACE_COLLECTION_PATH)"
            >
              <view flex="~ items-center">
                <!-- 警告图标 -->
                <view m="r-3" flex="shrink-0">
                  <view
                    h-8
                    w-8
                    flex="~ items-center justify-center"
                    border="rounded-full"
                    bg="orange-100"
                  >
                    <Icon name="error-warning-line" icon-color="#ea580c" icon-size="36rpx" />
                  </view>
                </view>
                <!-- 通知内容 -->
                <view min-w-0 flex="1">
                  <view text="sm orange-800" font="medium">
                    {{ currentChild?.name }}人脸采集未通过
                  </view>
                  <view m="t-1" text="xs orange-600">点击重新采集</view>
                </view>
                <!-- 箭头图标 -->
                <view m="l-2" flex="shrink-0">
                  <Icon name="arrow-right-s-line" icon-color="#ea580c" icon-size="36rpx" />
                </view>
              </view>
            </view>

            <!-- 当前孩子账户信息 -->
            <view v-if="currentChild" border="~ bg-muted solid rounded-2xl" bg="white" p="4">
              <!-- 当前孩子账户 -->
              <view flex="~ items-center justify-between" m="b-3">
                <view>
                  <view text="sm gray-900" font="medium">
                    {{ currentChild.name }}
                  </view>
                  <view text="xs gray-500">
                    {{ currentChild.school }}
                  </view>
                </view>
                <view
                  bg="primary"
                  p="x-3 y-1.5"
                  text="xs white"
                  border="rounded-xl"
                  font="medium"
                  @click="navigationToPath(`${PARENT_STUDENT_DETAIL_PATH}`)"
                >
                  详情
                </view>
              </view>

              <!-- 余额和消费信息 -->
              <view border="rounded-xl" bg="bg-secondary" p="3">
                <view flex="~ items-center justify-between">
                  <view>
                    <view m="b-1" text="xs primary" font="medium">账户余额</view>
                    <view text="xl gray-900" font="bold">
                      {{ currentChild.balance }}
                    </view>
                  </view>
                  <view text="right">
                    <view text="xs gray-500">今日消费</view>
                    <view text="sm gray-700" font="medium">
                      {{ currentChild.todayConsumption }}
                    </view>
                  </view>
                </view>
                <view m="t-2" p="t-2" border-t="1 bg-muted solid">
                  <view flex="~ justify-between" text="xs gray-500">
                    <text>本月消费: {{ currentChild.monthlyConsumption }}</text>
                    <text>上次充值: {{ currentChild.lastRecharge }}</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 功能按钮网格 -->
            <view grid="~ cols-4 gap-4">
              <view
                v-for="(item, index) in functionButtons"
                :key="index"
                flex="~ col items-center"
                @click="navigationToPath(item.path)"
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

    <!-- <template #skeleton>
      <Skeleton />
    </template> -->
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
