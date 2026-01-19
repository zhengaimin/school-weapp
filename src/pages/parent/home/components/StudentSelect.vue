<script setup lang="ts">
import type { TDeviceType } from '@/constant/modules'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import Radio from '@/components/form/radio/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { DEVICE_TYPE, DEVICE_TYPE_OPTIONS } from '@/constant/modules'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

const emit = defineEmits<{
  change: [childId: number, deviceType: TDeviceType]
}>()

const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { currentStudent, students, studentsIdMap } = storeToRefs(parentStore)
const { deviceType } = storeToRefs(currentStudentStore)

const show = defineModel<boolean>('modelValue', { default: false })

// 表单数据
const formData = ref<{
  deviceType: TDeviceType
  studentId: number | null
}>({
  deviceType: DEVICE_TYPE.VIDEO,
  studentId: null,
})

// 选中学生的设备类型列表
const selectedStudentDeviceTypes = computed(() => {
  if (!formData.value.studentId) return []
  const student = studentsIdMap.value[formData.value.studentId]
  return student?.supportedDeviceTypes || []
})

// 过滤后的设备类型选项
const filteredDeviceTypeOptions = computed(() => {
  const types = selectedStudentDeviceTypes.value
  if (!types.length) return []
  return DEVICE_TYPE_OPTIONS.filter(opt => types.includes(opt.value))
})

// 是否显示设备类型选择器
const showDeviceTypeSelector = computed(() => {
  return formData.value.studentId && selectedStudentDeviceTypes.value.length > 1
})

// 学生选项（转换为 Radio 格式）
const studentOptions = computed(() => {
  return students.value.map(child => ({
    value: child.id,
    label: child.name,
    schoolName: child.schoolName,
    grade: child.grade,
    departmentName: child.departmentName,
    className: child.className,
  }))
})

// 监听弹窗显示，初始化选中状态
watch(show, (val) => {
  if (val) {
    formData.value.studentId = currentStudent.value?.id ?? null
  }
})

// 监听学生选择变化，自动设置设备类型
watch(() => formData.value.studentId, (studentId) => {
  if (!studentId) return

  const types = studentsIdMap.value[studentId]?.supportedDeviceTypes || []
  if (types.length === 1) {
    formData.value.deviceType = types[0] as TDeviceType
  }
  else if (types.length > 1) {
    formData.value.deviceType = types.includes(deviceType.value)
      ? deviceType.value
      : (types[0] as TDeviceType)
  }
  else {
    formData.value.deviceType = deviceType.value || DEVICE_TYPE.VIDEO
  }
})

// 生成完整班级名称
function getFullClassName(child: any) {
  const list = []
  if (child.grade) list.push(child.grade)
  if (child.departmentName) list.push(child.departmentName)
  if (child.className) list.push(child.className)
  return list.join(' · ')
}

// 确认选择
function handleConfirm() {
  if (!formData.value.studentId) return

  // 保存设备类型到 store
  currentStudentStore.setDeviceType(formData.value.deviceType)
  show.value = false
  emit('change', formData.value.studentId, formData.value.deviceType)
}

// 关闭选择器
function onClose() {
  show.value = false
}
</script>

<template>
  <BottomPopup
    v-model="show"
    title="选择服务对象"
    :show-close="true"
    max-height="60vh"
    @close="onClose"
  >
    <Form :model="formData">
      <view p="4" flex="~ col gap-3">
        <!-- 学生列表 -->
        <Cell id="studentId" label="选择学生" prop="studentId">
          <Radio v-model="formData.studentId" :options="studentOptions" :columns="0">
            <template #option="{ option }">
              <view flex="~ col 1" min-w="0">
                <view flex="~ row items-baseline" gap="1">
                  <text text="sm gray-900" font="medium">
                    {{ option.label }}
                  </text>
                  <text text="xs gray-500">
                    ({{ option.schoolName }})
                  </text>
                </view>
                <text text="xs gray-500" m="t-1">
                  {{ getFullClassName(option) }}
                </text>
              </view>
            </template>
          </Radio>
        </Cell>

        <!-- 设备类型选择 -->
        <Cell
          v-if="showDeviceTypeSelector"
          id="deviceType"
          label="设备类型"
          prop="deviceType"
        >
          <Radio v-model="formData.deviceType" :options="filteredDeviceTypeOptions" :columns="2" />
        </Cell>
      </view>
    </Form>

    <template #footer>
      <!-- 确认按钮 -->
      <view p="4" border="t gray-100 solid">
        <view
          w="full"
          p="y-3"
          border="rounded-full"
          bg="primary"
          text="center white sm"
          font="medium"
          :class="{ 'opacity-50': !formData.studentId }"
          @click="handleConfirm"
        >
          确认选择
        </view>
      </view>
    </template>
  </BottomPopup>
</template>
