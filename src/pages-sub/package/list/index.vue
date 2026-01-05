<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐列表"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import TButton from '@/components/common/button/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import {
  PACKAGE_DETAIL_PATH,
  PACKAGE_HISTORY_PATH,
  PACKAGE_REFUND_HISTORY_PATH,
} from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { usePackageEmitter } from '@/utils/emit/package'
import { usePackage } from '../hooks/usePackage'
import ActivePackageCard from './components/ActivePackageCard.vue'
import PackageCard from './components/PackageCard.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, batchRequestHandler, onLoginFail, getContentHeight }
  = usePage()
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { deviceType } = storeToRefs(currentStudentStore)
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: packagesList,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IPackage>({
  get: params => getAvailablePackagesApi({ ...params, deviceType: deviceType.value }),
  immediate: false,
  listField: 'packages',
})
const { axiosGetUserBalanceApi } = useBalance()
const { onPackageRefund, onPackageTransaction } = usePackageEmitter()
const {
  activePackage,
  activePackageTotal,
  hasPendingRefund,
  pendingPayment,
  purchasedPackageIds,
  axiosGetCheckPendingApi,
  axiosGetPendingPaymentApi,
  axiosGetStudentActivePackageApi,
} = usePackage()

const contentStyle = computed(() => getContentHeight('164rpx'))

/** 是否显示待支付订单 */
const hasPendingPayment = computed(() => pendingPayment.value?.hasPending)

/** 是否显示当前激活套餐 */
const hasActivePackage = computed(() => !!unref(activePackage))

/** 点击待支付通知跳转到历史页面 */
function handlePendingPaymentClick() {
  uni.navigateTo({ url: PACKAGE_HISTORY_PATH })
}

/** 跳转到退款历史页面 */
function handleGoToRefundHistory() {
  uni.navigateTo({ url: PACKAGE_REFUND_HISTORY_PATH })
}

/** 跳转到套餐详情页 */
function handleGoToPackageDetail(id: number) {
  uni.navigateTo({ url: `${PACKAGE_DETAIL_PATH}?id=${id}` })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([
    onRefreshList(),
    axiosGetStudentActivePackageApi(),
    axiosGetPendingPaymentApi(),
    axiosGetCheckPendingApi(),
  ])
}

onShow(() => {
  if (unref(pageLoaded)) {
    batchRequestHandler([
      axiosGetStudentActivePackageApi(),
      axiosGetCheckPendingApi(),
      axiosGetPendingPaymentApi(),
      axiosGetUserBalanceApi(),
    ])
  }
})

onPackageRefund(() => {
  batchRequestHandler([axiosGetStudentActivePackageApi(), axiosGetCheckPendingApi()])
})

onPackageTransaction(() => {
  batchRequestHandler([
    axiosGetStudentActivePackageApi(),
    axiosGetPendingPaymentApi(),
    axiosGetUserBalanceApi(),
  ])
})
</script>

<template>
  <Page
    title="套餐列表"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <RefreshList
      :custom-style="contentStyle"
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty && !hasActivePackage"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 y-2!" flex="~ col" gap="4">
        <!-- 待审核套餐提示 -->
        <Notice
          v-if="hasPendingRefund"
          type="warning"
          title="当前存在待审核退款申请，点击查看"
          :show-popup="false"
          @click="handleGoToRefundHistory"
        />
        <!-- 待支付提醒 -->
        <Notice
          v-if="hasPendingPayment"
          type="warning"
          :show-popup="false"
          title="当前存在待支付订单，点击查看"
          @click="handlePendingPaymentClick"
        />

        <!-- 已购买套餐区域 -->
        <view v-if="hasActivePackage" flex="~ col" gap="3">
          <view flex="~ row items-center justify-between" px="1">
            <text text="base gray-800" font="bold">
              已购买套餐
            </text>
            <view v-if="activePackageTotal" px="2" py="0.5" bg="primary/10" rounded-full>
              <text text="xs primary" font="medium">
                {{ activePackageTotal }} 个生效中
              </text>
            </view>
          </view>
          <ActivePackageCard v-if="activePackage" :package="activePackage!" />
        </view>

        <!-- 可购买套餐区域 -->
        <view flex="~ col" gap="3">
          <!-- 区块标题 -->
          <view flex="~ row items-center justify-between" px="1">
            <text text="base gray-800" font="bold">
              可购买套餐
            </text>
            <text text="xs gray-400">
              按需选择
            </text>
          </view>

          <!-- 套餐列表 -->
          <view flex="~ col" gap="3">
            <PackageCard
              v-for="pkg in packagesList"
              :key="pkg.id"
              :pkg="pkg"
              :is-purchased="purchasedPackageIds.has(pkg.id)"
              @click="handleGoToPackageDetail(pkg.id)"
            />
          </view>

          <!-- 空状态 -->
          <StatusTip v-if="!loading && packagesList.length === 0" image="content" />
        </view>
      </view>
    </RefreshList>

    <!-- 底部操作按钮 -->
    <view p="x-4 y-3" flex gap="4" border="t gray-100">
      <TButton type="primary" size="large" full flex-1 @click="handlePendingPaymentClick">
        购买历史
      </TButton>
      <TButton type="primary" size="large" full flex-1 @click="handleGoToRefundHistory">
        退费历史
      </TButton>
    </view>
  </Page>
</template>
