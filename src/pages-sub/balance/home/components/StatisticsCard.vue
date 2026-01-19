<script lang="ts" setup>
import WhiteCard from '@/components/common/white-card/index.vue'

defineProps<{
  monthCount?: number
  monthAmount?: string
  totalRecharge?: string
}>()
</script>

<template>
  <WhiteCard>
    <!-- 卡片头部 -->
    <view flex="~ row items-center justify-between" m="b-3">
      <view flex="~ row items-center" gap="2">
        <view w="1" h="3" bg="blue-500" rounded-full />
        <text text="base gray-900" font="bold">
          账户统计
        </text>
      </view>
      <text text="xs gray-400">
        本月数据
      </text>
    </view>

    <!-- 统计数据网格 -->
    <view p="3" bg="gray-50" rounded="md">
      <view flex="~ row justify-around">
        <view flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ monthCount ?? '--' }}
          </text>
          <text text="xs gray-500">
            消费次数
          </text>
        </view>
        <view flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ monthAmount ?? '--' }}
          </text>
          <text text="xs gray-500">
            消费金额
          </text>
        </view>
        <view flex="~ col items-center">
          <text text="base gray-800" font="semibold" mb="0.5">
            {{ totalRecharge ?? '--' }}
          </text>
          <text text="xs gray-500">
            累计充值
          </text>
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
