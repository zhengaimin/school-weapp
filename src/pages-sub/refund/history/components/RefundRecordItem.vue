<script lang="ts" setup>
// #region 导入
import type { Refund } from '@/api/interface/modules/refund'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules/refund'
import { formatTime } from '@/utils/time'
// #endregion

// #region 属性定义
defineProps<{
  record: Refund.IRefundApplicationVo
}>()

const emit = defineEmits<{
  click: [event: Event]
  cancel: [record: Refund.IRefundApplicationVo]
}>()
// #endregion

// #region 方法
function handleCancel(record: Refund.IRefundApplicationVo) {
  emit('cancel', record)
}
// #endregion
</script>

<template>
  <view relative overflow="hidden" @click.stop="e => emit('click', e)">
    <WhiteCard relative>
      <!-- 背景图标 -->
      <view absolute style="left: -34px; top: 34px; transform: translateY(-50%)">
        <Icon
          :name="REFUND_STATUS_CONFIGS[record.status].icon"
          :icon-color="REFUND_STATUS_CONFIGS[record.status].iconColor"
          icon-size="256rpx"
          custom-class="opacity-10"
        />
      </view>

      <!-- 内容区域 -->
      <view relative z="10">
        <!-- 第一行：姓名和金额 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ record.statusText }}
          </view>
          <view text="lg gray-900" font="bold">
            ¥{{ record.applyAmount }}
          </view>
        </view>

        <!-- 第二行：文字和时间 -->
        <view flex="~ justify-between items-center" m="b-2">
          <view flex-1 overflow-hidden text="xs gray-600">
            <view overflow-hidden text-ellipsis whitespace-nowrap>
              {{
                record.status === REFUND_STATUS.REJECTED ? record.adminRemark : record.applyReason
              }}
            </view>
          </view>
          <view text="xs gray-600" whitespace-nowrap m="l-2">
            {{ formatTime(record.applyTime) }}
          </view>
        </view>
      </view>

      <!-- 只有当状态为待审核(0)时才显示取消申请按钮 -->
      <view v-if="record.status === REFUND_STATUS.PENDING" flex="~ justify-end" m="t-3">
        <TButton size="small" type="default" @click.stop="handleCancel(record)">
          取消申请
        </TButton>
      </view>
    </WhiteCard>
  </view>
</template>
