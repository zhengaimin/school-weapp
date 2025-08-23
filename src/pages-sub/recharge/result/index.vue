<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "充值成功"
  }
}
</route>

<script lang="ts" setup>
import type { ActionButton, RechargeResultInfo } from './data'
import { onMounted, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { usePage } from '@/hooks/usePage'
import {

  formatAmount,
  formatTime,
  getActionButtons,
  getRechargeResultInfo,

} from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 充值结果信息
const resultInfo = ref<RechargeResultInfo>()
// 操作按钮列表
const actionButtons = ref<ActionButton[]>(getActionButtons())

// 处理按钮点击
function handleButtonClick(button: ActionButton) {
  if (button.id === 'home') {
    uni.reLaunch({
      url: button.path,
    })
  }
  else {
    uni.navigateTo({
      url: button.path,
    })
  }
}

// 初始化页面数据
function initPageData() {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options as any

  // 获取充值结果信息
  resultInfo.value = getRechargeResultInfo({
    amount: options.amount,
    studentName: options.studentName,
    orderId: options.orderId,
  })
}

onMounted(() => {
  initPageData()
  pageLoading.value = false
})
</script>

<template>
  <Page
    title="充值成功"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view v-if="resultInfo" p="x-4 t-4 b-4">
      <!-- 成功提示 -->
      <view text="center" p="y-8">
        <view
          w="20"
          h="20"
          bg="accent-light opacity-20"
          border="rounded-full"
          flex="~ items-center justify-center"
          m="x-auto b-4"
        >
          <Icon name="check-line" color="#f57b32" size="64rpx" />
        </view>
        <view text="xl gray-900" font="medium" m="b-2">
          充值成功！
        </view>
        <view text="sm gray-600">
          您的账户已成功充值
        </view>
      </view>

      <!-- 充值详情 -->
      <WhiteCard custom-class="mb-6">
        <view text="base gray-900" font="medium" m="b-4">
          充值详情
        </view>
        <view space="y-3">
          <view flex="~ justify-between items-center">
            <text text="sm gray-600">
              学生姓名
            </text>
            <text text="sm gray-900" font="medium">
              {{ resultInfo.studentName }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm gray-600">
              充值金额
            </text>
            <text text="lg primary" font="bold">
              {{ formatAmount(resultInfo.amount) }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm gray-600">
              充值时间
            </text>
            <text text="sm gray-900" font="medium">
              {{ formatTime(resultInfo.time) }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm gray-600">
              支付方式
            </text>
            <text text="sm gray-900" font="medium">
              {{ resultInfo.paymentMethod }}
            </text>
          </view>
          <view flex="~ justify-between items-center">
            <text text="sm gray-600">
              交易状态
            </text>
            <text text="sm accent" font="medium">
              {{ resultInfo.status }}
            </text>
          </view>
        </view>
      </WhiteCard>

      <!-- 操作按钮 -->
      <view space="y-3">
        <TButton
          v-for="button in actionButtons"
          :key="button.id"
          :type="button.type"
          size="large"
          block
          @click="handleButtonClick(button)"
        >
          <Icon :name="button.icon" color="#ffffff" size="32rpx" />
          <text m="l-2">
            {{ button.title }}
          </text>
        </TButton>
      </view>
    </view>
  </Page>
</template>
