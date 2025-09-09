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
// #region 导入
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
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import {
  NAVIGATION_SUFFIX_COLOR,
  NAVIGATION_SUFFIX_SIZE,
  REFUND_TYPE,
  REFUND_TYPE_OPTIONS,
} from '@/constant/modules'
import { REFUND_HISTORY_PATH, REFUND_RESULT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'
import { refundNotices, refundProcessSteps, refundRules } from './data'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight }
  = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView }
  = useForm('.apply-scroll')
const message = useMessage()
const { axiosGetUserBalanceApi } = useBalance()
const { onRefundSuccess } = useRefundEmitter()
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const { currentStudent } = storeToRefs(userStore)
const { balanceInfo } = storeToRefs(parentStore)
// #endregion

// #region 定义响应式数据
// 待审核的退款申请信息
const pendingRefundInfo = ref<Refund.Application.ResGetPendingApi | null>(null)
// 退费说明弹框
const showRefundInfoPopup = ref(false)
// 表单数据
const formData = ref({
  refundType: REFUND_TYPE.FULL,
  reason: '',
})
// #endregion

// #region 定义计算属性
// 当前可用余额
const availableBalance = computed(() => +balanceInfo.value?.availableBalance || 0)
const availableBalanceText = computed(() => `¥${Number(availableBalance.value).toFixed(2)}`)
const refundTypeOptions = computed(() => {
  return REFUND_TYPE_OPTIONS.map(option => ({
    ...option,
    suffix: availableBalanceText.value,
  }))
})
// 是否存在待处理的退款申请
const hasPendingRefund = computed(() => !!pendingRefundInfo.value?.hasPending)

// 是否余额不足
const hasInsufficientBalance = computed(() => Number(availableBalance.value) <= 0)

// 是否可以提交申请
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
// #endregion

// #region 定义验证规则
const rules = {
  refundType: [{ required: true, message: '请选择退费金额' }],
  reason: [
    { required: true, message: '请输入退费原因', trigger: 'blur' },
    { min: 5, max: 200, message: '退费原因应为5-200个字符', trigger: 'blur' },
  ],
}
// #endregion

// #region 接口请求函数
async function axiosGetPendingRefundApi() {
  try {
    const result = await getPendingRefundApi()
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
// #endregion

// #region 方法定义
async function refresh() {
  console.log('expose: 退款历史页面刷新方法')
  batchRequestHandler([axiosGetPendingRefundApi()])
}
// #endregion

// #region 事件处理函数
// 显示退费说明弹框
function showRefundInfo() {
  showRefundInfoPopup.value = true
}
// 跳转到退费记录页面
function goToRefundHistory() {
  uni.navigateTo({
    url: REFUND_HISTORY_PATH,
  })
}

// 取消待处理的退款申请
function handleCancelPendingRefund() {
  if (!pendingRefundInfo.value?.applicationId) {
    toast.show('未找到待处理的退款申请')
    return
  }
  uni.navigateTo({
    url: `${REFUND_RESULT_PATH}?id=${pendingRefundInfo.value.applicationId}`,
  })
}

// 提交退费申请
async function handleSubmitRefund() {
  try {
    const { valid } = await validate(['refundType', 'reason'])
    if (!valid) {
      scrollToFirstError()
      return
    }
    submitLoading.value = true
    const { reason, refundType } = unref(formData)
    // 构建提交数据，匹配API接口要求
    const submissionData = {
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

      // 跳转到结果页
      if (
        pendingResult.code === 0
        && 'data' in pendingResult
        && pendingResult?.data?.applicationId
      ) {
        uni.navigateTo({
          url: `${REFUND_RESULT_PATH}?id=${pendingResult.data.applicationId}`,
        })
      }
    }
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
// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}

// 监听退款成功事件
const unsubscribeRefund = onRefundSuccess((data) => {
  console.log('监听到退款成功事件:', data)
  // 刷新余额和退款状态
  batchRequestHandler([axiosGetPendingRefundApi(), axiosGetUserBalanceApi()])
})

// 组件卸载时取消监听
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
// #endregion
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
                  {{ currentStudent?.studentName || '未选择学生' }}
                </view>
                <view text="xs text-secondary">
                  当前余额
                </view>
              </view>
              <view flex="~ items-center justify-between">
                <view text="xs text-secondary">
                  {{ currentStudent?.fullClassName }}
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

    <view p="4">
      <!-- 提交申请按钮 -->
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
