<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { TRefundStatus } from '@/constant/modules'
import { computed, ref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { postCancelPackageRefundApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE_I18N, REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules'
import { PACKAGE_REFUND_RESULT_PATH } from '@/constant/router'
import { formatTime } from '@/utils/format'
import { toast } from '@/utils/toast'

const props = defineProps<{
  record: Pkg.Refund.IRefundApplicationRecord
  showDeviceType?: boolean
}>()

const emit = defineEmits<{
  click: [event: Event, record: Pkg.Refund.IRefundApplicationRecord]
  cancel: [record: Pkg.Refund.IRefundApplicationRecord]
}>()

const message = useMessage()

const cancelling = ref(false)

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

const deviceTypeLabel = computed(() => {
  const deviceType = props.record.deviceType
  return deviceType ? DEVICE_TYPE_I18N[deviceType as keyof typeof DEVICE_TYPE_I18N] : ''
})

/** 处理点击事件 */
function handleClick(event: Event) {
  emit('click', event, props.record)
  uni.navigateTo({
    url: `${PACKAGE_REFUND_RESULT_PATH}?id=${props.record.id}`,
  })
}

/** 处理取消申请 */
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
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消退款申请失败:', error)
      toast.show('取消失败，请重试')
    }
  } finally {
    uni.hideLoading()
  }
}
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
      <view relative z="10" flex="~ col" gap="1">
        <!-- 第一行：套餐名称和金额 -->
        <view flex="~ justify-between items-center">
          <view text="sm gray-900" font="medium">
            {{ record.statusText }}
          </view>

          <view text="lg gray-900" font="bold">
            ¥{{ Number(actualAmount).toFixed(2) }}
          </view>
        </view>

        <!-- 第二行：状态和申请时间 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="xs gray-600">
            <text v-if="props.showDeviceType && deviceTypeLabel">
              {{ deviceTypeLabel }} ·
            </text>
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
