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
import type { Payment } from '@/api/interface/modules/payment'
import type { TDeviceType } from '@/constant/modules'
import type { TBatchRequestList } from '@/hooks/usePage'

import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { computed, ref, unref, watch } from 'vue'
import { getPaymentConfigApi, getPendingBalancePaymentApi } from '@/api/modules/payment'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import InputNumber from '@/components/form/input-number/index.vue'
import Radio from '@/components/form/radio/index.vue'
import { DEVICE_TYPE, PAYMENT_METHOD } from '@/constant/modules'
import { BALANCE_RECHARGE_HISTORY_PATH, BALANCE_RECHARGE_RESULT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useSchoolModules } from '@/hooks/useSchoolModules'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, resetValidate } = useForm()
const { axiosPostRechargeApi, rechargeLoading } = usePayment()
const {
  axiosGetUserBalanceApi,
  getBalanceByDeviceType,
  dryerBalanceInfo,
  videoBalanceInfo,
} = useBalance()
const { supportedDeviceTypes, defaultDeviceType, deviceTypeRadioOptions } = useDeviceType()
const { hasSelectRechargeAmountModules, hasInputRechargeAmountModules } = useSchoolModules()

const currentStudentStore = useCurrentStudentStore()
const { studentInfo, studentFullInfo, devices } = storeToRefs(currentStudentStore)

/** 是否存在待支付订单 */
const hasPendingOrder = ref(false)
/** 待支付订单信息 */
const pendingOrderInfo = ref<Payment.Order.Pending.ResGetPendingApi | null>(null)
/** 充值金额选项 */
const amountOptions = ref<{ value: number, label: string, selected: boolean }[]>([])
/** 当前选中的金额 */
const currentAmount = ref(0)
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
const formData = ref<{
  deviceType?: TDeviceType
  customAmount: string | number
}>({
  deviceType: fallbackDeviceType.value,
  customAmount: '',
})
/** 支付配置信息 */
const paymentConfig = ref<Payment.Config.IPaymentConfig>({
  fixedAmounts: '',
  minAmount: null,
  maxAmount: null,
  defaultAmount: null,
})

/** 是否显示充值模块 */
const showRechargeModules = computed(
  () => hasSelectRechargeAmountModules.value || hasInputRechargeAmountModules.value,
)
/** 内容区域样式 */
const contentStyle = computed(() => getContentHeight('164rpx'))
/** 当前选中的设备类型 */
const selectedDeviceType = computed(() => formData.value.deviceType || fallbackDeviceType.value)
/** 当前展示的余额信息 */
const currentBalanceInfo = computed(() => {
  if (selectedDeviceType.value === DEVICE_TYPE.DRYER) {
    return dryerBalanceInfo.value
  }
  return videoBalanceInfo.value
})

/** 表单校验规则 */
const rules = {
  deviceType: [{ required: true, message: '请选择设备类型' }],
  customAmount: [{ required: false, message: '请输入有效的充值金额' }],
}

/** 设备类型选项 */
const deviceTypeOptions = computed(() => deviceTypeRadioOptions.value ?? [])
/** 是否禁用提交按钮 */
const submitDisabled = computed(
  () => !hasSupportedDeviceTypes.value || currentAmount.value <= 0 || hasPendingOrder.value,
)
/** 提交按钮文本 */
const submitText = computed(() => {
  if (!hasSupportedDeviceTypes.value) return '不支持支付'
  if (currentAmount.value > 0) return `确认充值 ¥${currentAmount.value}`
  return '确认充值'
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

/** 检查待支付订单 */
async function axiosCheckPendingOrderApi() {
  try {
    if (!selectedDeviceType.value) return { code: -1 }

    const result = await getPendingBalancePaymentApi({ deviceType: selectedDeviceType.value })

    if (result.code === 0) {
      const { hasPending } = result.data
      hasPendingOrder.value = hasPending
      pendingOrderInfo.value = hasPending ? result.data : null
    }
    return result
  } catch (error) {
    console.error('检查待支付订单失败:', error)
    throw error
  }
}
/** 获取支付配置 */
async function axiosGetPaymentConfigApi() {
  try {
    const result = await getPaymentConfigApi()
    if (result.code === 0) {
      paymentConfig.value = result.data
      const { fixedAmounts, minAmount, maxAmount } = result.data

      // 更新充值金额选项，兼容 "10,20" 与 "[10,20]" 两种格式
      if (fixedAmounts) {
        amountOptions.value = fixedAmounts
          .replace(/[[\]"'\s]/g, '')
          .split(',')
          .filter(amountStr => amountStr !== '')
          .map(amountStr => Number(amountStr))
          .filter(amount => !Number.isNaN(amount))
          .filter(
            amount =>
              (minAmount === null || amount >= minAmount)
              && (maxAmount === null || amount <= maxAmount),
          )
          .map(amount => ({
            value: amount,
            label: `${amount}元`,
            selected: false,
          }))
      } else {
        amountOptions.value = []
      }
    }
    return result
  } catch (error) {
    console.error('获取支付配置失败:', error)
    throw error
  }
}

/** 清空金额选择 */
function clearAmount() {
  // 清空预设金额选中状态
  amountOptions.value.forEach((option) => {
    option.selected = false
  })
  // 重置表单数据
  formData.value.customAmount = ''
  // 清空当前金额
  currentAmount.value = 0
  resetValidate()
}

/** 处理自定义金额变化 */
async function handleCustomAmountChange(event: { value: string | number }) {
  const { value } = event

  // 清空预设金额选中状态
  amountOptions.value.forEach((option) => {
    option.selected = false
  })

  // 更新当前金额
  let numValue = Number(value)

  // 如果输入为空或无效，设置为0
  if (value === '' || value === null || Number.isNaN(numValue)) {
    formData.value.customAmount = ''
    currentAmount.value = 0
    return
  }

  // 确保是整数
  numValue = Math.floor(numValue)

  // 检查最小值
  const { minAmount, maxAmount } = unref(paymentConfig)
  if (minAmount !== null && numValue < minAmount) {
    numValue = minAmount
  }

  // 检查最大值
  if (maxAmount !== null && numValue > maxAmount) {
    numValue = maxAmount
  }

  // 更新当前金额和表单数据
  formData.value.customAmount = numValue
  currentAmount.value = numValue
}
/** 点击待支付订单公告 */
function handlePendingOrderClick() {
  if (!pendingOrderInfo.value) {
    toast.show('订单信息不完整')
    return
  }

  uni.navigateTo({
    url: BALANCE_RECHARGE_HISTORY_PATH,
  })
}
/** 选择预设金额 */
function selectAmount(amount: number) {
  formData.value.customAmount = ''
  resetValidate()
  amountOptions.value.forEach((option) => {
    option.selected = option.value === amount
  })
  currentAmount.value = amount
}
/** 查看充值记录 */
function handleViewHistory() {
  uni.navigateTo({
    url: BALANCE_RECHARGE_HISTORY_PATH,
  })
}
/** 确认充值 */
async function handleConfirmRecharge() {
  if (!hasSupportedDeviceTypes.value) return
  if (hasPendingOrder.value) {
    toast.show('您有待支付的订单，请先处理')
    return
  }
  // 如果有自定义金额，先校验表单
  if (hasInputRechargeAmountModules.value && formData.value.customAmount) {
    try {
      const result = await validate(['customAmount'])
      if (!result.valid) {
        return
      }
    } catch (error) {
      return
    }
  }

  if (currentAmount.value <= 0) {
    toast.show('请选择充值金额')
    return
  }

  const amountToPay = Number(currentAmount.value.toFixed(2))
  const paymentMethod = PAYMENT_METHOD.WECHAT

  if (!selectedDeviceType.value) return

  await axiosPostRechargeApi(amountToPay, paymentMethod, selectedDeviceType.value, {
    async onSuccess(data) {
      const { orderNo, id } = data
      clearAmount()
      uni.navigateTo({
        url: `${BALANCE_RECHARGE_RESULT_PATH}?orderId=${id}&orderNo=${orderNo}`,
      })
    },
    async onFinally() {
      clearAmount()

      if (!selectedDeviceType.value) return
      batchRequestHandler([
        axiosCheckPendingOrderApi(),
        axiosGetUserBalanceApi(selectedDeviceType.value),
      ])
    },
  })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  clearAmount()
  const requests: TBatchRequestList = [axiosGetPaymentConfigApi()]
  if (hasSupportedDeviceTypes.value) {
    requests.push(axiosCheckPendingOrderApi())
    if (selectedDeviceType.value) {
      requests.push(axiosGetUserBalanceApi(selectedDeviceType.value))
    }
  }
  await batchRequestHandler(requests)
}

/** 处理设备类型切换 */
async function handleDeviceTypeChange(value: string | number) {
  if (!value) return
  clearAmount()
  await batchRequestHandler(
    [axiosCheckPendingOrderApi(), getBalanceByDeviceType(value as TDeviceType)],
    {
      auto: false,
    },
  )
}

/** 页面显示处理 */
onShow(() => {
  if (unref(pageLoaded)) {
    clearAmount()
    if (!hasSupportedDeviceTypes.value || !selectedDeviceType.value) return

    batchRequestHandler([
      axiosCheckPendingOrderApi(),
      axiosGetUserBalanceApi(selectedDeviceType.value),
    ])
  }
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
      <view flex="~ row items-center justify-center" h-full gap="4" @click.stop></view>
    </template>

    <!-- 内容区域 -->
    <scroll-view scroll-y :style="contentStyle">
      <view p="x-4 t-2 b-4" flex="~ col" gap="4">
        <!-- 待支付订单通知 -->
        <Notice
          v-if="hasPendingOrder"
          type="warning"
          title="待支付订单"
          :content="`您有一个待支付订单，金额¥${pendingOrderInfo?.amount}，点击查看详情。`"
          @click="handlePendingOrderClick"
        />

        <!-- 当前学生信息 -->
        <WhiteCard custom-class="flex flex-row" :disabled="hasPendingOrder">
          <RoleAvatar custom-class="mr-3" size="small" />
          <view flex="1 col" gap-1>
            <view flex="~ items-center justify-between">
              <view text="sm text-primary" font="medium">
                {{ studentInfo?.studentName }}
              </view>
              <view text="xs text-secondary">
                当前余额
              </view>
            </view>
            <view flex="~ items-center justify-between">
              <view text="xs text-secondary">
                {{ studentFullInfo }}
              </view>
              <view text="sm primary" font="medium">
                ￥{{
                  currentBalanceInfo?.availableBalanceFormatted
                    || (currentBalanceInfo?.availableBalance ?? '--')
                }}
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 充值选项 -->
        <WhiteCard v-if="showRechargeModules" :disabled="hasPendingOrder">
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

              <!-- 充值金额选择 -->
              <view v-if="hasSelectRechargeAmountModules">
                <view text="sm text-primary" font="medium" m="b-3">
                  选择充值金额
                </view>
                <view grid="~ cols-3" gap="3">
                  <view
                    v-for="option in amountOptions"
                    :key="option.value"
                    flex="~ items-center justify-center"
                    p="3"
                    border="~ solid rounded-md"
                    :class="
                      option.selected ? 'border-primary bg-primary bg-opacity-5' : 'border-bg-muted'
                    "
                    transition-colors
                    @click="selectAmount(option.value)"
                  >
                    <text text="sm" :class="option.selected ? 'text-primary' : 'text-primary'">
                      {{ option.label }}
                    </text>
                  </view>
                </view>
              </view>

              <!-- 自定义金额 -->
              <Cell
                v-if="hasInputRechargeAmountModules"
                id="customAmount"
                prop="customAmount"
                label="自定义金额"
                label-position="top"
              >
                <InputNumber
                  v-model="formData.customAmount"
                  placeholder="请输入充值金额"
                  allow-null
                  :min="paymentConfig.minAmount"
                  :max="paymentConfig.maxAmount"
                  @change="handleCustomAmountChange"
                />
              </Cell>
            </view>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <view v-if="showRechargeModules" p="4" flex="~ row" gap="3">
      <!-- 充值记录按钮 -->
      <view w="1/3">
        <TButton type="default" size="large" full @click="handleViewHistory">
          充值记录
        </TButton>
      </view>
      <!-- 确认充值按钮 -->
      <view w="2/3">
        <TButton
          :type="currentAmount > 0 ? 'primary' : 'default'"
          size="large"
          full
          :disabled="submitDisabled"
          :loading="rechargeLoading"
          @click="handleConfirmRecharge"
        >
          {{ submitText }}
        </TButton>
      </view>
    </view>
  </Page>
</template>
