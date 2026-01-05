# Vue 开发规范

本文档包含 Vue 组件和页面的开发规范，涵盖代码组织、命名规范、样式规范等内容。

---

# 组件开发规范

## Template 点击事件规范
如果 template 中只有一个根节点，需要添加标准的点击事件处理：

### 事件处理规范
1. 添加 `@click.stop="e => emit('click', e)"` 事件
2. 确保在 `defineEmits` 中定义了正确的 `click` 事件类型
3. 事件类型必须为 `click: [event: Event]`

### 示例
```vue
<script lang="ts" setup>
import type { DataType } from '@/types'

const props = defineProps<{
  data: DataType
}>()

const emit = defineEmits<{
  click: [event: Event]
  action: [data: DataType]
}>()

/** 处理操作事件 */
function handleAction() {
  emit('action', props.data)
}
</script>

<template>
  <view class="component-wrapper" @click.stop="e => emit('click', e)">
    <!-- 组件内容 -->
    <view>{{ data.title }}</view>
    <button @click.stop="handleAction">操作</button>
  </view>
</template>
```

## 注意事项
1. 点击事件的事件参数类型必须为 `Event`
2. 使用 `@click.stop` 防止事件冒泡
3. 确保 TypeScript 类型定义正确
4. 所有方法定义必须在函数上方添加简短的单行 JSDoc 注释（使用 /** */ 格式），说明函数目的与行为，便于阅读与维护
5. 间距使用规范：在组件模板中，应避免直接使用 space="y-<n>" 这类垂直间距原子类，建议使用弹性布局配合 gap 来控制垂直间距。示例：
```vue
<!-- 不推荐 -->
<view p="4" space="y-3">
  ...
</view>

<!-- 推荐：使用 flex + gap -->
<view p="4" flex="~ col" gap="3">
  ...
</view>
```
此规则适用于所有组件模板，确保布局语义清晰且与项目的 UnoCSS/Attributify 风格保持一致。
6. 禁止使用 `// #region` 和 `// #endregion` 注释进行代码折叠，代码组织应通过合理的结构和 JSDoc 注释来体现

## Icon 组件使用规范

Icon 组件使用 `icon-color` 和 `icon-size` 属性，而不是 `color` 和 `size` 字段：

```vue
<Icon name="history-line" :icon-color="NAVIGATION_SUFFIX_COLOR" :icon-size="NAVIGATION_SUFFIX_SIZE" />
```

## 帮助弹框组件使用规范

使用 BottomPopup 组件创建帮助弹框：

```vue
<BottomPopup v-model="showHelpModal" title="绑定说明" height="auto">
  <view p="4 b-6" text-sm color-text-secondary space-y-2>
    <view v-for="(item, index) in helpContent" :key="index" flex="~">
      <text mr-2>
        ·
      </text>
      <text flex-1>
        {{ item }}
      </text>
    </view>
  </view>
</BottomPopup>
```# 页面开发规范

## 通用开发规范
1. 始终使用中文回复。不要进行测试、不要写文档
2. 不要修改、扫描 `src/uni_modules` 目录下的文件

## 核心技术栈
- **框架**: uniapp (Vue3 + TypeScript + Vite5)
- **UI组件库**: wot-design-uni
- **CSS框架**: UnoCSS + SCSS
- **状态管理**: Pinia + persistedstate
- **请求库**: Alova
- **分页组件**: z-paging
- **包管理器**: pnpm

## 项目结构规范
```
src/
├── api/             # API 接口
├── components/      # 公共组件
├── constant/        # 常量文件
├── hooks/           # hooks
├── http/            # 网络请求
├── layouts/         # 布局组件
├── pages/           # 页面文件
│   ├── index/       # 首页模块
│   ├── finance/     # 交易模块
│   └── profile/     # 个人中心模块
├── pages-sub/       # 分包页面
├── router/          # 路由配置
├── static/          # 静态资源
├── store/           # Pinia 状态管理
├── style/           # 全局样式
├── types/           # TypeScript 类型定义
├── uni_modules/     # uni_modules -> 不需要修改、读取
└── utils/          # 工具函数
```

## 页面开发基本规范
1. 通过 `html` 文件 创建/更新 页面，需要参考 `.roo/rules/page.md` 中 `样式和布局规范` 章节
2. 创建页面时，需要在 `@/constant/router` 同步添加常量按照 router 文件的风格，新建一个在任务末尾告诉我新建了什么页面路径
3. uni.navigateTo 时，优先使用 `@/constant/router` 下的常量，没有则新建按照 router 文件的风格，新建一个在任务末尾告诉我新建了什么页面路径
4. 无论是什么页面，都需要使用 `.roo/rules/page.md` 中 `完整的页面模板示例` 作为基础模板

## 骨架屏开发规范
通过 vue、html 生成骨架屏，需要参考 `.roo/rules/skeleton.md`

## Vue 语法规范
- 组件定义双向绑定的时候，使用 `defineModel` 而不是 `update:xxx`

## 提示组件使用规范
- message 优先使用 wot ui 的组件 `useMessage`
- toast 优先使用 uni 的 api，icon 参数默认为 none

## 目录

1. [Page 组件使用规范](#1-page-组件使用规范)
   - 1.1 基本用法
   - 1.2 Props 属性
   - 1.3 事件处理
   - 1.4 插槽使用

2. [usePage Hook 使用模式](#2-usepage-hook-使用模式)
   - 2.1 基本用法
   - 2.2 状态管理
   - 2.3 接口调用策略
   - 2.4 页面高度计算

3. [接口函数命名和封装规范](#3-接口函数命名和封装规范)
   - 3.1 命名规范
   - 3.2 文件组织
   - 3.3 接口封装

4. [页面结构组织规范](#4-页面结构组织规范)
   - 4.1 route 配置
   - 4.2 script 结构
   - 4.3 template 结构
   - 4.4 style 规范

5. [组件导入和使用规范](#5-组件导入和使用规范)
   - 5.1 导入规范
   - 5.2 组件使用

6. [表单处理和验证模式](#6-表单处理和验证模式)
   - 6.1 useForm Hook 使用
   - 6.2 表单组件使用
   - 6.3 表单验证

7. [样式和布局规范](#7-样式和布局规范)
   - 7.1 UnoCSS 使用
   - 7.2 布局规范
   - 7.3 响应式设计

8. [完整的页面模板示例](#8-完整的页面模板示例)

9. [常见问题和注意事项](#9-常见问题和注意事项)
## 1. Page 组件使用规范

Page 组件是所有页面的基础组件，提供了页面的基本结构、导航、加载状态处理等功能。

### 1.1 基本用法

```vue
<template>
  <Page
    title="页面标题"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 页面内容 -->
    <view>页面内容</view>
  </Page>
</template>
```

### 1.2 Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| title | String | '' | 页面标题 |
| showTabbar | Boolean | false | 是否显示 tabBar |
| showBack | Boolean | true | 是否显示返回按钮 |
| error | String | '' | 错误信息 |
| scrollY | Boolean | true | 是否允许纵向滚动 |
| loading | v-model | false | 页面加载状态 |

### 1.3 事件处理

| 事件名 | 说明 | 回调参数 |
|-------|------|---------|
| scroll | 滚动事件 | 滚动事件对象 |
| login:success | 登录成功事件 | - |
| login:fail | 登录失败事件 | - |

### 1.4 插槽使用

Page 组件提供了多个插槽以满足不同的页面需求：

#### header-right 插槽

用于在导航栏右侧添加自定义内容：

```vue
<template #header-right>
  <view flex="~ row items-center justify-center" h-full gap="4">
    <Icon
      name="information-line"
      :icon-color="NAVIGATION_SUFFIX_COLOR"
      :icon-size="NAVIGATION_SUFFIX_SIZE"
      @click="showInfo"
    />
  </view>
</template>
```

#### skeleton 插槽

用于自定义页面加载时的骨架屏：

```vue
<template #skeleton>
  <Skeleton />
</template>
```

骨架屏的开发规范请参考 `.roo/rules/skeleton.md`。
## 2. usePage Hook 使用模式

usePage Hook 提供了页面开发中常用的逻辑复用功能，包括状态管理、接口调用策略和页面高度计算等。

### 2.1 基本用法

```ts
import { usePage } from '@/hooks/usePage'

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
```

### 2.2 状态管理

usePage Hook 提供了以下响应式状态：

| 状态 | 类型 | 说明 |
|------|------|------|
| pageLoading | Ref<boolean> | 页面加载状态 |
| pageError | Ref<string> | 页面错误信息 |

### 2.3 接口调用策略

#### batchRequestHandler

用于批量处理多个接口请求，统一处理成功和失败状态：

```ts
const { batchRequestHandler } = usePage()

async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}
```

#### 登录事件处理

```ts
const { onLoginSuccess, onLoginFail } = usePage()

// 登录成功处理
function handleLoginSuccess() {
  onLoginSuccess()
}

// 登录失败处理
## 3. 接口函数命名和封装规范

接口函数的命名和封装遵循统一规范，确保代码的一致性和可维护性。

### 3.1 命名规范

接口函数采用动词+名词的形式，动词表示操作类型，名词表示操作对象：

- `get` - 获取数据
- `post` - 创建数据
- `put` - 更新数据
- `delete` - 删除数据
- `patch` - 部分更新数据

示例：
```ts
// 获取待处理退款信息
getPendingRefundApi()

// 提交退费申请
postApplyRefundApi()```

### 3.2 文件组织

接口文件按模块组织，分为接口定义和接口实现两部分：

```
src/api/
├── interface/           # 接口定义
│   └── modules/         # 按模块分类
│       └── refund.ts    # 退款模块接口定义
└── modules/             # 接口实现
    └── refund/          # 退款模块
        └── index.ts     # 退款接口实现
```

### 3.3 接口封装

#### 接口定义

在 `src/api/interface/modules/refund.ts` 中定义接口类型：

```ts
export namespace Refund {
  /** 申请退款请求参数 */
  export interface ApplyRefundReq {
    /** 退款类型 FULL-全额退款 */
    refundType: 'FULL'
    /** 申请原因 */
    applyReason: string
  }
  
  /** 申请退款响应数据 */
  export interface ApplyRefundRes {
    /** 申请金额 */
    applyAmount: number
    /** 申请时间 */
    applyTime: string
  }
}
```

#### 接口实现

在 `src/api/modules/refund/index.ts` 中实现接口：

```ts
import type { Refund } from '@/api/interface/modules/refund'
## 4. 页面结构组织规范

页面文件遵循统一的结构组织规范，确保代码的一致性和可维护性。

### 4.1 route 配置

页面路由配置使用 jsonc 格式，包含布局和样式设置：

```vue
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "申请退费"
  }
}
</route>
```

### 4.2 script 结构

页面脚本部分采用以下结构：

```vue
<script lang="ts" setup>
import type { Refund } from '@/api/interface/modules/refund'
import { computed, onMounted, ref } from 'vue'
import { getPendingRefundApi, postApplyRefundApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import { REFUND_HISTORY_PATH } from '@/constant/router'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/parent'
import { refundNotices, refundProcessSteps, refundRules } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView } = useForm('.apply-scroll')

const parentStore = useParentStore()

const formData = ref({
  refundType: 'FULL',
  reason: '',
})

const refundTypeOptions = computed(() => {
  return REFUND_TYPE_OPTIONS.map(option => ({
    ...option,
    suffix: currentBalanceText.value,
  }))
})

const rules = {
  reason: [
    { required: true, message: '请输入退费原因', trigger: 'blur' },
    { min: 5, max: 200, message: '退费原因应为5-200个字符', trigger: 'blur' },
  ],
}

/** 获取待处理退款信息 */
async function axiosGetPendingRefundApi() {
  try {
    const result = await getPendingRefundApi()
    if (result.code === 0) {
      // 处理数据逻辑
    }
    return result
  }
  catch (error) {
    console.error('获取退款信息失败:', error)
    throw error
  }
}

/** 提交退费申请 */
async function handleSubmitRefund() {
  try {
    const { valid } = await validate(['reason'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true

    const result = await postApplyRefundApi({
      refundType: formData.value.refundType,
      applyReason: formData.value.reason,
    })

    uni.showToast({
      title: '申请提交成功',
      icon: 'success',
    })
  }
  catch (error) {
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}

onMounted(() => {
  // 页面初始化逻辑
})
</script>
```

#### 代码组织规范

为了提高代码的可读性，建议按以下顺序组织代码：

1. **类型定义导入**（import type）
2. **Vue 相关函数**
3. **接口函数**
4. **组件**
5. **常量**
6. **Hooks**
7. **Store**
8. **本地数据/组件**
9. **组件选项配置**（defineOptions）
10. **Hook 函数调用**
11. **Store 相关调用**
12. **响应式数据**（ref、reactive）
13. **计算属性**（computed）
14. **验证规则**
15. **接口请求函数**（与后端API交互的函数）
16. **方法定义**（通用方法函数，如 refreshPage 等）
17. **事件处理函数**（用户交互事件处理）
18. **生命周期钩子**（Vue 生命周期函数及 onLoginSuccess、onShow 等）

#### 重要说明

- **接口请求函数**：专门用于存放与后端API交互的函数，如获取数据、提交数据等请求函数
- **方法定义**：包含通用的方法函数，如页面刷新方法、数据处理方法、工具方法等
  - 规则：所有方法定义必须在函数上方添加简短的单行 JSDoc 注释（使用 /** */ 格式），说明函数的主要作用与行为
- **事件处理函数**：专门处理用户交互事件的函数，如按钮点击、表单提交等
- **生命周期钩子**：包含所有 Vue 生命周期函数（onMounted、onUnmounted 等）以及页面相关的生命周期函数（onLoginSuccess、onShow 等）

```vue
<script lang="ts" setup>
import type { Refund } from '@/api/interface/modules/refund'
import { computed, onMounted, ref } from 'vue'
import { getPendingRefundApi, postApplyRefundApi } from '@/api/modules/refund'
import Page from '@/components/common/page/index.vue'
import { REFUND_HISTORY_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail } = usePage()

const pendingRefund = ref<Refund.PendingRefundInfo>()

const hasPendingRefund = computed(() => !!pendingRefund.value)

/** 获取待处理退款信息 */
async function axiosGetPendingRefundApi() {
  try {
    const result = await getPendingRefundApi()
    if (result.code === 0) {
      pendingRefund.value = result.data
    }
    return result
  }
  catch (error) {
    console.error('获取待处理退款信息失败:', error)
    throw error
  }
}

/** 提交退款申请 */
async function axiosPostRefundApi(params: Refund.ApplyRefundReq) {
  try {
    const result = await postApplyRefundApi(params)
    if (result.code === 0) {
      // 处理提交成功逻辑
    }
    return result
  }
  catch (error) {
    console.error('提交退款申请失败:', error)
    throw error
  }
}

/** 刷新页面数据 */
async function refreshPage() {
  await batchRequestHandler([axiosGetPendingRefundApi()])
}

/** 格式化金额显示 */
function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

/** 根据状态获取显示文本 */
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: '待处理',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
  }
  return statusMap[status] || '未知状态'
}

/** 跳转到详情页 */
function handleGoToDetail() {
  uni.navigateTo({ url: REFUND_HISTORY_PATH })
}

/** 提交退费申请 */
async function handleSubmitRefund() {
  try {
    await axiosPostRefundApi({
      refundType: 'FULL',
      applyReason: '申请退费'
    })
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })
  }
  catch (error) {
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none'
    })
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}

onMounted(() => {
  // 页面初始化逻辑
})

onShow(() => {
  // 页面显示时的逻辑
})
</script>
```

#### 重要说明

- **接口请求函数**：专门用于存放与后端API交互的函数，如获取数据、提交数据等请求函数
  - 示例：`axiosGetPendingRefundApi()`、`axiosPostRefundApi()`
- **方法定义**：包含通用的方法函数，如页面刷新方法、数据处理方法、工具方法等
  - 示例：`refreshPage()`、`formatAmount()`、`getStatusText()`
- **事件处理函数**：专门处理用户交互事件的函数，如按钮点击、表单提交等
  - 示例：`handleGoToDetail()`、`handleSubmitRefund()`
- **生命周期钩子**：包含所有 Vue 生命周期函数（onMounted、onUnmounted 等）以及页面相关的生命周期函数（onLoginSuccess、onShow 等）
## 5. 组件导入和使用规范

组件导入和使用遵循统一规范，确保代码的一致性和可维护性。

### 5.1 导入规范

按照以下顺序进行导入：

1. **类型定义导入**（import type）
2. **Vue 相关函数**
3. **接口函数**
4. **组件**
5. **常量**
6. **Hooks**
7. **Store**
8. **本地数据/组件**

示例：
```ts
import type { Refund } from '@/api/interface/modules/refund'
import { computed, onMounted, ref } from 'vue'
import { getPendingRefundApi, postApplyRefundApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import { REFUND_HISTORY_PATH } from '@/constant/router'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/parent'
import { refundNotices, refundProcessSteps, refundRules } from './data'
```

### 5.2 组件使用

#### 基础组件使用

所有页面必须使用 Page 组件作为根组件：

```vue
<template>
  <Page
    title="页面标题"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 页面内容 -->
  </Page>
</template>
```

#### 表单组件使用

表单相关组件使用规范：

```vue
<!-- 表单容器 -->
<Form ref="formRef" :model="formData" :rules="rules">
  <view flex="~ col" gap="2.5">
    <!-- 表单字段容器 -->
    <Cell id="reason" required label="退费原因" prop="reason">
      <!-- 表单控件 -->
      <wd-textarea
        v-model="formData.reason"
        prop="reason"
        placeholder="请输入退费原因"
        :maxlength="200"
      />
    </Cell>
  </view>
</Form>
```

#### 公共组件使用

公共组件按需导入使用：

```vue
<!-- 按钮组件 -->
<TButton
  type="primary"
  size="large"
  block
  :loading="submitLoading"
  @click="handleSubmit"
>
  提交
</TButton>

<!-- 图标组件 -->
<Icon
  name="information-line"
  :icon-color="NAVIGATION_SUFFIX_COLOR"
  :icon-size="NAVIGATION_SUFFIX_SIZE"
  @click="showInfo"
/>
```

#### form 表单
1. 使用 `@/components/form/index/index.vue` 组件，标签为 `Form`
2. Cell 使用 `@/components/form/cell/index.vue` 组件，标签为 `Cell`
  - `Cell` 必须添加 `prop`, `id`, `label` 属性
  - `Cell` 组件插槽内容不需要添加 `prop`，除非我特殊说明，你才需要添加
3. 单选使用 `@/components/form/radio/index.vue` 组件，标签为 `Radio`
4. 下拉框使用 `@/components/form/picker/index.vue` 组件，标签为 `Picker`

出去上述规则外，优先使用 wot ui 组件库的组件

#### 基础模板
根据模板内容生成基础的页面内容
```vue
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
</route>

<script lang="ts" setup>
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'

defineOptions({
  options: {
    styleIsolation: 'apply-shared', // apply-shared shared
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
</script>

<template>
  <Page
    title=""
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <text>111</text>
  </Page>
</template>

<style scoped lang="scss"></style>
```

## 表单完整示例

```vue
<template>
  <!-- 内容区域 -->
  <scroll-view
    class="apply-scroll"
    scroll-y
    :enhanced="true"
    :show-scrollbar="false"
    :scroll-with-animation="true"
    :scroll-into-view="scrollIntoView"
    :style="contentHeight"
  >
    <view box-border p="x-4 t-2 b-4">
      <!-- 退费申请表单 -->
      <WhiteCard>
        <Form ref="formRef" :model="formData" :rules="rules">
          <view flex="~ col" gap="2.5">
            <!-- 孩子选择 -->
            <Cell id="childId" required label="选择孩子" prop="childId">
              <Radio
                v-model="formData.childId"
                :options="childrenOptions"
                @change="onChildChange"
              />
            </Cell>

            <!-- 退费金额 -->
            <Cell id="refundType" required label="退费金额" prop="refundType">
              <Radio
                v-model="formData.refundType"
                :options="refundTypeOptions"
                :columns="2"
                @change="onRefundTypeChange"
              />

              <!-- 部分退费金额输入 -->
              <view v-if="formData.refundType === 'partial'" m="t-3">
                <wd-input
                  v-model.number="formData.partialAmount"
                  prop="partialAmount"
                  type="number"
                  placeholder="请输入退费金额"
                  :rules="rules.partialAmount"
                />
                <view text="xs gray-500" m="t-1">
                  最大可退费金额: {{ maxRefundAmount }}
                </view>
              </view>
            </Cell>

            <!-- 退费原因 -->
            <Cell id="reason" required label="退费原因" prop="reason">
              <Radio
                v-model="formData.reason"
                :options="refundReasonOptions"
                :columns="2"
                @change="onRefundReasonChange"
              />

              <!-- 其他原因输入 -->
              <view v-if="formData.reason === 'other'" m="t-3">
                <wd-textarea
                  v-model="formData.otherReason"
                  prop="otherReason"
                  placeholder="请详细说明退费原因"
                  :rules="rules.otherReason"
                  :maxlength="200"
                />
              </view>
            </Cell>

            <!-- 联系人姓名 -->
            <Cell id="contactName" required label="联系人姓名" prop="contactName">
              <wd-input
                v-model="formData.contactName"
                prop="contactName"
                placeholder="请输入联系人姓名"
                :rules="rules.contactName"
              />
            </Cell>

            <!-- 联系电话 -->
            <Cell id="contactPhone" required label="联系电话" prop="contactPhone">
              <wd-input
                v-model="formData.contactPhone"
                prop="contactPhone"
                type="tel"
                placeholder="请输入联系电话"
                :rules="rules.contactPhone"
              />
            </Cell>
          </view>
        </Form>
      </WhiteCard>
    </view>
  </scroll-view>

  <view p="4">
    <!-- 提交申请按钮 -->
    <TButton
      type="primary"
      size="large"
      block
      :loading="submitLoading"
      @click="handleSubmitRefund"
    >
      提交退费申请
    </TButton>
  </view>
</template>

<script lang="ts" setup>
import Form from '@/components/form/index/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Radio from '@/components/form/radio/index.vue'
import { useForm } from '@/hooks/useForm'

const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView }
  = useForm('.apply-scroll')

/** 提交退费申请 */
async function handleSubmitRefund() {
  try {
    // 动态验证规则：根据表单状态验证不同字段
    const fieldsToValidate = ['childId', 'refundType', 'reason', 'contactName', 'contactPhone']

    // 如果是部分退费，验证退费金额
    if (formData.value.refundType === 'partial') {
      fieldsToValidate.push('partialAmount')
    }

    // 如果是其他原因，验证其他原因文本
    if (formData.value.reason === 'other') {
      fieldsToValidate.push('otherReason')
    }

    const { valid } = await validate(fieldsToValidate)
    if (!valid) {
      // 滚动到第一个错误字段
      scrollToFirstError()
      return
    }

    submitLoading.value = true

    // 提交申请
    const result = await submitRefundApplication(formData.value)

    // ...
  }
  catch (error) {
    console.error('xxx失败:', error)
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}
</script>
```

#### 刷新列表
1. 如果需要筛选区域则使用 `@/components/common/filter-group/index.vue` 组件
2. 需要通过 `contentStyle` 计算出 `RefreshList` 组件的高度
3. 使用 `useRefresh` 来辅助实现 `RefreshList`

```
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'

const { getContentHeight } = usePage()
const {
  loading,
  refreshLoading,
  loaded,
  empty,
  list: recordsList,
  onRefreshList,
  onLoadMore,
} = useRefresh<RefundRecord>({
  // fetchRefundRecords - 模拟 API 请求函数
  get: fetchRefundRecords,
  immediate: false,
})

const contentStyle = computed(() => {
  return getContentHeight('140rpx')
})


<view p="4 t-2!">
  <!-- 筛选区域 -->
  <FilterGroup v-model="filters" :filters="filterConfigs" @change="onFilterChange" />
</view>

<!-- 退款记录列表 -->
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
      @click="goToRefundDetail(record)"
    >
      <WhiteCard relative>
        <!-- 背景图标 -->
        <view absolute style="left: -34px; top: 34px; transform: translateY(-50%)">
          <Icon
            :name="getStatusConfig(record.status).icon"
            :icon-color="getStatusConfig(record.status).iconColor"
            icon-size="256rpx"
            custom-class="opacity-10"
          />
        </view>

        <!-- 内容区域 -->
        <view relative z="10">
          <!-- 第一行：姓名和金额 -->
          <view flex="~ justify-between items-center" m="b-1">
            <view text="sm gray-900" font="medium">
              {{ record.studentName }}
            </view>
            <view text="lg gray-900" font="bold">
              ¥{{ record.amount.toFixed(2) }}
            </view>
          </view>

          <!-- 第二行：状态和退款方式 -->
          <view flex="~ justify-between items-center" m="b-2">
            <view text="xs gray-600">
              {{ getStatusConfig(record.status).label }} · {{ record.refundMethod }}
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
```

#### header-right 插槽
```
import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'

<template #header-right>
  <view flex="~ row items-center justify-center" h-full gap="4">
    <Icon
      name="information-line"
      :icon-color="NAVIGATION_SUFFIX_COLOR"
      :icon-size="NAVIGATION_SUFFIX_SIZE"
      @click="showRefundInfo"
    />
    <Icon
      name="history-line"
      :icon-color="NAVIGATION_SUFFIX_COLOR"
      :icon-size="NAVIGATION_SUFFIX_SIZE"
      @click="goToRefundHistory"
    />
  </view>
</template>
```

#### Icon
是 icon-color 和 icon-size 不是 color、size 字段
```
<Icon name="history-line" :icon-color="NAVIGATION_SUFFIX_COLOR" :icon-size="NAVIGATION_SUFFIX_SIZE" />
```

#### 帮助弹框
```
<BottomPopup v-model="showHelpModal" title="绑定说明" height="auto">
  <view p="4 b-6" text-sm color-text-secondary space-y-2>
    <view v-for="(item, index) in helpContent" :key="index" flex="~">
      <text mr-2>
        ·
      </text>
      <text flex-1>
        {{ item }}
      </text>
    </view>
  </view>
</BottomPopup>
```
## 6. 表单处理和验证模式

表单处理和验证使用 useForm Hook 和相关表单组件实现。

### 6.1 useForm Hook 使用

useForm Hook 提供了表单处理的常用功能：

```ts
import { useForm } from '@/hooks/useForm'

const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView } = useForm('.apply-scroll')
```

#### 返回值说明

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| formRef | Ref | 表单组件引用 |
| validate | Function | 表单验证方法 |
| submitLoading | Ref<boolean> | 提交加载状态 |
| scrollToFirstError | Function | 滚动到第一个错误字段 |
| scrollIntoView | Ref<string> | 滚动到指定元素 |

#### 表单验证

```ts
// 验证指定字段
const { valid } = await validate(['refundType', 'reason'])

// 验证所有字段
const { valid } = await validate()
```

#### 滚动到错误字段

```ts
if (!valid) {
  scrollToFirstError()
  return
}
```

### 6.2 表单组件使用

#### Form 组件

Form 组件是表单的容器：

```vue
<Form ref="formRef" :model="formData" :rules="rules">
  <!-- 表单字段 -->
</Form>
```

#### Cell 组件

Cell 组件用于包裹表单字段：

```vue
<Cell id="reason" required label="退费原因" prop="reason">
  <wd-textarea
    v-model="formData.reason"
    prop="reason"
    placeholder="请输入退费原因"
    :maxlength="200"
  />
</Cell>
```

### 6.3 表单验证

#### 验证规则定义

```ts
const rules = {
  refundType: [{ required: true, message: '请选择退费金额' }],
  reason: [
    { required: true, message: '请输入退费原因', trigger: 'blur' },
    { min: 5, max: 200, message: '退费原因应为5-200个字符', trigger: 'blur' },
  ],
}
```
## 7. 样式和布局规范

项目使用 UnoCSS 作为 CSS 框架，采用 Attributify 模式编写样式。

### 7.1 UnoCSS 使用

1. 提供的 html 都是 tailwind 开发的，而我们的项目用的是 unocss
2. 严格按照参考 HTML 文件中的 Tailwind CSS 类名实现
3. 不要将 Tailwind 类名转换为 rpx 单位
4. 直接使用 HTML 中的类名，如 w-16 h-16，而不是 w-16rpx h-16rpx
5. 保持与参考 HTML 完全一致的类名和结构
6. 只有在 UnoCSS 不支持的情况下才使用自定义样式
7. 如果在 `uno.config.ts` 配置文件已经存在变量，直接使用 css 变量
8. 使用 unocss 的时候，尽量使用 Attributify 模式

#### tailwindcss 转换 unocss 注意点
1. 边框: 需要额外添加 border-solid 否则无法显示
  - tailwindcss: border border-bg-muted
  - unocss: border border-gray-200 border-solid
  - 单边边框：border-b border-b-bg-muted border-b-solid

#### Attributify 参考
1. margin
  - 负边距: -mt-6 -> mt--6
2. border
  - 单边边框(上边框): border-t="gray-200 solid"
```
<view
  flex="~ items-center justify-between"
  bg="primary"
  p="x-3 y-1.5"
  text="xs white center"
  border="~ gray-200 solid rounded-xl"
  font="medium"
  gap="4"
>
  测试
</view>

<!-- 间距使用规范：统一使用 flex + gap 替代 space="y-*" -->
<!-- 说明：为保持组件与页面布局风格一致，避免使用 space="y-<n>" 这类原子类来控制垂直间距，推荐使用 flex 布局配合 gap 属性。 -->
<!-- 示例 -->
<!-- 不推荐 -->
<!-- <view p="4" space="y-3">...</view> -->

<!-- 推荐 -->
<!-- <view p="4" flex="~ col" gap="3">...</view> -->

<!-- 将本规则添加到页面开发规范中，适用于所有页面模板与页面内组件的模板代码。 -->
```


### 7.2 布局规范

#### 响应式布局

使用 UnoCSS 的响应式前缀实现响应式布局：

```vue
<view 
  grid="~ cols-1 md:cols-2 lg:cols-3"
  gap="4"
>
  <!-- 内容 -->
</view>
```

#### 弹性布局
## 8. 完整的页面模板示例

以下是一个完整的页面模板示例，展示了所有规范的综合应用：

```vue
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "页面标题"
  }
}
</route>

<script lang="ts" setup>
import type { Refund } from '@/api/interface/modules/refund'
import { computed, ref } from 'vue'
import { getPendingRefundApi, postApplyRefundApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import { REFUND_HISTORY_PATH } from '@/constant/router'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView } = useForm('.page-scroll')

const formData = ref({
  refundType: 'FULL',
  reason: '',
})

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

const rules = {
  refundType: [{ required: true, message: '请选择退费金额' }],
  reason: [
    { required: true, message: '请输入退费原因', trigger: 'blur' },
    { min: 5, max: 200, message: '退费原因应为5-200个字符', trigger: 'blur' },
  ],
}

/** 获取待处理退款信息 */
async function axiosGetPendingRefundApi() {
  try {
    return await getPendingRefundApi()
  }
  catch (error) {
    console.error('获取退款信息失败:', error)
    throw error
  }
}

/** 提交退款申请 */
async function axiosPostRefundApi(params: {refundType: string, applyReason: string}) {
  try {
    return await postApplyRefundApi(params)
  }
  catch (error) {
    console.error('提交退款申请失败:', error)
    throw error
  }
}

/** 格式化金额显示 */
function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

/** 提交表单 */
async function handleSubmit() {
  try {
    const { valid } = await validate(['refundType', 'reason'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true

    const result = await axiosPostRefundApi({
      refundType: 'FULL',
      applyReason: formData.value.reason,
    })

    uni.showToast({
      title: '提交成功',
      icon: 'success',
    })
  }
  catch (error) {
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}

onMounted(() => {
  // 页面初始化逻辑
})
</script>

<template>
  <Page
    title="页面标题"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view
      class="page-scroll"
      scroll-y
      :enhanced="true"
      :show-scrollbar="false"
      :scroll-with-animation="true"
## 9. 常见问题和注意事项

### 9.1 Page 组件相关

#### 页面加载状态控制

确保正确控制页面加载状态，避免页面长时间处于加载状态：

```ts
// 正确做法
async function onLoginSuccess() {
  try {
    await batchRequestHandler([axiosGetPendingRefundApi()])
  } finally {
    pageLoading.value = false
  }
}

// 错误做法 - 忘记设置加载状态为false
async function onLoginSuccess() {
  batchRequestHandler([axiosGetPendingRefundApi()])
}
```

#### 页面错误处理

正确处理页面错误，提供友好的错误提示：

```ts
const { pageError, onLoginFail } = usePage()

function handleLoginFail() {
  onLoginFail() // 会自动设置默认错误信息
  // 或自定义错误信息
  // pageError.value = '自定义错误信息'
}
```

### 9.2 表单相关

#### 表单验证

确保在提交前进行表单验证，并正确处理验证结果：

```ts
async function handleSubmit() {
  try {
    // 1. 执行验证
    const { valid } = await validate(['field1', 'field2'])
    
    // 2. 检查验证结果
    if (!valid) {
      scrollToFirstError()
      return
    }
    
    // 3. 继续提交逻辑
    // ...
  } catch (error) {
    // 4. 处理提交错误
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
}
```

#### 表单字段标识

确保每个表单字段都有正确的 id 和 prop 属性：

```vue
<!-- 正确做法 -->
<Cell id="reason" required label="退费原因" prop="reason">
  <wd-textarea v-model="formData.reason" prop="reason" />
</Cell>

<!-- 错误做法 - 缺少 id 或 prop -->
<Cell label="退费原因">
  <wd-textarea v-model="formData.reason" />
</Cell>
```

### 9.3 样式相关

#### UnoCSS 类名使用

正确使用 UnoCSS 类名，避免使用不支持的类名：

```vue
<!-- 正确做法 -->
<view p="4" text="sm" bg="white" border="~ gray-200 solid rounded">

<!-- 错误做法 - 使用不支持的单位 -->
<view p="4rpx" text="sm">
```

#### 响应式设计

合理使用响应式类名，确保在不同设备上都有良好的显示效果：

```vue
<!-- 正确做法 -->
<view grid="~ cols-1 md:cols-2 lg:cols-3" gap="4">

<!-- 注意断点的合理使用 -->
<view text="base md:lg xl:xl">
```

### 9.4 性能优化

#### 避免不必要的重新渲染

使用 computed 计算属性缓存计算结果：

```ts
// 正确做法
const currentBalanceText = computed(() => `¥${Number(currentBalance.value).toFixed(2)}`)

// 避免在模板中直接计算
// <view>{{ `¥${Number(currentBalance).toFixed(2)}` }}</view>
```

#### 合理使用 v-if 和 v-show

根据使用场景选择合适的指令：

```vue
<!-- 频繁切换使用 v-show -->
<view v-show="showDetails">
  详细信息
</view>

<!-- 条件很少改变使用 v-if -->
<view v-if="hasPermission">
  权限内容
</view>
```

### 9.5 其他注意事项

#### 组件通信

优先使用 defineModel 进行双向绑定：

```ts
// 正确做法
const model = defineModel<boolean>('model', { default: false })

// 避免使用 update:xxx 事件
// const emit = defineEmits(['update:model'])
```

组件定义双向绑定的时候，使用 `defineModel` 而不是 `update:xxx`。

#### 路由跳转

使用常量定义路由路径：

```ts
// 正确做法
import { REFUND_HISTORY_PATH } from '@/constant/router'

uni.navigateTo({ url: REFUND_HISTORY_PATH })

// 避免硬编码路径
// uni.navigateTo({ url: '/pages-sub/refund/history/index' })
```

#### 按钮组件使用规范

优先使用 `@/components/common/button/index.vue` 组件，标签为 `TButton`。

#### 弹框提示规范

优先使用 wot ui 的 `useMessage` 方法。

#### Toast 提示规范

统一使用 `toast` 方法，根据不同场景选择：
- **成功提示**: `toast.success('操作成功')`
- **错误提示**: `toast.error('操作失败')`
- **警告提示**: `toast.warning('注意事项')`
- **普通提示**: `toast.show('普通提示')`
- **信息提示**: `toast.info('信息提示')`

详细规范请参见 `.roo/rules/toast.md`。