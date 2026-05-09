<script lang="ts" setup>
import type { Gifts } from '@/api/interface/modules/gifts'
import WhiteCard from '@/components/common/white-card/index.vue'

const props = defineProps<{
  validGifts?: Gifts.Valid.ResGetStudentValidGiftsApi
}>()

const emit = defineEmits<{
  click: [event: Event]
}>()

/** 记录数量 */
const recordCount = computed(() => props.validGifts?.records?.length ?? 0)

/** 是否有记录 */
const hasRecords = computed(() => recordCount.value > 0)
</script>

<template>
  <WhiteCard v-if="hasRecords" @click.stop="e => emit('click', e)">
    <!-- 卡片头部 -->
    <view flex="~ row items-center justify-between" m="b-3">
      <view flex="~ row items-center" gap="2">
        <view w="1" h="3" bg="blue-500" rounded-full />
        <text text="base gray-900" font="bold">
          赠时长
        </text>
      </view>
      <text text="xs gray-400">
        共{{ recordCount }}条
      </text>
    </view>

    <!-- 赠费记录列表 -->
    <view bg="gray-50" rounded="md" px="3" py="1">
      <view
        v-for="(item, index) in validGifts?.records"
        :key="item.id"
        flex="~ row items-center justify-between"
        py="2.5"
        :class="[index < recordCount - 1 ? 'border-b border-b-gray-200 border-b-dashed' : '']"
      >
        <!-- 左侧：来源 -->
        <text text="sm gray-800" font="medium">
          {{ item.sourceText }}
        </text>

        <!-- 右侧：赠送时长 | 剩余时长 | 剩余天数 -->
        <view flex="~ row items-center" gap="2">
          <text text="xs gray-500">
            赠{{ item.totalMinutes }}分钟
          </text>
          <view w="1px" h="3" bg="gray-300" />
          <text text="xs blue-600" font="medium">
            剩{{ item.remainingMinutes }}分钟
          </text>
          <view w="1px" h="3" bg="gray-300" />
          <text text="xs" :class="item.remainingDays <= 3 ? 'text-orange-500' : 'text-gray-500'">
            {{ item.remainingDays }}天
          </text>
        </view>
      </view>
    </view>
  </WhiteCard>
</template>
