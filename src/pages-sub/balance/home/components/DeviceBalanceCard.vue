<!-- 设备余额、套餐及赠送时长信息卡片 -->
<script lang="ts" setup>
import type { Gifts } from '@/api/interface/modules/gifts'
import type { Overview } from '@/api/interface/modules/overview'
import type { Pkg } from '@/api/interface/modules/package'
import type { User } from '@/api/interface/modules/user'

import dayjs from 'dayjs'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE, DEVICE_TYPE_I18N, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_DETAIL_PATH } from '@/constant/router'

const props = defineProps<{
  device: Overview.IDeviceVo
  balanceInfo?: User.Parent.IBalanceInfo | null
  activePackage?: Pkg.Query.IStudentActivePackageVo | null
  giftRecords?: Gifts.ValidGiftRecord[]
}>()

const deviceName = computed(() => DEVICE_TYPE_I18N[props.device.deviceType] || props.device.deviceName)
const isVideoDevice = computed(() => props.device.deviceType === DEVICE_TYPE.VIDEO)
/** 是否展示剩余分钟 */
const hasRemainingMinutes = computed(() => isVideoDevice.value && props.device.remainingMinutes > 0)
/** 赠费记录数量 */
const giftCount = computed(() => props.giftRecords?.length ?? 0)
/** 是否展示赠费 */
const hasGiftRecords = computed(() => giftCount.value > 0)
/** 套餐类型标签 */
const packageTypeLabel = computed(() => {
  const packageType = props.activePackage?.snapshotInfo?.packageType || props.activePackage?.packageContent.packageType
  return packageType ? PACKAGE_TYPE_I18N[packageType] : ''
})

const availableBalance = computed(() => {
  if (props.balanceInfo?.availableBalanceFormatted) return props.balanceInfo.availableBalanceFormatted
  if (props.balanceInfo?.availableBalance) return props.balanceInfo.availableBalance
  return props.device.balance || '--'
})
/** 赠费余额 */
const giftBalance = computed(() => {
  const amount = Number(props.balanceInfo?.giftBalance ?? props.device.giftBalance ?? 0)
  return Number.isNaN(amount) ? '0.00' : amount.toFixed(2)
})

const lastUpdateTime = computed(() => {
  if (props.balanceInfo?.lastUpdateTime) return props.balanceInfo.lastUpdateTime
  if (props.balanceInfo?.updatedAt) return dayjs(props.balanceInfo.updatedAt).format('YYYY-MM-DD HH:mm')
  return ''
})

function getGiftExpireText(item: Gifts.ValidGiftRecord) {
  if (item.remainingDays <= 0) return '今日过期'
  return `${item.remainingDays}天后过期`
}

function handlePackageClick() {
  if (props.activePackage) {
    uni.navigateTo({ url: `${PACKAGE_DETAIL_PATH}?id=${props.activePackage.packageId}` })
  }
}
</script>

<template>
  <WhiteCard :show-border="false">
    <!-- 卡片头部：设备名称 + 最后更新时间 -->
    <view flex="~ row items-center justify-between" m="b-4">
      <view flex="~ row items-center" gap="2">
        <view w="1" h="4" bg="blue-500" rounded="sm" />
        <text text="base gray-900" font="bold">
          {{ deviceName }}
        </text>
      </view>
      <view v-if="lastUpdateTime" flex="~ row items-center" gap="1">
        <Icon name="time-line" icon-color="#9ca3af" icon-size="22rpx" />
        <text text="xs gray-400">
          {{ lastUpdateTime }}
        </text>
      </view>
    </view>

    <!-- 余额展示 -->
    <view flex="~ col gap-2" m="b-4" p="4" bg="#f0f9ff" rounded="lg">
      <view flex="~ row items-center justify-between">
        <text text="sm gray-500">
          可用余额
        </text>
        <view v-if="hasRemainingMinutes" flex="~ row items-center" gap="1">
          <text text="xs gray-500">
            剩余
          </text>
          <text text="sm blue-600" font="medium">
            {{ device.remainingMinutes }}
          </text>
          <text text="xs gray-500">
            分钟
          </text>
        </view>
      </view>
      <view class="device-card__amount">
        <text class="device-card__currency">
          ¥
        </text>
        <text class="device-card__amount-value">
          {{ availableBalance }}
        </text>
      </view>
      <view flex="~ row items-center justify-between" m="t-1">
        <text text="xs gray-500">
          赠费
        </text>
        <text text="sm blue-600" font="medium">
          ¥{{ giftBalance }}
        </text>
      </view>
    </view>

    <!-- 套餐信息 -->
    <view v-if="activePackage" :class="[hasGiftRecords ? 'mb-4' : '']" @click="handlePackageClick">
      <view flex="~ row items-center justify-between" m="b-3">
        <text text="sm gray-700" font="medium">
          {{ packageTypeLabel }}
        </text>
        <view px="2" py="0.5" rounded="sm" bg="blue-50">
          <text text="xs blue-600" font="bold">
            使用中
          </text>
        </view>
      </view>
      <view p="4" bg="gray-50" rounded="lg">
        <!-- 话机：三列指标 -->
        <view v-if="isVideoDevice" flex="~ row justify-around">
          <view flex="~ col items-center">
            <text text="base gray-800" font="semibold" mb="0.5">
              {{ balanceInfo?.packageMinutes ?? '-' }}
            </text>
            <text text="xs gray-500">
              套餐时长
            </text>
          </view>
          <view flex="~ col items-center">
            <text text="base gray-800" font="semibold" mb="0.5">
              {{ balanceInfo?.packageMessageCount === -1 ? '无限' : balanceInfo?.packageMessageCount }}
            </text>
            <text text="xs gray-500">
              剩余留言
            </text>
          </view>
          <view flex="~ col items-center">
            <text text="base gray-800" font="semibold" mb="0.5">
              {{ dayjs(activePackage.endDate).format('MM-DD') }}
            </text>
            <text text="xs gray-500">
              到期日
            </text>
          </view>
        </view>
        <!-- 吹风机：两列指标 -->
        <view v-else flex="~ row justify-around">
          <view flex="~ col items-center">
            <text text="base gray-800" font="semibold" mb="0.5">
              {{ balanceInfo?.packageMinutes ?? '-' }}
            </text>
            <text text="xs gray-500">
              套餐时长
            </text>
          </view>
          <view flex="~ col items-center">
            <text text="base gray-800" font="semibold" mb="0.5">
              {{ dayjs(activePackage.endDate).format('MM-DD') }}
            </text>
            <text text="xs gray-500">
              到期日
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 无套餐提示 -->
    <view
      v-else
      p="4"
      bg="gray-50"
      rounded="lg"
      flex="~ row items-center justify-center"
      :class="[hasGiftRecords ? 'mb-4' : '']"
    >
      <text text="sm gray-400">
        暂无生效套餐
      </text>
    </view>

    <view v-if="hasGiftRecords" h="1px" bg="#f3f4f6" m="b-4" />

    <!-- 赠送时长信息 -->
    <view v-if="hasGiftRecords" flex="~ col gap-3">
      <view flex="~ row items-center justify-between">
        <text text="sm gray-700" font="bold">
          赠送时长
        </text>
        <text text="xs gray-400">
          共 {{ giftCount }} 条
        </text>
      </view>
      <view bg="#f9fafb" rounded="lg" p="y-2 x-3" flex="~ col" gap="3">
        <view
          v-for="(item, index) in giftRecords"
          :key="item.id"
          flex="~ row items-center justify-between"
          :class="[index < giftCount - 1 ? 'border-b border-b-gray-200 border-b-solid pb-3' : '']"
        >
          <text text="sm gray-600">
            {{ item.description || item.sourceText }}
          </text>
          <view flex="~ row items-center" gap="2">
            <text text="xs blue-600" font="bold">
              剩 {{ item.remainingMinutes }} 分钟
            </text>
            <view w="1px" h="2.5" bg="gray-300" />
            <text text="xs" :class="item.remainingDays <= 3 ? 'text-orange-600' : 'text-gray-400'">
              {{ getGiftExpireText(item) }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </WhiteCard>
</template>

<style lang="scss" scoped>
.device-card__amount {
  display: flex;
  align-items: flex-end;
  gap: 8rpx;
}

.device-card__currency {
  color: #2563eb;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 1;
}

.device-card__amount-value {
  color: #2563eb;
  font-size: 72rpx;
  font-weight: 700;
  line-height: 90%;
}
</style>
