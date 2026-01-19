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
import type { Refund } from '@/api/interface/modules/refund'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, ref, unref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getPendingRefundApi, postApplyRefundApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import Radio from '@/components/form/radio/index.vue'
import { REFUND_TYPE, REFUND_TYPE_OPTIONS } from '@/constant/modules'
import { BALANCE_REFUND_HISTORY_PATH, BALANCE_REFUND_RESULT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight }
  = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView }
  = useForm('.apply-scroll')
const message = useMessage()
const { axiosGetUserBalanceApi } = useBalance()
const { onRefundSuccess } = useRefundEmitter()

const userStore = useUserStore()
const currentStudentStore = useCurrentStudentStore()
const { studentInfo, balanceInfo, deviceType } = storeToRefs(currentStudentStore)

const pendingRefundInfo = ref<Refund.Application.ResGetPendingApi | null>(null)
const formData = ref({
  refundType: REFUND_TYPE.FULL,
  reason: '',
})

const availableBalance = computed(() => +balanceInfo.value?.availableBalance || 0)
const availableBalanceText = computed(() => `¥${Number(availableBalance.value).toFixed(2)}`)
const refundTypeOptions = computed(() => {
  return REFUND_TYPE_OPTIONS.map(option => ({
    ...option,
    suffix: availableBalanceText.value,
  }))
})
const hasPendingRefund = computed(() => !!pendingRefundInfo.value?.hasPending)
const hasInsufficientBalance = computed(() => Number(availableBalance.value) <= 0)
const cannotSubmit = computed(
  () =>
    hasPendingRefund.value
    || hasInsufficientBalance.value
    || !formData.value.refundType
    || !formData.value.reason,
)
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

const rules = {
  refundType: [{ required: true, message: '请选择退费金额' }],
  reason: [
    { required: true, message: '请输入退费原因' },
    { min: 5, max: 200, message: '退费原因应为5-200个字符' },
  ],
}

/** 获取待处理退款信息 */
async function axiosGetPendingRefundApi() {
  try {
    const result = await getPendingRefundApi({
      deviceType: deviceType.value,
    })
    if (result.code === 0) {
      pendingRefundInfo.value = result.data
    }
    return result
  }
  catch (error) {
    console.error('获取待处理退款信息失败:', error)
    return { code: -1 }
  }
  finally {
    pageLoading.value = false
  }
}

/** 刷新页面数据 */
async function refresh() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}

/** 取消待处理的退款申请 */
function handleCancelPendingRefund() {
  if (!pendingRefundInfo.value?.applicationId) {
    toast.show('未找到待处理的退款申请')
    return
  }
  uni.navigateTo({
    url: `${BALANCE_REFUND_RESULT_PATH}?id=${pendingRefundInfo.value.applicationId}`,
  })
}

/** 查看历史记录 */
function handleViewHistory() {
  uni.navigateTo({
    url: BALANCE_REFUND_HISTORY_PATH,
  })
}

/** 提交退费申请 */
async function handleSubmitRefund() {
  try {
    const { valid } = await validate(['refundType', 'reason'])
    if (!valid) {
      scrollToFirstError()
      return
    }
    submitLoading.value = true
    const { reason, refundType } = unref(formData)
    const submissionData = {
      deviceType: deviceType.value,
      refundType,
      applyReason: reason,
    }
    const result = await postApplyRefundApi(submissionData)
    if (result.code === 0) {
      formData.value.reason = ''
      const refundResult = result.data

      const pendingResult = await axiosGetPendingRefundApi()
      await axiosGetUserBalanceApi()
      submitLoading.value = false

      await message.alert({
        title: '退费申请已提交',
        msg: `申请金额：¥${refundResult.applyAmount}\n我们将在3-5个工作日内处理您的申请。`,
        confirmButtonText: '查看详情',
        closeOnClickModal: false,
      })

      if (
        pendingResult.code === 0
        && 'data' in pendingResult
        && pendingResult?.data?.applicationId
      ) {
        uni.navigateTo({
          url: `${BALANCE_REFUND_RESULT_PATH}?id=${pendingResult.data.applicationId}`,
        })
      }
    }
  }
  catch (error) {
    console.error('提交退费申请失败:', error)
    toast.show('提交失败，请重试')
  }
  finally {
    submitLoading.value = false
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}

const unsubscribeRefund = onRefundSuccess((data) => {
  console.log('监听到退款成功事件:', data)
  batchRequestHandler([axiosGetPendingRefundApi(), axiosGetUserBalanceApi()])
})

onUnmounted(() => {
  unsubscribeRefund()
})

onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([axiosGetPendingRefundApi(), axiosGetUserBalanceApi()])
  }
})

defineExpose({
  refresh,
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
      <view flex="~ col" gap="4" box-border p="x-4 t-2 b-4">
        <template v-if="hasInsufficientBalance || hasPendingRefund">
          <!-- 待处理退款申请公告 -->
          <Notice
            v-if="hasPendingRefund"
            title="您当前存在正在处理中的退款申请，暂时无法发起新的退款操作，点击可取消申请。"
            type="warning"
            :show-popup="false"
            @click="handleCancelPendingRefund"
          />
          <!-- 余额不足公告 -->
          <Notice
            v-else-if="hasInsufficientBalance"
            :title="`您的账户余额为¥${availableBalance.toFixed(2)}，暂时无法发起退款申请。`"
            type="warning"
            :clickable="false"
            :show-popup="false"
          />
        </template>

        <!-- 学生信息卡片 -->
        <WhiteCard>
          <view flex="~ row">
            <RoleAvatar custom-class="mr-3" size="small" />
            <view flex="1 col" gap-1>
              <view flex="~ items-center justify-between">
                <view text="sm text-primary" font="medium">
                  {{ studentInfo?.studentName || '未选择学生' }}
                </view>
                <view text="xs text-secondary">
                  当前余额
                </view>
              </view>
              <view flex="~ items-center justify-between">
                <view text="xs text-secondary">
                  {{ studentInfo?.className }}
                </view>
                <view text="sm primary" font="medium">
                  {{ availableBalanceText }}
                </view>
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 退费申请表单 -->
        <WhiteCard>
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
              <!-- 退费金额 -->
              <Cell id="refundType" required label="退费金额" prop="refundType">
                <Radio v-model="formData.refundType" :options="refundTypeOptions" />
              </Cell>

              <!-- 退费原因 -->
              <Cell id="reason" required label="退费原因" prop="reason">
                <wd-textarea
                  v-model="formData.reason"
                  :show-confirm-bar="false"
                  placeholder="请输入退费原因"
                  :maxlength="200"
                />
              </Cell>
            </view>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <view p="4" flex="~ row" gap="3">
      <!-- 历史记录按钮 -->
      <view w="1/3">
        <TButton type="default" size="large" full @click="handleViewHistory">
          历史记录
        </TButton>
      </view>
      <!-- 提交申请按钮 -->
      <view w="2/3">
        <TButton
          type="primary"
          size="large"
          full
          :disabled="cannotSubmit"
          :loading="submitLoading"
          @click="handleSubmitRefund"
        >
          提交退费申请
        </TButton>
      </view>
    </view>
  </Page>
</template>
