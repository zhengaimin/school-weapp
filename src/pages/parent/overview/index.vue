<route lang="jsonc" type="page">
{
  // 暂时不使用，保留以便后续恢复
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "概览"
  }
}
</route>

<script setup lang="ts">
import type { Overview } from '@/api/interface/modules/overview'
import type { User } from '@/api/interface/modules/user'
import type { TDeviceType } from '@/constant/modules/business/package/common'

import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, watch } from 'vue'
import { getOverviewStudentsApi } from '@/api/modules/overview'
import { postParentSwitchChildApi } from '@/api/modules/students'
import Page from '@/components/common/page/index.vue'
import {
  MINIAPP_MODULE_KEY_PACKAGE_PURCHASE,
  MINIAPP_MODULE_KEY_RECHARGE,
} from '@/constant/modules/miniapp'
import { PARENT_HOME_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useAppStore } from '@/store/app'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import DeviceCard from './components/DeviceCard.vue'
import StudentSelector from './components/StudentSelector.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { navBarInfo } = storeToRefs(useAppStore())
const { pageLoading, pageError, batchRequestHandler, onLoginFail } = usePage()
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const userStore = useUserStore()

/** 学生列表 */
const students = ref<Overview.IStudentVo[]>([])
/** 当前选中的学生ID */
const currentStudentId = ref<number | null>(null)
/** 是否显示学生选择弹窗 */
const isStudentPopupVisible = ref(false)
/** 切换学生加载状态 */
const switchLoading = ref(false)

/** 内容区域顶部内边距 */
const contentPaddingTop = computed(() => {
  return `calc(${navBarInfo.value.navBarHeight}px + 16rpx)`
})
/** 当前选中的学生信息 */
const currentStudent = computed(() => {
  if (!students.value.length) return null
  if (currentStudentId.value == null) return students.value[0]
  return students.value.find(s => s.id === currentStudentId.value) || students.value[0]
})
/** 是否展示余额与本月支出模块 */
const hasRechargeModule = computed(() => {
  return currentStudent.value?.modules?.includes(MINIAPP_MODULE_KEY_RECHARGE) ?? false
})
/** 是否展示套餐模块 */
const hasPackageModule = computed(() => {
  return currentStudent.value?.modules?.includes(MINIAPP_MODULE_KEY_PACKAGE_PURCHASE) ?? false
})

/** 处理学生设备数据 */
function getStudentDevices(devices: Overview.IStudentVo['devices']) {
  return devices.map((device) => {
    const hasPackage = device.remainingMinutes > 0
    const mockTotal = hasPackage
      ? Math.max(device.remainingMinutes, Math.floor(Math.random() * 50) + 60)
      : 0
    const mockExpense = device.monthlyExpense ?? Math.random() * 30 + 10
    return {
      ...device,
      monthlyExpense: mockExpense,
      monthlyRecharge: device.monthlyRecharge ?? mockExpense + Math.random() * 50 + 20,
      packageTotal: device.packageTotal ?? mockTotal,
      packagePending: device.packagePending ?? (hasPackage && Math.random() > 0.7 ? 1 : 0),
    }
  })
}

/** 获取概览学生数据 */
async function axiosGetOverviewStudentsApi() {
  try {
    const result = await getOverviewStudentsApi()

    if (result.code === 0) {
      students.value = result.data.students.map(student => ({
        ...student,
        devices: getStudentDevices(student.devices),
      }))

      if (students.value.length > 0 && currentStudentId.value == null) {
        const roleInfo = userStore.userInfo?.roleInfo as User.Common.IParentRoleInfoVo
        const currentChildId = roleInfo?.currentChild?.studentId

        const matchedStudent = currentChildId
          ? students.value.find(s => s.id === currentChildId)
          : null
        currentStudentId.value = matchedStudent?.id ?? students.value[0].id
      }
    }

    return result
  } catch (error) {
    console.error('获取概览数据失败:', error)
    return { code: -1 }
  }
}

/** 切换当前学生 */
async function axiosPostParentSwitchChildApi(childId: number) {
  try {
    return await postParentSwitchChildApi({ childUserId: childId })
  } catch (error) {
    console.error('切换学生失败:', error)
    return { code: -1, data: null }
  }
}

/** 跳转到家长首页 */
async function handleGoToHome(_deviceType: TDeviceType) {
  if (!currentStudentId.value || switchLoading.value) return

  const childId = currentStudentId.value
  const previousStudentId = parentStore.currentStudentId

  switchLoading.value = true
  try {
    const result = await axiosPostParentSwitchChildApi(childId)
    if (result.code !== 0) return

    if (previousStudentId !== childId) {
      currentStudentStore.clearStudentData()
    }

    parentStore.setCurrentStudentId(childId)

    const token = result.data?.token
    if (token) {
      userStore.setToken(token)
      await userStore.getUserInfo()
    }

    uni.navigateTo({ url: PARENT_HOME_PATH })
  } finally {
    switchLoading.value = false
  }
}

/** 处理学生选择弹窗显示状态变化 */
function handlePopupChange(visible: boolean) {
  isStudentPopupVisible.value = visible
}

/** 登录成功处理 */
async function onLoginSuccess() {
  const { allSuccess } = await batchRequestHandler([axiosGetOverviewStudentsApi()])
  if (!allSuccess) return
  await nextTick()
}

watch(switchLoading, (loading) => {
  if (loading) {
    uni.showLoading({ title: '加载中' })
  } else {
    uni.hideLoading()
  }
})
</script>

<template>
  <Page
    :scroll-y="false"
    :show-back="false"
    :navbar="false"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view class="relative h-full w-full bg-gray-50">
      <!-- 固定头部背景 -->
      <view
        class="gradient-bg"
        h="45vh"
        absolute
        left-0
        right-0
        top-0
        overflow-hidden
        style="z-index: 0"
      >
        <view class="-right-10 -top-10" absolute h-32 w-32 rounded-full bg="white opacity-10" />
        <view class="-left-8" absolute top-20 h-20 w-20 rounded-full bg="white opacity-15" />
        <view absolute bottom-16 right-12 h-24 w-24 rounded-full bg="white opacity-5" />
        <!-- 波浪形状 -->
        <view absolute bottom-0 left-0 right-0 h-25>
          <svg viewBox="0 0 375 100" preserveAspectRatio="none" class="h-full w-full">
            <path d="M0,70 Q93.75,20 187.5,40 T375,25 L375,100 L0,100 Z" fill="#f8fafc" />
          </svg>
        </view>
      </view>

      <!-- 主要内容 -->
      <scroll-view scroll-y absolute bottom-0 left-0 right-0 top-0 style="z-index: 10">
        <view :style="{ paddingTop: contentPaddingTop }" relative p="x-4 b-6" flex="~ col gap-4">
          <!-- 头部文字 -->
          <view px-1 flex="~ col">
            <text block text="white xl" font-bold leading-tight>
              概览
            </text>
            <text text="white/80 xs" mt-1 block>
              请选择学生查看统计与设备信息
            </text>
          </view>

          <!-- 学生选择器 -->
          <StudentSelector
            v-model="currentStudentId"
            :students="students"
            @popup-change="handlePopupChange"
          />

          <!-- 设备统计 -->
          <view v-if="currentStudent" :key="`device-stats-${currentStudent.id}`" flex="~ col gap-4">
            <DeviceCard
              v-for="device in currentStudent.devices"
              :key="`${currentStudent.id}-${device.deviceType}`"
              :device="device"
              :show-recharge-module="hasRechargeModule"
              :show-package-module="hasPackageModule"
              @click="handleGoToHome"
            />
          </view>

          <!-- 空状态 -->
          <view
            v-else-if="!pageLoading && !pageError"
            flex="~ col items-center justify-center"
            py-20
          >
            <text text="gray-400 sm">
              暂无学生数据
            </text>
          </view>
        </view>
      </scroll-view>
    </view>
  </Page>
</template>

<style lang="scss" scoped>
.gradient-bg {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
</style>
