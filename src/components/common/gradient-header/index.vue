<script lang="ts" setup>
import { computed } from 'vue'
import Icon from '@/components/icon/index.vue'

interface Props {
  // 标题
  title?: string
  // 副标题
  subtitle?: string
  // 是否显示返回按钮
  showBack?: boolean
  // 自定义渐变色
  gradientColors?: string
  // 返回按钮点击事件
  onBack?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  showBack: true,
  gradientColors: 'linear-gradient(135deg, #3269dd 0%, #5b8cff 100%)',
  onBack: undefined,
})

const emit = defineEmits<{
  back: []
}>()

// 计算渐变背景样式
const gradientStyle = computed(() => ({
  background: props.gradientColors,
}))

// 处理返回按钮点击
function handleBack() {
  if (props.onBack) {
    props.onBack()
  }
  else {
    emit('back')
    uni.navigateBack()
  }
}
</script>

<template>
  <view class="gradient-header" relative overflow="hidden" :style="gradientStyle">
    <!-- 装饰圆形 -->
    <view
      absolute
      style="top: -40rpx; right: -40rpx"
      w="32"
      h="32"
      bg="white opacity-10"
      border="rounded-full"
    ></view>
    <view
      absolute
      style="top: 80rpx; left: -32rpx"
      w="20"
      h="20"
      bg="white opacity-15"
      border="rounded-full"
    ></view>

    <!-- 返回按钮 -->
    <view v-if="showBack" relative z="20" p="t-4 x-6">
      <view
        w="10"
        h="10"
        bg="white opacity-20"
        border="rounded-full"
        flex="~ items-center justify-center"
        transition-colors
        @click="handleBack"
      >
        <Icon name="arrow-left-line" color="#ffffff" size="40rpx" />
      </view>
    </view>

    <!-- 内容区域 -->
    <view relative z="10" p="t-8 b-12 x-6" text="white">
      <view flex="~ items-center" m="b-2">
        <view text="2xl" font="bold">
          {{ title }}
        </view>
      </view>
      <view v-if="subtitle" text="sm opacity-75" m="t-1">
        {{ subtitle }}
      </view>

      <!-- 插槽：支持自定义内容 -->
      <slot />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.gradient-header {
  background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%);
}
</style>
