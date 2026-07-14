<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import StatusTip from '@/components/common/status-tip/index.vue'

// 定义组件属性类型
interface Props {
  /** 自定义样式 */
  customStyle?: string | Record<string, any>
  /** 是否为空数据 */
  empty?: boolean
  /** 加载更多的阈值 */
  lowerThreshold?: number
  /** 加载更多是否加载中 */
  loading?: boolean
  /** 下拉刷新是否加载中 */
  refreshLoading?: boolean
  /** 是否加载完毕 -> 没有更多了 */
  loaded?: boolean
  /** 是否启用下拉刷新 */
  isRefresh?: boolean
  /** 加载更多指示器位置 */
  loadmorePosition?: 'top' | 'bottom'
}

// 定义事件类型
interface Emits {
  (e: 'refresh'): void
  (e: 'loadmore'): void
  (e: 'scroll', detail: any): void
}

const props = withDefaults(defineProps<Props>(), {
  customStyle: () => ({}),
  empty: false,
  lowerThreshold: 200,
  loading: false,
  refreshLoading: false,
  loaded: false,
  isRefresh: true,
  loadmorePosition: 'bottom',
})

const emit = defineEmits<Emits>()

// 组件状态
const showRefresh = ref(false)
const forceRefresh = ref(false)

// 触摸相关状态
const moveStartPosition = ref(0)
const moveDistance = ref(0)
const isRefreshMaxDown = ref(false)
const isLoading = ref(false)

// 常量定义
const MOVE_REFRESH_DISTANCE = 60 // 达到刷新的阈值
const MOVE_MAX_DISTANCE = 100 // 最大可滑动距离

// 容器和刷新元素的引用
const listContainer = ref<any>(null)
const refreshContainer = ref<any>(null)

// 计算属性
// 处理自定义样式，兼容字符串和对象格式
const computedStyle = computed(() => {
  if (typeof props.customStyle === 'string') {
    return props.customStyle
  }
  if (typeof props.customStyle === 'object' && props.customStyle !== null) {
    return props.customStyle
  }
  return {}
})

const refreshScale = computed(() => {
  const scale = moveDistance.value / 100
  return scale > 1 ? 1 : scale
})

const containerTransform = computed(() => {
  // 如果正在刷新，显示刷新位置
  if (props.refreshLoading || showRefresh.value) {
    return `translateY(${Math.max(moveDistance.value, MOVE_REFRESH_DISTANCE)}px)`
  }
  return `translateY(${moveDistance.value}px)`
})

const refreshTransform = computed(() => {
  // 如果正在刷新或显示刷新状态，显示完整的指示器
  if (props.refreshLoading || showRefresh.value) {
    return 'scale(1) translateY(-100%)'
  }

  if (moveDistance.value >= MOVE_MAX_DISTANCE) {
    return 'scale(1) translateY(-100%)'
  } else {
    return `scale(${refreshScale.value}) translateY(-100%)`
  }
})

// 监听 refreshLoading 变化
watch(
  () => props.refreshLoading,
  (newVal) => {
    showRefresh.value = newVal

    // 开始刷新，显示指示器
    if (newVal) {
      showRefreshIndicator()
    } else { // 刷新完成，重置状态
      resetRefreshState()
    }
  },
)

// 触摸事件处理
function handleTouchStart(e: TouchEvent) {
  if (isLoading.value || props.loading || props.refreshLoading) {
    return
  }

  moveDistance.value = 0
  moveStartPosition.value = e.touches[0].clientY
}

function handleTouchMove(e: TouchEvent) {
  if (isLoading.value || props.loading || props.refreshLoading) {
    return
  }

  const currentDistance = e.touches[0].clientY - moveStartPosition.value

  // 如果是往下滑动，则不处理
  if (currentDistance <= 0) {
    return
  }

  moveDistance.value = Math.min(currentDistance, MOVE_MAX_DISTANCE)

  // 达到最大距离时触发震动提示
  if (moveDistance.value >= MOVE_MAX_DISTANCE && !isRefreshMaxDown.value) {
    // uni.vibrateShort() // 可选的震动反馈
    isRefreshMaxDown.value = true
  }
}

function handleTouchEnd() {
  if (isLoading.value || props.loading || props.refreshLoading) {
    return
  }

  if (moveDistance.value <= 0) {
    return
  }

  if (moveDistance.value < MOVE_REFRESH_DISTANCE) {
    // 移动距离小于刷新阈值，取消刷新
    cancelRefresh()
  } else {
    // 开始刷新
    startRefresh()
  }

  // 重置状态
  moveStartPosition.value = 0
  isRefreshMaxDown.value = false
}

// 刷新相关方法
function startRefresh() {
  isLoading.value = true
  showRefresh.value = true
  emit('refresh')
}

// 显示刷新指示器（用于程序化触发刷新）
function showRefreshIndicator() {
  isLoading.value = true
  moveDistance.value = MOVE_REFRESH_DISTANCE

  // 使用 setTimeout 确保 DOM 完全渲染
  setTimeout(() => {
    nextTick(() => {
      // 设置容器位置以显示刷新指示器
      if (listContainer.value && listContainer.value.style) {
        listContainer.value.style.transform = `translateY(${MOVE_REFRESH_DISTANCE}px)`
        listContainer.value.style.transition = 'transform 0.3s ease'
      }
      if (refreshContainer.value && refreshContainer.value.style) {
        refreshContainer.value.style.transform = 'scale(1) translateY(-100%)'
        refreshContainer.value.style.transition = 'transform 0.3s ease'
      }
    })
  }, 50) // 给一个小的延迟确保 DOM 准备就绪
}

function cancelRefresh() {
  showRefresh.value = false
  resetRefreshState()
}

function resetRefreshState() {
  moveDistance.value = 0
  isLoading.value = false
  showRefresh.value = false

  nextTick(() => {
    // 重置动画状态
    if (listContainer.value && listContainer.value.style) {
      listContainer.value.style.transform = 'translateY(0px)'
      listContainer.value.style.transition = 'transform 0.3s ease'
    }
    if (refreshContainer.value && refreshContainer.value.style) {
      refreshContainer.value.style.transform = 'scale(0) translateY(-100%)'
      refreshContainer.value.style.transition = 'transform 0.3s ease'
    }

    // 清除过渡效果
    setTimeout(() => {
      if (listContainer.value && listContainer.value.style) {
        listContainer.value.style.transition = ''
      }
      if (refreshContainer.value && refreshContainer.value.style) {
        refreshContainer.value.style.transition = ''
      }
    }, 300)
  })
}

// 主动触发刷新
function forceRefreshAction() {
  forceRefresh.value = true
  nextTick(() => {
    forceRefresh.value = false
  })
}

// 加载更多
function handleLoadMore() {
  if (!props.loaded && !props.loading) {
    emit('loadmore')
  }
}

// 滚动事件
function handleScroll(e: any) {
  emit('scroll', e.detail)
}

// 暴露方法给父组件
defineExpose({
  forceRefresh: forceRefreshAction,
})
</script>

<template>
  <scroll-view
    class="refresh-list"
    :scroll-y="!refreshLoading"
    :style="computedStyle"
    :lower-threshold="lowerThreshold"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @scrolltolower="handleLoadMore"
    @scroll="handleScroll"
  >
    <!-- 前置插槽 -->
    <slot name="before" />

    <view
      v-if="isRefresh"
      ref="listContainer"
      class="list-container"
      :style="{ transform: containerTransform }"
    >
      <!-- 下拉刷新指示器 -->
      <view
        v-show="showRefresh || moveDistance > 0"
        ref="refreshContainer"
        class="refresh-container"
        :style="{ transform: refreshTransform }"
      >
        <view class="refresh-dot" />
        <view class="refresh-dot" />
        <view class="refresh-dot" />
      </view>

      <!-- 顶部加载更多 -->
      <view v-if="loading && loadmorePosition === 'top'" class="gap-text">
        <view class="word">
          加载中...
        </view>
      </view>

      <!-- 主要内容 -->
      <slot v-if="!empty" />

      <!-- 底部加载更多 -->
      <view v-if="loading && loadmorePosition === 'bottom'" class="gap-text">
        <view class="word">
          加载中...
        </view>
      </view>

      <!-- 空数据状态 -->
      <view v-if="!refreshLoading && !loading && loaded && empty" class="gap-text empty">
        <StatusTip image="content" tip="暂无内容" />
      </view>

      <!-- 已加载完所有数据（非空状态） -->
      <view v-if="!refreshLoading && !loading && loaded && !empty" class="gap-text load-finish">
        <text>- 已加载全部数据 -</text>
      </view>
    </view>

    <!-- 后置插槽 -->
    <slot name="after" />
  </scroll-view>
</template>

<style scoped lang="scss">
.refresh-list {
  width: 100%;
  height: 100%;
}

.refresh-container {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  transform-origin: top center;
  transform: translateY(100%) scale(0);
}

.refresh-dot {
  margin-right: 12rpx;
  width: 12rpx;
  height: 12rpx;
  background: #cccccc;
  border-radius: 50%;
  animation: loading-2 0.6s infinite;

  &:first-child {
    animation: loading-1 0.6s infinite;
  }

  &:last-child {
    margin-right: 0;
    animation: loading-3 0.6s infinite;
  }
}

.list-container {
  width: 100%;
  height: 100%;
  max-height: 100vh;
}

.gap-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  min-width: 440rpx;
  font-size: 28rpx;
  text-align: center;
  color: #9b9b9b;
  letter-spacing: 1rpx;
  height: 80rpx;
  line-height: 80rpx;

  &.empty {
    height: 100%;
  }
}

.empty-icon {
  width: 200rpx;
  margin-bottom: 20rpx;
}

.word {
  display: flex;
  flex-direction: column;

  &__cn {
    font-size: 28rpx;
    line-height: 1.5;
  }

  &__en {
    font-size: 20rpx;
    opacity: 0.7;
    margin-top: 4rpx;
  }
}

// 加载动画
@keyframes loading-1 {
  0%,
  60%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(0.7);
    opacity: 0.7;
  }
}

@keyframes loading-2 {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  15%,
  45% {
    transform: scale(0.7);
    opacity: 0.7;
  }
}

@keyframes loading-3 {
  0%,
  30%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  60% {
    transform: scale(0.7);
    opacity: 0.7;
  }
}
</style>
