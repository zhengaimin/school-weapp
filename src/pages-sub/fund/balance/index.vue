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
import TButton from '@/components/common/button/index.vue'
import DetailBlock from '@/components/common/detail-block/index.vue'
import Page from '@/components/common/page/index.vue'
import Icon from '@/components/icon/index.vue'
import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules'
import { BALANCE_RECHARGE_HISTORY_PATH, BALANCE_RECHARGE_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/parent'
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
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const { balanceInfo } = storeToRefs(parentStore)
const { currentStudent } = storeToRefs(userStore)
// #endregion

// #region 定义响应式数据
const consumptionStatistics = ref()
// #endregion

// #region 定义计算属性
const detailItems = computed(() => {
  return [
    { key: 'name', label: '学生姓名', value: currentStudent.value?.studentName || '--' },
    { key: 'studentCode', label: '学号', value: currentStudent.value?.studentCode || '--' },
    { key: 'schoolName', label: '学校', value: currentStudent.value?.schoolName || '--' },
    { key: 'grade', label: '年级', value: currentStudent.value?.grade || '--' },
    { key: 'className', label: '班级', value: currentStudent.value?.className || '--' },
  ]
})

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
// #endregion

// #region 事件处理函数
function goToHistory() {
  uni.navigateTo({
    url: BALANCE_RECHARGE_HISTORY_PATH,
  })
}

function goToRecharge() {
  uni.navigateTo({
    url: BALANCE_RECHARGE_PATH,
  })
}
// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  await batchRequestHandler([axiosGetConsumptionStatisticsApi()])
}
// #endregion
</script>

<template>
  <Page
    title="余额查询"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #header-right>
      <view flex="~ row items-center justify-center" h-full @click="goToHistory">
        <Icon
          name="history-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
        />
      </view>
    </template>

    <!-- 内容区域 -->
    <scroll-view scroll-y :style="contentStyle">
      <view p="x-4 t-2 b-4" relative z-10>
        <!-- 当前孩子余额卡片 -->
        <view bg="white" border="~ bg-muted solid rounded-lg" p="6" m="b-4">
          <!-- 余额显示 -->
          <view text="center" p="y-6" bg="bg-secondary" border="rounded-lg" m="b-6">
            <view text="sm text-secondary" m="b-2">
              账户余额
            </view>
            <view text="4xl primary" font="bold" m="b-2">
              {{ balanceInfo?.availableBalanceFormatted || '--' }}
            </view>
            <view text="xs text-muted">
              上次更新：{{ balanceInfo?.lastUpdateTime }}
            </view>
          </view>

          <!-- 快速统计 -->
          <view grid="~ cols-3" gap="4">
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ consumptionStatistics?.monthCount }}
              </view>
              <view text="xs text-secondary">
                本月消费次数
              </view>
            </view>
            <view text="center">
              <view text="lg text-primary" font="medium">
                {{ consumptionStatistics?.monthAmount }}
              </view>
              <view text="xs text-secondary">
                本月消费金额
              </view>
            </view>
            <view text="center">
              <view lh-56rpx text="xs text-primary" font="medium">
                {{
                  balanceInfo?.updatedAt ? dayjs(balanceInfo.updatedAt).format('YYYY-MM-DD') : '--'
                }}
              </view>
              <view text="xs text-secondary">
                上次充值
              </view>
            </view>
          </view>
        </view>

        <!-- 账户详情 -->
        <DetailBlock title="账户详情" :items="detailItems" />
      </view>
    </scroll-view>

    <view p="4">
      <TButton type="primary" size="large" full @click="goToRecharge">
        充值
      </TButton>
    </view>
  </Page>
</template>
