<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_DETAIL_PATH } from '@/constant/router'

const props = defineProps<{
  package: Pkg.Query.IStudentActivePackageVo
}>()

const isVideoDevice = computed(() => props.package?.snapshotInfo.deviceType === DEVICE_TYPE.VIDEO)

function handleClick() {
  const { packageId } = props.package

  uni.navigateTo({ url: `${PACKAGE_DETAIL_PATH}?id=${packageId}` })
}
</script>

<template>
  <WhiteCard v-if="package" @click="handleClick">
    <!-- 头部：名称 + 状态标签 -->
    <view flex="~ row items-center" gap="2" mb="3">
      <text text="lg gray-800" font="semibold">
        {{ PACKAGE_TYPE_I18N[package?.snapshotInfo.packageType] }}
      </text>
      <view px="1.5" py="0.5" rounded bg="primary/10">
        <text text="xs primary" font="medium">
          使用中
        </text>
      </view>
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
