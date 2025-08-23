<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "消费记录"
  }
}
</route>

<script lang="ts" setup>
import type { ConsumptionRecord, FilterParams, StatisticsData } from './data'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import { computed, nextTick, onMounted, ref } from 'vue'

import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'

import { usePage } from '@/hooks/usePage'

import { formatAmount, getConsumptionRecords, getStatistics } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()

// 获取页面参数
const studentId = ref('')

// 筛选条件
const filters = ref({
  child: 'all',
  time: 'month',
})

// 筛选器配置
const filterConfigs = computed<FilterConfig[]>(() => [
  {
    key: 'child',
    title: '选择孩子',
    options: [
      { value: 'all', label: '全部孩子' },
      { value: 'child1', label: '张小明' },
      { value: 'child2', label: '张小红' },
    ],
  },
  {
    key: 'time',
    title: '时间筛选',
    options: [
      { value: 'today', label: '今天' },
      { value: 'week', label: '本周' },
      { value: 'month', label: '本月' },
      { value: 'all', label: '全部' },
    ],
  },
])

// 统计数据
const statistics = ref<StatisticsData>({
  todayConsumption: '¥0.00',
  monthlyConsumption: '¥0.00',
  totalConsumption: '¥0.00',
})

// 消费记录列表
const recordsList = ref<ConsumptionRecord[]>([])

// 查询参数
const queryParams = ref<FilterParams>({
  child: 'all',
  time: 'month',
  page: 1,
  pageSize: 10,
})

// 刷新相关状态
const loading = ref(false)
const refreshLoading = ref(false)
const loaded = ref(false)

// 计算是否为空数据
const empty = computed(
  () => recordsList.value.length === 0 && !loading.value && !refreshLoading.value,
)
const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

// 加载消费记录数据
async function fetchRecords(isRefresh = false) {
  try {
    if (isRefresh) {
      queryParams.value.page = 1
      recordsList.value = []
    }

    const result = await getConsumptionRecords(queryParams.value)

    if (isRefresh) {
      recordsList.value = result.list
    }
    else {
      recordsList.value = [...recordsList.value, ...result.list]
    }

    // 判断是否还有更多数据
    loaded.value = recordsList.value.length >= result.total

    // 如果不是刷新，增加页码
    if (!isRefresh) {
      queryParams.value.page = (queryParams.value.page || 1) + 1
    }
  }
  catch (error) {
    console.error('加载消费记录失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error',
    })
  }
}

// 加载统计数据
async function fetchStatistics() {
  try {
    const result = await getStatistics(queryParams.value)
    statistics.value = result
  }
  catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 下拉刷新
async function onRefresh() {
  refreshLoading.value = true
  try {
    await Promise.all([fetchRecords(true), fetchStatistics()])
  }
  finally {
    refreshLoading.value = false
  }
}

// 上拉加载更多
async function onLoadMore() {
  if (!loaded.value && !loading.value && !refreshLoading.value) {
    loading.value = true
    try {
      await fetchRecords(false)
    }
    finally {
      loading.value = false
    }
  }
}

// 筛选条件变化
function onFilterChange(key: string, value: string | number) {
  console.log('筛选条件变化:', { key, value })

  // 更新查询参数
  queryParams.value = {
    ...queryParams.value,
    [key]: value,
    page: 1,
  }

  // 重新加载数据
  onRefresh()
}

// 初始化数据
async function initData() {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage: any = pages[pages.length - 1]
  const options = currentPage.options || {}

  if (options.studentId) {
    studentId.value = options.studentId
    // 可以根据 studentId 设置默认的筛选条件
    filters.value.child = options.studentId === 'child1' ? 'child1' : 'child2'
  }

  pageLoading.value = false
  await nextTick()
  onRefresh()
}

// 页面加载完成后初始化
onMounted(() => {
  initData()
})
</script>

<template>
  <Page
    title="消费记录"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 筛选器 -->
    <view p="x-4 t-2 b-4">
      <FilterGroup v-model="filters" :filters="filterConfigs" @change="onFilterChange" />
    </view>

    <!-- 消费记录列表 -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :custom-style="contentStyle"
      @refresh="onRefresh"
      @loadmore="onLoadMore"
    >
      <!-- 统计卡片 -->
      <view p="x-4 b-4">
        <WhiteCard>
          <view grid="~ cols-3" gap="4" p="4">
            <view text="center">
              <view text="lg primary" font="bold">
                {{ statistics.todayConsumption }}
              </view>
              <view text="xs text-secondary" m="t-1">
                今日消费
              </view>
            </view>
            <view text="center">
              <view text="lg primary" font="bold">
                {{ statistics.monthlyConsumption }}
              </view>
              <view text="xs text-secondary" m="t-1">
                本月消费
              </view>
            </view>
            <view text="center">
              <view text="lg primary" font="bold">
                {{ statistics.totalConsumption }}
              </view>
              <view text="xs text-secondary" m="t-1">
                总消费
              </view>
            </view>
          </view>
        </WhiteCard>
      </view>

      <view p="x-4" space="y-3">
        <WhiteCard v-for="record in recordsList" :key="record.id" p="4">
          <view flex="~ items-center justify-between">
            <view>
              <view text="sm text-primary" font="medium">
                {{ record.type }}
              </view>
              <view text="xs text-secondary" m="t-1">
                {{ record.studentName }} · {{ record.description }}
              </view>
            </view>
            <view text="right">
              <view
                text="sm"
                font="medium"
                :class="record.isPositive ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatAmount(record.amount, record.isPositive) }}
              </view>
              <view text="xs text-muted" m="t-1">
                {{ record.time }}
              </view>
            </view>
          </view>
        </WhiteCard>
      </view>
    </RefreshList>
  </Page>
</template>
