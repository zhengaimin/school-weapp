<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { TPackageStatus } from '@/constant/modules'
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { PACKAGE_STATUS, PACKAGE_STATUS_CONFIGS, PACKAGE_TYPE_I18N } from '@/constant/modules'
import { formatTime } from '@/utils/format'

const props = defineProps<{
  record: Pkg.Query.IPackagePurchaseVo
  hasPendingRefund?: boolean
}>()

const emit = defineEmits<{
  click: [event: Event, record: Pkg.Query.IPackagePurchaseVo]
  cancel: [record: Pkg.Query.IPackagePurchaseVo]
  pay: [record: Pkg.Query.IPackagePurchaseVo]
  refund: [record: Pkg.Query.IPackagePurchaseVo]
}>()

/** 套餐状态 */
const recordStatus = computed(() => props.record?.status ?? null)
/** 判断是否为待支付状态 */
const isUnpaid = computed(() => recordStatus.value === PACKAGE_STATUS.PENDING)
/** 是否显示退款按钮 */
const showRefundButton = computed(() => {
  if (props.hasPendingRefund) return false
  return props.record?.canRefund
})
/** 获取状态配置 */
const statusConfig = computed(() => PACKAGE_STATUS_CONFIGS[recordStatus.value as TPackageStatus])
/** 获取图标名称 */
const iconName = computed(() => statusConfig.value?.icon)
/** 获取图标颜色 */
const iconColor = computed(() => statusConfig.value?.iconColor)
/** 获取状态标签 */
const statusLabel = computed(() => statusConfig.value?.label)
/** 获取套餐类型标签 */
const packageTypeLabel = computed(() => PACKAGE_TYPE_I18N[props.record?.snapshotInfo?.packageType])

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
