<script lang="ts" setup>
import type { FabAction } from './types'
import { computed, ref } from 'vue'
import Icon from '@/components/icon/index.vue'
import { useAppStore } from '@/store/app'

// 定义组件选项
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = withDefaults(
  defineProps<{
    actions: FabAction[]
    icon?: string
    iconColor?: string
    iconSize?: string
    draggable?: boolean
    zIndex?: number
    bottom?: number // 下边距，rpx单位
  }>(),
  {
    icon: 'history-line',
    iconColor: 'white',
    iconSize: '34rpx',
    draggable: true,
    zIndex: 100,
    bottom: 32,
  },
)

// 计算属性
const fabActive = ref(false)
const appStore = useAppStore()

// 计算是否显示操作列表
const showActions = computed(() => {
  return props.actions?.length > 1
})

// 计算gap值
const computedGap = computed(() => {
  const menuHeight = appStore.navBarInfo?.menuHeight || 32
  const bottomGapPx = props.bottom ? uni.upx2px(props.bottom) : 8

  return {
    top: menuHeight + 8, // 上边距使用menuHeight + 8px
    right: 8,
    bottom: bottomGapPx, // 下边距使用用户传入的值（转换为px）
  }
})

// 处理触发按钮点击
function handleTriggerClick() {
  if (props.actions?.length === 1) {
    // 如果只有一个操作，直接跳转
    handleActionClick(props.actions[0])
  }
  else {
    // 如果有多个操作，显示/隐藏操作列表
    fabActive.value = !fabActive.value
  }
}

// 处理操作点击
function handleActionClick(action: FabAction) {
  fabActive.value = false
  uni.navigateTo({
    url: action.path,
  })
}
</script>

<template>
  <wd-fab
    v-model:active="fabActive"
    position="right-center"
    :draggable="draggable"
    :gap="computedGap"
    :z-index="zIndex"
    direction="bottom"
  >
    <template #trigger>
      <view
        flex="~ items-center justify-center"
        w="12"
        h="12"
        bg="primary"
        rounded="full"
        shadow="md"
        @click="handleTriggerClick"
      >
        <Icon :name="icon" :icon-color="iconColor" :icon-size="iconSize" />
      </view>
    </template>

    <view v-if="showActions" flex="~" gap="2">
      <view
        v-for="(action, index) in actions"
        :key="index"
        flex="~ items-center justify-center"
        w="10"
        h="10"
        bg="primary"
        rounded-full
        @click="handleActionClick(action)"
      >
        <text whitespace-nowrap text="xs" color="white">
          {{ action.text }}
        </text>
      </view>
    </view>
  </wd-fab>
</template>
