# Page 组件文档

`Page` 组件是应用的通用页面布局组件，封装了页面常见的加载、错误处理、导航栏以及登录认证逻辑。

## 主要功能

1.  **统一导航栏**：提供一个可配置的顶部导航栏。
2.  **加载与骨架屏**：处理页面加载状态，并支持自定义骨架屏。
3.  **错误处理**：显示统一的错误提示界面。
4.  **自动登录与认证**：封装了微信小程序和 H5 环境下的自动登录、用户信息获取和权限跳转逻辑。
5.  **滚动容器**：提供一个可滚动的页面内容区域。

## 逻辑流程

`Page` 组件的核心逻辑由 `usePageAuth` hook 提供，主要流程如下：

1.  **组件挂载 (`onMounted`)**：
    *   判断当前平台（微信小程序或 H5）。
    *   **微信小程序**：
        *   检查是否需要重新登录（`needBind` 为 `true`、无手机号、无 `token` 或首次启动）。
        *   如果需要，调用 `mpWeixinLogin` 执行微信登录、获取用户信息、并根据用户角色和绑定状态进行页面跳转。
        *   如果不需要，直接触发 `login:success` 事件。
    *   **H5 环境**：
        *   调用 `otherEnvLogin` 尝试获取用户信息。
        *   成功则触发 `login:success`，失败则触发 `login:fail`。

2.  **登录成功后 (`loginSuccessNavigation`)**：
    *   检查用户角色 (`role`)：
        *   如果无角色，则跳转到角色选择页面 (`WELCOME_PATH`)。
        *   如果是家长 (`ROLE_TYPE.PARENT`) 且未绑定学生 (`needBind`)，则跳转到学生绑定页面 (`PARENT_STUDENT_BIND_PATH`)。
    *   如果已完成绑定或非家长角色，则跳转到应用首页 (`TABBAR_HOME_PATH`)。

3.  **数据初始化 (`initInfo`)**：
    *   在登录流程中，如果存在 `token`，则会尝试获取用户信息和（如果是家长）学生列表。

## Props

| 属性名       | 类型      | 默认值  | 说明                                   |
| ------------ | --------- | ------- | -------------------------------------- |
| `title`      | `String`  | `''`    | 导航栏标题。                           |
| `showTabbar` | `Boolean` | `false` | 是否为 Tabbar 页面，用于计算内容区域高度。 |
| `showBack`   | `Boolean` | `true`  | 是否显示返回按钮。                     |
| `error`      | `String`  | `''`    | 错误信息，非空时将显示错误页面。       |
| `scrollY`    | `Boolean` | `true`  | 内容区域是否可垂直滚动。               |
| `loading`    | `Boolean` | `false` | (v-model) 控制加载状态。               |
| `show`       | `Boolean` | `true`  | (v-model) 控制导航栏的显示与隐藏。     |

## 事件

| 事件名          | 参数 | 说明                                     |
| --------------- | ---- | ---------------------------------------- |
| `scroll`        | `e`  | `scroll-view` 滚动时触发。               |
| `login:success` | -    | 登录和初始化流程成功时触发。             |
| `login:fail`    | -    | 登录或初始化流程失败时触发。             |

## 插槽

| 插槽名          | 说明                                       |
| --------------- | ------------------------------------------ |
| `default`       | 页面主要内容。                             |
| `header-right`  | 导航栏右侧区域，可用于放置操作按钮等。     |
| `skeleton`      | 自定义骨架屏内容，在 `loading` 为 `true` 时显示。 |

## 使用示例

```vue
<script lang="ts" setup>
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
</script>

<template>
  <Page
    title="页面标题"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 骨架屏 -->
    <template #skeleton>
      <MySkeleton />
    </template>

    <!-- 导航栏右侧按钮 -->
    <template #header-right>
      <MyHeaderButtons />
    </template>

    <!-- 页面内容 -->
    <view>
      这里是页面内容
    </view>
  </Page>
</template>