<script setup lang="ts">
import TButton from '@/components/common/button/index.vue'
import Icon from '@/components/icon/index.vue'
import { copyToClipboard } from '@/utils/clipboard'

interface Props {
  /** 是否显示弹框 */
  modelValue?: boolean
  /** 弹框标题 */
  title?: string
  /** 客服电话 */
  phone?: string
  /** 提示文案 */
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '联系客服',
  phone: '027-86951388',
  message: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const show = defineModel('modelValue', { default: false })

function handleClose() {
  show.value = false
  emit('close')
}

function handleCopyPhone() {
  if (props.phone) {
    copyToClipboard(props.phone, '客服电话')
  }
}

function handleCall() {
  if (!props.phone) {
    uni.showToast({
      title: '暂无客服电话',
      icon: 'none',
    })
    return
  }

  uni.makePhoneCall({
    phoneNumber: props.phone,
  })
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="center"
    :close-on-click-modal="false"
    :root-portal="true"
    custom-style="width: 82vw; border-radius: 24rpx;"
    @close="handleClose"
  >
    <view class="customer-service-popup" flex="~ col items-center" p="x-5 y-6">
      <view class="customer-service-popup__icon" flex="~ items-center justify-center">
        <Icon name="customer-service-line" icon-color="#3269dd" icon-size="72rpx" />
      </view>
      <text v-if="title || message" class="customer-service-popup__title">
        {{ message || title }}
      </text>
      <view
        class="customer-service-popup__contact"
        flex="~ items-center justify-center"
        gap="2"
        w-full
        @click="handleCopyPhone"
      >
        <text class="customer-service-popup__phone">
          {{ phone || '暂无客服电话' }}
        </text>
        <Icon name="file-copy-line" icon-color="#7b8ba6" icon-size="30rpx" />
      </view>

      <view class="customer-service-popup__actions" flex="~" w-full gap-3>
        <TButton type="default" full flex-1 size="medium" @click="handleClose">
          取消
        </TButton>
        <TButton type="primary" full flex-1 size="medium" @click="handleCall">
          立即呼叫
        </TButton>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.customer-service-popup {
  box-sizing: border-box;

  &__icon {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    background-color: #eef4ff;
  }

  &__title {
    margin-top: 20rpx;
    color: #0f1f39;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 44rpx;
  }

  &__contact {
    margin-top: 24rpx;
  }

  &__phone {
    color: #0f1f39;
    font-size: 40rpx;
    font-weight: 500;
    line-height: 48rpx;
    white-space: nowrap;
  }

  &__actions {
    margin-top: 32rpx;
  }
}
</style>
