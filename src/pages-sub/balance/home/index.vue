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
import type { TDeviceType } from '@/constant/modules'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getStudentActivePackageApi } from '@/api/modules'
import { getStudentValidGiftsApi } from '@/api/modules/gifts'
import { getConsumptionStatisticsApi } from '@/api/modules/user/consumption'
import Page from '@/components/common/page/index.vue'
import { DEVICE_TYPE } from '@/constant/modules'
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

const consumptionStatistics = ref()
const validGifts = ref<Gifts.Valid.ResGetStudentValidGiftsApi>()
/** 每个设备对应的生效套餐 */
const deviceActivePackages = ref<Map<TDeviceType, Pkg.Query.IStudentActivePackageVo | null>>(new Map())

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
  return deviceActivePackages.value.get(deviceType) ?? null
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
  } catch (error) {
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
  } catch (error) {
    return { code: -1 }
  }
}

/** 获取指定设备类型的生效套餐 */
async function fetchActivePackage(deviceType: TDeviceType) {
  try {
    const result = await getStudentActivePackageApi({ deviceType })
    if (result.code === 0) {
      deviceActivePackages.value.set(deviceType, result.data.activePackages?.[0] ?? null)
    }
    return result
  } catch (error) {
    return { code: -1 }
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  const deviceList = devices.value || []
  const requests: Promise<any>[] = [
    axiosGetConsumptionStatisticsApi(),
    axiosGetValidGiftsApi(),
  ]

  for (const device of deviceList) {
    requests.push(axiosGetUserBalanceApi(device.deviceType))
    requests.push(fetchActivePackage(device.deviceType))
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
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view scroll-y :style="contentStyle" bg-gray-50>
      <!-- 蓝色背景区域 -->
      <view class="balance-hero" relative overflow="hidden" bg="#3269dd" pt-safe>
        <view relative z="10" p="t-5 b-12 x-6" text="white">
          <view flex="~ col items-center" p="b-4">
            <!-- 学生信息胶囊 -->
            <view
              flex="~ row items-center"
              gap="1.5"
              p="x-4 y-2"
              bg="white/15"
              rounded-full
              backdrop-blur-sm
            >
              <text text="sm white" font="medium">
                {{ currentStudent?.studentName || '--' }}
              </text>
              <view v-if="studentFullInfo" w="1px" h="3" bg="white/40" />
              <text v-if="studentFullInfo" text="xs white/75">
                {{ studentFullInfo }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 内容区域 -->
      <view p="x-4 b-6 b-safe" relative z-10 flex="~ col gap-3" class="balance-content">
        <!-- 设备余额卡片列表 -->
        <DeviceBalanceCard
          v-for="device in devices"
          :key="device.deviceType"
          :device="device"
          :balance-info="getBalanceInfoByDevice(device.deviceType)"
          :active-package="getActivePackageByDevice(device.deviceType)"
          :gift-records="getGiftRecordsByDevice(device.deviceType)"
        />

        <!-- 账户统计卡片 -->
        <StatisticsCard
          :month-count="consumptionStatistics?.monthCount"
          :month-amount="consumptionStatistics?.monthAmount"
          :total-recharge="totalRecharge"
        />
      </view>
    </scroll-view>
  </Page>
</template>

<style lang="scss" scoped>
.balance-hero {
  border-bottom-left-radius: 56rpx;
  border-bottom-right-radius: 56rpx;
}

.balance-content {
  margin-top: -48rpx;
}
</style>
