<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { TPackageStatus } from '@/constant/modules/package'
// #region 导入
import { computed } from 'vue'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import {
  PACKAGE_STATUS,
  PACKAGE_STATUS_CONFIGS,
  PACKAGE_TYPE_I18N,
} from '@/constant/modules/package'
import { formatTime } from '@/utils/time'
// #endregion

// #region 属性定义
const props = defineProps<{
  record: Pkg.Query.IStudentActivePackageVo
  continueLoading: boolean
  cancelLoading: boolean
}>()

const emit = defineEmits<{
  click: [event: Event, record: Pkg.Query.IStudentActivePackageVo]
  cancel: [record: Pkg.Query.IStudentActivePackageVo]
  pay: [record: Pkg.Query.IStudentActivePackageVo]
}>()
// #endregion

// #region 定义计算属性
const isUnpaid = computed(() => {
  return props.record.status === PACKAGE_STATUS.PENDING
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
            ¥{{ Number(record?.currentTemplate?.purchasePrice).toFixed(2) }}
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
        <view v-if="isUnpaid" flex="~ justify-end" m="t-3" gap="3">
          <TButton
            type="danger"
            size="small"
            plain
            :loading="cancelLoading"
            @click.stop="handleCancel"
          >
            取消
          </TButton>
          <TButton
            type="primary"
            size="small"
            plain
            :loading="continueLoading"
            @click.stop="handlePay"
          >
            继续支付
          </TButton>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
