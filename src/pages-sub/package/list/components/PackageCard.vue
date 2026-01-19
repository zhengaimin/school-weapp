<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

interface Props {
  package: Pkg.Query.IPackage
  isPurchased?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

const currentStudentStore = useCurrentStudentStore()
const { deviceType } = storeToRefs(currentStudentStore)

const isFixed = computed(() => props.package.packageType === PACKAGE_TYPE.FIXED)
const isVideoDevice = computed(() => deviceType.value === DEVICE_TYPE.VIDEO)

const messageCountDisplay = computed(() => {
  const count = props.package.packageContent?.messageCount
  if (count === -1) return '∞'
  return count ?? '-'
})
</script>

<template>
  <WhiteCard @click="emit('click')">
    <!-- 头部：名称 + 已购买标签 + 价格 -->
    <view flex="~ row items-center justify-between" mb="2">
      <view flex="~ row items-center" gap="2">
        <text text="lg gray-800" font="semibold">
          {{ PACKAGE_TYPE_I18N[package.packageType] }}
        </text>
        <view v-if="isPurchased" px="1.5" py="0.5" rounded bg="green-500/10">
          <text text="xs green-600" font="medium">
            已购买
          </text>
        </view>
      </view>
      <view flex="~ row items-baseline">
        <text text="sm red-500" font="semibold">
          ¥
        </text>
        <text text="2xl red-500" font="bold">
          {{ package.purchasePrice }}
        </text>
      </view>
    </view>

    <!-- 指标区域 -->
    <view p="3" bg="gray-50" rounded="md" mb="3">
      <view flex="~ row justify-around">
        <!-- 话机：通话分钟 -->
        <view v-if="isVideoDevice" flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ package.packageContent?.videoCallMinutes ?? '-' }}
          </text>
          <text text="xs gray-500">
            通话分钟
          </text>
        </view>
        <!-- 话机：留言条数 -->
        <view v-if="isVideoDevice" flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ messageCountDisplay }}
          </text>
          <text text="xs gray-500">
            留言条数
          </text>
        </view>
        <!-- 吹风机：吹风时长 -->
        <view v-if="!isVideoDevice" flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ package.packageContent?.dryerMinutes ?? '-' }}
          </text>
          <text text="xs gray-500">
            吹风时长
          </text>
        </view>
        <view flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ package.totalMonths ?? '-' }}
          </text>
          <text text="xs gray-500">
            套餐月数
          </text>
        </view>
      </view>
    </view>

    <!-- 套餐说明 -->
    <view v-if="package.templateDescription" mb="2">
      <text text="sm gray-500" leading="relaxed" class="line-clamp-2">
        {{ package.templateDescription }}
      </text>
    </view>

    <!-- 使用规则 -->
    <view v-if="package.usageRules" p="x-3 y-2" bg="primary/6" rounded="md" mb="2">
      <text text="xs primary" font="semibold" block mb="0.5">
        使用规则
      </text>
      <text text="sm primary" leading="relaxed">
        {{ package.usageRules }}
      </text>
    </view>

    <!-- 底部：有效期 + 查看详情 -->
    <view flex="~ row items-center justify-between" mt="2">
      <text v-if="isFixed && package.startTime" text="xs gray-400">
        有效期：{{ package.startTime }} 至 {{ package.endTime }}
      </text>
      <view v-else />
      <view flex="~ row items-center" text="sm primary" font="medium">
        <text>查看详情</text>
        <text class="i-carbon-chevron-right" text="xs" ml="0.5" />
      </view>
    </view>
  </WhiteCard>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
