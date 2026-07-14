# RefreshList 下拉刷新 + 上拉加载组件

一个基于 Vue 3 + uni-app 的下拉刷新和上拉加载组件，支持自定义样式和丰富的配置选项。

## 功能特性

- ✅ **下拉刷新**：支持自定义触摸手势，流畅的动画效果
- ✅ **上拉加载**：滚动到底部自动触发加载更多
- ✅ **空数据状态**：内置空数据展示
- ✅ **加载状态**：支持刷新和加载中状态
- ✅ **TypeScript**：完整的类型定义
- ✅ **插槽支持**：灵活的内容定制
- ✅ **响应式**：完全响应式设计

## 安装使用

### 基础用法

```vue
<template>
  <RefreshList
    :loading="loading"
    :refresh-loading="refreshLoading"
    :loaded="loaded"
    :empty="dataList.length === 0"
    @refresh="handleRefresh"
    @loadmore="handleLoadMore"
  >
    <view
      v-for="(item, index) in dataList"
      :key="index"
      class="list-item"
    >
      {{ item }}
    </view>
  </RefreshList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RefreshList from '@/components/common/refresh-list/index.vue'

const dataList = ref<string[]>([])
const loading = ref(false)
const refreshLoading = ref(false)
const loaded = ref(false)

const handleRefresh = () => {
  // 下拉刷新逻辑
  refreshLoading.value = true
  // 模拟 API 请求
  setTimeout(() => {
    dataList.value = ['新数据1', '新数据2', '新数据3']
    refreshLoading.value = false
  }, 1000)
}

const handleLoadMore = () => {
  // 上拉加载更多逻辑
  loading.value = true
  setTimeout(() => {
    dataList.value.push('更多数据1', '更多数据2')
    loading.value = false
    // 如果没有更多数据了
    loaded.value = true
  }, 1000)
}
</script>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `customStyle` | `string` | `''` | 自定义样式 |
| `empty` | `boolean` | `false` | 是否为空数据状态 |
| `lowerThreshold` | `number` | `200` | 距离底部多少像素时触发加载更多 |
| `loading` | `boolean` | `false` | 是否正在加载更多 |
| `refreshLoading` | `boolean` | `false` | 是否正在下拉刷新 |
| `loaded` | `boolean` | `false` | 是否已加载完毕（没有更多数据） |
| `isRefresh` | `boolean` | `true` | 是否启用下拉刷新功能 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `refresh` | - | 下拉刷新触发 |
| `loadmore` | - | 上拉加载更多触发 |
| `scroll` | `detail: any` | 滚动事件 |

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 主要内容区域 |
| `before` | 列表前的内容 |
| `after` | 列表后的内容 |
| `scrollafter` | 滚动容器内，列表后的内容 |

## 方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <RefreshList ref="refreshListRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const refreshListRef = ref()

// 主动触发刷新
const forceRefresh = () => {
  refreshListRef.value?.forceRefresh()
}
</script>
```

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `forceRefresh` | - | 主动触发下拉刷新 |

## 高级用法

### 自定义空数据状态

```vue
<template>
  <RefreshList :empty="dataList.length === 0">
    <!-- 数据列表 -->
    <view v-for="item in dataList" :key="item.id">
      {{ item.name }}
    </view>

    <!-- 自定义空数据 -->
    <template #scrollafter>
      <view v-if="dataList.length === 0" class="custom-empty">
        <image src="@/static/images/custom-empty.png" />
        <text>暂无相关数据</text>
      </view>
    </template>
  </RefreshList>
</template>
```

### 自定义加载完成提示

```vue
<template>
  <RefreshList :loaded="loaded">
    <!-- 数据列表 -->
    <view v-for="item in dataList" :key="item.id">
      {{ item.name }}
    </view>
    
    <template #scrollafter>
      <view v-if="loaded" class="load-finish">
        <text>🎉 全部数据加载完成</text>
      </view>
    </template>
  </RefreshList>
</template>
```

### 完整的数据管理示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RefreshList from '@/components/common/refresh-list/index.vue'

interface ListItem {
  id: number
  name: string
  description: string
}

const dataList = ref<ListItem[]>([])
const loading = ref(false)
const refreshLoading = ref(false)
const loaded = ref(false)
const page = ref(1)
const pageSize = 20

// 获取数据
const fetchData = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    refreshLoading.value = true
    dataList.value = []
  } else {
    loading.value = true
  }

  try {
    const response = await fetch(`/api/list?page=${page.value}&size=${pageSize}`)
    const result = await response.json()
    
    if (isRefresh) {
      dataList.value = result.data
    } else {
      dataList.value.push(...result.data)
    }
    
    page.value++
    loaded.value = result.data.length < pageSize
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
    refreshLoading.value = false
  }
}

const handleRefresh = () => {
  loaded.value = false
  fetchData(true)
}

const handleLoadMore = () => {
  if (!loaded.value && !loading.value) {
    fetchData(false)
  }
}

onMounted(() => {
  fetchData(true)
})
</script>
```

## 样式定制

组件使用 SCSS 编写，支持通过 CSS 变量或深度选择器进行样式定制：

```scss
// 自定义刷新指示器颜色
:deep(.refresh-dot) {
  background: #007aff !important;
}

// 自定义空数据样式
:deep(.gap-text) {
  color: #666 !important;
  font-size: 30rpx !important;
}

// 自定义容器样式
.custom-refresh-list {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  border-radius: 16rpx;
  overflow: hidden;
}
```

## 注意事项

1. **性能优化**：大量数据时建议使用虚拟滚动
2. **触摸冲突**：避免在组件内部嵌套其他可滚动元素
3. **状态管理**：正确管理 `loading`、`refreshLoading`、`loaded` 状态
4. **错误处理**：在数据请求中添加适当的错误处理逻辑

## 浏览器兼容性

- ✅ 微信小程序
- ✅ 支付宝小程序 
- ✅ H5
- ✅ App (Vue)
- ✅ 快应用

## 更新日志

### v1.0.0
- 🎉 初始版本发布
- ✅ 支持下拉刷新和上拉加载
- ✅ 完整的 TypeScript 支持
- ✅ 丰富的插槽和配置选项