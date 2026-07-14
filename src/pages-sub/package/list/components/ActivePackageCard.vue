<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_HISTORY_RESULT_PATH } from '@/constant/router'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

const props = defineProps<{
  package: Pkg.Query.IStudentActivePackageVo
}>()

const currentStudentStore = useCurrentStudentStore()
const { devices } = storeToRefs(currentStudentStore)
const { defaultDeviceType } = useDeviceType()

const primaryDeviceType = computed(() => devices.value?.[0]?.deviceType || defaultDeviceType.value)
const isVideoDevice = computed(() => primaryDeviceType.value === DEVICE_TYPE.VIDEO)

function handleClick() {
  const { id, paymentOrderNo } = props.package

  uni.navigateTo({
    url: `${PACKAGE_HISTORY_RESULT_PATH}?orderNo=${paymentOrderNo}&packageRecordId=${id}`,
  })
}
</script>

<template>
  <WhiteCard v-if="package" @click="handleClick">
    <!-- 头部：名称 -->
    <view text="lg gray-800" font="semibold" mb="3">
      {{ PACKAGE_TYPE_I18N[package?.snapshotInfo.packageType] }}
    </view>

    <!-- 指标区域 -->
    <view p="3" bg="gray-50" rounded="md">
      <view flex="~ row justify-around">
        <!-- 话机：视频通话分钟数 -->
        <view v-if="isVideoDevice" flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ package.snapshotInfo.videoCallMinutes ?? '-' }}
          </text>
          <text text="xs gray-500">
            通话分钟
          </text>
        </view>
        <!-- 话机：留言条数 -->
        <view v-if="isVideoDevice" flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{
              package.snapshotInfo.messageCount === -1
                ? '∞'
                : (package.snapshotInfo.messageCount ?? '-')
            }}
          </text>
          <text text="xs gray-500">
            留言条数
          </text>
        </view>
        <!-- 吹风机：吹风时长 -->
        <view v-if="!isVideoDevice" flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ package.snapshotInfo.dryerMinutes ?? '-' }}
          </text>
          <text text="xs gray-500">
            吹风时长
          </text>
        </view>
        <view flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ dayjs(package.endDate).format('YYYY-MM-DD') }}
          </text>
          <text text="xs gray-500">
            到期时间
          </text>
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
