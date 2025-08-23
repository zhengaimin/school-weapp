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
import type { ChildDetailInfo } from './data'
import { onMounted, ref } from 'vue'

import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

import { usePage } from '@/hooks/usePage'

import { getChildDetailInfo } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 页面参数
const childId = ref('')
// 孩子详情信息
const childInfo = ref<ChildDetailInfo | null>(null)

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

// 初始化页面数据
function initPageData() {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage: any = pages[pages.length - 1]
  const options = currentPage.options as any

  childId.value = options.id || 'xiaoming'

  // 加载孩子详情
  const detail = getChildDetailInfo(childId.value)
  if (detail) {
    childInfo.value = detail
  }
  else {
    pageError.value = '未找到孩子信息'
  }
}

onMounted(() => {
  initPageData()
  pageLoading.value = false
})
</script>

<template>
  <Page
    title="学生信息"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view v-if="childInfo" flex="~ col" gap="4" p="4 t-2!">
      <!-- 学生头像和基本信息 -->
      <WhiteCard>
        <view flex="~ items-center" gap="6">
          <RoleAvatar type="student" size="large" />
          <view flex="1" space="y-2">
            <view text="xl gray-900" font="bold">
              {{ childInfo.name }}
            </view>
            <view text="sm gray-500">
              {{ childInfo.school }}·{{ childInfo.class }}
            </view>
          </view>
        </view>
      </WhiteCard>

      <!-- 学生详细信息 -->
      <WhiteCard custom-class="p-0!">
        <!-- 性别 -->
        <view flex="~ items-center justify-between" p="4" border-b="1 gray-100 solid">
          <text text="sm gray-600">
            性别
          </text>
          <text text="sm gray-900" font="medium">
            {{ childInfo.gender }}
          </text>
        </view>

        <!-- 学号 -->
        <view
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
          @click="copyToClipboard(childInfo.studentId, '学号')"
        >
          <text text="sm gray-600">
            学号
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ childInfo.studentId }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>

        <!-- 唯一号 -->
        <view
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
          @click="copyToClipboard(childInfo.uniqueId, '唯一号')"
        >
          <text text="sm gray-600">
            唯一号
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ childInfo.uniqueId }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>

        <!-- 消费账号 -->
        <view
          flex="~ items-center justify-between"
          p="4"
          border-b="1 gray-100 solid"
          @click="copyToClipboard(childInfo.consumptionAccount, '消费账号')"
        >
          <text text="sm gray-600">
            消费账号
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ childInfo.consumptionAccount }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>

        <!-- 物理卡号 -->
        <view
          flex="~ items-center justify-between"
          p="4"
          @click="copyToClipboard(childInfo.physicalCardNumber, '物理卡号')"
        >
          <text text="sm gray-600">
            物理卡号
          </text>
          <view flex="~ items-center" gap="2">
            <text text="sm gray-900" font="medium">
              {{ childInfo.physicalCardNumber }}
            </text>
            <Icon name="file-copy-line" icon-color="#9ca3af" icon-size="28rpx" />
          </view>
        </view>
      </WhiteCard>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
