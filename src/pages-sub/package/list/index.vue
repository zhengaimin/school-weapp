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
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import FabActions from '@/components/common/fab-actions/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import {
  PACKAGE_DETAIL_PATH,
  PACKAGE_HISTORY_PATH,
  PACKAGE_REFUND_HISTORY_PATH,
} from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { usePackageStore } from '@/store/package'
import { usePackageEmitter } from '@/utils/emit/package'
import { usePayment } from '../hooks/usePayment'
import ActivePackageCard from './components/ActivePackageCard.vue'
import PackageItem from './components/PackageItem.vue'
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
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: packagesList,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IPackage>({
  get: getAvailablePackagesApi,
  immediate: false,
  listField: 'packages',
})
const { axiosGetUserBalanceApi } = useBalance()
const packageStore = usePackageStore()
const { activePackage, pendingPayment, hasPendingRefund } = storeToRefs(packageStore)
const { onPackageRefund, onPackageTransaction } = usePackageEmitter()
const {
  activePackageTotal,
  axiosGetCheckPendingApi,
  axiosGetPendingPaymentApi,
  axiosGetStudentActivePackageApi,
} = usePayment()
// #endregion

// #region 定义计算属性
const contentStyle = computed(() => {
  return getContentHeight('0')
})
// 是否显示待支付订单
const hasPendingPayment = computed(() => {
  return pendingPayment.value?.hasPending
})
// 是否显示当前激活套餐
const hasActivePackage = computed(() => {
  return !!unref(activePackage)
})
// #endregion

// #endregion

// #region 定义响应式数据
// Fab 操作按钮列表
const fabActions = computed(() => [
  {
    text: '购买\n历史',
    path: PACKAGE_HISTORY_PATH,
  },
  {
    text: '退费\n历史',
    path: PACKAGE_REFUND_HISTORY_PATH,
  },
])
// #endregion

// #region 事件处理函数
// 跳转到套餐购买历史页面
function handleGoToHistory() {
  uni.showLoading({ title: '加载中...' })
  uni.navigateTo({
    url: PACKAGE_HISTORY_PATH,
    complete: () => {
      uni.hideLoading()
    },
  })
}

// 点击待支付通知跳转到历史页面
function handlePendingPaymentClick() {
  uni.showLoading({ title: '加载中...' })
  uni.navigateTo({
    url: PACKAGE_HISTORY_PATH,
    complete: () => {
      uni.hideLoading()
    },
  })
}

// 跳转到退款历史页面
function handleGoToRefundHistory() {
  uni.showLoading({ title: '加载中...' })
  uni.navigateTo({
    url: PACKAGE_REFUND_HISTORY_PATH,
    complete: () => {
      uni.hideLoading()
    },
  })
}

// 跳转到套餐详情页面
function handleShowPackageDetails(pkg: Pkg.Query.IPackage) {
  uni.showLoading({ title: '加载中...' })
  uni.navigateTo({
    url: `${PACKAGE_DETAIL_PATH}?id=${pkg.id}`,
    complete: () => {
      uni.hideLoading()
    },
  })
}

// 处理当前套餐卡片点击事件，跳转到详情页面
function handleShowActivePackageDetails(pkg: Pkg.Query.IStudentActivePackageVo) {
  uni.showLoading({ title: '加载中...' })
  uni.navigateTo({
    url: `${PACKAGE_DETAIL_PATH}?id=${pkg.packageId}`,
    complete: () => {
      uni.hideLoading()
    },
  })
}
// #endregion

// #region 生命周期钩子
// 登录成功后的页面初始化逻辑（刷新接口与数据）
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
      axiosGetStudentActivePackageApi(),
      axiosGetPendingPaymentApi(),
      axiosGetUserBalanceApi(),
    ])
  }
})

// 监听退款事件
onPackageRefund(() => {
  console.log('监听到套餐退款事件:')
  // 调用相关接口刷新数据
  batchRequestHandler([axiosGetStudentActivePackageApi(), axiosGetCheckPendingApi()])
})

// 监听交易事件
onPackageTransaction(() => {
  console.log('监听到套餐交易事件:')
  // 调用相关接口刷新数据
  batchRequestHandler([
    axiosGetStudentActivePackageApi(),
    axiosGetPendingPaymentApi(),
    axiosGetUserBalanceApi(),
  ])
})
// #endregion
</script>

<template>
  <Page
    title="套餐列表"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #header-right>
      <view flex="~ row items-center justify-center" h-full gap="4" @click.stop></view>
    </template>

    <!-- 套餐列表区域（可刷新/上拉） -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :style="contentStyle"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 t-2" flex="~ col" gap="3">
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

        <!-- 当前套餐区域（顶部） -->
        <view v-if="hasActivePackage" flex="~ col" gap="2">
          <!-- 区块标题 -->
          <view text="sm gray-700" font="medium">
            已购买套餐 {{ activePackageTotal ? `(套餐数量${activePackageTotal})` : 0 }}
          </view>

          <!-- 当前使用套餐卡片 -->
          <ActivePackageCard
            :active-package="activePackage!"
            @show-details="handleShowActivePackageDetails"
          />
        </view>

        <!-- 区块标题 -->
        <view text="sm gray-700" font="medium">
          套餐列表
        </view>
        <view flex="~ col" gap="3">
          <PackageItem
            v-for="pkg in packagesList"
            :key="pkg.id"
            :pkg="pkg"
            :is-active="pkg.id === activePackage?.packageId"
            @click="handleShowPackageDetails"
          />
        </view>
      </view>
    </RefreshList>

    <!-- 浮动操作按钮 -->
    <FabActions :actions="fabActions" :bottom="32" />
  </Page>
</template>

<style scoped lang="scss"></style>
