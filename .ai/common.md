# 语言回复规范

所有机器人回复必须使用简体中文（zh-CN）。
禁止使用其他语言进行回复。

# 事件处理函数命名规范

## 概述

本文档规定了项目中所有页面和组件的事件处理函数命名规范，以确保代码的一致性和可读性。

## 命名规则

### 基本规则

所有事件处理函数必须以 `handle` 开头，后面跟上描述性的动作名称，采用驼峰命名法（camelCase）。

### 命名格式

```
handle + 动作 + 对象
```

### 示例

```typescript
// 正确示例
function handleClick() {}
function handleSubmit() {}
function handleBack() {}
function handleInputChange() {}
function handleSelectAmount() {}
function handleConfirmRecharge() {}

// 错误示例
function click() {}
function submit() {}
function goBack() {}
function onInputChange() {}
function selectAmount() {}
function confirmRecharge() {}
```

## 适用范围

此规范适用于以下场景中的事件处理函数：

1. **页面组件**：所有 `.vue` 文件中的事件处理函数
2. **公共组件**：`src/components` 目录下的所有组件中的事件处理函数
3. **表单组件**：表单相关的事件处理函数
4. **生命周期事件**：页面和组件的生命周期事件处理函数

## 特殊情况

### 生命周期事件

生命周期事件处理函数也应遵循此规范：

```typescript
// 正确示例
function handleLoginSuccess() {}
function handleLoginFail() {}
function handleMounted() {}
function handleShow() {}

// 错误示例
function onLoginSuccess() {}
function onLoginFail() {}
function onMounted() {}
function onShow() {}
```

### 异步事件处理

异步事件处理函数同样需要遵循此规范：

```typescript
// 正确示例
async function handleSubmit() {
  // 异步逻辑
}

async function handleAsyncOperation() {
  // 异步逻辑
}

// 错误示例
async function submit() {
  // 异步逻辑
}

async function asyncOperation() {
  // 异步逻辑
}
```

## 实施建议

1. **代码审查**：在代码审查过程中，检查事件处理函数的命名是否符合规范。
2. **IDE 配置**：可以配置 IDE 的代码检查工具，自动检测不符合规范的命名。
3. **团队培训**：确保团队成员了解并遵守此命名规范。
4. **重构现有代码**：逐步重构现有代码中的事件处理函数，使其符合规范。

## 优势

采用统一的事件处理函数命名规范有以下优势：

1. **提高代码可读性**：统一的命名规范使代码更易读、更易理解。
2. **便于维护**：当所有事件处理函数都使用相同的命名模式时，更容易定位和维护代码。
3. **减少命名冲突**：明确的命名前缀有助于避免与其他函数的命名冲突。
4. **提高团队协作效率**：统一的规范使团队成员能够更快地理解和适应彼此的代码。