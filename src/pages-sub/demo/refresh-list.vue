<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "刷新列表测试"
  }
}
</route>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'

import { usePage } from '@/hooks/usePage'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { navBarInfo } = storeToRefs(appStore)
const { pageLoading } = usePage()

// Tab筛选状态
interface TabItem {
  value: string
  label: string
  count?: number
}

const tabList = ref<TabItem[]>([
  { value: 'all', label: '全部', count: 0 },
  { value: 'pending', label: '待处理', count: 0 },
  { value: 'processing', label: '处理中', count: 0 },
  { value: 'completed', label: '已完成', count: 0 },
])

const activeTab = ref('all')

// 示例数据类型
interface DataItem {
  id: number
  title: string
  status: 'pending' | 'processing' | 'completed'
  createTime: string
}

const allDataList = ref<DataItem[]>([])
const loading = ref(false)
const refreshLoading = ref(false)
const loaded = ref(false)
const page = ref(1)
const pageSize = 10

// 根据当前tab筛选的数据
const dataList = computed(() => {
  if (activeTab.value === 'all') {
    return allDataList.value
  }
  return allDataList.value.filter(item => item.status === activeTab.value)
})

// 生成随机状态
function getRandomStatus(): 'pending' | 'processing' | 'completed' {
  const statuses: ('pending' | 'processing' | 'completed')[] = [
    'pending',
    'processing',
    'completed',
  ]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// 初始化加载数据
async function loadData(isRefresh = false) {
  if (isRefresh) {
    page.value = 1
    refreshLoading.value = true
  }
  else {
    loading.value = true
  }

  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newData: DataItem[] = Array.from({ length: pageSize }, (_, i) => {
      const id = (page.value - 1) * pageSize + i + 1
      return {
        id,
        title: `数据项 ${id}`,
        status: getRandomStatus(),
        createTime: new Date().toLocaleDateString(),
      }
    })

    if (isRefresh) {
      allDataList.value = newData
    }
    else {
      allDataList.value.push(...newData)
    }

    page.value++

    // 更新tab计数
    updateTabCounts()

    // 模拟数据加载完毕（假设总共30条数据）
    if (allDataList.value.length >= 30) {
      loaded.value = true
    }
  }
  catch (error) {
    console.error('加载数据失败:', error)
  }
  finally {
    loading.value = false
    refreshLoading.value = false
  }
}

// 更新tab计数
function updateTabCounts() {
  const counts = {
    all: allDataList.value.length,
    pending: allDataList.value.filter(item => item.status === 'pending').length,
    processing: allDataList.value.filter(item => item.status === 'processing').length,
    completed: allDataList.value.filter(item => item.status === 'completed').length,
  }

  tabList.value.forEach((tab) => {
    tab.count = counts[tab.value as keyof typeof counts] || 0
  })
}

// 切换tab
function handleTabChange(value: string) {
  activeTab.value = value
}

// 获取状态文本
function getStatusText(status: string): string {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 下拉刷新
function handleRefresh() {
  loaded.value = false
  loadData(true)
}

// 上拉加载更多
function handleLoadMore() {
  if (!loaded.value && !loading.value) {
    loadData(false)
  }
}

// 页面加载时获取初始数据
onMounted(() => {
  loadData(true)

  setTimeout(() => {
    pageLoading.value = false
  }, 1000)
})
</script>

<template>
  <Page title="刷新测试页面" :loading="pageLoading">
    <view class="tab-container">
      <view class="tab-list">
        <view
          v-for="tab in tabList"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @tap="handleTabChange(tab.value)"
        >
          <text class="tab-label">
            {{ tab.label }}
          </text>
        </view>
      </view>
    </view>

    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="dataList.length === 0 && !loading && !refreshLoading"
      :custom-style="`height: calc(100vh - ${navBarInfo.navBarHeight}px - 108rpx);`"
      @refresh="handleRefresh"
      @loadmore="handleLoadMore"
    >
      <!-- 数据列表 -->
      <view v-for="item in dataList" :key="item.id" class="list-item">
        <view class="item-content">
          <view class="item-left">
            <text class="item-text">
              {{ item.title }}
            </text>
            <text class="item-time">
              {{ item.createTime }}
            </text>
          </view>
          <view class="item-right">
            <text class="status-tag" :class="`status-${item.status}`">
              {{ getStatusText(item.status) }}
            </text>
            <text class="item-index">
              #{{ item.id }}
            </text>
          </view>
        </view>
      </view>
    </RefreshList>
  </Page>
</template>

<style scoped lang="scss">
.header {
  padding: 20rpx;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;

  .title {
    font-size: 32rpx;
    font-weight: bold;
  }
}

// Tab栏样式
.tab-container {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  position: relative;
  padding: 10rpx 16rpx;
  text-align: center;
  transition: all 0.3s ease;

  &.active {
    .tab-label {
      color: #007aff;
      font-weight: 600;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -20rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background-color: #007aff;
      border-radius: 2rpx;
    }
  }

  &:not(.active) {
    .tab-label {
      color: #666;
    }
  }
}

.tab-label {
  font-size: 28rpx;
  font-weight: 400;
}

// 列表项样式
.list-item {
  background-color: white;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.item-content {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.item-time {
  font-size: 24rpx;
  color: #999;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.status-tag {
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 16rpx;
  font-weight: 500;

  &.status-pending {
    background-color: #fff3cd;
    color: #856404;
  }

  &.status-processing {
    background-color: #d1ecf1;
    color: #0c5460;
  }

  &.status-completed {
    background-color: #d4edda;
    color: #155724;
  }
}

.item-index {
  font-size: 24rpx;
  color: #999;
  background-color: #f8f9fa;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.load-finish {
  padding: 40rpx;
  text-align: center;
  color: #999;
  font-size: 24rpx;
}
</style>
