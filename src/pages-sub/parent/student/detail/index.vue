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
import { usePage } from '@/hooks/usePage'
import { useUserStore } from '@/store/user'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginFail } = usePage()

// 使用 parent store
const userStore = useUserStore()
const { currentStudent } = storeToRefs(userStore)

const faceStatusText = computed(() => {
  if (!currentStudent.value)
    return ''
  return currentStudent.value.faceStatus === 1 ? '已录入' : '未录入'
})
// 复制文本到剪贴板
function copyToClipboard(text: string, label: string) {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: `${label}已复制`,
        icon: 'success',
      })
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'none',
      })
    },
  })
}

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
        <view flex="~ items-center" gap="6">
          <RoleAvatar type="student" size="large" />
          <view flex="1" space="y-2">
            <view text="xl gray-900" font="bold">
              {{ currentStudent.studentName }}
            </view>
            <view text="sm gray-500">
              {{ currentStudent.grade }}·{{ currentStudent.className }}
            </view>
          </view>
        </view>
      </WhiteCard>

      <!-- 学生详细信息 -->
      <WhiteCard custom-class="p-0!">
        <!-- 学校 -->
        <view flex="~ items-center justify-between" p="4" border-b="1 gray-100 solid">
          <text text="sm gray-600">
            学校
          </text>
          <text text="sm gray-900" font="medium">
            {{ currentStudent.schoolName }}
          </text>
        </view>

        <!-- 部门 -->
        <view flex="~ items-center justify-between" p="4" border-b="1 gray-100 solid">
          <text text="sm gray-600">
            级部
          </text>
          <text text="sm gray-900" font="medium">
            {{ currentStudent.departmentName }}
          </text>
        </view>

        <!-- 年级 -->
        <view flex="~ items-center justify-between" p="4" border-b="1 gray-100 solid">
          <text text="sm gray-600">
            年级
          </text>
          <text text="sm gray-900" font="medium">
            {{ currentStudent.grade }}
          </text>
        </view>

        <!-- 班级 -->
        <view flex="~ items-center justify-between" p="4" border-b="1 gray-100 solid">
          <text text="sm gray-600">
            班级
          </text>
          <text text="sm gray-900" font="medium">
            {{ currentStudent.className }}
          </text>
        </view>

        <!-- 学号 -->
        <view
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
          @click="copyToClipboard(currentStudent.studentCode, '学号')"
        >
          <text text="sm gray-600">
            学号
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ currentStudent.studentCode }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>

        <!-- 卡号 -->
        <view
          v-if="currentStudent.cardNumber"
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
          @click="copyToClipboard(currentStudent.cardNumber, '卡号')"
        >
          <text text="sm gray-600">
            卡号
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ currentStudent.cardNumber }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>

        <!-- 身份证 -->
        <view
          v-if="currentStudent.idCard"
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
          @click="copyToClipboard(currentStudent.idCard, '身份证')"
        >
          <text text="sm gray-600">
            身份证
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ currentStudent.idCard }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>

        <!-- 性别 -->
        <view
          v-if="currentStudent.gender"
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
        >
          <text text="sm gray-600">
            性别
          </text>
          <text text="sm gray-900" font="medium">
            {{ currentStudent.gender }}
          </text>
        </view>

        <!-- 人脸状态 -->
        <view flex="~ items-center justify-between" p="4" border-b="1 gray-100 solid">
          <text text="sm gray-600">
            人脸状态
          </text>
          <text text="sm gray-900" font="medium">
            {{ faceStatusText }}
          </text>
        </view>
      </WhiteCard>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
