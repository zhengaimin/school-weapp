<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useAppStore } from '@/store/app'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'

const emit = defineEmits<{
  change: [childId: number]
}>()
const { navBarInfo } = storeToRefs(useAppStore())
const userStore = useUserStore()
const parentStore = useParentStore()
const { currentStudent } = storeToRefs(userStore)
const { students } = storeToRefs(parentStore)

const show = defineModel<boolean>('modelValue', { default: false })
const top = computed(() => {
  // 64rpx -> 字体高度 | 16rpx -> 导航栏到字体的间距
  return `calc(${navBarInfo.value.navBarHeight}px + 64rpx + 16rpx)`
})

// 选择学生
function selectChild(childId: number) {
  emit('change', childId)

  setTimeout(() => {
    show.value = false
  }, 300)
}
// 关闭选择器
function onClose() {
  show.value = false
}
</script>

<template>
  <!-- 遮罩层 -->
  <wd-overlay v-model:show="show" :z-index="30" @click="onClose">
    <!-- 学生选择下拉列表 -->
    <view
      v-if="show"
      absolute
      right="6"
      z="40"
      w="300px"
      border="~ gray-200 solid rounded-xl"
      bg="white"
      :style="{ top }"
    >
      <view p="4" space="y-3">
        <view
          v-for="child in students"
          :key="child.id"
          flex="~ items-center justify-between"
          p="3"
          border="~ gray-200 solid rounded-md"
          transition="colors"
          cursor="pointer"
          :class="
            currentStudent.studentId === child.id ? 'border-primary bg-primary bg-opacity-5' : ''
          "
          @click="selectChild(child.id)"
        >
          <!-- 学生信息区域 -->
          <view flex="~ items-center" w-full>
            <!-- 单选圆圈 -->
            <view
              w="4"
              h="4"
              border="~ solid rounded-full"
              m="r-3"
              flex="~ items-center justify-center"
              :class="
                currentStudent.studentId === child.id
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              "
            >
              <view
                v-if="currentStudent.studentId === child.id"
                w="2"
                h="2"
                bg="white"
                border="rounded-full"
              />
            </view>

            <!-- 学生信息 -->
            <view flex="~ col 1">
              <view flex="~ row items-baseline" w-full gap="1">
                <view text="sm gray-900" font="medium">
                  {{ child.name }}
                </view>
                <text text="xs gray-500">
                  ({{ child.schoolName }})
                </text>
              </view>

              <view text="xs gray-500" m="t-1">
                {{ child.grade }}·{{ child.className }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </wd-overlay>
</template>
