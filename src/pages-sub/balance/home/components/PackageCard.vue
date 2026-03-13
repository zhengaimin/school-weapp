<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { User } from '@/api/interface/modules/user'
import type { TDeviceType } from '@/constant/modules'

import dayjs from 'dayjs'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_DETAIL_PATH } from '@/constant/router'

const props = defineProps<{
  package: Pkg.Query.IStudentActivePackageVo
  deviceType?: TDeviceType
  balanceInfo?: User.Parent.IBalanceInfo | null
}>()

const resolvedDeviceType = computed(() => props.deviceType || DEVICE_TYPE.VIDEO)
const isVideoDevice = computed(() => resolvedDeviceType.value === DEVICE_TYPE.VIDEO)

/** 跳转套餐详情 */
function handleClick() {
  uni.navigateTo({ url: `${PACKAGE_DETAIL_PATH}?id=${props.package.packageId}` })
}
</script>

<template>
  <WhiteCard v-if="package" @click="handleClick">
    <!-- 卡片头部 -->
    <view flex="~ row items-center justify-between" m="b-3">
      <view flex="~ row items-center" gap="2">
        <view w="1" h="3" bg="blue-500" rounded-full />
        <text text="base gray-900" font="bold">
          {{ PACKAGE_TYPE_I18N[package?.snapshotInfo.packageType] }}
        </text>
      </view>
      <view px="2" py="0.5" rounded="sm" bg="blue-50">
        <text text="xs blue-600" font="medium">
          使用中
        </text>
      </view>
    </view>

    <!-- 指标区域 -->
    <view p="3" bg="gray-50" rounded="md">
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
            {{
              balanceInfo?.packageMessageCount === -1 ? '无限' : balanceInfo?.packageMessageCount
            }}
          </text>
          <text text="xs gray-500">
            剩余留言
          </text>
        </view>
        <view flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ dayjs(package.endDate).format('MM-DD') }}
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
            {{ dayjs(package.endDate).format('MM-DD') }}
          </text>
          <text text="xs gray-500">
            到期日
          </text>
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
