<script setup lang="ts">
import type { ITabItem } from './useTab'

import { onMounted, watch } from 'vue'
import { useTab } from './useTab'

// 定义 emits
interface Emits {
  (e: 'change', index: number): void
}

const props = defineProps<{
  tabs: ITabItem[]
}>()

const emit = defineEmits<Emits>()

const scrollPosition = defineModel<number>('scrollPosition', { default: 0 })
const activeTab = defineModel<number>('activeTab', { default: 0 })

const { positionsInitialized, tabPositions, initTabPositions } = useTab()

// 切换分类
function switchTab(index: number) {
  activeTab.value = index
  emit('change', index)

  // 如果位置信息已初始化，直接滚动
  if (positionsInitialized.value) {
    scrollToLeftFast(index)
  }
}

// 快速滚动到选中的tab，使其位于最左侧
function scrollToLeftFast(index: number) {
  const targetTab = tabPositions.value[index]
  if (!targetTab) return

  scrollPosition.value = Math.max(0, targetTab.preLeft)
}

// 监听tabs变化，重新初始化位置信息
watch(
  () => props.tabs,
  () => {
    positionsInitialized.value = false
    tabPositions.value = []

    // 延迟初始化，确保DOM更新完成
    setTimeout(() => {
      initTabPositions(props.tabs)
    })
  },
  { deep: true },
)

// 组件挂载后初始化位置信息
onMounted(() => {
  // 延迟初始化，确保DOM渲染完成
  setTimeout(() => {
    initTabPositions(props.tabs)
  })
})
</script>

<template>
  <!-- 分类导航条 -->
  <view class="w-full overflow-hidden">
    <scroll-view
      class="tabs-scroll-view w-full"
      scroll-x
      :scroll-left="scrollPosition"
      scroll-with-animation
      :show-scrollbar="false"
      :enhanced="true"
    >
      <view class="box-border h-12 flex flex-row">
        <view
          v-for="(tab, index) in tabs"
          :id="`tab-${tab.value}`"
          :key="tab.value"
          class="tab-item flex-shrink-0 cursor-pointer px-3 py-3 text-center"
          :class="{ active: activeTab === index }"
          @click="switchTab(index)"
        >
          <text class="whitespace-nowrap text-sm">
            {{ tab.label }}
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.tab-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    font-weight: 600;
    color: #3269dd;
    transform: scale(1.05);
  }
}

.tabs-scroll-view {
  white-space: nowrap;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  /* 禁用原生滚动条 */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}
</style>
