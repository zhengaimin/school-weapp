# 错误处理使用指南

## 概述

项目已经集成了统一的错误码处理机制，可以自动将后端返回的错误码转换为友好的错误提示信息。

## 错误码配置

所有错误码定义在 `src/constant/modules/error-codes.ts` 文件中：

```typescript
export const ERROR_CODES = {
  '100206': '用户名或密码错误',
  '200101': '学生信息不存在',
  // ... 更多错误码
} as const
```

## HTTP 请求自动处理

HTTP 请求封装已经自动集成了错误处理，当接口返回非 0 的 code 时：

1. 自动查找对应的错误提示信息
2. 显示 Toast 提示
3. 在控制台输出错误日志

```typescript
// src/http/index.ts
if (data.code !== 0) {
  // 优先使用错误码对应的提示信息
  const errorMessage = isKnownErrorCode(data.code) 
    ? getErrorMessage(data.code)
    : (data.msg || '网络错误，请稍后重试')
  
  toast.info(errorMessage)
}
```

## 页面中的使用

### 1. 基础使用（推荐）

在大多数情况下，你不需要额外处理错误，HTTP 层会自动显示错误提示：

```typescript
// 接口请求函数
async function axiosGetDataApi() {
  try {
    const result = await getDataApi()
    if (result.code === 0) {
      // 处理成功数据
      data.value = result.data
    }
    return result
  }
  catch (error) {
    // HTTP 层已经显示了错误提示，这里只需要重新抛出
    throw error
  }
}
```

### 2. 自定义错误处理

如果需要自定义错误处理逻辑，可以使用 `useErrorHandler` Hook：

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler'

const { handleError } = useErrorHandler()

async function handleSubmit() {
  try {
    await submitApi(formData.value)
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })
  }
  catch (error) {
    // 使用统一错误处理
    handleError(error)
  }
}
```

### 3. 不显示自动提示

如果你想自己处理错误提示，可以在接口调用时设置 `hideErrorToast: true`：

```typescript
async function axiosGetDataApi() {
  try {
    return await http.get('/api/data', {}, {}, { hideErrorToast: true })
  }
  catch (error) {
    // 自定义处理逻辑
    const { handleError } = useErrorHandler()
    if ((error as BusinessError).code === '200101') {
      // 针对特定错误码的处理
      handleError(error, false) // 不显示 toast
      console.log('学生信息不存在，执行特殊逻辑')
    } else {
      handleError(error) // 显示 toast
    }
    throw error
  }
}
```

## Hook 方法说明

`useErrorHandler` Hook 提供了以下方法：

```typescript
const { 
  handleBusinessError,  // 处理业务错误
  handleNetworkError,   // 处理网络错误
  handleError,          // 通用错误处理
  handleHttpError       // 处理HTTP响应错误
} = useErrorHandler()
```

### handleError 方法

```typescript
/**
 * 通用错误处理方法
 * @param error 错误对象
 * @param showToast 是否显示错误提示，默认为 true
 * @returns 处理后的错误信息
 */
function handleError(error: any, showToast = true): string
```

## 添加新的错误码

1. 在 `src/constant/modules/error-codes.ts` 中添加新的错误码：

```typescript
export const ERROR_CODES = {
  // ... 现有错误码
  '300001': '新功能错误提示',
} as const
```

2. 错误码会自动在 HTTP 请求中生效，无需额外配置。

## 完整的页面使用示例

```typescript
// #region 导入
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { getRefundListApi } from '@/api/modules/refund'
// #endregion

// #region 使用 Hooks
const { handleError } = useErrorHandler()
// #endregion

// #region 接口请求函数
async function axiosGetRefundListApi() {
  try {
    const result = await getRefundListApi()
    if (result.code === 0) {
      refundList.value = result.data
    }
    return result
  }
  catch (error) {
    // HTTP 层已自动显示错误提示
    console.error('获取退款列表失败:', error)
    throw error
  }
}
// #endregion

// #region 事件处理函数
async function handleSubmitRefund() {
  try {
    const result = await postRefundApi(formData.value)
    uni.showToast({
      title: '申请提交成功',
      icon: 'success'
    })
  }
  catch (error) {
    // 使用统一的错误处理，会自动显示对应的错误信息
    handleError(error)
  }
}
// #endregion
```

## 注意事项

1. **错误码格式**：确保错误码为字符串格式，与后端保持一致
2. **错误提示**：错误提示应该简洁明了，便于用户理解
3. **未知错误码**：对于未配置的错误码，会显示后端返回的 message 或默认提示
4. **网络错误**：网络错误会显示固定的网络错误提示

## 最佳实践

1. **统一处理**：优先使用自动错误处理，减少重复代码
2. **特殊处理**：只在需要特殊逻辑时才自定义错误处理
3. **用户体验**：确保错误提示对用户友好，避免技术术语
4. **错误日志**：重要错误应该记录日志，便于排查问题

```typescript
// 推荐的接口请求函数写法
async function axiosGetUserInfoApi() {
  try {
    const result = await getUserInfoApi()
    if (result.code === 0) {
      userInfo.value = result.data
    }
    return result
  }
  catch (error) {
    // 记录错误日志
    console.error('获取用户信息失败:', error)
    // 重新抛出，让调用方处理
    throw error
  }
}