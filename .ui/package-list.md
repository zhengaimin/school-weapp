# 可购买套餐列表 UI 设计文档

## 1. 接口数据结构

```typescript
// 请求参数
interface ReqGetAvailableApi {
  page?: number        // 页码，默认1
  pageSize?: number    // 每页数量，默认20
  deviceType?: TDeviceType  // 设备类型
}

// 套餐信息
interface IPackage {
  id: number                    // 套餐ID
  templateCode: string          // 套餐编码
  packageName: string           // 套餐名称
  packageContent: {
    videoCallMinutes: number    // 视频通话分钟数
    messageCount: number        // 留言条数
  }
  purchasePrice: number         // 实际购买价格
  monthlyPrice: number          // 基础月价格
  totalMonths: number           // 套餐总月数
  templateDescription: string   // 套餐说明
  usageRules: string            // 使用规则
  packageType: 'FIXED' | 'FLEXIBLE'  // 套餐类型
  deviceType: string            // 设备类型
  startTime: string             // 开始时间（固定套餐）
  endTime: string               // 结束时间（固定套餐）
  monthlyDecrease: boolean      // 是否按月递减
}
```

---

## 2. 页面结构

使用 `Page` 组件作为页面容器，配合 `RefreshList` 实现下拉刷新和上拉加载。

```
┌─────────────────────────────────────┐
│  ← 返回    套餐列表 · 话机           │  ← Navigation 导航栏
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │      套餐卡片 1              │   │
│  │  ┌─────┐                    │   │
│  │  │ 标签 │  套餐名称    ¥价格 │   │
│  │  └─────┘                    │   │
│  │  ─────────────────────────  │   │
│  │  通话分钟 | 留言条数 | 月数  │   │  ← RefreshList 可刷新列表
│  │  ─────────────────────────  │   │
│  │  套餐说明文字                │   │
│  │                    [购买]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      套餐卡片 2              │   │
│  │         ...                 │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Page 组件说明

| 属性 | 类型 | 说明 |
|:-----|:-----|:-----|
| `title` | `string` | 页面标题，会自动拼接设备类型 |
| `loading` | `boolean` | 页面加载状态 |
| `showBack` | `boolean` | 是否显示返回按钮，默认 `true` |
| `error` | `string` | 错误信息，有值时显示错误状态 |

### RefreshList 组件说明

| 属性 | 类型 | 说明 |
|:-----|:-----|:-----|
| `loading` | `boolean` | 列表加载状态 |
| `refresh-loading` | `boolean` | 下拉刷新状态 |
| `loaded` | `boolean` | 是否加载完毕 |
| `empty` | `boolean` | 列表是否为空 |

| 事件 | 说明 |
|:-----|:-----|
| `@refresh` | 下拉刷新时触发 |
| `@loadmore` | 上拉加载更多时触发 |

---

## 3. 组件设计

### 3.1 套餐卡片 (PackageCard)

#### 视觉规范

| 属性 | 值 | 说明 |
|:-----|:---|:-----|
| 背景色 | `#ffffff` | 白色背景 |
| 圆角 | `rounded-xl` (24rpx) | 标准卡片圆角 |
| 内边距 | `p-4` (32rpx) | 标准内边距 |
| 卡片间距 | `gap-3` (24rpx) | 卡片之间的间距 |
| 边框 | `border-1 border-gray-100` | 细边框 |

#### 卡片内部结构

```vue
<template>
  <!-- 套餐卡片 -->
  <view
    v-for="pkg in packages"
    :key="pkg.id"
    bg="white"
    p="4"
    rounded-xl
    border="1 solid gray-100"
  >
    <!-- 头部：标签 + 名称 + 价格 -->
    <view flex="~ row items-center justify-between" mb="3">
      <view flex="~ row items-center" gap="2">
        <!-- 套餐类型标签 -->
        <view
          px="2"
          py="1"
          rounded
          text="2xs white"
          :bg="pkg.packageType === 'FIXED' ? 'primary' : 'success'"
        >
          {{ pkg.packageType === 'FIXED' ? '固定' : '灵活' }}
        </view>
        <!-- 套餐名称 -->
        <text text="lg gray-800" font="bold">
          {{ pkg.packageName }}
        </text>
      </view>
      <!-- 价格 -->
      <view flex="~ col items-end">
        <text text="xl" font="bold" text-color="error">
          ¥{{ pkg.purchasePrice }}
        </text>
        <text v-if="pkg.totalMonths > 1" text="2xs gray-400">
          ≈¥{{ Math.round(pkg.purchasePrice / pkg.totalMonths) }}/月
        </text>
      </view>
    </view>

    <!-- 分隔线 -->
    <view h="1px" bg="gray-100" my="3" />

    <!-- 套餐内容：图标 + 数据 -->
    <view flex="~ row" gap="4" mb="3">
      <!-- 通话分钟 -->
      <view flex="~ row items-center" gap="1">
        <view w="8" h="8" rounded-full bg="primary-50" flex="~ items-center justify-center">
          <text text="xs primary">📞</text>
        </view>
        <view flex="~ col">
          <text text="sm gray-800" font="medium">
            {{ pkg.packageContent.videoCallMinutes }}
          </text>
          <text text="2xs gray-400">分钟</text>
        </view>
      </view>

      <!-- 留言条数 -->
      <view flex="~ row items-center" gap="1">
        <view w="8" h="8" rounded-full bg="secondary/10" flex="~ items-center justify-center">
          <text text="xs secondary">💬</text>
        </view>
        <view flex="~ col">
          <text text="sm gray-800" font="medium">
            {{ pkg.packageContent.messageCount }}
          </text>
          <text text="2xs gray-400">条留言</text>
        </view>
      </view>

      <!-- 套餐时长 -->
      <view flex="~ row items-center" gap="1">
        <view w="8" h="8" rounded-full bg="accent/10" flex="~ items-center justify-center">
          <text text="xs accent">📅</text>
        </view>
        <view flex="~ col">
          <text text="sm gray-800" font="medium">
            {{ pkg.totalMonths }}
          </text>
          <text text="2xs gray-400">个月</text>
        </view>
      </view>
    </view>

    <!-- 套餐说明与使用规则 -->
    <view v-if="pkg.templateDescription || pkg.usageRules" flex="~ col" gap="2" mb="3">
      <!-- 套餐说明 -->
      <view v-if="pkg.templateDescription" p="2" bg="gray-50" rounded="lg">
        <text text="xs gray-500" leading="relaxed">
          {{ pkg.templateDescription }}
        </text>
      </view>
      <!-- 使用规则 -->
      <view v-if="pkg.usageRules" p="2" bg="primary/5" rounded="lg">
        <text text="2xs primary" font="semibold" block mb="0.5">使用规则</text>
        <text text="xs primary" leading="relaxed">
          {{ pkg.usageRules }}
        </text>
      </view>
    </view>

    <!-- 固定套餐有效期 -->
    <view v-if="pkg.packageType === 'FIXED'" mb="3" p="2" bg="gray-50" rounded>
      <text text="2xs gray-500">
        有效期：{{ pkg.startTime }} 至 {{ pkg.endTime }}
      </text>
    </view>

    <!-- 购买按钮 -->
    <view flex="~ row justify-end">
      <view
        px="6"
        py="2"
        rounded-full
        bg="primary"
        text="sm white"
        font="medium"
        @click="handleBuy(pkg)"
      >
        立即购买
      </view>
    </view>
  </view>
</template>
```

---

### 3.2 颜色配置

根据 UI-DESIGN-GUIDE.md 规范：

| 元素 | 颜色 | Token |
|:-----|:-----|:------|
| 价格文字 | `#ef4444` | `error` |
| 固定套餐标签 | `#3269dd` | `primary` |
| 灵活套餐标签 | `#10b981` | `success` |
| 套餐名称 | `#1f2937` | `gray-800` |
| 说明文字 | `#6b7280` | `gray-500` |
| 次要信息 | `#9ca3af` | `gray-400` |
| 购买按钮 | `#3269dd` | `primary` |
| 卡片边框 | `#f3f4f6` | `gray-100` |
| 图标背景 | 各色 10% 透明度 | `primary-50`, `secondary/10`, `accent/10` |

---

### 3.3 空状态

```vue
<template>
  <view v-if="packages.length === 0" flex="~ col items-center justify-center" py="20">
    <view text="4xl" mb="4">📦</view>
    <text text="base gray-500">暂无可购买套餐</text>
  </view>
</template>
```

---

## 4. 完整页面代码示例

```vue
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
import type { Pkg } from '@/api/interface/modules/package'
import { ref } from 'vue'
import { getAvailablePackagesApi } from '@/api/modules/package'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { useRefresh } from '@/hooks/useRefresh'
import { DEVICE_TYPE } from '@/constant/modules'

const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: packages,
  onRefreshList,
  onLoadMore,
} = useRefresh<Pkg.Query.IPackage>({
  get: (params) => getAvailablePackagesApi({
    ...params,
    deviceType: DEVICE_TYPE.VIDEO  // 单设备类型
  }),
  listField: 'packages',
})

function handleBuy(pkg: Pkg.Query.IPackage) {
  // 购买逻辑
  console.log('购买套餐:', pkg.id)
}
</script>

<template>
  <Page title="可购买套餐">
    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 y-3" flex="~ col" gap="3">
        <!-- 套餐卡片列表 -->
        <view
          v-for="pkg in packages"
          :key="pkg.id"
          bg="white"
          p="4"
          rounded-xl
          border="1 solid gray-100"
        >
          <!-- 头部 -->
          <view flex="~ row items-center justify-between" mb="3">
            <view flex="~ row items-center" gap="2">
              <view
                px="2"
                py="1"
                rounded
                text="2xs white"
                :class="pkg.packageType === 'FIXED' ? 'bg-primary' : 'bg-success'"
              >
                {{ pkg.packageType === 'FIXED' ? '固定' : '灵活' }}
              </view>
              <text text="lg gray-800" font="bold">
                {{ pkg.packageName }}
              </text>
            </view>
            <view flex="~ col items-end">
              <text text="xl error" font="bold">
                ¥{{ pkg.purchasePrice }}
              </text>
              <text v-if="pkg.totalMonths > 1" text="2xs gray-400">
                ≈¥{{ Math.round(pkg.purchasePrice / pkg.totalMonths) }}/月
              </text>
            </view>
          </view>

          <!-- 分隔线 -->
          <view h="1px" bg="gray-100" my="3" />

          <!-- 套餐内容 -->
          <view flex="~ row" gap="6" mb="3">
            <view flex="~ col items-center">
              <text text="lg gray-800" font="bold">
                {{ pkg.packageContent.videoCallMinutes }}
              </text>
              <text text="2xs gray-400">通话分钟</text>
            </view>
            <view flex="~ col items-center">
              <text text="lg gray-800" font="bold">
                {{ pkg.packageContent.messageCount }}
              </text>
              <text text="2xs gray-400">留言条数</text>
            </view>
            <view flex="~ col items-center">
              <text text="lg gray-800" font="bold">
                {{ pkg.totalMonths }}
              </text>
              <text text="2xs gray-400">个月</text>
            </view>
          </view>

          <!-- 说明 -->
          <view v-if="pkg.templateDescription" mb="3">
            <text text="xs gray-500">{{ pkg.templateDescription }}</text>
          </view>

          <!-- 固定套餐有效期 -->
          <view v-if="pkg.packageType === 'FIXED'" mb="3" p="2" bg="gray-50" rounded>
            <text text="2xs gray-500">
              有效期：{{ pkg.startTime }} 至 {{ pkg.endTime }}
            </text>
          </view>

          <!-- 购买按钮 -->
          <view flex="~ row justify-end">
            <view
              px="6"
              py="2"
              rounded-full
              bg="primary"
              text="sm white"
              font="medium"
              @click="handleBuy(pkg)"
            >
              立即购买
            </view>
          </view>
        </view>
      </view>
    </RefreshList>
  </Page>
</template>
```

---

## 5. 设计要点总结

1. **卡片式布局**：白底圆角卡片，符合项目整体风格
2. **价格突出**：使用 `error` 红色突出价格信息
3. **标签区分**：用颜色标签区分固定/灵活套餐类型
4. **信息层次**：名称 > 价格 > 内容数据 > 说明文字
5. **操作明确**：购买按钮使用主色，位置固定在右下角
6. **单设备类型**：通过 `deviceType` 参数筛选，简化展示

---

**文档版本**: v1.0
**创建日期**: 2025-12-31
