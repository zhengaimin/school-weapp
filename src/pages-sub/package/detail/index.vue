<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐详情"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getPackageDetailApi } from '@/api/modules/package/query'
import TButton from '@/components/common/button/index.vue'
import DetailBlock from '@/components/common/detail-block/index.vue'
import Page from '@/components/common/page/index.vue'
import { PACKAGE_TYPE, PACKAGE_TYPE_I18N, PAYMENT_METHOD } from '@/constant/modules'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { usePackageStore } from '@/store/package'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'
import { usePayment } from '../hooks/usePayment'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
useForm('.refund-scroll')
const packageStore = usePackageStore()
const { activePackage, pendingPayment, hasPendingRefund } = storeToRefs(packageStore)
const { emitPackageTransaction } = usePackageEmitter()
// #endregion

// #region 定义响应式数据
const packageDetail = ref<Pkg.Query.ResGetPackageDetailApi>()

// #endregion

// #region 使用 Payment Hook
const { axiosPostPurchasePackageApi, purchaseLoading } = usePayment()
// #endregion

// #region 定义计算属性
const packageDetails = computed(() => {
  const info = unref(packageDetail)

  if (!info) {
    return {
      basicInfo: [],
      contentInfo: [],
      otherInfo: [],
      templateDescription: '',
      usageRules: '',
    }
  }

  // 构建基本信息数组，包含有效期（如果是固定套餐）
  const basicInfo = [
    { key: 'type', label: '套餐类型', value: PACKAGE_TYPE_I18N[info.packageType] },
    { key: 'price', label: '购买价格', value: `¥${info.purchasePrice}` },
  ]

  // 当套餐类型为固定套餐时，添加有效期信息到基本信息中
  if (info.packageType === PACKAGE_TYPE.FIXED) {
    basicInfo.push({
      key: 'validity',
      label: '有效期',
      value: `${dayjs(info.startDate).format('YYYY-MM-DD')} 至 ${dayjs(info.endDate).format('YYYY-MM-DD')}`,
    })
  }

  basicInfo.push({
    key: 'totalMonths',
    label: '总时长',
    value: `${info.totalMonths}个月`,
  })

  return {
    basicInfo,
    contentInfo: [
      {
        key: 'minutes',
        label: '视频通话分钟数',
        value: `${info.packageContent.videoCallMinutes}分钟`,
      },
      {
        key: 'messages',
        label: '留言条数',
        value:
          info.packageContent.messageCount === -1
            ? '不限额'
            : `${info.packageContent.messageCount}条`,
      },
    ],
    templateDescription: info.templateDescription,
    usageRules: info.usageRules,
  }
})

// 是否显示待支付订单
const hasPendingPayment = computed(() => {
  return pendingPayment.value?.hasPending
})

// 是否显示购买按钮
const showPurchaseButton = computed(() => {
  // 1. 当前存在待支付或待审的套餐，不显示购买按钮
  if (hasPendingPayment.value || hasPendingRefund.value) {
    return false
  }

  // 2. 不存在活跃中套餐，可以显示按钮
  if (!activePackage.value) {
    return true
  }

  // 3. 存在活跃中套餐，需要判断活跃套餐类型、当前套餐类型都为通用套餐才能显示按钮
  if (activePackage.value && packageDetail.value) {
    return (
      activePackage.value.snapshotInfo.packageType === PACKAGE_TYPE.GENERAL
      && packageDetail.value.packageType === PACKAGE_TYPE.GENERAL
    )
  }

  return false
})

// 是否应该显示正常内容（套餐存在时）
const shouldShowContent = computed(() => {
  return packageDetail.value?.isPackageExists !== false
})

// 计算内容区域高度
const contentHeight = computed(() => {
  // 只有显示购买按钮时才需要预留底部按钮区域高度（约164rpx）
  const needButtonArea = showPurchaseButton.value && shouldShowContent.value
  return getContentHeight(needButtonArea ? '164rpx' : '0')
})
// #region 定义验证规则
// #endregion

// #region 接口请求函数
// 获取套餐详情
async function axiosGetPackageDetailApi(id: number) {
  try {
    const result = await getPackageDetailApi(id)
    if (result.code === 0) {
      packageDetail.value = result.data
    }
    return result
  }
  catch (error) {
    console.error('获取套餐详情失败:', error)
    throw error
  }
}

// #endregion

// #region 事件处理函数
// 购买套餐
async function handleGoToPurchase() {
  if (!packageDetail.value?.packageTemplateId) {
    toast.show('套餐信息不完整')
    return
  }

  await axiosPostPurchasePackageApi(
    {
      packageId: packageDetail.value.packageTemplateId,
      paymentMethod: PAYMENT_METHOD.WECHAT,
    },
    {
      onSuccess: () => {
        // 发送套餐交易事件
        emitPackageTransaction()

        setTimeout(() => {
          uni.navigateBack()
        }, 500)
      },
      onError: (error) => {
        console.error('购买套餐失败:', error)
        // 发送套餐交易事件
        emitPackageTransaction()
      },
    },
  )
}
// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  const { query } = currRoute()

  batchRequestHandler([axiosGetPackageDetailApi(+query.id)])
}
// #endregion
</script>

<template>
  <Page
    title="套餐详情"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 商品已下架提示 -->
    <view v-if="!packageDetail?.isPackageExists" h-full>
      <wd-status-tip
        custom-class="h-full flex flex-col items-center  justify-center"
        image="search"
        tip="商品已下架"
      />
    </view>

    <template v-else>
      <!-- 内容区域 -->
      <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
        <view p="4 t-2!" flex="~ col" gap="3">
          <!-- 套餐基本信息 -->
          <DetailBlock title="基本信息" :items="packageDetails.basicInfo" />
          <!-- 套餐内容信息 -->
          <DetailBlock title="套餐内容" :items="packageDetails.contentInfo" />

          <!-- 套餐描述 -->
          <view
            v-if="packageDetails.templateDescription"
            bg="white"
            border="~ gray-100 solid rounded-xl"
            p="4"
          >
            <view text="sm gray-900" font="medium" m="b-3">
              套餐描述
            </view>
            <view text="sm gray-600" leading="relaxed" whitespace="pre-wrap">
              {{ packageDetails.templateDescription }}
            </view>
          </view>

          <!-- 使用规则 -->
          <view
            v-if="packageDetails.usageRules"
            bg="white"
            border="~ gray-100 solid rounded-xl"
            p="4"
          >
            <view text="sm gray-900" font="medium" m="b-3">
              使用规则
            </view>
            <view text="sm gray-600" leading="relaxed" whitespace="pre-wrap">
              {{ packageDetails.usageRules }}
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 购买按钮 -->
      <view v-if="showPurchaseButton && shouldShowContent" p="4">
        <TButton
          type="primary"
          size="large"
          full
          flex="1"
          :loading="purchaseLoading"
          @click="handleGoToPurchase"
        >
          立即购买
        </TButton>
      </view>
    </template>
  </Page>
</template>

<style scoped lang="scss">
:deep(.wd-status-tip) {
}
</style>
