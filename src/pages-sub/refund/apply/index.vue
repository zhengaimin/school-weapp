<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "申请退费"
  }
}
</route>

<script lang="ts" setup>
import type { ChildBalanceInfo, RefundApplicationForm, RefundReason } from './data'

import { computed, onMounted, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import Radio from '@/components/form/radio/index.vue'
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'

import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { REFUND_HISTORY_PATH } from '@/constant/router'

import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'

import {
  getChildBalanceInfo,
  getRefundReasonOptions,
  refundNotices,
  refundProcessSteps,
  refundRules,
  submitRefundApplication,
} from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView }
  = useForm('.apply-scroll')

// 直接获取学生信息，不再需要列表选择
const studentInfo = ref<ChildBalanceInfo>(getChildBalanceInfo('xiaoming')!)
// 退费原因选项
const refundReasons = ref<RefundReason[]>(getRefundReasonOptions())

const refundReasonOptions = computed(() =>
  refundReasons.value.map(reason => ({
    value: reason.value,
    label: reason.label,
  })),
)

// 新增：创建只有一个“全额退款”选项的 Radio
const refundTypeOptions = computed(() => [
  {
    value: 'all',
    label: '全额退款',
    suffix: studentInfo.value.balanceText,
  },
])

// 退费说明弹框显示状态
const showRefundInfoPopup = ref(false)

// 表单数据，移除 childId，固定 refundType 为 'all'
const formData = ref<Partial<RefundApplicationForm>>({
  reason: 'graduate',
  contactName: '',
  contactPhone: '',
  refundType: 'all',
})

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

// 更新验证规则，移除 childId 和 partialAmount
const rules = {
  reason: [{ required: true, message: '请选择退费原因' }],
  otherReason: [{ required: true, message: '请输入其他退费原因' }],
  contactName: [
    { required: true, message: '请输入联系人姓名' },
    { required: true, min: 2, message: '联系人姓名至少2个字符' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话' },
    {
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
    },
  ],
}

// 退费原因选择变化处理
function onRefundReasonChange(value: string | number) {
  formData.value.reason = value as 'graduate' | 'unused' | 'other'
  // 如果不是其他原因，清空其他原因文本
  if (value !== 'other') {
    formData.value.otherReason = undefined
  }
}

// 显示退费说明
function showRefundInfo() {
  showRefundInfoPopup.value = true
}

// 跳转到退费记录
function goToRefundHistory() {
  uni.navigateTo({
    url: REFUND_HISTORY_PATH,
  })
}

// 简化提交逻辑
async function handleSubmitRefund() {
  try {
    const fieldsToValidate = ['reason', 'contactName', 'contactPhone']

    if (formData.value.reason === 'other') {
      fieldsToValidate.push('otherReason')
    }

    const { valid } = await validate(fieldsToValidate)
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true

    const submissionData = {
      ...formData.value,
      childId: studentInfo.value.id, // 提交时附带学生ID
    }

    const result = await submitRefundApplication(submissionData as RefundApplicationForm)

    uni.showToast({
      title: `退费申请已提交！\n退费金额：¥${result.refundAmount.toFixed(2)}\n我们将在3-5个工作日内处理您的申请。`,
      icon: 'success',
      duration: 3000,
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 3000)
  }
  catch (error) {
    console.error('提交退费申请失败:', error)
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  pageLoading.value = false
})
</script>

<template>
  <Page
    title="申请退费"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #header-right>
      <view flex="~ row items-center justify-center" h-full gap="4">
        <Icon
          name="information-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="showRefundInfo"
        />
        <Icon
          name="history-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="goToRefundHistory"
        />
      </view>
    </template>

    <!-- 内容区域 -->
    <scroll-view
      class="apply-scroll"
      scroll-y
      :enhanced="true"
      :show-scrollbar="false"
      :scroll-with-animation="true"
      :scroll-into-view="scrollIntoView"
      :style="contentHeight"
    >
      <view box-border p="x-4 t-2 b-4">
        <!-- 学生信息卡片 -->
        <WhiteCard flex="~ row" m="b-4">
          <RoleAvatar custom-class="mr-3" size="small" />
          <view flex="1 col" gap-1>
            <view flex="~ items-center justify-between">
              <view text="sm text-primary" font="medium">
                {{ studentInfo.name }}
              </view>
              <view text="xs text-secondary">
                当前余额
              </view>
            </view>
            <view flex="~ items-center justify-between">
              <view text="xs text-secondary">
                {{ studentInfo.school }} · {{ studentInfo.grade }}
              </view>
              <view text="sm primary" font="medium">
                {{ studentInfo.balanceText }}
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 退费申请表单 -->
        <WhiteCard>
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
              <!-- 退费金额 -->
              <Cell required label="退费金额" prop="refundType">
                <Radio v-model="formData.refundType" :options="refundTypeOptions" />
              </Cell>

              <!-- 退费原因 -->
              <Cell id="reason" required label="退费原因" prop="reason">
                <Radio
                  v-model="formData.reason"
                  :options="refundReasonOptions"
                  :columns="2"
                  @change="onRefundReasonChange"
                />

                <!-- 其他原因输入 -->
                <view v-if="formData.reason === 'other'" m="t-3">
                  <wd-textarea
                    v-model="formData.otherReason"
                    prop="otherReason"
                    placeholder="请详细说明退费原因"
                    :maxlength="200"
                  />
                </view>
              </Cell>

              <!-- 联系人姓名 -->
              <Cell id="contactName" required label="联系人姓名" prop="contactName">
                <wd-input v-model="formData.contactName" placeholder="请输入联系人姓名" />
              </Cell>

              <!-- 联系电话 -->
              <Cell id="contactPhone" required label="联系电话" prop="contactPhone">
                <wd-input v-model="formData.contactPhone" type="tel" placeholder="请输入联系电话" />
              </Cell>
            </view>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <view p="4">
      <!-- 提交申请按钮 -->
      <TButton
        type="primary"
        size="large"
        block
        :loading="submitLoading"
        @click="handleSubmitRefund"
      >
        提交退费申请
      </TButton>
    </view>

    <!-- 退费说明弹框 -->
    <BottomPopup v-model="showRefundInfoPopup" title="退费说明" height="auto">
      <view p="4 b-6" text-sm color-text-secondary space-y-4>
        <!-- 退费流程 -->
        <view>
          <view text="base" font="medium" m="b-2" color-text-primary>
            退费流程
          </view>
          <view space-y-2>
            <view v-for="(item, index) in refundProcessSteps" :key="index" flex="~">
              <text mr-2>
                {{ index + 1 }}.
              </text>
              <text flex-1>
                {{ item }}
              </text>
            </view>
          </view>
        </view>

        <!-- 退费规则 -->
        <view>
          <view text="base" font="medium" m="b-2" color-text-primary>
            退费规则
          </view>
          <view space-y-2>
            <view v-for="(item, index) in refundRules" :key="index" flex="~">
              <text mr-2>
                •
              </text>
              <text flex-1>
                {{ item }}
              </text>
            </view>
          </view>
        </view>

        <!-- 注意事项 -->
        <view>
          <view text="base" font="medium" m="b-2" color-text-primary>
            注意事项
          </view>
          <view space-y-2>
            <view v-for="(item, index) in refundNotices" :key="index" flex="~">
              <text mr-2 color-red-500>
                •
              </text>
              <text flex-1 color-red-600>
                {{ item }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </BottomPopup>
  </Page>
</template>
