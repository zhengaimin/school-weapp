<script lang="ts" setup>
import { computed } from 'vue'
import Icon from '@/components/icon/index.vue'
import { typeConfig } from './config'

const props = withDefaults(
  defineProps<{
    /** 通知类型 */
    type?: 'info' | 'success' | 'warning' | 'error' | 'custom'
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
  }>(),
  {
    type: 'info',
    title: '',
    content: '',
  },
)

const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
}>()

// 获取当前类型的配置
const currentConfig = computed(() => typeConfig[props.type])

// 根据类型获取图标名称
const iconName = computed(() => currentConfig.value.icon)

// 根据类型获取图标颜色
const iconColor = computed(() => currentConfig.value.iconColor)

// 根据类型获取边框颜色
const borderColor = computed(() => currentConfig.value.borderColor)

// 根据类型获取背景颜色
const bgColor = computed(() => currentConfig.value.bgColor)

// 根据类型获取文本颜色
const textColor = computed(() => currentConfig.value.textColor)

function handleClick(event: Event) {
  emit('click', event)
}
</script>

<template>
  <!-- 通知内容 -->
  <view @click.stop="handleClick">
    <view
      flex="~ items-start"
      gap="3"
      p="x-4 y-3"
      border="solid rounded-lg 1px"
      :style="{
        borderColor,
        backgroundColor: bgColor,
      }"
    >
      <view h-4 flex="~ items-center justify-center">
        <Icon :name="iconName" :icon-color="iconColor" icon-size="40rpx" />
      </view>
      <view flex="1 ~ col" gap="1">
        <view v-if="props.title" text-sm font="medium" :style="{ color: textColor }">
          {{ props.title }}
        </view>
        <view v-if="props.content" text-xs :style="{ color: textColor }">
          {{ props.content }}
        </view>
      </view>
    </view>
  </view>
</template>
