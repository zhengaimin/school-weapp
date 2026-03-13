<script lang="ts" setup>
import type { Payment } from '@/api/interface/modules/payment'
import TButton from '@/components/common/button/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE_I18N } from '@/constant/modules'
import { useUserStore } from '@/store/user'
import { formatTime } from '@/utils/format'

import { getStatusConfig } from '../data'

const props = defineProps<{
  record: Payment.Order.IPaymentRecordVo
  showDeviceType?: boolean
}>()

const emit = defineEmits<{
  detail: [record: Payment.Order.IPaymentRecordVo]
  cancel: [record: Payment.Order.IPaymentRecordVo]
  pay: [record: Payment.Order.IPaymentRecordVo]
}>()

const userStore = useUserStore()

// 判断是否为本人操作
const isSelfOperation = computed(() => {
  return userStore.userInfo?.userId === props.record.userId
})

function handleDetail() {
  emit('detail', props.record)
}

function handleCancel() {
  emit('cancel', props.record)
}

function handlePay() {
  emit('pay', props.record)
}
</script>

<template>
  <view relative overflow="hidden" @click="handleDetail">
    <WhiteCard relative>
      <!-- 背景图标 -->
      <view absolute left--68rpx top-68rpx style="transform: translateY(-50%)">
        <Icon
          :name="getStatusConfig(record.status).icon"
          :icon-color="getStatusConfig(record.status).iconColor"
          icon-size="256rpx"
          custom-class="opacity-10"
        />
      </view>

      <!-- 内容区域 -->
      <view relative z="10">
        <!-- 第一行：姓名和金额 -->
        <view flex="~ justify-between items-center" m="b-1">
          <view text="sm gray-900" font="medium">
            {{ record.orderNo }}
          </view>
          <view text="lg gray-900" font="bold">
            ¥{{ Number(record.amount).toFixed(2) }}
          </view>
        </view>

        <!-- 第二行：支付方式和时间 -->
        <view flex="~ justify-between items-center" m="b-2">
          <view text="xs gray-600">
            <text v-if="props.showDeviceType && record.deviceType">
              {{ DEVICE_TYPE_I18N[record.deviceType] }} ·
            </text>
            {{ record.statusText }} · {{ isSelfOperation ? '本人操作' : '非本人操作' }}
          </view>
          <view text="xs gray-600">
            {{ formatTime(record.createdAt) }}
          </view>
        </view>

        <!-- 底部操作区域 -->
        <view v-if="record.status === 0" p="t-2" flex="~ row justify-end" gap="2">
          <TButton size="small" type="warning" plain @click.stop="handleCancel">
            取消
          </TButton>
          <TButton size="small" type="primary" plain @click.stop="handlePay">
            去支付
          </TButton>
        </view>
      </view>
    </WhiteCard>
  </view>
</template>
