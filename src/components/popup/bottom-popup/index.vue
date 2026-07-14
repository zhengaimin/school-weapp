<script setup lang="ts">
import type { BottomPopupProps } from './types'
import { computed } from 'vue'

// 组件属性类型（使用导入的类型）
type Props = BottomPopupProps

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showClose: true,
  closeOnClickModal: true,
  customStyle: '',
  customClass: '',
  height: '60vh',
  maxHeight: '60vh',
  safeAreaInsetBottom: true,
  zIndex: 999,
  showHeader: true,
  headerStyle: '',
  contentStyle: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'click-modal'): void
  (e: 'before-enter'): void
  (e: 'enter'): void
  (e: 'after-enter'): void
  (e: 'before-leave'): void
  (e: 'leave'): void
  (e: 'after-leave'): void
}>()

// 使用 defineModel 定义双向绑定
const show = defineModel('modelValue', { default: false })

// 计算弹框样式
const popupStyle = computed(() => {
  const style = 'border-radius: 32rpx 32rpx 0 0;'

  return `${style} ${props.customStyle}`
})

// 计算标题栏样式
const computedHeaderStyle = computed(() => {
  return props.headerStyle
})

// 关闭弹框
function handleClose() {
  show.value = false
  emit('close')
}

// 点击遮罩事件
function handleClickModal() {
  emit('click-modal')
}

// 进入前事件
function handleBeforeEnter() {
  emit('before-enter')
}

// 进入事件
function handleEnter() {
  emit('enter')
}

// 进入后事件
function handleAfterEnter() {
  emit('after-enter')
}

// 离开前事件
function handleBeforeLeave() {
  emit('before-leave')
}

// 离开事件
function handleLeave() {
  emit('leave')
}

// 离开后事件
function handleAfterLeave() {
  emit('after-leave')
}

// 显示弹框
function showPopup() {
  show.value = true
}

// 隐藏弹框
function hidePopup() {
  show.value = false
}

// 切换弹框显示状态
function togglePopup() {
  show.value = !show.value
}

// 暴露方法给父组件
defineExpose({
  show: showPopup,
  hide: hidePopup,
  toggle: togglePopup,
})
</script>

<template>
  <wd-popup
    v-bind="$attrs"
    v-model="show"
    position="bottom"
    :close-on-click-modal="closeOnClickModal"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :z-index="zIndex"
    :root-portal="true"
    :custom-style="popupStyle"
    :custom-class="customClass"
    @close="handleClose"
    @click-modal="handleClickModal"
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @after-enter="handleAfterEnter"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
    @after-leave="handleAfterLeave"
  >
    <view class="bottom-popup" overflow-hidden flex="~ col">
      <!-- 标题栏 -->
      <view
        v-if="showHeader && (title || showClose || $slots.header)"
        class="bottom-popup__header"
        flex="~ items-center justify-between"
        p-4
        :style="computedHeaderStyle"
      >
        <!-- 标题区域 -->
        <view class="bottom-popup__title">
          <slot name="header">
            <view v-if="title" text="lg left gray-900">
              {{ title }}
            </view>
          </slot>
        </view>

        <!-- 关闭按钮 -->
        <view v-if="showClose" class="bottom-popup__close" @click="handleClose">
          <slot name="close">
            <wd-icon name="close" color="#999" size="32rpx" />
          </slot>
        </view>
      </view>

      <!-- 内容区域 -->
      <view class="bottom-popup__content" :style="contentStyle">
        <scroll-view scroll-y :style="{ maxHeight }">
          <slot />
        </scroll-view>
      </view>

      <!-- 底部区域 -->
      <view v-if="$slots.footer" class="bottom-popup__footer">
        <slot name="footer" />
      </view>
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
.bottom-popup {
  &__header {
    flex-shrink: 0;
    border-bottom: 1px solid #f5f5f5;
  }

  &__title {
    flex: 1;
    min-width: 0;
  }

  &__close {
    flex-shrink: 0;
    cursor: pointer;
    padding: 8rpx;
    margin: -8rpx;
  }

  &__content {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  &__footer {
    flex-shrink: 0;
  }
}

// 深度选择器样式
:deep(.wd-popup) {
  overflow: hidden;
}
</style>
