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
import { computed, ref, unref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import FabActions from '@/components/common/fab-actions/index.vue'
import Notice from '@/components/common/notice/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules'
import {
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
import PackageCollapseCard from './components/PackageCollapseCard.vue'
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

// #region Mock 数据（开发阶段使用）
const mockPackages: Pkg.Query.IPackage[] = [
  {
    id: 1,
    templateCode: 'PHONE_BASIC_001',
    packageName: '话机基础套餐',
    packageContent: { videoCallMinutes: 100, messageCount: 50 },
    purchasePrice: 30,
    monthlyPrice: 30,
    totalMonths: 1,
    templateDescription: '每月100分钟视频通话，50条留言',
    usageRules: '套餐有效期内可使用，过期作废',
    packageType: 'GENERAL',
    deviceType: 'PHONE',
    startTime: '',
    endTime: '',
    monthlyDecrease: false,
  },
  {
    id: 2,
    templateCode: 'PHONE_PREMIUM_001',
    packageName: '话机畅享套餐',
    packageContent: { videoCallMinutes: 300, messageCount: 100 },
    purchasePrice: 68,
    monthlyPrice: 68,
    totalMonths: 1,
    templateDescription: '每月300分钟视频通话，100条留言',
    usageRules: '套餐有效期内可使用，过期作废',
    packageType: 'GENERAL',
    deviceType: 'PHONE',
    startTime: '',
    endTime: '',
    monthlyDecrease: false,
  },
  {
    id: 3,
    templateCode: 'PHONE_SEMESTER_001',
    packageName: '话机学期套餐',
    packageContent: { videoCallMinutes: 500, messageCount: 200 },
    purchasePrice: 299,
    monthlyPrice: 60,
    totalMonths: 5,
    templateDescription: '学期套餐，每月500分钟视频通话',
    usageRules: '按学期计费，支持按月递减',
    packageType: 'FIXED',
    deviceType: 'PHONE',
    startTime: '2025-03-01',
    endTime: '2025-07-31',
    monthlyDecrease: true,
  },
  {
    id: 4,
    templateCode: 'DRYER_BASIC_001',
    packageName: '吹风机基础套餐',
    packageContent: { videoCallMinutes: 0, messageCount: 0 },
    purchasePrice: 15,
    monthlyPrice: 15,
    totalMonths: 1,
    templateDescription: '每月30次吹风机使用',
    usageRules: '每次使用时长10分钟',
    packageType: 'GENERAL',
    deviceType: 'DRYER',
    startTime: '',
    endTime: '',
    monthlyDecrease: false,
  },
  {
    id: 5,
    templateCode: 'DRYER_PREMIUM_001',
    packageName: '吹风机畅享套餐',
    packageContent: { videoCallMinutes: 0, messageCount: 0 },
    purchasePrice: 25,
    monthlyPrice: 25,
    totalMonths: 1,
    templateDescription: '每月60次吹风机使用',
    usageRules: '每次使用时长10分钟，不限时段',
    packageType: 'GENERAL',
    deviceType: 'DRYER',
    startTime: '',
    endTime: '',
    monthlyDecrease: false,
  },
  {
    id: 6,
    templateCode: 'DRYER_SEMESTER_001',
    packageName: '吹风机学期套餐',
    packageContent: { videoCallMinutes: 0, messageCount: 0 },
    purchasePrice: 99,
    monthlyPrice: 20,
    totalMonths: 5,
    templateDescription: '学期套餐，每月80次吹风机使用',
    usageRules: '按学期计费，超出次数按次收费',
    packageType: 'FIXED',
    deviceType: 'DRYER',
    startTime: '2025-03-01',
    endTime: '2025-07-31',
    monthlyDecrease: false,
  },
]
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

// 套餐详情弹框
const showPackagePopup = ref(false)
const selectedPackage = ref<Pkg.Query.IPackage | null>(null)

// 按设备类型分组套餐列表（开发阶段使用 mock 数据）
const phonePackages = computed(() => {
  // TODO: 接口对接后改回 packagesList.value
  const list = mockPackages.length ? mockPackages : packagesList.value
  return list.filter(pkg => pkg.deviceType === DEVICE_TYPE.PHONE)
})

const dryerPackages = computed(() => {
  // TODO: 接口对接后改回 packagesList.value
  const list = mockPackages.length ? mockPackages : packagesList.value
  return list.filter(pkg => pkg.deviceType === DEVICE_TYPE.DRYER)
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

// 显示套餐详情弹框
function handleShowPackageDetails(pkg: Pkg.Query.IPackage) {
  selectedPackage.value = pkg
  showPackagePopup.value = true
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
            已购买套餐 {{ activePackageTotal ? `(${activePackageTotal}个)` : '' }}
          </view>

          <!-- 当前使用套餐卡片 -->
          <ActivePackageCard
            v-if="activePackage"
            :active-package="activePackage!"
          />
        </view>

        <!-- 话机套餐（可折叠卡片） -->
        <PackageCollapseCard
          title="话机套餐"
          :packages="phonePackages"
          :active-package-id="activePackage?.packageId"
          :default-expanded="true"
          @click-package="handleShowPackageDetails"
        />

        <!-- 吹风机套餐（可折叠卡片） -->
        <PackageCollapseCard
          title="吹风机套餐"
          :packages="dryerPackages"
          :active-package-id="activePackage?.packageId"
          :default-expanded="false"
          @click-package="handleShowPackageDetails"
        />
      </view>
    </RefreshList>

    <!-- 浮动操作按钮 -->
    <FabActions :actions="fabActions" :bottom="32" />

    <!-- 套餐详情弹框 -->
    <BottomPopup
      v-model="showPackagePopup"
      title="套餐详情"
      max-height="60vh"
    >
      <view v-if="selectedPackage" p="4" flex="~ col" gap="4">
        <!-- 套餐名称与价格 -->
        <view flex="~ row items-center justify-between">
          <view flex="~ col" gap="1">
            <text text="lg gray-800" font="bold">
              {{ selectedPackage.packageName }}
            </text>
            <text text="xs gray-500">
              {{ PACKAGE_TYPE_I18N[selectedPackage.packageType] }}
            </text>
          </view>
          <view flex="~ col items-end">
            <text text="xl red-500" font="bold">
              ¥{{ selectedPackage.purchasePrice }}
            </text>
            <text v-if="selectedPackage.totalMonths > 1" text="xs gray-400">
              约 ¥{{ (selectedPackage.purchasePrice / selectedPackage.totalMonths).toFixed(0) }}/月
            </text>
          </view>
        </view>

        <!-- 套餐说明 -->
        <view v-if="selectedPackage.templateDescription" p="3" bg="gray-50" rounded="lg">
          <text text="sm gray-600">
            {{ selectedPackage.templateDescription }}
          </text>
        </view>

        <!-- 套餐信息列表 -->
        <view flex="~ col" gap="3">
          <view flex="~ row justify-between" text="sm">
            <text text="gray-500">
              套餐时长
            </text>
            <text text="gray-800">
              {{ selectedPackage.totalMonths }}个月
            </text>
          </view>
          <view flex="~ row justify-between" text="sm">
            <text text="gray-500">
              月费
            </text>
            <text text="gray-800">
              ¥{{ selectedPackage.monthlyPrice }}/月
            </text>
          </view>
          <view v-if="selectedPackage.packageType === 'FIXED'" flex="~ row justify-between" text="sm">
            <text text="gray-500">
              有效期
            </text>
            <text text="gray-800">
              {{ selectedPackage.startTime }} 至 {{ selectedPackage.endTime }}
            </text>
          </view>
        </view>

        <!-- 使用规则 -->
        <view v-if="selectedPackage.usageRules" flex="~ col" gap="2">
          <text text="sm gray-800" font="medium">
            使用规则
          </text>
          <text text="xs gray-500" leading="relaxed">
            {{ selectedPackage.usageRules }}
          </text>
        </view>
      </view>
    </BottomPopup>
  </Page>
</template>

<style scoped lang="scss"></style>
