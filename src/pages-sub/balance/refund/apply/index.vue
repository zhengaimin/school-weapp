<!-- 学生余额退款申请页面 -->
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
import type { TDeviceType } from '@/constant/modules'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, ref, unref, watch } from 'vue'
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
import CustomerService from '@/components/popup/customer-service/index.vue'
import { DEVICE_TYPE, REFUND_TYPE, REFUND_TYPE_OPTIONS } from '@/constant/modules'
import { BALANCE_REFUND_HISTORY_PATH, BALANCE_REFUND_RESULT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useDeviceType } from '@/hooks/useDeviceType'
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

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView } = useForm('.apply-scroll')
const message = useMessage()
const {
  axiosGetUserBalanceApi,
  getBalanceByDeviceType,
  dryerBalanceInfo,
  videoBalanceInfo,
} = useBalance()
const { supportedDeviceTypes, defaultDeviceType, deviceTypeRadioOptions } = useDeviceType()
const { onRefundSuccess } = useRefundEmitter()

const currentStudentStore = useCurrentStudentStore()
const { studentInfo, studentFullInfo, devices } = storeToRefs(currentStudentStore)
const { userInfo } = storeToRefs(useUserStore())

/** 待处理退款信息 */
const pendingRefundInfo = ref<Refund.Application.ResGetPendingApi | null>(null)
/** 是否展示余额异常客服弹框 */
const showBalanceCustomerService = ref(false)
/** 优先使用的设备类型 */
const primaryDeviceType = computed<TDeviceType>(() => {
  return devices.value?.[0]?.deviceType || defaultDeviceType.value
})
/** 设备类型兜底选项 */
const fallbackDeviceType = computed<TDeviceType | undefined>(() => {
  if (supportedDeviceTypes.value.length === 0) return undefined
  if (supportedDeviceTypes.value.length === 1) {
    return supportedDeviceTypes.value[0] as TDeviceType
  }

  const candidate = primaryDeviceType.value
  if (supportedDeviceTypes.value.includes(candidate)) return candidate
  return supportedDeviceTypes.value[0] as TDeviceType
})
/** 是否有可用设备类型 */
const hasSupportedDeviceTypes = computed(() => supportedDeviceTypes.value.length > 0)
/** 是否展示设备类型选项 */
const showDeviceTypeOptions = computed(() => (deviceTypeRadioOptions.value?.length ?? 0) > 0)

/** 表单数据 */
const formData = ref({
  deviceType: fallbackDeviceType.value,
  refundType: REFUND_TYPE.FULL,
  reason: '',
})

/** 当前选中的设备类型 */
const selectedDeviceType = computed(() => formData.value.deviceType || fallbackDeviceType.value)

/** 当前展示的余额信息 */
const currentBalanceInfo = computed(() => {
  if (selectedDeviceType.value === DEVICE_TYPE.DRYER) {
    return dryerBalanceInfo?.value
  }
  return videoBalanceInfo?.value
})
/** 当前可用余额 */
const availableBalance = computed(() => +currentBalanceInfo.value?.availableBalance || 0)
/** 可用余额文案 */
const availableBalanceText = computed(() => `¥${Number(availableBalance.value).toFixed(2)}`)
/** 不可退赠费余额 */
const giftBalance = computed(() => +currentBalanceInfo.value?.giftBalance || 0)
/** 赠费余额文案 */
const giftBalanceText = computed(() => `¥${Number(giftBalance.value).toFixed(2)}`)
/** 可退现金余额 */
const refundableBalance = computed(() => Math.max(availableBalance.value - giftBalance.value, 0))
/** 可退余额文案 */
const refundableBalanceText = computed(() => `¥${refundableBalance.value.toFixed(2)}`)
/** 可用余额与可退余额是否不同 */
const hasRefundableBalanceDifference = computed(() => {
  return availableBalance.value.toFixed(2) !== refundableBalance.value.toFixed(2)
})
/** 全额退款金额文案 */
const fullRefundAmountText = computed(() => refundableBalanceText.value)
/** 顶部余额概览 */
const balanceSummaryItems = computed(() => [
  {
    label: '可用余额',
    value: availableBalanceText.value,
    warning: false,
  },
  {
    label: '赠费',
    value: giftBalanceText.value,
    warning: false,
  },
  {
    label: '可退余额',
    value: refundableBalanceText.value,
    highlight: true,
    warning: hasRefundableBalanceDifference.value,
  },
])
/** 退费金额选项 */
const refundTypeOptions = computed(() => {
  return REFUND_TYPE_OPTIONS.map((option) => {
    return {
      ...option,
      suffix: option.value === REFUND_TYPE.FULL ? fullRefundAmountText.value : undefined,
    }
  })
})
/** 是否存在待处理退款 */
const hasPendingRefund = computed(() => !!pendingRefundInfo.value?.hasPending)
/** 是否余额不足 */
const hasInsufficientBalance = computed(() => refundableBalance.value <= 0)
/** 是否禁止提交 */
const cannotSubmit = computed(
  () =>
    !hasSupportedDeviceTypes.value
    || hasPendingRefund.value
    || hasInsufficientBalance.value
    || !formData.value.deviceType
    || !formData.value.refundType
    || !formData.value.reason,
)
/** 内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

/** 设备类型选项 */
const deviceTypeOptions = computed(() => deviceTypeRadioOptions.value ?? [])
/** 提交按钮文案 */
const submitText = computed(() => {
  if (!hasSupportedDeviceTypes.value) return '不支持退款'
  return '提交退费申请'
})

watch(
  fallbackDeviceType,
  (value) => {
    if (!value) {
      formData.value.deviceType = undefined
      return
    }

    if (!formData.value.deviceType || !supportedDeviceTypes.value.includes(formData.value.deviceType)) {
      formData.value.deviceType = value
    }
  },
  { immediate: true },
)

const rules = {
  deviceType: [{ required: true, message: '请选择设备类型' }],
  refundType: [{ required: true, message: '请选择退费金额' }],
  reason: [
    { required: true, message: '请输入退费原因' },
    { min: 5, max: 200, message: '退费原因应为5-200个字符' },
  ],
}

/** 获取待处理退款信息 */
async function axiosGetPendingRefundApi() {
  try {
    if (!selectedDeviceType.value) return { code: -1 }

    const result = await getPendingRefundApi({
      deviceType: selectedDeviceType.value,
    })
    if (result.code === 0) {
      pendingRefundInfo.value = result.data
    }
    return result
  } catch (error) {
    console.error('获取待处理退款信息失败:', error)
    return { code: -1 }
  } finally {
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
    if (!hasSupportedDeviceTypes.value) return

    const { valid } = await validate(['deviceType', 'refundType', 'reason'])
    if (!valid) {
      scrollToFirstError()
      return
    }
    submitLoading.value = true
    const { reason, refundType, deviceType: submitDeviceType } = unref(formData)
    const submissionData = {
      deviceType: submitDeviceType,
      refundType,
      applyReason: reason,
    }
    const result = await postApplyRefundApi(submissionData)
    if (result.code === 0) {
      formData.value.reason = ''
      const refundResult = result.data

      const pendingResult = await axiosGetPendingRefundApi()
      if (selectedDeviceType.value) {
        await axiosGetUserBalanceApi(selectedDeviceType.value)
      }
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
  } catch (error) {
    console.error('提交退费申请失败:', error)
    toast.show('提交失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

/** 处理设备类型切换 */
async function handleDeviceTypeChange(value: string | number) {
  if (!value) return
  await batchRequestHandler([axiosGetPendingRefundApi(), getBalanceByDeviceType(value as TDeviceType)], {
    auto: false,
  })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  if (hasSupportedDeviceTypes.value) {
    const requests = [axiosGetPendingRefundApi()]
    if (selectedDeviceType.value) {
      requests.push(axiosGetUserBalanceApi(selectedDeviceType.value))
    }
    batchRequestHandler(requests)
  }
}

/** 监听退款成功事件 */
const unsubscribeRefund = onRefundSuccess((data) => {
  console.log('监听到退款成功事件:', data)
  if (selectedDeviceType.value) {
    batchRequestHandler([
      axiosGetPendingRefundApi(),
      getBalanceByDeviceType(selectedDeviceType.value),
    ])
  }
})

onUnmounted(() => {
  unsubscribeRefund()
})

onShow(() => {
  if (unref(pageLoaded)) {
    if (!hasSupportedDeviceTypes.value || !selectedDeviceType.value) return

    batchRequestHandler([
      axiosGetPendingRefundApi(),
      axiosGetUserBalanceApi(selectedDeviceType.value),
    ])
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
            :title="`您的可用余额为${availableBalanceText}，赠费${giftBalanceText}不可退款，当前无可退余额。`"
            type="warning"
            :clickable="false"
            :show-popup="false"
          />
        </template>

        <!-- 学生信息卡片 -->
        <WhiteCard>
          <view flex="~ row" items-start>
            <RoleAvatar custom-class="mr-3" size="small" />
            <view flex="1 col" gap-1>
              <view text="sm text-primary" font="medium">
                {{ studentInfo?.studentName || '未选择学生' }}
              </view>
              <view text="xs text-secondary">
                {{ studentFullInfo }}
              </view>
            </view>
          </view>
        </WhiteCard>

        <WhiteCard>
          <view flex="~ row items-stretch">
            <template v-for="(item, index) in balanceSummaryItems" :key="item.label">
              <view flex="1 ~ col items-center justify-center" gap="1" p="x-1.5">
                <view flex="~ items-center" gap="0.5">
                  <text text="xs">
                    {{ item.label }}
                  </text>
                  <view
                    v-if="item.warning"
                    flex="~ items-center justify-center"
                    h-5
                    w-5
                    @click.stop="showBalanceCustomerService = true"
                  >
                    <Icon name="error-warning-line" icon-color="#f59e0b" icon-size="28rpx" />
                  </view>
                </view>
                <text text="xs" font="medium">
                  {{ item.value }}
                </text>
              </view>
              <view
                v-if="index < balanceSummaryItems.length - 1"
                w="1px"
                bg="gray-100"
                rounded="full"
                m="y-1.5"
              />
            </template>
          </view>
        </WhiteCard>

        <!-- 退费申请表单 -->
        <WhiteCard>
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
              <!-- 设备类型 -->
              <Cell v-if="showDeviceTypeOptions" id="deviceType" required label="设备类型" prop="deviceType">
                <Radio
                  v-model="formData.deviceType"
                  :options="deviceTypeOptions"
                  :columns="2"
                  @change="handleDeviceTypeChange"
                />
              </Cell>

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
          {{ submitText }}
        </TButton>
      </view>
    </view>
    <CustomerService
      v-if="hasRefundableBalanceDifference"
      v-model="showBalanceCustomerService"
      title=""
      :phone="userInfo?.customerServicePhone || ''"
      message="余额异常，请联系客服退款"
    />
  </Page>
</template>
