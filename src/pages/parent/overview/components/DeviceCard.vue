<script setup lang="ts">
import type { Overview } from '@/api/interface/modules/overview'
import type { TDeviceType } from '@/constant/modules/business/package/common'
import PieChart from '@/components/common/pie-chart/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE } from '@/constant/modules/business/package/common'
import ChartsCard from './ChartsCard.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = withDefaults(defineProps<{
  device: Overview.IDeviceVo
  showRechargeModule?: boolean
  showPackageModule?: boolean
}>(), {
  showRechargeModule: true,
  showPackageModule: true,
})

const emit = defineEmits<{
  (e: 'click', deviceType: TDeviceType): void
}>()

interface DeviceConfig {
  icon: string
  bgClass: string
  iconColor: string
  textClass: string
  chartColor: string
}

const DEVICE_CONFIG: Record<TDeviceType | 'DEFAULT', DeviceConfig> = {
  [DEVICE_TYPE.DRYER]: {
    icon: 'windy-line',
    bgClass: 'bg-indigo-50',
    iconColor: '#4F46E5',
    textClass: 'text-indigo-600',
    chartColor: '#4F46E5',
  },
  [DEVICE_TYPE.VIDEO]: {
    icon: 'customer-service-line',
    bgClass: 'bg-orange-50',
    iconColor: '#F97316',
    textClass: 'text-orange-600',
    chartColor: '#F97316',
  },
  DEFAULT: {
    icon: 'question-line',
    bgClass: 'bg-gray-50',
    iconColor: '#9ca3af',
    textClass: 'text-gray-700',
    chartColor: '#9ca3af',
  },
}

/** 获取设备样式配置 */
function getDeviceConfig(type: TDeviceType): DeviceConfig {
  return DEVICE_CONFIG[type] || DEVICE_CONFIG.DEFAULT
}

/** 格式化数值，最多保留两位小数 */
function formatValue(val: number): string {
  return Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/\.?0+$/, '')
}

/** 获取余额图表数据 */
function getBalanceChartData(device: Overview.IDeviceVo) {
  const balance = Number(device.balance)
  const isNegative = !Number.isFinite(balance) ? false : balance < 0
  const recharge = device.monthlyRecharge || 0

  if (isNegative) {
    return [{ name: '欠费', value: Math.abs(balance), color: '#E11D48' }]
  }

  const config = getDeviceConfig(device.deviceType)
  const validBalance = Number.isFinite(balance) ? Math.max(0, balance) : 0
  const emptyVal = Math.max(0, recharge - validBalance)

  if (validBalance === 0 && emptyVal === 0) {
    return [{ name: '空', value: 1, color: '#E2E8F0' }]
  }

  return [
    { name: '余额', value: Number(formatValue(validBalance)), color: config.chartColor },
    { name: '剩余', value: Number(formatValue(emptyVal)), color: '#E2E8F0' },
  ]
}

/** 获取套餐图表数据 */
function getPackageChartData(device: Overview.IDeviceVo) {
  const total = device.packageTotal ?? 100
  const remaining = Math.max(0, device.remainingMinutes)
  const clampedRemaining = Math.min(remaining, total)
  const used = Math.max(0, total - clampedRemaining)

  if (total === 0 || (used === 0 && clampedRemaining === 0)) {
    return [{ name: '空', value: 1, color: '#E2E8F0' }]
  }

  return [
    { name: '已用', value: Number(formatValue(used)), color: '#F97316' },
    { name: '剩余', value: Number(formatValue(clampedRemaining)), color: '#0EA5E9' },
  ]
}

/** 获取本月支出图表数据 */
function getExpenseChartData(device: Overview.IDeviceVo) {
  const expense = Math.max(0, device.monthlyExpense ?? 0)
  const recharge = Math.max(0, device.monthlyRecharge || 0)
  const emptyVal = Math.max(0, recharge - expense)

  if (expense === 0 && emptyVal === 0) {
    return [{ name: '空', value: 1, color: '#E2E8F0' }]
  }

  return [
    { name: '已用', value: Number(formatValue(expense)), color: '#F97316' },
    { name: '剩余', value: Number(formatValue(emptyVal)), color: '#E2E8F0' },
  ]
}

/** 格式化金额显示 */
function formatMoney(val: number): string {
  return `¥${Number.isFinite(val) ? val.toFixed(2) : '0.00'}`
}
</script>

<template>
  <WhiteCard>
    <view flex="~ items-center" mb-3 gap-2 @click="emit('click', props.device.deviceType)">
      <view
        h-8
        w-8
        rounded-full
        :class="getDeviceConfig(device.deviceType).bgClass"
        flex="~ items-center justify-center"
      >
        <Icon
          :name="getDeviceConfig(device.deviceType).icon"
          :icon-color="getDeviceConfig(device.deviceType).iconColor"
          icon-size="32rpx"
        />
      </view>
      <view flex-1 text-left>
        <view text="sm gray-800" font-bold>
          {{ device.deviceName }}
        </view>
        <view text="2xs gray-400">
          使用统计
        </view>
      </view>
      <Icon name="arrow-right-s-line" icon-color="#9ca3af" icon-size="40rpx" />
    </view>

    <view grid="~ cols-2" gap-3>
      <!-- 余额图表 -->
      <ChartsCard
        v-if="props.showRechargeModule"
        icon="wallet-line"
        :icon-bg-class="
          Number(device.balance) < 0 ? 'bg-rose-50' : getDeviceConfig(device.deviceType).bgClass
        "
        :icon-color="
          Number(device.balance) < 0 ? '#E11D48' : getDeviceConfig(device.deviceType).iconColor
        "
        :title="Number(device.balance) < 0 ? '欠费' : '余额'"
      >
        <PieChart
          :width="220"
          :height="220"
          :ring-width="38"
          :data="getBalanceChartData(device)"
          :center-text="formatMoney(Number(device.balance))"
          :center-label="Number(device.balance) < 0 ? '欠费' : '余额'"
        />
      </ChartsCard>

      <!-- 套餐图表 -->
      <ChartsCard
        v-if="props.showPackageModule"
        icon="timer-2-line"
        icon-bg-class="bg-sky-50"
        icon-color="#0EA5E9"
        title="套餐"
      >
        <template v-if="(device.packagePending ?? 0) > 0" #header-right>
          <view bg="indigo-100" text="indigo-700 [20rpx]" rounded-md px-1.5 py-0.5 font-medium>
            待生效 {{ device.packagePending }}
          </view>
        </template>
        <PieChart
          :width="220"
          :height="220"
          :ring-width="38"
          :data="getPackageChartData(device)"
          :center-text="`${device.remainingMinutes}分钟`"
          center-label="剩余"
        />
      </ChartsCard>

      <!-- 本月支出图表 -->
      <ChartsCard
        v-if="props.showRechargeModule"
        icon="money-cny-circle-line"
        icon-bg-class="bg-orange-50"
        icon-color="#F97316"
        title="本月支出"
        :col-span2="props.showPackageModule"
      >
        <PieChart
          :width="220"
          :height="220"
          :ring-width="38"
          :data="getExpenseChartData(device)"
          :center-text="formatMoney(device.monthlyExpense ?? 0)"
          center-label="本月支出"
        />
      </ChartsCard>
    </view>
  </WhiteCard>
</template>
