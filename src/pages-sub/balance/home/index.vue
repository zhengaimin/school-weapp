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
import type { TDeviceType } from '@/constant/modules'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getValidGiftsApi } from '@/api/modules/gifts'
import { getConsumptionStatisticsApi } from '@/api/modules/user/consumption'
import Page from '@/components/common/page/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE } from '@/constant/modules'
import { useBalance } from '@/hooks/useBalance'
import { useDeviceType } from '@/hooks/useDeviceType'
import { usePage } from '@/hooks/usePage'
import { usePackage } from '@/pages-sub/package/hooks/usePackage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import GiftCard from './components/GiftCard.vue'
import PackageCard from './components/PackageCard.vue'
import StatisticsCard from './components/StatisticsCard.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginFail, batchRequestHandler, getContentHeight } = usePage()
const { activePackage, axiosGetStudentActivePackageApi } = usePackage()
const { getBalanceByDeviceType, dryerBalanceInfo, videoBalanceInfo } = useBalance()
const { defaultDeviceType } = useDeviceType()
const currentStudentStore = useCurrentStudentStore()
const {
  studentInfo: currentStudent,
  studentFullInfo,
  devices,
} = storeToRefs(currentStudentStore)

const consumptionStatistics = ref()
const validGifts = ref<Gifts.Valid.ResGetValidGiftsApi>()

/** 内容区域样式 */
const contentStyle = computed(() => {
  return getContentHeight('0')
})

/** 优先使用的设备类型 */
const primaryDeviceType = computed<TDeviceType>(() => {
  return devices.value?.[0]?.deviceType || defaultDeviceType.value || DEVICE_TYPE.VIDEO
})
/** 当前展示的余额信息 */
const currentBalanceInfo = computed(() => {
  if (primaryDeviceType.value === DEVICE_TYPE.DRYER) {
    return dryerBalanceInfo.value
  }
  return videoBalanceInfo.value
})

const lastUpdateTimeFormatted = computed(() => {
  if (currentBalanceInfo.value?.lastUpdateTime) {
    return currentBalanceInfo.value.lastUpdateTime
  }
  if (currentBalanceInfo.value?.updatedAt) {
    return dayjs(currentBalanceInfo.value.updatedAt).format('YYYY-MM-DD HH:mm')
  }
  return '--'
})

/** 是否有生效套餐 */
const hasActivePackage = computed(() => !!activePackage.value)

/** 是否有有效赠费 */
const hasValidGifts = computed(() => !!validGifts.value?.records?.length)

/** 波浪背景图 */
const waveSvgUrl = computed(() => {
  const color = '#f9fafb'
  const svgContent = `<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path fill="${color}" fill-opacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
})

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
    const result = await getValidGiftsApi()
    if (result.code === 0) {
      validGifts.value = result.data
    }
    return result
  } catch (error) {
    return { code: -1 }
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  await batchRequestHandler([
    axiosGetConsumptionStatisticsApi(),
    axiosGetStudentActivePackageApi(),
    axiosGetValidGiftsApi(),
    getBalanceByDeviceType(primaryDeviceType.value),
  ])
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
      <view relative overflow="hidden" bg="#3269dd" pt-safe>
        <view relative z="10" p="t-4 b-8 x-6" text="white">
          <view flex="~ col items-center" p="b-10">
            <!-- 学生信息胶囊 -->
            <view
              flex="~ row items-center"
              gap="1"
              p="x-3 y-1"
              bg="white/10"
              rounded-full
              m="b-6"
              backdrop-blur-sm
            >
              <text text="sm white" font="medium" opacity-95>
                {{ studentFullInfo || currentStudent?.studentName || '--' }}
              </text>
            </view>

            <!-- 余额展示 -->
            <view text="sm white/80" m="b-1">
              当前可用余额
            </view>
            <view text="4xl white" font="bold" flex="~ items-baseline" tracking-tight>
              <text text="xl" m="r-1" opacity-90>
                ¥
              </text>
              {{
                currentBalanceInfo?.availableBalanceFormatted
                  || (currentBalanceInfo?.availableBalance ?? '--')
              }}
            </view>

            <!-- 更新时间 -->
            <view m="t-3" flex="~ row items-center" gap="1" opacity-70>
              <Icon name="time-line" icon-color="#ffffff" icon-size="24rpx" />
              <text text="xs">
                更新于 {{ lastUpdateTimeFormatted }}
              </text>
            </view>
          </view>
        </view>

        <!-- 底部波浪 -->
        <view
          absolute
          bottom="[-2rpx]"
          left-0
          w-full
          z="5"
          style="height: 80rpx; pointer-events: none"
        >
          <image
            :src="waveSvgUrl"
            mode="scaleToFill"
            style="width: 100%; height: 100%; display: block"
          />
        </view>
      </view>

      <!-- 内容区域 (上浮重叠) -->
      <view p="x-4 b-6 b-safe" relative z-10 flex="~ col gap-3" m="t-[-64rpx]">
        <!-- 账户统计卡片 -->
        <StatisticsCard
          :month-count="consumptionStatistics?.monthCount"
          :month-amount="consumptionStatistics?.monthAmount"
          :total-recharge="currentBalanceInfo?.totalRecharge"
        />

        <!-- 已购买套餐 -->
        <PackageCard
          v-if="hasActivePackage"
          :package="activePackage!"
          :device-type="primaryDeviceType"
          :balance-info="currentBalanceInfo"
        />

        <!-- 赠费信息 -->
        <GiftCard v-if="hasValidGifts" :valid-gifts="validGifts" />
      </view>
    </scroll-view>
  </Page>
</template>
