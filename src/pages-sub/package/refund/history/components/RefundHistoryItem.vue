<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import type { TRefundStatus } from '@/constant/modules'
import { computed, ref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { postCancelPackageRefundApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules'
import { formatTime } from '@/utils/format'
import { toast } from '@/utils/toast'
// #endregion

// #region 属性定义
const props = defineProps<{
  record: Pkg.Refund.IRefundApplicationRecord
}>()

const emit = defineEmits<{
  click: [event: Event, record: Pkg.Refund.IRefundApplicationRecord]
  cancel: [record: Pkg.Refund.IRefundApplicationRecord]
}>()
// #endregion

// #region 使用 Hooks
const message = useMessage()
// #endregion

// #region 定义响应式数据
const cancelling = ref(false)
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

const actualAmount = computed(() => {
  return props.record.actualAmount || props.record.applyAmount
})

const canCancel = computed(() => {
  return props.record.status === REFUND_STATUS.PENDING
})
// #endregion

// #region 事件处理函数
// 处理点击事件
function handleClick(event: Event) {
  emit('click', event, props.record)
}

// 处理取消申请
async function handleCancelRefund() {
  try {
    await message.confirm({
      msg: '确认取消退款申请吗？',
    })

    uni.showLoading({
      title: '取消中...',
      mask: true,
    })

    const result = await postCancelPackageRefundApi(props.record.id)

    if (result.code === 0) {
      toast.show('取消成功')
      emit('cancel', props.record)
    }
  }
  catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消退款申请失败:', error)
      toast.show('取消失败，请重试')
    }
  }
  finally {
    uni.hideLoading()
  }
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
        <!-- 第一行：套餐名称和金额 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ record.statusText }}
          </view>

          <view text="lg gray-900" font="bold">
            ¥{{ Number(actualAmount).toFixed(2) }}
          </view>
        </view>

        <!-- 第二行：状态和申请时间 -->
        <view flex="~ justify-between items-center" m="b-2">
          <view text="xs gray-600">
            {{ record.status === REFUND_STATUS.REJECTED ? record.adminRemark : record.applyReason }}
          </view>
          <view text="xs gray-600">
            {{ formatTime(record.applyTime) }}
          </view>
        </view>

        <!-- 第三行：操作按钮 -->
        <view v-if="canCancel" flex="~ justify-end">
          <TButton type="danger" plain size="small" @click.stop="handleCancelRefund">
            取消申请
          </TButton>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
