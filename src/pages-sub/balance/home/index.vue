<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "余额查询"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getConsumptionStatisticsApi } from '@/api/modules/user/consumption'
import GradientHeader from '@/components/common/gradient-header/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { usePage } from '@/hooks/usePage'
import { usePackage } from '@/pages-sub/package/hooks/usePackage'
import ActivePackageCard from '@/pages-sub/package/list/components/ActivePackageCard.vue'
import { useParentStore } from '@/store/auth/parent'
import { useUserStore } from '@/store/user'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, onLoginFail, batchRequestHandler, getContentHeight } = usePage()
const { activePackage, axiosGetStudentActivePackageApi } = usePackage()
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const { currentStudent } = storeToRefs(userStore)
const { balanceInfo } = storeToRefs(parentStore)
// #endregion

// #region 定义响应式数据
const consumptionStatistics = ref()
// #endregion

// #region 定义计算属性
const contentStyle = computed(() => {
  return getContentHeight('0')
})

/** 上次更新 */
const lastUpdateTimeFormatted = computed(() => {
  if (balanceInfo.value?.lastUpdateTime) {
    return balanceInfo.value.lastUpdateTime
  }
  if (balanceInfo.value?.updatedAt) {
    return dayjs(balanceInfo.value.updatedAt).format('YYYY-MM-DD HH:mm')
  }
  return '--'
})
// #endregion

// #region 接口请求函数
async function axiosGetConsumptionStatisticsApi() {
  try {
    const result = await getConsumptionStatisticsApi()

    if (result.code === 0) {
      consumptionStatistics.value = result.data
    }

    return result
  }
  catch (error) {
    return { code: -1 }
  }
}

// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  await batchRequestHandler([axiosGetConsumptionStatisticsApi(), axiosGetStudentActivePackageApi()])
}
// #endregion
</script>

<template>
  <Page
    :show="false"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view scroll-y :style="contentStyle">
      <!-- 渐变头部 + 余额展示 -->
      <GradientHeader title="账户信息" :show-back="true">
        <view m="t-2" p="b-8">
          <view text="sm opacity-90" m="b-2">
            当前余额 (元)
          </view>
          <view text="4xl" font="bold" m="b-6">
            {{ balanceInfo?.availableBalanceFormatted || (balanceInfo?.availableBalance ?? '--') }}
          </view>
          <view flex="~ items-center justify-between" text="sm opacity-90">
            <view>
              {{ currentStudent?.studentName || currentStudent?.fullClassName || '--' }}
            </view>
            <view>
              更新于:{{ lastUpdateTimeFormatted }}
            </view>
          </view>
        </view>
      </GradientHeader>

      <view flex="~ col" gap="4" p="x-4 b-8" relative z-10 style="margin-top: -48rpx">
        <!-- 分块：账户统计 -->
        <WhiteCard>
          <view text="base text-gray-900" font="bold" m="b-4">
            账户统计
          </view>
          <view grid="~ cols-3" gap="4">
            <view flex="~ col items-center" gap="2">
              <view w="12" h="12" rounded-full bg="primary-50" flex="~ items-center justify-center">
                <Icon name="file-list-3-line" icon-color="#3269dd" icon-size="44rpx" />
              </view>
              <view text="xl text-gray-900" font="bold" m="t-1">
                {{ consumptionStatistics?.monthCount ?? '--' }}
              </view>
              <view text="xs text-gray-500">
                本月消费次数
              </view>
            </view>
            <view flex="~ col items-center" gap="2">
              <view w="12" h="12" rounded-full bg="primary-50" flex="~ items-center justify-center">
                <Icon name="money-cny-circle-line" icon-color="#3269dd" icon-size="44rpx" />
              </view>
              <view text="xl text-gray-900" font="bold" m="t-1">
                {{ consumptionStatistics?.monthAmount ?? '--' }}
              </view>
              <view text="xs text-gray-500">
                本月消费金额
              </view>
            </view>
            <view flex="~ col items-center" gap="2">
              <view w="12" h="12" rounded-full bg="primary-50" flex="~ items-center justify-center">
                <Icon name="wallet-3-line" icon-color="#3269dd" icon-size="44rpx" />
              </view>
              <view text="xl text-gray-900" font="bold" m="t-1">
                {{ balanceInfo?.totalRecharge ?? '--' }}
              </view>
              <view text="xs text-gray-500">
                累计充值
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 分块：套餐信息 -->
        <ActivePackageCard v-if="activePackage" :active-package="activePackage" />
      </view>
    </scroll-view>
  </Page>
</template>
