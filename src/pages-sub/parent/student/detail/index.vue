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

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginFail } = usePage()

const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { currentStudent } = storeToRefs(parentStore)
const { studentInfo } = storeToRefs(currentStudentStore)

interface StudentDetailItem {
  key: string
  label: string
  value: string
  copyable: boolean
}

/** 学生人脸状态文案 */
const faceStatusText = computed(() => {
  if (!studentInfo.value || studentInfo.value.faceStatus === null) return '未知'
  return FACE_STATUS_I18N[studentInfo.value.faceStatus] || '未知'
})

/** 追加学生信息条目 */
function pushStudentDetailItem(items: StudentDetailItem[], item: StudentDetailItem) {
  if (item.value) {
    items.push(item)
  }
}

/** 学生详细信息配置 */
const studentDetailItems = computed(() => {
  const items: StudentDetailItem[] = []
  const current = currentStudent.value
  const info = studentInfo.value

  pushStudentDetailItem(items, {
    key: 'school',
    label: '学校',
    value: current?.schoolName || '',
    copyable: false,
  })
  pushStudentDetailItem(items, {
    key: 'grade',
    label: '年级',
    value: info?.grade || current?.grade || '',
    copyable: false,
  })
  pushStudentDetailItem(items, {
    key: 'department',
    label: '级部',
    value: info?.departmentName || '',
    copyable: false,
  })
  pushStudentDetailItem(items, {
    key: 'class',
    label: '班级',
    value: info?.className || current?.className || '',
    copyable: false,
  })
  pushStudentDetailItem(items, {
    key: 'studentCode',
    label: '学号',
    value: info?.studentCode || '',
    copyable: true,
  })
  pushStudentDetailItem(items, {
    key: 'cardNumber',
    label: '卡号',
    value: info?.cardNumber || '',
    copyable: true,
  })
  pushStudentDetailItem(items, {
    key: 'idCard',
    label: '身份证',
    value: info?.idCard || '',
    copyable: true,
  })

  items.push(
    {
      key: 'UUID',
      label: '唯一号',
      value: info?.UUID || '',
      copyable: true,
    },
    {
      key: 'faceStatus',
      label: '人脸状态',
      value: faceStatusText.value,
      copyable: false,
    },
  )

  return items
})

/** 复制学生信息到剪贴板 */
function handleCopyStudentInfo(field: string, label: string) {
  if (studentInfo.value && studentInfo.value[field as keyof typeof studentInfo.value]) {
    const value = studentInfo.value[field as keyof typeof studentInfo.value]
    if (value) {
      copyToClipboard(String(value), label)
    }
  }
}

/** 登录成功处理 */
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
          <view flex="~ col 1" gap="2">
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
          <view
            v-for="item in studentDetailItems"
            :key="item.key"
            flex="~ justify-between items-start"
            gap="4"
          >
            <text shrink-0 text="sm">
              {{ item.label }}
            </text>

            <!-- 可复制字段 -->
            <view
              v-if="item.copyable"
              flex="~ items-center gap-2"
              cursor="pointer"
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
