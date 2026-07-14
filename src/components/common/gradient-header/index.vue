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
  // 自定义背景（支持纯色/渐变）
  gradientColors?: string
  // 是否显示底部波浪
  showWave?: boolean
  // 波浪颜色
  waveColor?: string
  // 返回按钮点击事件
  onBack?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  showBack: true,
  gradientColors: 'linear-gradient(135deg, #3269dd 0%, #5b8cff 100%)',
  showWave: false,
  waveColor: '#f9fafb',
  onBack: undefined,
})

const emit = defineEmits<{
  back: []
}>()

// 计算渐变背景样式
const gradientStyle = computed(() => ({
  background: props.gradientColors,
}))

// 生成波浪 SVG Data URI
const waveSvgUrl = computed(() => {
  const color = props.waveColor
  const svgContent = `<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path fill="${color}" fill-opacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
})

// 处理返回按钮点击
function handleBack() {
  if (props.onBack) {
    props.onBack()
  } else {
    emit('back')
    uni.navigateBack()
  }
}
</script>

<template>
  <view class="gradient-header" relative overflow="hidden" :style="gradientStyle" pt-safe>
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
        <Icon name="arrow-left-line" icon-color="#ffffff" icon-size="40rpx" />
      </view>
    </view>

    <!-- 内容区域 -->
    <view relative z="10" p="t-4 b-8 x-6" text="white">
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

    <!-- 底部波浪 -->
    <view
      v-if="showWave"
      absolute
      bottom="[-2rpx]"
      left-0
      w-full
      z="5"
      style="height: 80rpx; pointer-events: none;"
    >
      <image
        :src="waveSvgUrl"
        mode="scaleToFill"
        style="width: 100%; height: 100%; display: block;"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.gradient-header {
  background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%);
}
</style>
