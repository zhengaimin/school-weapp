# UI 设计风格指南

> 本文档记录了 **school-weapp** 项目的完整 UI 设计系统，用于在其他项目中复现相同的设计风格。

## 📋 目录

- [1. 项目概览](#1-项目概览)
- [2. 核心设计原则](#2-核心设计原则)
- [3. 颜色系统](#3-颜色系统)
- [4. 排版系统](#4-排版系统)
- [5. 间距与布局](#5-间距与布局)
- [6. 组件设计规范](#6-组件设计规范)
- [7. 图标系统](#7-图标系统)
- [8. 动效与交互](#8-动效与交互)
- [9. 复现指南](#9-复现指南)

---

## 1. 项目概览

### 技术栈
- **框架**: Vue 3 + TypeScript + uni-app
- **构建工具**: Vite 5.2.8
- **样式方案**: UnoCSS (原子化 CSS)
- **UI 组件库**: wot-design-uni v1.9.1
- **状态管理**: Pinia 2.0.36
- **包管理器**: pnpm

### 项目定位
基于 uni-app 的跨平台小程序应用（主要针对微信小程序），适配 H5、App 等多端。

---

## 2. 核心设计原则

### 2.1 设计理念
- **现代简约**: 蓝白色调为主，圆角卡片式布局，微渐变装饰
- **原子化开发**: 全面使用 UnoCSS 进行样式开发，减少手写 CSS
- **组件化架构**: 高复用性组件设计（Page、Header、Card、Tabbar）
- **多端适配**: 统一使用 `rpx` 单位，内置安全区处理

### 2.2 视觉特色
- **渐变头部**: 135° 蓝色渐变 + 半透明装饰圆形
- **卡片设计**: 白底圆角卡片，阴影轻微
- **色彩丰富**: 功能入口采用 Tailwind 色系，每个功能独立配色

---

## 3. 颜色系统

### 3.1 品牌色 (Brand Colors)

| Token | Hex | 说明 | 使用场景 |
|:------|:----|:-----|:---------|
| `primary` | `#3269dd` | **主色** (品牌蓝) | 主按钮、链接、重要信息 |
| `primary-light` | `#5b8cff` | 主色变亮 | 渐变终点、悬停态 |
| `primary-dark` | `#1e4ba8` | 主色变暗 | 点击态、深色模式 |
| `primary-50` | `#f0f4ff` | 主色超浅 | 背景色、标签 |
| `primary-100` | `#e1eaff` | 主色浅色 | 卡片背景 |

**渐变配置**:
```css
background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%);
```

### 3.2 辅助色 (Secondary Colors)

| Token | Hex | 说明 | 使用场景 |
|:------|:----|:-----|:---------|
| `secondary` | `#44bbdd` | **辅色** (青蓝色) | 次要按钮、信息提示 |
| `secondary-light` | `#6bc9e3` | 辅色变亮 | 悬停态 |
| `secondary-dark` | `#2a9bc1` | 辅色变暗 | 点击态 |
| `accent` | `#f57b32` | **强调色** (活力橙) | 重要提示、徽章 |
| `accent-light` | `#f89a5b` | 强调色变亮 | 悬停态 |
| `accent-dark` | `#e55a0a` | 强调色变暗 | 点击态 |

### 3.3 功能色 (Functional Colors)

| Token | Hex | 背景色 | 用途 |
|:------|:----|:-------|:-----|
| `success` | `#10b981` | `#d1fae5` | 成功/通过/完成 |
| `warning` | `#f59e0b` | `#fef3c7` | 警告/提示/待处理 |
| `error` | `#ef4444` | `#fee2e2` | 错误/删除/失败 |
| `cancel` | `#6b7280` | `#f3f4f6` | 取消/禁用/次要操作 |

**使用示例**:
```html
<!-- 成功提示 -->
<view bg="success-bg" text="success" p="2" rounded>操作成功</view>

<!-- 警告提示 -->
<view bg="warning-bg" text="warning" p="2" rounded>请注意</view>
```

### 3.4 中性色 & 背景 (Neutrals & Backgrounds)

| Token | Hex | 说明 | 使用场景 |
|:------|:----|:-----|:---------|
| `text-primary` | `#1a202c` | 主要文字 (深灰) | 标题、正文 |
| `text-secondary` | `#4a5568` | 次要文字 (灰) | 辅助说明 |
| `text-muted` | `#9ca3af` | 提示文字 (浅灰) | 占位符、禁用文字 |
| `bg-primary` | `#ffffff` | 页面/卡片背景 | 主要内容区 |
| `bg-secondary` | `#f7fafc` | 页面底色 | 页面背景 |
| `bg-muted` | `#edf2f7` | 分割线/弱背景 | 分隔区域 |

### 3.5 功能入口配色系统 (Menu Icon Colors)

基于 **Tailwind CSS 色系**，每个功能入口采用独立配色（500 级主色 + 100 级背景色）：

| 功能 | 主色 (500) | 背景色 (100) | 色系 |
|:-----|:-----------|:-------------|:-----|
| 个人信息 | `#f97316` | `#ffedd4` | Orange |
| 学生信息 | `#f59e0b` | `#fef3c7` | Amber |
| 绑定学生 | `#14b8a6` | `#ccfbf1` | Teal |
| 切换身份 | `#84cc16` | `#ecfccb` | Lime |
| 人脸采集 | `#8b5cf6` | `#ede9fe` | Purple |
| 亲情号 | `#ec4899` | `#fce7f3` | Pink |
| 账户信息 | `#3b82f6` | `#dbeafe` | Blue |
| 套餐购买 | `#10b981` | `#d1fae5` | Emerald |
| 申请退费 | `#ef4444` | `#fee2e2` | Red |
| 意见反馈 | `#f43f5e` | `#ffe4e6` | Rose |
| 留言 | `#8b5cf6` | `#ede9fe` | Violet |
| 关于我们 | `#6b7280` | `#f3f4f6` | Gray |
| 设备订阅 | `#06b6d4` | `#cffafe` | Cyan |
| 消费记录 | `#6366f1` | `#e0e7ff` | Indigo |
| 充值明细 | `#0ea5e9` | `#e0f2fe` | Sky |
| 成绩查询 | `#d946ef` | `#fae8ff` | Fuchsia |

**配置规范**:
```typescript
interface IMenuItem {
  title: string
  icon: string
  color: string      // 主色调（500级别）
  bgColor: string    // 背景色（100级别）
  path?: string
}
```

### 3.6 图标背景色 (Icon Backgrounds)

用于功能入口图标底色，带有透明度：

```css
icon-bg-user: rgba(245, 123, 50, 0.1)      /* 橙色透明 */
icon-bg-finance: rgba(68, 187, 221, 0.1)   /* 蓝色透明 */
icon-bg-action: rgba(245, 123, 50, 0.15)   /* 橙色透明（加深） */
icon-bg-system: rgba(50, 105, 221, 0.1)    /* 主色透明 */
icon-bg-feedback: rgba(139, 92, 246, 0.1)  /* 紫色透明 */
icon-bg-info: rgba(156, 163, 175, 0.1)     /* 灰色透明 */
```

---

## 4. 排版系统

### 4.1 字体大小 (Font Sizes)

使用 `rpx` 单位确保移动端响应式体验：

| Class | Size (rpx) | Line Height | 用途 |
|:------|:-----------|:------------|:-----|
| `text-3xs` | 18rpx | 26rpx | 最小文字、极小标签 |
| `text-2xs` | 20rpx | 28rpx | 极小标签、辅助说明 |
| `text-xs` | 24rpx | 32rpx | 小标签、次要信息 |
| `text-sm` | 28rpx | 40rpx | 辅助信息、说明文字 |
| `text-base` | 32rpx | 44rpx | 正文内容（默认） |
| `text-lg` | 36rpx | 48rpx | 小标题、强调文字 |
| `text-xl` | 40rpx | 56rpx | 模块标题 |
| `text-2xl` | 48rpx | 64rpx | 页面大标题 |
| `text-3xl` | 60rpx | 72rpx | 特大标题 |

**使用示例**:
```html
<view text="2xl" font="bold">页面标题</view>
<view text="base" text="text-secondary">正文内容</view>
<view text="2xs" text="text-muted">辅助说明</view>
```

### 4.2 字重 (Font Weight)

| Class | Weight | 用途 |
|:------|:-------|:-----|
| `font-light` | 300 | 轻量文字 |
| `font-normal` | 400 | 正文（默认） |
| `font-medium` | 500 | 强调文字 |
| `font-semibold` | 600 | 小标题 |
| `font-bold` | 700 | 标题、重要信息 |

### 4.3 行高 (Line Height)

| Class | Value | 用途 |
|:------|:------|:-----|
| `leading-none` | 1 | 紧凑布局 |
| `leading-tight` | 1.25 | 标题 |
| `leading-normal` | 1.5 | 正文（默认） |
| `leading-relaxed` | 1.75 | 舒适阅读 |

---

## 5. 间距与布局

### 5.1 间距系统 (Spacing)

遵循 **4px 栅格系统** (1 unit = 0.25rem ≈ 4px)：

| Class | Value | 用途 |
|:------|:------|:-----|
| `p-1` / `m-1` | 8rpx | 最小间距 |
| `p-2` / `m-2` | 16rpx | 紧凑间距 |
| `p-4` / `m-4` | 32rpx | **标准间距**（最常用） |
| `p-6` / `m-6` | 48rpx | 宽松间距 |
| `p-8` / `m-8` | 64rpx | 大间距 |
| `p-12` / `m-12` | 96rpx | 超大间距 |

**方向控制**:
- `pt-4`: padding-top
- `pb-4`: padding-bottom
- `pl-4`: padding-left
- `pr-4`: padding-right
- `px-4`: padding 左右
- `py-4`: padding 上下

### 5.2 圆角 (Border Radius)

| Class | Value | 用途 |
|:------|:------|:-----|
| `rounded` | 8rpx | 小圆角 |
| `rounded-lg` | 16rpx | 中圆角 |
| `rounded-xl` | 24rpx | **标准卡片圆角**（最常用） |
| `rounded-2xl` | 32rpx | 大圆角 |
| `rounded-full` | 9999px | 完全圆形（按钮、头像） |

### 5.3 安全区适配 (Safe Area)

自定义规则，处理刘海屏和小黑条：

| Class | CSS | 用途 |
|:------|:----|:-----|
| `pt-safe` | `padding-top: env(safe-area-inset-top)` | 顶部安全区 |
| `pb-safe` | `padding-bottom: env(safe-area-inset-bottom)` | 底部安全区 |
| `p-safe` | 全方位安全区 | 全屏页面 |

**使用示例**:
```html
<!-- 页面容器 -->
<view class="t-page" h-screen bg-gray-50 pb-safe>
  <!-- 内容 -->
</view>
```

### 5.4 页面布局 (Page Layout)

**标准页面结构**:
```vue
<template>
  <view class="t-page" flex="~ col" relative z-1 box-border h-screen bg-gray-50 pb-safe>
    <!-- 导航区域 -->
    <Navigation :title="页面标题" />

    <!-- 内容区域 -->
    <scroll-view enable-flex flex="~ 1 col" scroll-y>
      <slot />
    </scroll-view>
  </view>
</template>
```

**布局特点**:
- 使用 `flex="~ col"` 实现垂直布局
- `h-screen` 占满屏幕高度
- `pb-safe` 处理底部安全区
- `scroll-view` 内容可滚动

---

## 6. 组件设计规范

### 6.1 渐变头部 (Gradient Header)

**视觉特征**:
- 135° 蓝色渐变背景
- 右上角和左侧有半透明白色装饰圆形
- 白色文字
- 可选返回按钮

**代码实现**:
```vue
<template>
  <view class="gradient-header" relative overflow="hidden" :style="gradientStyle">
    <!-- 装饰圆形 -->
    <view
      absolute
      style="top: -40rpx; right: -40rpx"
      w="32" h="32"
      bg="white opacity-10"
      border="rounded-full"
    ></view>
    <view
      absolute
      style="top: 80rpx; left: -32rpx"
      w="20" h="20"
      bg="white opacity-15"
      border="rounded-full"
    ></view>

    <!-- 返回按钮 -->
    <view v-if="showBack" relative z="20" p="t-4 x-6">
      <view
        w="10" h="10"
        bg="white opacity-20"
        border="rounded-full"
        flex="~ items-center justify-center"
        @click="handleBack"
      >
        <Icon name="arrow-left-line" color="#ffffff" size="40rpx" />
      </view>
    </view>

    <!-- 内容区域 -->
    <view relative z="10" p="t-8 b-12 x-6" text="white">
      <view text="2xl" font="bold">{{ title }}</view>
      <view v-if="subtitle" text="sm opacity-75" m="t-1">{{ subtitle }}</view>
      <slot />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.gradient-header {
  background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%);
}
</style>
```

**使用场景**: 个人中心、详情页、表单页

### 6.2 白底卡片 (White Card)

**视觉特征**:
- 白色背景
- 圆角 `rounded-xl`
- 标准内边距 `p-4`
- 可选边框

**代码实现**:
```html
<!-- 基础卡片 -->
<view bg="white" p="4" rounded-xl>
  <!-- 卡片内容 -->
</view>

<!-- 带边框卡片 -->
<view bg="white" p="4" rounded-xl border="1 solid" border-color="bg-muted">
  <!-- 卡片内容 -->
</view>

<!-- 带阴影卡片 -->
<view bg="white" p="4" rounded-xl shadow="sm">
  <!-- 卡片内容 -->
</view>
```

**使用场景**: 列表项、信息展示、表单容器

### 6.3 功能入口按钮 (Menu Button)

**视觉特征**:
- 图标 + 文字垂直布局
- 图标带有彩色背景（100 级）
- 图标颜色（500 级）
- 圆角背景

**代码实现**:
```html
<view flex="~ col items-center" p="4">
  <!-- 图标容器 -->
  <view
    w="48"
    h="48"
    rounded-xl
    flex="~ items-center justify-center"
    :style="{ backgroundColor: item.bgColor }"
  >
    <Icon :name="item.icon" :color="item.color" size="48rpx" />
  </view>

  <!-- 文字 -->
  <view text="sm text-primary" m="t-2">{{ item.title }}</view>
</view>
```

**配置示例**:
```typescript
const menuItem = {
  title: '账户信息',
  icon: 'wallet-3-line',
  color: '#3b82f6',      // blue-500
  bgColor: '#dbeafe',    // blue-100
  path: '/pages/balance/index'
}
```

### 6.4 底部标签栏 (Tabbar)

**视觉特征**:
- 固定在底部
- 支持 iconfont/UnoCSS 图标
- 带有 `safe-area-inset-bottom`
- 选中态高亮

**实现方式**:
- 使用 `wot-design-uni` 的 `wd-tabbar` 组件
- 自定义封装为 `FgTabbar` 组件

### 6.5 页面容器 (Page Component)

**功能**:
- 统一的导航栏
- Loading 状态管理
- 错误状态展示
- 安全区适配
- 登录逻辑处理

**使用示例**:
```vue
<template>
  <Page v-model:loading="loading" title="页面标题">
    <!-- 页面内容 -->
  </Page>
</template>
```

---

## 7. 图标系统

### 7.1 图标方案
- **SVG 图标**: 自定义 Icon 组件
- **iconfont 字体图标**: 引入 `iconfont.css`

### 7.2 Icon 组件使用

```html
<!-- 基础用法 -->
<Icon name="arrow-left-line" color="#ffffff" size="40rpx" />

<!-- 带背景的图标 -->
<view
  w="48" h="48"
  rounded-xl
  bg="icon-bg-user"
  flex="~ items-center justify-center"
>
  <Icon name="user-line" color="#f97316" size="48rpx" />
</view>
```

### 7.3 常用图标

| 图标名称 | 用途 |
|:---------|:-----|
| `arrow-left-line` | 返回 |
| `arrow-right-line` | 前进、查看更多 |
| `user-line` | 用户、个人 |
| `wallet-3-line` | 钱包、账户 |
| `coupon-line` | 优惠券、套餐 |
| `message-3-line` | 消息、留言 |
| `heart-3-line` | 收藏、喜欢 |
| `settings-line` | 设置 |

---

## 8. 动效与交互

### 8.1 过渡动画

```css
/* 颜色过渡 */
transition-colors

/* 全属性过渡 */
transition-all

/* 透明度过渡 */
transition-opacity
```

### 8.2 点击态

```html
<!-- 按钮点击态 -->
<view
  bg="primary"
  active:bg="primary-dark"
  transition-colors
>
  按钮
</view>
```

### 8.3 加载状态

使用 `Loading` 组件展示加载动画。

---

## 9. 复现指南

### 9.1 安装依赖

```bash
pnpm add -D unocss @uni-helper/unocss-preset-uni
pnpm add wot-design-uni
```

### 9.2 配置 UnoCSS

创建 `uno.config.ts`，复制以下配置：

```typescript
import { presetUni } from '@uni-helper/unocss-preset-uni'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: false,
      },
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      center: 'flex justify-center items-center',
    },
  ],
  rules: [
    ['p-safe', {
      padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    }],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['border-top-gray', { 'border-top': '1px solid #f3f4f6' }],
    ['border-1', { 'border-width': '1px' }],
  ],
  theme: {
    colors: {
      // 复制上面的颜色配置
      'primary': '#3269dd',
      'primary-light': '#5b8cff',
      // ... 其他颜色
    },
    fontSize: {
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx'],
    },
  },
})
```

### 9.3 创建基础组件

**必需组件**:
1. `Page` - 页面容器
2. `GradientHeader` - 渐变头部
3. `Navigation` - 导航栏
4. `Icon` - 图标组件
5. `Loading` - 加载组件

### 9.4 配置 Vite

```typescript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    uni(),
    UnoCSS(),
  ],
})
```

### 9.5 引入全局样式

在 `main.ts` 中引入：

```typescript
import 'uno.css'
import '@/style/iconfont.css'
```

### 9.6 功能入口配置

创建 `constant/modules/ui/menu.ts`，参考 Tailwind 色系配置功能入口：

```typescript
export interface IMenuItem {
  title: string
  icon: string
  color: string      // 500 级
  bgColor: string    // 100 级
  path?: string
}

export const MENU_ACCOUNT: IMenuItem = {
  title: '账户信息',
  icon: 'wallet-3-line',
  color: '#3b82f6',      // blue-500
  bgColor: '#dbeafe',    // blue-100
  path: '/pages/balance/index'
}
```

---

## 10. 设计资源

### 10.1 参考资源
- **Tailwind CSS 色系**: https://tailwindcss.com/docs/colors
- **UnoCSS 文档**: https://unocss.dev/
- **wot-design-uni**: https://wot-design-uni.netlify.app/

### 10.2 设计工具
- **Figma**: 用于设计稿
- **IconPark**: 图标库

---

## 附录: 快速参考

### 常用原子类组合

```html
<!-- 标准卡片 -->
<view bg="white" p="4" rounded-xl shadow="sm">

<!-- 渐变头部 -->
<view style="background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%)">

<!-- 功能按钮 -->
<view flex="~ col items-center" p="4">

<!-- 居中布局 -->
<view class="center">

<!-- 文字样式 -->
<view text="2xl" font="bold" text="text-primary">
```

### 颜色速查

| 用途 | 颜色 |
|:-----|:-----|
| 主色 | `#3269dd` |
| 成功 | `#10b981` |
| 警告 | `#f59e0b` |
| 错误 | `#ef4444` |
| 文字 | `#1a202c` |
| 背景 | `#f7fafc` |

---

**文档版本**: v1.0
**最后更新**: 2025-12-29
**维护者**: school-weapp 团队
