<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "时间选择器示例"
  }
}
</route>

<script lang="ts" setup>
import type { FilterConfig } from '@/components/common/filter-group/index.vue'
import FilterGroup from '@/components/common/filter-group/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'

import { usePage } from '@/hooks/usePage'

defineOptions({
  options: {
    styleIsolation: 'apply-shared', // apply-shared shared
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// FilterGroup 筛选数据
const filtersModel = ref([])

// 筛选器配置
const filterConfigs: FilterConfig[] = [
  {
    key: 'dateRange',
    title: '选择日期',
    type: 'daterange',
    options: [],
  },
  {
    key: 'status',
    title: '选择状态',
    options: [
      { label: '全部', value: 0 },
      { label: '待处理', value: 1 },
      { label: '已完成', value: 2 },
    ],
  },
]
</script>

<template>
  <Page
    title="FilterGroup 混合筛选"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4" space="y-4">
      <!-- FilterGroup 筛选组件 -->
      <FilterGroup v-model="filtersModel" :filters="filterConfigs" />

      <!-- 筛选结果显示 -->
      <WhiteCard>
        <view p="4">
          <view text="lg" font="semibold" m="b-3">
            筛选结果
          </view>
          <pre text="sm" color="text-secondary" overflow="auto">{{ JSON.stringify(filtersModel, null, 2) }}</pre>
        </view>
      </WhiteCard>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
