<script lang="ts" setup>
import type { NoticeType } from './types'
import { computed } from 'vue'
import { useMessage } from 'wot-design-uni'
import Icon from '@/components/icon/index.vue'
import { typeConfig } from './config'

const props = withDefaults(
  defineProps<{
    /** 通知类型 */
    type?: NoticeType
    /** 通知标题 */
    title?: string
    /** 通知是否可点击 */
    clickable?: boolean
    /** 是否可关闭 */
    closable?: boolean
    /** 是否显示弹框 */
    showPopup?: boolean
    /** 弹框标题 */
    popupTitle?: string
    /** 弹框内容 */
    popupContent?: string
    /** 弹框确认按钮文本 */
    confirmButtonText?: string
    /** 弹框取消按钮文本 */
    cancelButtonText?: string
  }>(),
  {
    type: 'warning',
    title: '',
    clickable: true,
    closable: false,
    showPopup: true,
    popupTitle: '提示',
    popupContent: '',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  },
)

const emit = defineEmits<{
  click: [event: Event]
  confirm: []
  cancel: []
  close: []
}>()

const message = useMessage()

const currentConfig = computed(() => typeConfig[props.type])

// 点击通知的处理函数
function handleClick(event: Event) {
  // 如果需要显示弹窗，则处理弹窗逻辑
  if (props.showPopup) {
    message
      .confirm({
        title: props.popupTitle,
        msg: props.popupContent || props.title,
        confirmButtonText: props.confirmButtonText,
        cancelButtonText: props.cancelButtonText,
      })
      .then(() => {
        emit('confirm')
      })
      .catch(() => {
        emit('cancel')
      })
  }
  // 否则，直接触发 click 事件
  else {
    emit('click', event)
  }
}
</script>

<template>
  <view
    flex="~ items-center justify-between"
    p="3"
    gap="2"
    border="~ solid rounded-lg"
    :style="{
      backgroundColor: currentConfig.bgColor,
      borderColor: currentConfig.borderColor,
      color: currentConfig.textColor,
    }"
    :class="[clickable ? 'cursor-pointer' : '']"
    @click.stop="handleClick"
  >
    <view flex="~ items-start" gap="2">
      <view h-40rpx flex="~ items-center justify-center">
        <Icon :name="currentConfig.icon" :icon-color="currentConfig.iconColor" />
      </view>
      <view text="sm" flex="~ col 1" :style="{ color: currentConfig.textColor }">
        {{ title }}
      </view>
    </view>
  </view>
</template>
