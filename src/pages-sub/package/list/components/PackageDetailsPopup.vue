<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { postPurchasePackageApi } from '@/api/modules/package'
import { postApplyPackageRefundApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { PACKAGE_TYPE_I18N, PAYMENT_METHOD } from '@/constant/modules'
import { useUserStore } from '@/store/user'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import { requestWxPayment } from '@/utils/uni'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 属性定义
const props = defineProps<{
  /** 选中的套餐 */
  item: Pkg.Query.IPackage | undefined
  /** 当前激活的套餐 */
  activePackage?: Pkg.Query.IStudentActivePackageVo
  /** 是否显示购买按钮 */
  showPurchaseButton: boolean
  /** 是否显示退款按钮 */
  showRefundButton: boolean
  /** 是否禁用购买按钮 */
  disablePurchaseButton?: boolean
  /** 是否禁用退款按钮 */
  disableRefundButton?: boolean
}>()

const emit = defineEmits<{
  purchase: []
  refund: []
}>()
// #endregion

// #region 响应式数据
const visible = defineModel<boolean>('modelValue', { default: false })
const purchaseLoading = ref(false)
const refundLoading = ref(false)
// #endregion

// #region 使用 Hooks
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const { currentStudent } = storeToRefs(userStore)
// #endregion

// #region 计算属性
const currentStudentId = computed(() => {
  return unref(currentStudent).studentId
})
// #endregion

// #region 接口请求函数
// 创建购买套餐订单并发起支付
async function axiosPostPurchasePackageApi(packageId: number) {
  try {
    const params: Pkg.Payment.ReqPostPurchaseApi = {
      packageId,
      paymentMethod: PAYMENT_METHOD.WECHAT,
    }

    const result = await postPurchasePackageApi(params)

    if (result.code === 0) {
      // 处理微信支付
      await handleWechatPayment(result.data.paymentParams)
      return result
    }

    throw new Error('购买套餐失败')
  }
  catch (error) {
    console.error('购买套餐失败:', error)
    throw error
  }
}

// 申请套餐退费
async function axiosPostApplyPackageRefundApi(packageRecordId: number, applyReason: string) {
  try {
    const params: Pkg.Refund.ReqPostApplyRefundApi = {
      packageRecordId,
      applyReason,
    }

    const result = await postApplyPackageRefundApi(params)

    if (result.code === 0) {
      toast.show('退款申请提交成功')
      return result
    }

    throw new Error('申请套餐退款失败')
  }
  catch (error) {
    console.error('申请套餐退款失败:', error)
    throw error
  }
}
// #endregion

// #region 方法定义
// 格式化价格显示（前缀人民币符号）
function formatPrice(price: number): string {
  return `¥${price}`
}

// 根据套餐类型常量返回中文展示文本
function getPackageTypeText(type: string): string {
  return PACKAGE_TYPE_I18N[type as keyof typeof PACKAGE_TYPE_I18N] || '未知类型'
}
// #endregion

// #region 事件处理函数
// 发起微信支付（在小程序环境下调用微信支付接口）
async function handleWechatPayment(paymentParams: Pkg.Payment.IJsApiPayParams) {
  if (!isMpWeixin) {
    toast.show('当前环境不支持微信支付')
    throw new Error('当前环境不支持微信支付')
  }

  try {
    const res = await requestWxPayment({
      timeStamp: paymentParams.timeStamp,
      nonceStr: paymentParams.nonceStr,
      package: paymentParams.package,
      signType: paymentParams.signType,
      paySign: paymentParams.paySign,
    })
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
    return res
  }
  catch (err: any) {
    if (err.errMsg !== 'requestPayment:fail cancel') {
      uni.showToast({
        title: '支付失败',
        icon: 'none',
      })
    }
    throw err
  }
}

// 购买指定套餐（含学生选择校验与下单流程）
async function handlePurchasePackage(pkg: Pkg.Query.IPackage) {
  if (!currentStudentId.value) {
    toast.show('请先选择学生')
    return
  }

  try {
    purchaseLoading.value = true
    await axiosPostPurchasePackageApi(pkg.id)
  }
  catch (error) {
    toast.show('购买失败，请重试')
  }
  finally {
    console.log('1111')
    purchaseLoading.value = false
    visible.value = false
    // 通知父组件处理购买事件
    emit('purchase')
  }
}

// 申请退款
async function handleApplyRefund() {
  if (!props.activePackage) {
    toast.show('没有可退款的套餐')
    return
  }

  try {
    refundLoading.value = true
    await axiosPostApplyPackageRefundApi(props.activePackage.id, '申请退款')
  }
  catch (error) {
    toast.show('退款申请失败，请重试')
  }
  finally {
    console.log('refund')
    refundLoading.value = false
    visible.value = false
    // 通知父组件处理退款事件
    emit('refund')
  }
}

// 关闭套餐详情弹窗
function handleCloseDetails() {
  visible.value = false
}
// #endregion
</script>

<template>
  <BottomPopup v-model="visible" title="套餐详情" height="70vh" @close="handleCloseDetails">
    <!-- 滚动区域 -->
    <view v-if="item" class="popup-container">
      <view p="4" flex="~ col" gap="3">
        <!-- 套餐基本信息 -->
        <view flex="~ col" m="b-3">
          <view text="lg gray-900" font="bold">
            {{ getPackageTypeText(item.packageType) }}
          </view>
          <view text="base gray-700" m="t-1">
            {{ item.packageName }}
          </view>
        </view>

        <!-- 价格信息 -->
        <view p="4" bg="gray-100" border="rounded-lg">
          <view text="sm gray-700" font="medium" m="b-2">
            价格信息
          </view>
          <view flex="~ justify-between items-center" m="b-1">
            <view text="sm gray-600">
              实际购买价格
            </view>
            <view text="lg primary" font="bold">
              {{ formatPrice(item.purchasePrice) }}
            </view>
          </view>
          <view flex="~ justify-between items-center" m="b-1">
            <view text="sm gray-600">
              月基础价格
            </view>
            <view text="sm gray-500">
              {{ formatPrice(item.monthlyPrice) }}
            </view>
          </view>
          <view flex="~ justify-between items-center">
            <view text="sm gray-600">
              套餐总月数
            </view>
            <view text="sm gray-500">
              {{ item.totalMonths }}个月
            </view>
          </view>
        </view>

        <!-- 套餐内容详情 -->
        <view p="4" bg="gray-100" border="rounded-lg">
          <view text="sm gray-700" font="medium" m="b-3">
            套餐内容
          </view>
          <view flex="~ col" gap="2">
            <view v-if="item.packageContent.videoCallMinutes > 0" flex="~ items-center" gap="2">
              <view text="sm gray-600">
                视频通话：{{ item.packageContent.videoCallMinutes }}分钟
              </view>
            </view>
            <view v-if="item.packageContent.messageCount > 0" flex="~ items-center" gap="2">
              <view text="sm gray-600">
                留言条数：{{ item.packageContent.messageCount }}条
              </view>
            </view>
          </view>
        </view>

        <!-- 套餐说明 -->
        <view v-if="item.templateDescription" p="4" bg="gray-100" border="rounded-lg">
          <view text="sm gray-700" font="medium" m="b-2">
            套餐说明
          </view>
          <view text="xs gray-600" line="height-relaxed">
            {{ item.templateDescription }}
          </view>
        </view>

        <!-- 使用规则 -->
        <view v-if="item.usageRules" p="4" bg="gray-100" border="rounded-lg">
          <view text="sm gray-700" font="medium" m="b-2">
            使用规则
          </view>
          <view text="xs gray-600" line="height-relaxed">
            {{ item.usageRules }}
          </view>
        </view>

        <!-- 固定套餐特殊信息 -->
        <view v-if="item.packageType === 'FIXED'" p="4" bg="gray-100" border="rounded-lg">
          <view text="sm gray-700" font="medium" m="b-2">
            定制套餐信息
          </view>
          <view flex="~ col" gap="1">
            <view text="xs gray-600">
              开始时间：{{ item.startTime }}
            </view>
            <view text="xs gray-600">
              结束时间：{{ item.endTime }}
            </view>
            <view v-if="item.monthlyDecrease" text="xs gray-600">
              按月递减使用
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 按钮区域 - 使用 footer 插槽 -->
    <template v-if="item" #footer>
      <view class="popup-footer" p="4" flex="~ row" gap="3">
        <!-- 退款按钮 -->
        <TButton
          v-if="showRefundButton"
          type="danger"
          full
          size="large"
          flex="1"
          :loading="refundLoading"
          :disabled="disableRefundButton"
          @click="handleApplyRefund"
        >
          申请退款
        </TButton>

        <!-- 购买按钮 -->
        <TButton
          v-if="showPurchaseButton"
          type="primary"
          full
          size="large"
          flex="1"
          :loading="purchaseLoading"
          :disabled="disablePurchaseButton"
          @click="handlePurchasePackage(item)"
        >
          立即购买 {{ formatPrice(item.purchasePrice) }}
        </TButton>
      </view>
    </template>
  </BottomPopup>
</template>

<style scoped lang="scss">
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.popup-footer {
  :deep(.button) {
    width: 100%;
  }
}
</style>
