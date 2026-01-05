<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "学生信息"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { FACE_STATUS_I18N } from '@/constant/modules/business'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { copyToClipboard } from '@/utils/clipboard'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, onLoginFail } = usePage()
// #endregion

// #region 使用 Store
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { currentStudent } = storeToRefs(parentStore)
const { studentInfo } = storeToRefs(currentStudentStore)
// #endregion

// #region 定义计算属性
const faceStatusText = computed(() => {
  if (!studentInfo.value || studentInfo.value.faceStatus === null)
    return '未知'
  return FACE_STATUS_I18N[studentInfo.value.faceStatus] || '未知'
})

// 学生详细信息配置
const studentDetailItems = computed(() => [
  {
    key: 'school',
    label: '学校',
    value: currentStudent.value?.schoolName || '',
    copyable: false,
  },
  ...(currentStudent.value?.grade
    ? [
        {
          key: 'grade',
          label: '年级',
          value: currentStudent.value.grade,
          copyable: false,
        },
      ]
    : []),
  ...(currentStudent.value?.departmentName
    ? [
        {
          key: 'department',
          label: '级部',
          value: currentStudent.value.departmentName,
          copyable: false,
        },
      ]
    : []),
  ...(currentStudent.value?.className
    ? [
        {
          key: 'class',
          label: '班级',
          value: currentStudent.value.className,
          copyable: false,
        },
      ]
    : []),
  ...(studentInfo.value?.studentCode
    ? [
        {
          key: 'studentCode',
          label: '学号',
          value: studentInfo.value.studentCode,
          copyable: true,
        },
      ]
    : []),
  ...(studentInfo.value?.cardNumber
    ? [
        {
          key: 'cardNumber',
          label: '卡号',
          value: studentInfo.value.cardNumber,
          copyable: true,
        },
      ]
    : []),
  ...(studentInfo.value?.idCard
    ? [
        {
          key: 'idCard',
          label: '身份证',
          value: studentInfo.value.idCard,
          copyable: true,
        },
      ]
    : []),
  {
    key: 'UUID',
    label: '唯一号',
    value: studentInfo.value?.UUID || '',
    copyable: true,
  },
  {
    key: 'faceStatus',
    label: '人脸状态',
    value: faceStatusText.value,
    copyable: false,
  },
])
// #endregion
// #endregion

// #region 事件处理函数
/**
 * 复制学生信息到剪贴板
 * @param field 字段名，如 'studentCode', 'cardNumber' 等
 * @param label 显示标签，如 '学号', '卡号' 等
 */
function handleCopyStudentInfo(field: string, label: string) {
  if (studentInfo.value && studentInfo.value[field as keyof typeof studentInfo.value]) {
    const value = studentInfo.value[field as keyof typeof studentInfo.value]
    if (value) {
      copyToClipboard(String(value), label)
    }
  }
}
// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
  if (unref(currentStudent)) {
    pageLoading.value = false
    pageError.value = ''
  }
  else {
    pageLoading.value = false
    pageError.value = '网络异常，请稍后重试'
  }
}
// #endregion
</script>

<template>
  <Page
    title="学生信息"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view v-if="currentStudent" flex="~ col" gap="4" p="4 t-2!">
      <!-- 学生头像和基本信息 -->
      <WhiteCard>
        <view flex="~ items-center" gap="4">
          <RoleAvatar type="student" size="large" />
          <view flex="1" space="y-2">
            <view text="xl gray-900" font="bold">
              {{ studentInfo?.studentName }}
            </view>
            <view text="sm gray-500">
              {{ currentStudent?.fullClassName }}
            </view>
          </view>
        </view>
      </WhiteCard>

      <!-- 学生详细信息 -->
      <WhiteCard custom-class="py-4!">
        <view flex="~ col" gap="4">
          <view v-for="item in studentDetailItems" :key="item.key" flex="~ justify-between items-start" gap="4">
            <text shrink-0 text="sm">
              {{ item.label }}
            </text>

            <!-- 可复制字段 -->
            <view
              v-if="item.copyable" flex="~ items-center gap-2" cursor="pointer"
              @click="handleCopyStudentInfo(item.key, item.label)"
            >
              <text text="sm gray-900 right break-all" font-medium>
                {{ item.value }}
              </text>
              <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
            </view>

            <!-- 不可复制字段 -->
            <text v-else break-all text="sm gray-900 right" font-medium>
              {{ item.value }}
            </text>
          </view>
        </view>
      </WhiteCard>
    </view>
  </Page>
</template>
