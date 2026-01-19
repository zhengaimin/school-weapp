<script setup lang="ts">
import type { Overview } from '@/api/interface/modules/overview'
import { computed, ref, watch } from 'vue'
import Icon from '@/components/icon/index.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = defineProps<{
  students: Overview.IStudentVo[]
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', id: number): void
  (e: 'popup-change', visible: boolean): void
}>()

/** 是否显示下拉菜单 */
const showDropdown = ref(false)

/** 监听下拉菜单显示状态变化 */
watch(showDropdown, (visible) => {
  emit('popup-change', visible)
})

/** 当前选中的学生 */
const currentStudent = computed(() => {
  if (!props.students.length) return null
  if (props.modelValue == null) return props.students[0]
  return props.students.find(s => s.id === props.modelValue) || props.students[0]
})

/** 切换下拉菜单 */
function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

/** 选择学生 */
function selectStudent(id: number) {
  emit('update:modelValue', id)
  showDropdown.value = false
}
</script>

<template>
  <view v-if="currentStudent" relative>
    <!-- 选择器按钮 -->
    <view
      bg="white/90"
      rounded-2xl
      p-4
      shadow-sm
      backdrop-blur
      border="~ white/40 solid"
      @click="toggleDropdown"
    >
      <view flex="~ items-center" gap-3>
        <view
          h-12
          w-12
          rounded-full
          bg="blue-50"
          flex="~ items-center justify-center"
          text="primary xl"
          font-bold
          border="~ blue-100/50 solid"
          shadow-sm
        >
          <image
            v-if="currentStudent.avatar"
            :src="currentStudent.avatar"
            mode="aspectFill"
            class="h-full w-full rounded-full"
          />
          <Icon v-else name="user-5-line" icon-color="#3269dd" icon-size="44rpx" />
        </view>
        <view flex="~ col 1">
          <text block text="base gray-900" font-bold leading-tight>
            {{ currentStudent.name }}
          </text>
          <text text="xs gray-500" mt-0.5 block>
            {{ currentStudent.schoolName }} · {{ currentStudent.grade }}
            {{ currentStudent.className }}
          </text>
        </view>
        <view :class="showDropdown ? 'rotate-180' : ''" class="transition-transform duration-300">
          <Icon name="arrow-down-s-line" icon-color="#9ca3af" icon-size="40rpx" />
        </view>
      </view>
    </view>

    <!-- 下拉菜单 -->
    <view
      v-if="showDropdown"

      bg="white"

      border="~ gray-100 solid"
      absolute left-0 right-0 mt-2 overflow-hidden rounded-xl shadow-lg
      style="z-index: 50"
    >
      <scroll-view scroll-y class="max-h-64">
        <view
          v-for="student in students"
          :key="student.id"
          flex="~ items-center"
          gap-3
          p-3
          :class="modelValue === student.id ? 'bg-blue-50' : ''"
          active:bg="gray-50"
          @click="selectStudent(student.id)"
        >
          <view
            h-10
            w-10
            rounded-full
            bg="blue-50"
            flex="~ items-center justify-center"
            text="primary base"
            font-bold
            border="~ blue-100/50 solid"
          >
            <image
              v-if="student.avatar"
              :src="student.avatar"
              mode="aspectFill"
              class="h-full w-full rounded-full"
            />
            <Icon v-else name="user-5-line" icon-color="#3269dd" icon-size="36rpx" />
          </view>
          <view flex-1 text-left>
            <view text="sm gray-900" font-bold>
              {{ student.name }}
            </view>
            <view text="xs gray-500">
              {{ student.grade }}{{ student.className }}
            </view>
          </view>
          <Icon
            v-if="modelValue === student.id"
            name="check-line"
            icon-color="#3269dd"
            icon-size="36rpx"
          />
        </view>
      </scroll-view>
    </view>
  </view>
</template>
