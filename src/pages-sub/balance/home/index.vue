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
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
// #region 导入
import { computed, ref } from 'vue'
import { getValidGiftsApi } from '@/api/modules/gifts'
import { getConsumptionStatisticsApi } from '@/api/modules/user/consumption'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'
import GiftInfo from './components/GiftCard.vue'
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
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const { currentStudent } = storeToRefs(userStore)
const { balanceInfo } = storeToRefs(parentStore)
// #endregion

// #region 定义响应式数据
const consumptionStatistics = ref()
const validGifts = ref(null)
// #endregion

// #region 定义计算属性
const contentStyle = computed(() => {
  return getContentHeight('164rpx')
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

async function axiosGetValidGiftsApi() {
  try {
    const result = await getValidGiftsApi()

    if (result.code === 0) {
      validGifts.value = result.data
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
  await batchRequestHandler([axiosGetConsumptionStatisticsApi(), axiosGetValidGiftsApi()])
}
// #endregion
</script>

<template>
  <Page
    title="账户信息"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view scroll-y :style="contentStyle">
      <view flex="~ col" gap="3" p="x-4 t-2 b-4" relative z-10>
        <!-- 学生姓名 + 账户余额 -->
        <WhiteCard>
          <view>
            <view flex="~ items-center justify-between">
              <view text="3xl primary" font="bold">
                ￥{{
                  balanceInfo?.availableBalanceFormatted || (balanceInfo?.availableBalance ?? '--')
                }}
              </view>
              <view text="lg" font="medium">
                {{ currentStudent?.studentName || currentStudent?.fullClassName || '--' }}
              </view>
            </view>
            <view text="xs text-secondary" m="t-2">
              上次更新：{{
                balanceInfo?.lastUpdateTime
                  || (balanceInfo?.updatedAt
                    ? dayjs(balanceInfo.updatedAt).format('YYYY-MM-DD HH:mm')
                    : '--')
              }}
            </view>
          </view>
        </WhiteCard>

        <!-- 分块：账户统计 -->
        <WhiteCard>
          <view text="sm text-secondary" m="b-2">
            账户统计
          </view>
          <view grid="~ cols-3" gap="4">
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ consumptionStatistics?.monthCount ?? '--' }}
              </view>
              <view text="xs text-secondary">
                本月消费次数
              </view>
            </view>
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ consumptionStatistics?.monthAmount ?? '--' }}
              </view>
              <view text="xs text-secondary">
                本月消费金额
              </view>
            </view>
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ balanceInfo?.totalRecharge ?? '--' }}
              </view>
              <view text="xs text-secondary">
                累计充值
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 分块：套餐信息（使用 WhiteCard） -->
        <WhiteCard>
          <view text="sm text-secondary" m="b-3">
            套餐信息
          </view>
          <view grid="~ cols-3" gap="4">
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ balanceInfo?.packageMinutes ?? '--' }}
              </view>
              <view text="xs text-secondary">
                套餐分钟
              </view>
            </view>
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{
                  balanceInfo?.packageMessageCount === -1
                    ? '不限额'
                    : (balanceInfo?.packageMessageCount ?? '--')
                }}
              </view>
              <view text="xs text-secondary">
                套餐消息数
              </view>
            </view>
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ balanceInfo?.giftMinutes ?? '--' }}
              </view>
              <view text="xs text-secondary">
                赠送分钟
              </view>
            </view>
          </view>
        </WhiteCard>

        <!-- 分块：赠费信息 -->
        <GiftInfo v-if="validGifts" :valid-gifts="validGifts" />
      </view>
    </scroll-view>
  </Page>
</template>
