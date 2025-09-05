<script lang="ts" setup>
// #region 导入
import type { Refund } from '@/api/interface/modules/refund'
import type { TRefundStatus } from '@/constant/modules/refund'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { REFUND_APPLICATION_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules/refund'
import { formatTime } from '@/utils/time'
// #endregion

// #region 属性定义
const props = defineProps<{
  record: Refund.IRefundApplicationVo
}>()

const emit = defineEmits<{
  click: [event: Event, record: Refund.IRefundApplicationVo]
}>()
// #endregion

// #region 定义计算属性
const statusConfig = computed(() => {
  return REFUND_STATUS_CONFIGS[props.record.status as TRefundStatus]
})

const iconName = computed(() => {
  return statusConfig.value.icon
})

const iconColor = computed(() => {
  return statusConfig.value.iconColor
})

const statusLabel = computed(() => {
  return statusConfig.value.label
})

const actualAmount = computed(() => {
  return props.record.actualAmount || props.record.applyAmount
})
// #endregion

// #region 方法
// 处理点击事件
function handleClick(event: Event) {
  emit('click', event, props.record)
}
// #endregion
</script>

<template>
  <view relative overflow="hidden" @click.stop="handleClick">
    <WhiteCard relative>
      <!-- 背景图标 -->
      <view absolute left--68rpx top-68rpx style="transform: translateY(-50%)">
        <Icon
          :name="iconName"
          :icon-color="iconColor"
          icon-size="256rpx"
          custom-class="opacity-10"
        />
      </view>

      <!-- 内容区域 -->
      <view relative z="10">
        <!-- 第一行：退款单号和金额 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ record.statusText }}
          </view>

          <view text="lg gray-900" font="bold">
            ¥{{ Number(actualAmount).toFixed(2) }}
          </view>
        </view>

        <!-- 第二行：状态和申请时间 -->
        <view flex="~ justify-between items-center">
          <view text="xs gray-600">
            {{
              record.status === REFUND_APPLICATION_STATUS.REJECTED
                ? record.adminRemark
                : record.applyReason
            }}
          </view>
          <view text="xs gray-600">
            {{ formatTime(record.applyTime) }}
          </view>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
