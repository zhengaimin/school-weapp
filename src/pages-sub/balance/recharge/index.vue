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
// #region 导入
import type { RechargeAmountOption } from './data'
import type { Payment } from '@/api/interface/modules/payment'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, unref } from 'vue'
import { getPaymentLimitsApi, getPendingPaymentApi } from '@/api/modules/payment'
import TButton from '@/components/common/button/index.vue'
import FabActions from '@/components/common/fab-actions/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import { PAYMENT_METHOD } from '@/constant/modules'
import { BALANCE_RECHARGE_HISTORY_PATH, BALANCE_RECHARGE_RESULT_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { usePayment } from '@/pages-sub/balance/hooks/usePayment'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'
import { useBalanceEmitter } from '@/utils/emit/balance'
import { toast } from '@/utils/toast'
import { getRechargeAmountOptions } from './data'
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
const { formRef, validate, resetValidate } = useForm()
const { axiosPostRechargeApi, rechargeLoading } = usePayment()
const { axiosGetUserBalanceApi } = useBalance()
const { onRechargeSuccess } = useBalanceEmitter()
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const { balanceInfo } = storeToRefs(parentStore)
const { currentStudent } = storeToRefs(userStore)
// #endregion

// #region 定义响应式数据
// 模拟存在待支付订单
const hasPendingOrder = ref(false)
const pendingOrderInfo = ref<Payment.Order.Pending.ResGetPendingApi | null>(null)
// 充值金额选项
const amountOptions = ref<RechargeAmountOption[]>(getRechargeAmountOptions())
// 当前选中的金额
const currentAmount = ref(0)
// 表单数据
const formData = ref({
  customAmount: '',
})
// 支付限制信息
const paymentLimits = ref({
  minAmount: 0,
  maxAmount: 10000,
  message: '',
})
// #endregion

// #region 定义计算属性
const contentStyle = computed(() => getContentHeight('164rpx'))
// Fab 操作按钮列表
const fabActions = [
  {
    text: '充值记录',
    path: BALANCE_RECHARGE_HISTORY_PATH,
    icon: 'history-line',
    iconColor: '#606266',
    iconSize: '24rpx',
  },
]
// #endregion

// #region 定义验证规则
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
        if (num < paymentLimits.value.minAmount || num > paymentLimits.value.maxAmount) {
          return Promise.reject(new Error(paymentLimits.value.message))
        }

        return Promise.resolve()
      },
    },
  ],
}
// #endregion

// #region 接口请求函数
// 检查待支付订单
async function axiosCheckPendingOrderApi() {
  try {
    const result = await getPendingPaymentApi()
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

// 获取支付金额限制
async function axiosGetPaymentLimitsApi() {
  try {
    const result = await getPaymentLimitsApi()
    if (result.code === 0) {
      // 处理支付限制数据，更新支付限制状态
      paymentLimits.value = {
        minAmount: Number(result.data.minAmount),
        maxAmount: Number(result.data.maxAmount),
        message: result.data.message,
      }

      // 根据支付限制筛选充值金额选项
      filterAmountOptions()
    }
    return result
  }
  catch (error) {
    console.error('获取支付金额限制失败:', error)
    throw error
  }
}
// #endregion

// #region 方法定义
// 根据支付限制筛选充值金额选项
function filterAmountOptions() {
  const min = paymentLimits.value.minAmount
  const max = paymentLimits.value.maxAmount

  // 获取原始选项
  const originalOptions = getRechargeAmountOptions()

  // 筛选在限制范围内的选项
  amountOptions.value = originalOptions.filter(option => option.value >= min && option.value <= max)

  // 如果当前选中的金额不在限制范围内，清空选择
  if (currentAmount.value > 0 && (currentAmount.value < min || currentAmount.value > max)) {
    clearAmount()
  }
}

// 清空金额选择
function clearAmount() {
  // 清空预设金额选中状态
  amountOptions.value.forEach((option) => {
    option.selected = false
  })
  // 清空自定义金额
  formData.value.customAmount = ''
  // 清空当前金额
  currentAmount.value = 0
  // 重置表单验证
  resetValidate()
}
// #endregion

// #region 事件处理函数
// 点击待支付订单公告，跳转到结果页面
function handlePendingOrderClick() {
  if (!pendingOrderInfo.value) {
    toast.show('订单信息不完整')
    return
  }

  // 由于当前类型中没有orderId，我们使用amount作为参数跳转
  // 或者可以跳转到充值历史页面查看待支付订单
  uni.navigateTo({
    url: BALANCE_RECHARGE_HISTORY_PATH,
  })
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
async function handleConfirmRecharge() {
  if (hasPendingOrder.value) {
    toast.show('您有待支付的订单，请先处理')
    return
  }
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

  const amountToPay = Number(currentAmount.value.toFixed(2))
  const paymentMethod = PAYMENT_METHOD.WECHAT // 可以根据需要修改支付方式

  await axiosPostRechargeApi(amountToPay, paymentMethod, {
    async onSuccess(data) {
      const { orderNo, id } = data

      // 清空金额选择和输入
      clearAmount()

      // 跳转到充值成功页面
      uni.navigateTo({
        url: `${BALANCE_RECHARGE_RESULT_PATH}?orderId=${id}&orderNo=${orderNo}`,
      })
    },
    async onFinally() {
      batchRequestHandler([axiosCheckPendingOrderApi(), axiosGetUserBalanceApi()])
    },
  })
}

// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
  // 批量处理接口请求
  batchRequestHandler([axiosGetPaymentLimitsApi(), axiosCheckPendingOrderApi()])
}

onMounted(() => {
  onRechargeSuccess(axiosCheckPendingOrderApi)
})

onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([axiosCheckPendingOrderApi(), axiosGetUserBalanceApi()])
  }
})
// #endregion
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
          :title="`您有一个待支付的充值订单，金额¥${pendingOrderInfo?.amount}，点击查看详情。`"
          :show-popup="false"
          @click="handlePendingOrderClick"
        />

        <!-- 当前学生信息 -->
        <WhiteCard custom-class="flex flex-row" :disabled="hasPendingOrder">
          <RoleAvatar custom-class="mr-3" size="small" />
          <view flex="1 col" gap-1>
            <view flex="~ items-center justify-between">
              <view text="sm text-primary" font="medium">
                {{ currentStudent?.studentName }}
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
                ￥{{ balanceInfo?.availableBalanceFormatted }}
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 充值金额选择 -->
        <WhiteCard :disabled="hasPendingOrder">
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

          <!-- 自定义金额表单 -->
          <Form ref="formRef" :model="formData" :rules="rules">
            <Cell
              id="customAmount"
              prop="customAmount"
              p="x-0!"
              label="自定义金额"
              label-position="top"
            >
              <wd-input
                v-model="formData.customAmount"
                type="number"
                placeholder="请输入充值金额"
                @input="updateCustomAmount"
                @clear="updateCustomAmount"
              />
            </Cell>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <!-- 浮动操作按钮 -->
    <FabActions
      :actions="fabActions"
      icon-color="white"
      icon-size="32rpx"
      :bottom="164"
    />

    <view p="4">
      <!-- 确认充值按钮 -->
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
  </Page>
</template>
