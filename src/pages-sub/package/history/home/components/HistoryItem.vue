<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { TPackageStatus } from '@/constant/modules'
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { PACKAGE_STATUS, PACKAGE_STATUS_CONFIGS } from '@/constant/modules'
import { formatTime } from '@/utils/format'
import { canShowRefundButton } from '../../../utils'

type HistoryRecord = Pkg.Platform.IStudentPackage & {
  packageName?: string
  price?: number | string
}

const props = defineProps<{
  record: Pkg.Platform.IStudentPackage
  hasPendingRefund?: boolean
}>()

const emit = defineEmits<{
  click: [event: Event, record: Pkg.Platform.IStudentPackage]
  cancel: [record: Pkg.Platform.IStudentPackage]
  pay: [record: Pkg.Platform.IStudentPackage]
  refund: [record: Pkg.Platform.IStudentPackage]
}>()

/** 套餐状态 */
const recordStatus = computed(() => props.record?.status ?? null)
/** 判断是否为待支付状态 */
const isUnpaid = computed(() => recordStatus.value === PACKAGE_STATUS.PENDING)
/** 是否显示退款按钮 */
const showRefundButton = computed(() => {
  return props.record.packageRecordIds.length > 0 && canShowRefundButton({
    status: props.record.status,
    endDate: props.record.endDate,
    hasPendingRefund: props.hasPendingRefund,
  })
})
/** 获取状态配置 */
const statusConfig = computed(() => PACKAGE_STATUS_CONFIGS[recordStatus.value as TPackageStatus])
/** 获取图标名称 */
const iconName = computed(() => statusConfig.value?.icon || 'history-line')
/** 获取图标颜色 */
const iconColor = computed(() => statusConfig.value?.iconColor || '#9ca3af')
/** 获取图标背景色 */
const iconBackgroundColor = computed(() => statusConfig.value?.bgColor || '#f3f4f6')
/** 获取状态标签 */
const statusLabel = computed(() => statusConfig.value?.label || props.record.statusText || '套餐')
/** 获取套餐名称 */
const packageName = computed(() => {
  const record = props.record as HistoryRecord
  return record.name || record.packageName || '套餐'
})
/** 获取套餐价格 */
const packagePrice = computed(() => {
  const record = props.record as HistoryRecord
  const value = record.purchasePrice ?? record.price
  const price = Number(value)
  return Number.isFinite(price) ? price.toFixed(2) : '-'
})

/** 处理点击事件 */
function handleClick(event: Event) {
  emit('click', event, props.record)
}
/** 取消订单 */
function handleCancel() {
  emit('cancel', props.record)
}
/** 支付订单 */
function handlePay() {
  emit('pay', props.record)
}
/** 申请退款 */
function handleRefund() {
  emit('refund', props.record)
}
</script>

<template>
  <view v-if="record" relative overflow="hidden" @click.stop="handleClick">
    <WhiteCard relative>
      <!-- 背景图标 -->
      <view
        w="32"
        h="32"
        absolute
        left--68rpx
        top-68rpx
        overflow-hidden
        rounded-full
        opacity-10
        :style="{ backgroundColor: iconBackgroundColor, transform: 'translateY(-50%)' }"
      >
        <Icon
          :name="iconName"
          :icon-color="iconColor"
          icon-size="256rpx"
        />
      </view>

      <!-- 内容区域 -->
      <view relative z="10">
        <!-- 第一行：套餐名称和金额 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ packageName }}
          </view>

          <view text="lg gray-900" font="bold">
            ¥{{ packagePrice }}
          </view>
        </view>

        <!-- 第二行：状态和时间 -->
        <view flex="~ justify-between items-center" m="b-2">
          <view text="xs gray-600">
            {{ statusLabel }}
          </view>
          <view text="xs gray-600">
            {{ formatTime(record?.purchaseDate) }}
          </view>
        </view>
        <!-- 第三行：操作按钮 -->
        <view v-if="isUnpaid || showRefundButton" flex="~ justify-end" m="t-3" gap="3">
          <!-- 待支付状态的按钮 -->
          <template v-if="isUnpaid">
            <TButton type="danger" size="small" plain @click.stop="handleCancel">
              取消
            </TButton>
            <TButton type="primary" size="small" plain @click.stop="handlePay">
              继续支付
            </TButton>
          </template>

          <!-- 退款按钮 -->
          <TButton
            v-if="showRefundButton"
            type="warning"
            size="small"
            plain
            @click.stop="handleRefund"
          >
            申请退费
          </TButton>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
