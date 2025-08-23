<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "余额查询"
  }
}
</route>

<script lang="ts" setup>
import type { StudentBalanceInfo } from './data'
import { onMounted, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
import { getStudentBalanceInfo, refreshBalanceInfo } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared'
  }
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 学生余额信息
const balanceInfo = ref<StudentBalanceInfo>(getStudentBalanceInfo())
const refreshing = ref(false)

// 刷新余额信息
async function handleRefreshBalance() {
  refreshing.value = true
  try {
    const newData = await refreshBalanceInfo()
    balanceInfo.value = newData
  } catch (error) {
    console.error('刷新余额失败:', error)
  } finally {
    refreshing.value = false
  }
}

// 跳转到充值页面
function goToRecharge() {
  uni.navigateTo({
    url: `/pages-sub/parent/student/recharge/index?studentId=${balanceInfo.value.id}`
  })
}

// 跳转到消费记录页面
function goToConsumptionRecord() {
  uni.navigateTo({
    url: `/pages-sub/finance/consumption-record/index?studentId=${balanceInfo.value.id}`
  })
}

onMounted(() => {
  pageLoading.value = false
})
</script>

<template>
  <Page
    title="余额查询"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <view p="x-4 t-2 b-4">
      <!-- 当前孩子余额卡片 -->
      <view bg="white" border="~ bg-muted solid rounded-lg" p="6" m="b-4">
        <!-- 余额显示 -->
        <view text="center" p="y-6" bg="bg-secondary" border="rounded-lg" m="b-6">
          <view text="sm text-secondary" m="b-2">账户余额</view>
          <view text="4xl primary" font="bold" m="b-2">
            {{ balanceInfo.balance }}
          </view>
          <view text="xs text-muted">上次更新：{{ balanceInfo.lastUpdateTime }}</view>
        </view>

        <!-- 快速统计 -->
        <view grid="~ cols-3" gap="4">
          <view text="center">
            <view text="lg text-primary" font="medium">
              {{ balanceInfo.monthlyConsumptionCount }}
            </view>
            <view text="xs text-secondary">本月消费次数</view>
          </view>
          <view text="center">
            <view text="lg text-primary" font="medium">
              {{ balanceInfo.monthlyConsumptionAmount }}
            </view>
            <view text="xs text-secondary">本月消费金额</view>
          </view>
          <view text="center">
            <view text="lg text-primary" font="medium">
              {{ balanceInfo.lastRechargeDate }}
            </view>
            <view text="xs text-secondary">上次充值</view>
          </view>
        </view>
      </view>

      <!-- 账户详情 -->
      <view bg="white" border="~ bg-muted solid rounded-lg" p="4" m="b-4">
        <view text="base text-primary" font="medium" m="b-4">账户详情</view>
        <view space="y-4">
          <view flex="~ justify-between items-center">
            <text text="sm text-secondary">学生姓名</text>
            <text text="sm text-primary" font="medium">
              {{ balanceInfo.name }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm text-secondary">学号</text>
            <text text="sm text-primary" font="medium">
              {{ balanceInfo.studentId }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm text-secondary">班级</text>
            <text text="sm text-primary" font="medium">
              {{ balanceInfo.school }} · {{ balanceInfo.grade }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm text-secondary">账户状态</text>
            <text text="sm accent" font="medium">
              {{ balanceInfo.accountStatus }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm text-secondary">开户时间</text>
            <text text="sm text-primary" font="medium">
              {{ balanceInfo.openDate }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </Page>
</template>
