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
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getPaymentConfigApi, getPendingBalancePaymentApi } from '@/api/modules/payment'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import InputNumber from '@/components/form/input-number/index.vue'
import { PAYMENT_METHOD } from '@/constant/modules'
import { BALANCE_RECHARGE_HISTORY_PATH, BALANCE_RECHARGE_RESULT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useSchoolModules } from '@/hooks/useSchoolModules'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight }
  = usePage()
const { formRef, validate, resetValidate } = useForm()
const { axiosPostRechargeApi, rechargeLoading } = usePayment()
const { axiosGetUserBalanceApi } = useBalance()
const { hasSelectRechargeAmountModules, hasInputRechargeAmountModules } = useSchoolModules()

const userStore = useUserStore()
const currentStudentStore = useCurrentStudentStore()
const { studentInfo, balanceInfo, deviceType } = storeToRefs(currentStudentStore)

/** 是否存在待支付订单 */
const hasPendingOrder = ref(false)
/** 待支付订单信息 */
const pendingOrderInfo = ref<Payment.Order.Pending.ResGetPendingApi | null>(null)
/** 充值金额选项 */
const amountOptions = ref<{ value: number, label: string, selected: boolean }[]>([])
/** 当前选中的金额 */
const currentAmount = ref(0)
/** 表单数据 */
const formData = ref<{
  customAmount: string | number
}>({
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

const rules = {
  customAmount: [{ required: false, message: '请输入有效的充值金额' }],
}

/** 检查待支付订单 */
async function axiosCheckPendingOrderApi() {
  try {
    const result = await getPendingBalancePaymentApi({ deviceType: deviceType.value })

    if (result.code === 0) {
      const { hasPending } = result.data
      hasPendingOrder.value = hasPending
      pendingOrderInfo.value = hasPending ? result.data : null
    }
    return result
  }
  catch (error) {
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

      // 更新充值金额选项
      if (fixedAmounts) {
        amountOptions.value = fixedAmounts
          .split(',')
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
      }
      else {
        amountOptions.value = []
      }
    }
    return result
  }
  catch (error) {
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
    }
    catch (error) {
      return
    }
  }

  if (currentAmount.value <= 0) {
    toast.show('请选择充值金额')
    return
  }

  const amountToPay = Number(currentAmount.value.toFixed(2))
  const paymentMethod = PAYMENT_METHOD.WECHAT

  await axiosPostRechargeApi(amountToPay, paymentMethod, deviceType.value, {
    async onSuccess(data) {
      const { orderNo, id } = data
      clearAmount()
      uni.navigateTo({
        url: `${BALANCE_RECHARGE_RESULT_PATH}?orderId=${id}&orderNo=${orderNo}`,
      })
    },
    async onFinally() {
      clearAmount()

      batchRequestHandler([axiosCheckPendingOrderApi(), axiosGetUserBalanceApi()])
    },
  })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  clearAmount()
  await batchRequestHandler([axiosGetPaymentConfigApi(), axiosCheckPendingOrderApi()])
}

onShow(() => {
  if (unref(pageLoaded)) {
    clearAmount()
    batchRequestHandler([axiosCheckPendingOrderApi(), axiosGetUserBalanceApi()])
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
                {{ studentInfo?.className }}
              </view>
              <view text="sm primary" font="medium">
                ￥{{ balanceInfo?.availableBalanceFormatted }}
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 充值选项 -->
        <WhiteCard v-if="showRechargeModules" :disabled="hasPendingOrder">
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
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
          :disabled="currentAmount <= 0 || hasPendingOrder"
          :loading="rechargeLoading"
          @click="handleConfirmRecharge"
        >
          {{ currentAmount > 0 ? `确认充值 ¥${currentAmount}` : '确认充值' }}
        </TButton>
      </view>
    </view>
  </Page>
</template>
