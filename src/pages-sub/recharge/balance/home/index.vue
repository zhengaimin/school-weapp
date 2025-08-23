<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "账户充值"
  }
}
</route>

<script lang="ts" setup>
import type { RechargeAccountInfo, RechargeAmountOption } from './data'
import { onMounted, ref } from 'vue'

import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { RECHARGE_BALANCE_HISTORY_PATH, RECHARGE_RESULT_PATH } from '@/constant/router'

import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useMessage, useToast } from '@/uni_modules/wot-design-uni'

import {
  callWechatPay,
  getRechargeAccountInfo,
  getRechargeAmountOptions,
  submitRechargeRequest,
} from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const message = useMessage()
const toast = useToast()
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 表单相关
const { formRef, validate, resetValidate } = useForm()

// 充值账户信息
const accountInfo = ref<RechargeAccountInfo>(getRechargeAccountInfo())
// 充值金额选项
const amountOptions = ref<RechargeAmountOption[]>(getRechargeAmountOptions())
// 当前选中的金额
const currentAmount = ref(0)
// 表单数据
const formData = ref({
  customAmount: '',
})
// 提交状态
const submitting = ref(false)

// 表单校验规则
const rules = {
  customAmount: [
    {
      required: false,
      message: '请输入有效的充值金额',
      validator: (value: string) => {
        if (!value)
          return true

        // 检查格式
        if (!/^[1-9]\d*(?:\.\d{1,2})?$/.test(value)) {
          return Promise.reject(new Error('请输入有效的金额格式'))
        }

        // 检查范围
        const num = Number(value)
        if (num < 1 || num > 10000) {
          return Promise.reject(new Error('充值金额应在1-10000元之间'))
        }

        return Promise.resolve()
      },
    },
  ],
}

// 选择预设金额
function selectAmount(amount: number) {
  // 清空自定义金额
  formData.value.customAmount = ''
  resetValidate()
  // 更新选中状态
  amountOptions.value.forEach((option) => {
    option.selected = option.value === amount
  })
  currentAmount.value = amount
}

// 更新自定义金额
function updateCustomAmount() {
  if (formData.value.customAmount && !Number.isNaN(Number(formData.value.customAmount))) {
    // 清除预设金额选中状态
    amountOptions.value.forEach((option) => {
      option.selected = false
    })
    currentAmount.value = Number.parseFloat(formData.value.customAmount)
  }
  else {
    currentAmount.value = 0
  }
}

// 确认充值
async function confirmRecharge() {
  // 如果有自定义金额，先校验表单
  if (formData.value.customAmount) {
    try {
      const result = await validate(['customAmount'])
      if (!result.valid) {
        return
      }
    }
    catch (error) {
      return
    }
  }

  if (currentAmount.value <= 0) {
    toast.show('请选择充值金额')
    return
  }

  try {
    message
      .confirm({
        title: '确认充值',
        msg: `确认为${accountInfo.value.name}充值¥${currentAmount.value}？`,
      })
      .then(async () => {
        submitting.value = true

        // 调用微信支付
        toast.loading('正在调用微信支付...')
        const amountToPay = Number(currentAmount.value.toFixed(2))
        const paySuccess = await callWechatPay(amountToPay)

        if (paySuccess) {
          // 提交充值申请
          const rechargeInfo = await submitRechargeRequest(accountInfo.value.id, amountToPay)

          uni.hideLoading()

          // 跳转到充值成功页面
          uni.navigateTo({
            url: `${RECHARGE_RESULT_PATH}?amount=${amountToPay}&studentName=${accountInfo.value.name}&orderId=${rechargeInfo.orderId}`,
          })
        }
      })
  }
  catch (error) {
    toast.close()
    toast.show('充值失败，请重试')
  }
  finally {
    submitting.value = false
  }
}

// 跳转到充值记录
function goToRechargeHistory() {
  uni.navigateTo({
    url: `${RECHARGE_BALANCE_HISTORY_PATH}?studentId=${accountInfo.value.id}`,
  })
}

onMounted(() => {
  pageLoading.value = false
})
</script>

<template>
  <Page
    title="余额充值"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #header-right>
      <view flex="~ row items-center justify-center" h-full gap="4">
        <Icon
          name="history-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="goToRechargeHistory"
        />
      </view>
    </template>

    <!-- 内容区域 -->
    <view p="x-4 t-2 b-4">
      <!-- 当前学生信息 -->
      <WhiteCard flex="~ row" m="b-4">
        <RoleAvatar custom-class="mr-3" size="small" />
        <view flex="1 col" gap-1>
          <view flex="~ items-center justify-between">
            <view text="sm text-primary" font="medium">
              {{ accountInfo.name }}
            </view>
            <view text="xs text-secondary">
              当前余额
            </view>
          </view>
          <view flex="~ items-center justify-between">
            <view text="xs text-secondary">
              {{ accountInfo.school }} · {{ accountInfo.grade }}
            </view>
            <view text="sm primary" font="medium">
              {{ accountInfo.currentBalance }}
            </view>
          </view>
        </view>
      </WhiteCard>

      <!-- 充值金额选择 -->
      <WhiteCard bg="white" border="~ bg-muted solid rounded-lg" p="4" m="b-4">
        <view text="sm text-primary" font="medium" m="b-3">
          选择充值金额
        </view>
        <view grid="~ cols-3" gap="3" m="b-4">
          <view
            v-for="option in amountOptions"
            :key="option.value"
            flex="~ items-center justify-center"
            p="3"
            border="~ solid rounded-md"
            :class="option.selected ? 'border-primary bg-primary bg-opacity-5' : 'border-bg-muted'"
            transition-colors
            @click="selectAmount(option.value)"
          >
            <text text="sm" :class="option.selected ? 'text-primary' : 'text-primary'">
              {{ option.label }}
            </text>
          </view>
        </view>

        <!-- 自定义金额表单 -->
        <wd-form ref="formRef" :model="formData" :rules="rules">
          <Cell p="x-0!" label="自定义金额" label-position="top">
            <wd-input
              v-model="formData.customAmount"
              type="number"
              placeholder="请输入充值金额"
              @input="updateCustomAmount"
              @clear="updateCustomAmount"
            />
          </Cell>
        </wd-form>
      </WhiteCard>

      <!-- 确认充值按钮 -->
      <TButton
        :type="currentAmount > 0 ? 'primary' : 'default'"
        size="large"
        block
        :disabled="currentAmount <= 0 || submitting"
        :loading="submitting"
        @click="confirmRecharge"
      >
        {{ currentAmount > 0 ? `确认充值 ¥${currentAmount}` : '确认充值' }}
      </TButton>
    </view>
  </Page>
</template>
