<script setup lang="ts">
import type { ChildInfo } from '../data'

import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useAppStore } from '@/store/app'

// 属性定义
interface Props {
  /** 学生列表 */
  children?: ChildInfo[]
  /** 当前选中的学生ID */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  children: () => [],
  id: '',
})
// 事件定义
const emit = defineEmits<{
  selected: [childId: string, child: ChildInfo]
}>()

const { navBarInfo } = storeToRefs(useAppStore())

const show = ref(false)

const top = computed(() => {
  // 64rpx -> 字体高度 | 16rpx -> 导航栏到字体的间距
  return `calc(${navBarInfo.value.navBarHeight}px + 64rpx + 16rpx)`
})

// 选择学生
function selectChild(childId: string) {
  const selectedChild = props.children.find(child => child.id === childId)
  if (selectedChild) {
    emit('selected', childId, selectedChild)
  }

  setTimeout(() => {
    show.value = false
  }, 300)
}
// 关闭选择器
function onClose() {
  show.value = false
}

function acceptParams() {
  show.value = true
}

defineExpose({
  acceptParams,
})
</script>

<template>
  <!-- 遮罩层 -->
  <view v-if="show" fixed inset="0" z="30" bg="black opacity-50" @click="onClose" />

  <!-- 学生选择下拉列表 -->
  <view
    v-if="show"
    absolute
    right="6"
    z="40"
    w="300px"
    border="~ gray-200 solid rounded-xl"
    bg="white"
    shadow="lg"
    :style="{ top }"
  >
    <view p="4" space="y-3">
      <view
        v-for="child in props.children"
        :key="child.id"
        flex="~ items-center justify-between"
        p="3"
        border="~ gray-200 solid rounded-md"
        transition="colors"
        cursor="pointer"
        :class="id === child.id ? 'border-primary bg-primary bg-opacity-5' : ''"
        @click="selectChild(child.id)"
      >
        <!-- 学生信息区域 -->
        <view flex="~ items-center">
          <!-- 单选圆圈 -->
          <view
            w="4"
            h="4"
            border="~ solid rounded-full"
            m="r-3"
            flex="~ items-center justify-center"
            :class="id === child.id ? 'border-primary bg-primary' : 'border-gray-300'"
          >
            <view
              v-if="id === child.id"
              w="2"
              h="2"
              bg="white"
              border="rounded-full"
            />
          </view>

          <!-- 学生信息 -->
          <view>
            <view text="sm gray-900" font="medium">
              {{ child.name }}
            </view>
            <view text="xs gray-500" m="t-1">
              {{ child.school }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
