<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "余额信息"
  }
}
</route>

<script lang="ts" setup>
import type { Gifts } from '@/api/interface/modules/gifts'
import type { Pkg } from '@/api/interface/modules/package'
import type { User } from '@/api/interface/modules/user'
import type { TDeviceType } from '@/constant/modules'
import type { TBatchRequestList } from '@/hooks/usePage'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getStudentValidGiftsApi } from '@/api/modules/gifts'
import { getStudentPackagesApi } from '@/api/modules/package'
import { getConsumptionStatisticsApi } from '@/api/modules/user/consumption'
import Page from '@/components/common/page/index.vue'
import { DEVICE_TYPE, PACKAGE_BUY_STATUS } from '@/constant/modules'
import { useBalance } from '@/hooks/useBalance'
import { usePage } from '@/hooks/usePage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import DeviceBalanceCard from './components/DeviceBalanceCard.vue'
import StatisticsCard from './components/StatisticsCard.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginFail, batchRequestHandler, getContentHeight } = usePage()
const { axiosGetUserBalanceApi, dryerBalanceInfo, videoBalanceInfo } = useBalance()
const currentStudentStore = useCurrentStudentStore()
const {
  studentInfo: currentStudent,
  studentFullInfo,
  devices,
} = storeToRefs(currentStudentStore)

/** 消费统计 */
const consumptionStatistics = ref<User.Consumption.IConsumptionStatisticsVo>()
/** 有效赠费记录 */
const validGifts = ref<Gifts.Valid.ResGetStudentValidGiftsApi>()
/** 当前学生的有效套餐 */
const activePackages = ref<Pkg.Query.IStudentPackageVo[]>([])
/** 平台套餐月清设备汇总余额 */
const monthlyBalances = ref<Pkg.Platform.IMonthlyBalance[]>([])

/** 内容区域样式 */
const contentStyle = computed(() => getContentHeight('0'))
/** 累计充值（取第一个设备的余额信息） */
const totalRecharge = computed(() => {
  const firstDevice = devices.value?.[0]
  if (!firstDevice) return undefined
  const info = getBalanceInfoByDevice(firstDevice.deviceType)
  return info?.totalRecharge
})

/** 获取设备对应的余额信息 */
function getBalanceInfoByDevice(deviceType: TDeviceType) {
  if (deviceType === DEVICE_TYPE.DRYER) return dryerBalanceInfo.value
  return videoBalanceInfo.value
}
/** 获取设备对应的生效套餐 */
function getActivePackageByDevice(deviceType: TDeviceType) {
  return activePackages.value.find((packageItem) => {
    const deviceModules = packageItem.modules?.filter(module => module.deviceType) ?? []
    return deviceModules.length === 0 || deviceModules.some(module => module.deviceType === deviceType)
  }) ?? null
}
/** 获取设备对应的平台套餐月清余额 */
function getMonthlyBalanceByDevice(deviceType: TDeviceType) {
  return monthlyBalances.value.find(item => item.deviceType === deviceType) ?? null
}
/** 获取设备对应的赠费记录 */
function getGiftRecordsByDevice(deviceType: TDeviceType) {
  return validGifts.value?.records?.filter(item => item.deviceType === deviceType) ?? []
}

/** 获取消费统计 */
async function axiosGetConsumptionStatisticsApi() {
  try {
    const result = await getConsumptionStatisticsApi()
    if (result.code === 0) {
      consumptionStatistics.value = result.data
    }
    return result
  } catch {
    return { code: -1 }
  }
}
/** 获取有效赠费记录 */
async function axiosGetValidGiftsApi() {
  try {
    const result = await getStudentValidGiftsApi()
    if (result.code === 0) {
      validGifts.value = result.data
    }
    return result
  } catch {
    return { code: -1 }
  }
}
/** 获取学生有效套餐及月清余额 */
async function axiosGetActivePackagesApi() {
  try {
    const result = await getStudentPackagesApi({
      page: 1,
      pageSize: 100,
      status: PACKAGE_BUY_STATUS.ACTIVE,
    })
    if (result.code === 0) {
      activePackages.value = result.data?.packages ?? []
      monthlyBalances.value = result.data?.monthlyBalances ?? []
    }
    return result
  } catch {
    return { code: -1 }
  }
}

/** 登录成功处理 */
async function handleLoginSuccess() {
  const deviceList = devices.value || []
  const requests: TBatchRequestList = [
    axiosGetConsumptionStatisticsApi(),
    axiosGetValidGiftsApi(),
    axiosGetActivePackagesApi(),
  ]

  for (const device of deviceList) {
    requests.push(axiosGetUserBalanceApi(device.deviceType))
  }

  await batchRequestHandler(requests)
}
</script>

<template>
  <Page
    title="余额信息"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    :navbar="true"
    nav-bg-color="#3269dd"
    nav-text-color="#ffffff"
    nav-icon-color="#ffffff"
    @login:success="handleLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view scroll-y :style="contentStyle" bg-gray-50>
      <!-- 蓝色背景区域 -->
      <view class="balance-hero" relative overflow="hidden" bg="#3269dd">
        <view class="balance-hero__inner" relative z="10" text="white">
          <StatisticsCard
            :month-count="consumptionStatistics?.monthCount"
            :month-amount="consumptionStatistics?.monthAmount"
            :total-recharge="totalRecharge"
            :student-name="currentStudent?.studentName ?? undefined"
            :student-full-info="studentFullInfo"
          />
        </view>
      </view>

      <!-- 内容区域 -->
      <view p="x-4 b-6 b-safe" relative z-10 flex="~ col gap-4" class="balance-content">
        <!-- 设备余额卡片列表 -->
        <DeviceBalanceCard
          v-for="device in devices"
          :key="device.deviceType"
          :device="device"
          :balance-info="getBalanceInfoByDevice(device.deviceType)"
          :active-package="getActivePackageByDevice(device.deviceType)"
          :monthly-balance="getMonthlyBalanceByDevice(device.deviceType)"
          :gift-records="getGiftRecordsByDevice(device.deviceType)"
        />
      </view>
    </scroll-view>
  </Page>
</template>

<style lang="scss" scoped>
.balance-hero {
  min-height: 384rpx;
  box-sizing: border-box;
  padding: 76rpx 32rpx 0;
  border-bottom-left-radius: 56rpx;
  border-bottom-right-radius: 56rpx;
}

.balance-hero__inner {
  width: 100%;
}

.balance-content {
  margin-top: -64rpx;
}
</style>
