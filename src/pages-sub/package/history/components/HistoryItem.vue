<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { TPackageStatus } from '@/constant/modules'
// #region 导入
import dayjs from 'dayjs'
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import {
  PACKAGE_BUY_STATUS,
  PACKAGE_STATUS,
  PACKAGE_STATUS_CONFIGS,
  PACKAGE_TYPE_I18N,
} from '@/constant/modules'
import { formatTime } from '@/utils/format'
// #endregion

// #region 属性定义
const props = defineProps<{
  record: Pkg.Query.IPackagePurchaseVo
  hasPendingRefund?: boolean
}>()
const emit = defineEmits<{
  click: [event: Event, record: Pkg.Query.IPackagePurchaseVo]
  cancel: [record: Pkg.Query.IPackagePurchaseVo]
  pay: [record: Pkg.Query.IPackagePurchaseVo]
  refund: [record: Pkg.Query.IPackagePurchaseVo]
  cancelRefund: [record: Pkg.Query.IPackagePurchaseVo]
}>()
// #endregion

// #region 定义计算属性
// 判断记录是否是待审核的退款记录
const isPendingRefund = computed(() => {
  return props.record.status === PACKAGE_BUY_STATUS.REFUND_PENDING
})

const isUnpaid = computed(() => {
  return props.record.status === PACKAGE_STATUS.PENDING
})

// 是否显示退款按钮
const showRefundButton = computed(() => {
  // 如果存在待审核的退款申请，且当前记录不是申请退款中状态，则不显示退款按钮
  if (props.hasPendingRefund && props.record.status !== PACKAGE_BUY_STATUS.REFUND_PENDING) {
    return false
  }

  // 待激活套餐可以退款
  if (props.record.status === PACKAGE_STATUS.WAITING_ACTIVE) {
    return true
  }

  // 有效/已激活套餐需要判断结束日期和当前日期不是一个月
  if (props.record.status === PACKAGE_STATUS.ACTIVE && props.record.endDate) {
    const endDate = dayjs(props.record.endDate)
    const currentDate = dayjs()
    // 计算当前日期和结束日期的月份差异
    const monthsDiff = endDate.diff(currentDate, 'month', true)
    // 如果结束日期距离当前时间超过一个月，可以退款
    return monthsDiff > 1
  }

  return false
})

const statusConfig = computed(() => {
  return PACKAGE_STATUS_CONFIGS[props.record.status as TPackageStatus]
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

const packageTypeLabel = computed(() => {
  return PACKAGE_TYPE_I18N[props.record.snapshotInfo.packageType]
})
// #endregion

// #region 方法
function handleClick(event: Event) {
  emit('click', event, props.record)
}

// 取消订单
function handleCancel() {
  emit('cancel', props.record)
}

// 支付订单
function handlePay() {
  emit('pay', props.record)
}

// 申请退款
function handleRefund() {
  emit('refund', props.record)
}

// 取消退款
function handleCancelRefund() {
  emit('cancelRefund', props.record)
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
            {{ packageTypeLabel }}
          </view>

          <view text="lg gray-900" font="bold">
            ¥{{ Number(record?.purchasePrice).toFixed(2) }}
          </view>
        </view>

        <!-- 第二行：状态和时间 -->
        <view flex="~ justify-between items-center" m="b-2">
          <view text="xs gray-600">
            {{ statusLabel }}
          </view>
          <view text="xs gray-600">
            {{ formatTime(record.purchaseDate) }}
          </view>
        </view>
        <!-- 第三行：操作按钮 -->
        <view
          v-if="isUnpaid || showRefundButton || isPendingRefund"
          flex="~ justify-end"
          m="t-3"
          gap="3"
        >
          <!-- 待支付状态的按钮 -->
          <template v-if="isUnpaid">
            <TButton type="danger" size="small" plain @click.stop="handleCancel">
              取消
            </TButton>
            <TButton type="primary" size="small" plain @click.stop="handlePay">
              继续支付
            </TButton>
          </template>

          <!-- 取消退款按钮 -->
          <TButton
            v-if="isPendingRefund"
            type="danger"
            size="small"
            plain
            @click.stop="handleCancelRefund"
          >
            取消退款
          </TButton>

          <!-- 退款按钮 -->
          <TButton
            v-if="showRefundButton"
            type="warning"
            size="small"
            plain
            @click.stop="handleRefund"
          >
            申请退款
          </TButton>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
