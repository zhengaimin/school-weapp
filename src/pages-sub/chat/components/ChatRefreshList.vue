<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  // 是否正在加载
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否已加载全部
  loaded: {
    type: Boolean,
    default: false,
  },
  // 滚动到指定元素
  scrollIntoView: {
    type: String,
    default: '',
  },
  // 键盘高度，用于动态调整列表高度
  keyboardHeight: {
    type: Number,
    default: 0,
  },
  // 是否显示键盘
  isKeyboardShow: {
    type: Boolean,
    default: false,
  },
  // 输入框基础高度
  inputBaseHeight: {
    type: String,
    default: '100rpx',
  },
})

const emit = defineEmits(['load-more'])

// 计算列表区域高度
const listHeight = computed(() => {
  // 如果键盘显示，列表高度需要减去键盘高度
  // 否则使用完整高度
  const paddingBottom = props.isKeyboardShow ? `${props.keyboardHeight}px` : '0'
  return {
    height: '100%',
    paddingBottom,
  }
})

const scrollViewId = 'chat-scroll-view'
const currentScrollIntoView = ref('')
// 滚动到顶部时触发
function onScrollToUpper() {
  if (props.loading || props.loaded)
    return
  emit('load-more')
}

// 监听滚动目标变化
watch(
  () => props.scrollIntoView,
  (newValue) => {
    if (newValue) {
      scrollTo(newValue)
    }
  },
)

// 滚动到指定位置
function scrollTo(selector: string) {
  nextTick(() => {
    currentScrollIntoView.value = selector

    // 滚动后清除目标，以便下次还能触发
    setTimeout(() => {
      currentScrollIntoView.value = ''
    }, 150)
  })
}

// 滚动到底部
function scrollToBottom() {
  scrollTo('chat-bottom')
}

defineExpose({
  scrollTo,
  scrollToBottom,
})
</script>

<template>
  <scroll-view
    :id="scrollViewId"
    class="chat-refresh-list"
    :style="listHeight"
    scroll-y
    :scroll-into-view="currentScrollIntoView"
    upper-threshold="50"
    @scrolltoupper="onScrollToUpper"
  >
    <!-- 自定义加载指示器 -->
    <view v-if="loading" p="y-3" flex="~ justify-center items-center">
      <wd-loading size="20px" />
      <text text="sm gray-500" m="l-2">
        加载中...
      </text>
    </view>

    <slot />

    <view id="chat-bottom"></view>
  </scroll-view>
</template>

<style scoped lang="scss">
.chat-refresh-list {
  box-sizing: border-box;
  transition: height 0.3s ease, padding-bottom 0.3s ease;
}
</style>
