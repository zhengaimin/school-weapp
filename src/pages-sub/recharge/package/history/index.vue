<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "充值记录"
  }
}
</route>

<script lang="ts" setup>
import type { RechargeRecord, TimeFilterType } from './data'
import { computed, onMounted, ref } from 'vue'

import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

import { RECHARGE_RESULT_PATH } from '@/constant/router'

import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'

import {
  filterRechargeRecords,
  getRechargeRecords,
  getStatusConfig,
  getStatusFilterOptions,
  getTimeFilterOptions,
} from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, getContentHeight, onLoginSuccess, onLoginFail } = usePage()

// 页面参数
const studentId = ref('')
// 筛选条件
const filters = ref({
  time: 'all' as TimeFilterType,
  status: 'all',
})

// 筛选器配置
const filterConfigs = computed(() => [
  {
    key: 'time',
    title: '选择时间范围',
    options: getTimeFilterOptions(),
  },
  {
    key: 'status',
    title: '选择支付状态',
    options: getStatusFilterOptions(),
  },
])

// 模拟 API 请求函数
async function fetchRechargeRecords(query: any) {
  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 1000))

  const allRecords = getRechargeRecords(studentId.value)
  const filteredData = filterRechargeRecords(allRecords, filters.value.time, filters.value.status)

  // 模拟分页
  const { page = 1, page_size = 10 } = query
  const start = (page - 1) * page_size
  const end = start + page_size
  const list = filteredData.slice(start, end)

  return {
    code: 0,
    msg: 'success',
    data: {
      list,
      total: filteredData.length,
    },
  }
}

// 使用 useRefresh hook
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: recordsList,
  onRefreshList,
  onLoadMore,
} = useRefresh<RechargeRecord>({
  get: fetchRechargeRecords,
  immediate: false,
})

const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})

// 筛选变化处理
function onFilterChange(key: string, value: string | number) {
  // 重新加载数据
  onRefreshList()
}

// 跳转到充值记录详情
function goToRechargeDetail(record: RechargeRecord) {
  uni.navigateTo({
    url: `${RECHARGE_RESULT_PATH}?recordId=${record.id}`,
  })
}

// 初始化页面数据
function initPageData() {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage: any = pages[pages.length - 1]
  const options = currentPage.options as any

  studentId.value = options.studentId || ''
}

onMounted(async () => {
  initPageData()
  pageLoading.value = false

  // 等待页面完全渲染后再加载数据

  onRefreshList()
})
</script>

<template>
  <Page
    title="话机套餐购买记录"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2!">
      <!-- 筛选区域 -->
      <FilterGroup v-model="filters" :filters="filterConfigs" @change="onFilterChange" />
    </view>

    <!-- 充值记录列表 -->
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      :style="contentStyle"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4" space="y-3">
        <view
          v-for="record in recordsList"
          :key="record.id"
          relative
          overflow="hidden"
          @click="goToRechargeDetail(record)"
        >
          <WhiteCard relative>
            <!-- 背景图标 -->
            <view absolute left--68rpx top-68rpx style="transform: translateY(-50%)">
              <Icon
                :name="getStatusConfig(record.status).icon"
                :icon-color="getStatusConfig(record.status).iconColor"
                icon-size="256rpx"
                custom-class="opacity-10"
              />
            </view>

            <!-- 内容区域 -->
            <view relative z="10">
              <!-- 第一行：套餐名称和金额 -->
              <view flex="~ justify-between items-center" m="b-1">
                <view text="sm gray-900" font="medium">
                  {{ record.packageName }}
                </view>

                <view text="lg gray-900" font="bold">
                  ¥{{ record.amount.toFixed(2) }}
                </view>
              </view>

              <!-- 第二行：状态·充值来源和时间 -->
              <view flex="~ justify-between items-center">
                <view text="xs gray-600">
                  {{ getStatusConfig(record.status).label }} · {{ record.rechargeSource }}
                </view>
                <view text="xs gray-600">
                  {{ record.time }}
                </view>
              </view>
            </view>
          </WhiteCard>
        </view>
      </view>
    </RefreshList>
  </Page>
</template>
