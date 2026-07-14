<script setup lang="ts">
import type { IHomeStudent, IStudentDisplayInfo } from '../types'
import { computed, ref } from 'vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import Icon from '@/components/icon/index.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = defineProps<{
  students: IHomeStudent[]
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', id: number): void
  (e: 'popup-change', visible: boolean): void
}>()

/** 是否显示下拉菜单 */
const showDropdown = ref(false)

/** 当前选中的学生 */
const currentStudent = computed(() => {
  if (!props.students.length) return null
  if (props.modelValue == null) return props.students[0]
  return props.students.find(s => s.id === props.modelValue) || props.students[0]
})

/** 切换下拉菜单 */
function toggleDropdown() {
  const next = !showDropdown.value
  showDropdown.value = next
  emit('popup-change', next)
}

/** 选择学生 */
function selectStudent(id: number) {
  emit('update:modelValue', id)
  if (showDropdown.value) {
    showDropdown.value = false
    emit('popup-change', false)
  }
}

function getStudentFullInfo(student: IStudentDisplayInfo) {
  return [student.schoolName, student.grade, student.departmentName, student.className]
    .filter(Boolean)
    .join(' · ')
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
        <RoleAvatar
          type="student"
          size="medium"
          :path="currentStudent.avatar"
          :face-img="false"
          custom-class="border border-blue-100/50 shadow-sm"
        />
        <view flex="~ col 1">
          <text block text="base gray-900" font-bold leading-tight>
            {{ currentStudent.name }}
          </text>
          <text text="xs gray-500" mt-1 block>
            {{ getStudentFullInfo(currentStudent) }}
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
          <RoleAvatar
            type="student"
            size="small"
            :path="student.avatar"
            :face-img="false"
            custom-class="border border-blue-100/50"
          />
          <view flex-1 text-left>
            <view text="sm gray-900" font-bold>
              {{ student.name }}
            </view>
            <view text="xs gray-500" mt-0.5>
              {{ getStudentFullInfo(student) }}
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
