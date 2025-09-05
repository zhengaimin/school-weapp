<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue'

// 定义组件属性类型
interface Props {
  /** 数据列表 */
  items: any[]
  /** 预估的项目高度 */
  estimatedItemHeight?: number
  /** 视口外渲染的缓冲区项目数 */
  bufferSize?: number
  /** 自定义样式 */
  customStyle?: string | Record<string, any>
  /** 是否启用滚动监听 */
  enableScroll?: boolean
  /** 滚动事件节流时间（ms） */
  scrollThrottle?: number
}

// 定义事件类型
interface Emits {
  (e: 'scroll', detail: any): void
  (e: 'scrolltolower'): void
  (e: 'scrolltoupper'): void
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  estimatedItemHeight: 100,
  bufferSize: 5,
  customStyle: () => ({}),
  enableScroll: true,
  scrollThrottle: 50,
})

const emit = defineEmits<Emits>()

// 组件状态
const containerRef = ref<any>(null)
const scrollTop = ref(0)
const containerHeight = ref(0)
const itemHeights = ref<Map<number, number>>(new Map())
const lastScrollTime = ref(0)

// 计算可见区域的项目
const visibleItems = computed(() => {
  if (props.items.length === 0) return []

  const startIndex = Math.max(0, Math.floor(scrollTop.value / props.estimatedItemHeight) - props.bufferSize)
  const endIndex = Math.min(
    props.items.length - 1,
    Math.ceil((scrollTop.value + containerHeight.value) / props.estimatedItemHeight) + props.bufferSize
  )

  return props.items.slice(startIndex, endIndex + 1).map((item, index) => ({
    ...item,
    __virtualIndex: startIndex + index,
    __offset: calculateOffset(startIndex + index),
  }))
})

// 计算容器总高度
const totalHeight = computed(() => {
  let height = 0
  for (let i = 0; i < props.items.length; i++) {
    height += itemHeights.value.get(i) || props.estimatedItemHeight
  }
  return height
})

// 计算项目的偏移量
function calculateOffset(index: number): number {
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += itemHeights.value.get(i) || props.estimatedItemHeight
  }
  return offset
}

// 更新项目高度
function updateItemHeight(index: number, height: number) {
  if (itemHeights.value.get(index) !== height) {
    itemHeights.value.set(index, height)
  }
}

// 滚动事件处理（节流）
function handleScroll(e: any) {
  const now = Date.now()
  if (now - lastScrollTime.value < props.scrollThrottle) {
    return
  }
  lastScrollTime.value = now

  scrollTop.value = e.detail.scrollTop
  emit('scroll', e.detail)

  // 检查是否滚动到底部
  if (e.detail.scrollTop + containerHeight.value >= totalHeight.value - 10) {
    emit('scrolltolower')
  }

  // 检查是否滚动到顶部
  if (e.detail.scrollTop <= 10) {
    emit('scrolltoupper')
  }
}

// 滚动到指定位置
function scrollTo(position: number) {
  if (containerRef.value) {
    containerRef.value.scrollTo({
      top: position,
      animated: true,
    })
  }
}

// 滚动到指定项目
function scrollToItem(index: number) {
  if (index < 0 || index >= props.items.length) return
  
  const offset = calculateOffset(index)
  scrollTo(offset)
}

// 获取容器高度
function measureContainer() {
  if (containerRef.value) {
    const query = uni.createSelectorQuery().in(containerRef.value)
    query.select('.virtual-list-container').boundingClientRect((res: any) => {
      if (res) {
        containerHeight.value = res.height
      }
    }).exec()
  }
}

// 监听容器变化
onMounted(() => {
  nextTick(() => {
    measureContainer()
  })
})

// 监听items变化，重置高度缓存
watch(() => props.items, () => {
  // 保留部分高度缓存，避免完全重置
  const newHeights = new Map<number, number>()
  itemHeights.value.forEach((height, index) => {
    if (index < props.items.length) {
      newHeights.set(index, height)
    }
  })
  itemHeights.value = newHeights
  
  nextTick(() => {
    measureContainer()
  })
})

// 暴露方法给父组件
defineExpose({
  scrollTo,
  scrollToItem,
  updateItemHeight,
  measureContainer,
})
</script>

<template>
  <scroll-view
    ref="containerRef"
    class="virtual-list"
    :scroll-y="props.enableScroll"
    :style="props.customStyle"
    :scroll-top="scrollTop"
    @scroll="handleScroll"
  >
    <!-- 占位容器，设置总高度 -->
    <view
      class="virtual-list-container"
      :style="{ height: totalHeight + 'px', paddingBottom: '132rpx' }"
    >
      <!-- 渲染可见项目 -->
      <view
        v-for="item in visibleItems"
        :key="item.__virtualIndex"
        class="virtual-item"
        :style="{ transform: `translateY(${item.__offset}px)` }"
      >
        <slot :item="item" :index="item.__virtualIndex" :update-height="(height: number) => updateItemHeight(item.__virtualIndex, height)" />
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.virtual-list {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.virtual-list-container {
  position: relative;
  width: 100%;
}

.virtual-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
}
</style>