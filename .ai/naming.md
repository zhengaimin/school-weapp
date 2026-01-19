# 命名规范

本文档统一项目中的命名规范，所有相关文件都应遵循此规范。

---

## 常量命名

### TYPE 常量
- 格式：`UPPERCASE_SNAKE_CASE`
- 示例：`SEARCH_TYPE`、`PAYMENT_STATUS`

### TypeScript 类型
- 格式：`T + PascalCase`
- 示例：`TSearchType`、`TPaymentStatus`

### I18N 映射
- 格式：`[TYPE_NAME]_I18N`
- 示例：`SEARCH_TYPE_I18N`、`PAYMENT_STATUS_I18N`

### OPTIONS 列表
- 格式：`[TYPE_NAME]_OPTIONS`
- 示例：`SEARCH_TYPE_OPTIONS`、`PAYMENT_STATUS_OPTIONS`

### CONFIGS 映射
- 格式：`[TYPE_NAME]_CONFIGS`
- 示例：`REFUND_STATUS_CONFIGS`、`PACKAGE_STATUS_CONFIGS`

---

## 接口命名

### 接口函数
- 格式：`[httpMethod] + [Action] + Api`
- 示例：
  - `getDeviceGroupsApi`
  - `postSubscribeDeviceGroupApi`
  - `putUpdateDeviceGroupApi`
  - `deleteDeviceGroupApi`

### 请求接口类型
- 格式：`Req[HttpMethod][Action][Feature]Api`
- 示例：`ReqGetDeviceGroupsApi`、`ReqPostSubscribeDeviceGroupApi`

### 响应接口类型
- 格式：`Res[HttpMethod][Action][Feature]Api`
- 示例：`ResGetDeviceGroupsApi`、`ResPostSubscribeDeviceGroupApi`

### API 路径常量
- 格式：`[MODULE]_API` 或 `[MODULE]_[FEATURE]_API`
- 示例：`REFUND_API`、`DEVICES_GROUPS_API`

---

## 事件处理函数命名

所有事件处理函数必须以 `handle` 开头，采用驼峰命名法。

### 格式
```
handle + 动作 + 对象
```

### 正确示例
```typescript
function handleClick() {}
function handleSubmit() {}
function handleBack() {}
function handleInputChange() {}
function handleSelectAmount() {}
function handleConfirmRecharge() {}
function handleLoginSuccess() {}
function handleLoginFail() {}
```

### 错误示例
```typescript
// 以下命名方式不符合规范
function click() {}
function submit() {}
function goBack() {}
function onInputChange() {}
function selectAmount() {}
function onLoginSuccess() {}
```

---

## 接口请求函数命名

页面中封装 API 调用的函数使用 `axios` 前缀。

### 格式
```
axios + [HttpMethod] + [Feature] + Api
```

### 示例
```typescript
async function axiosGetPendingRefundApi() {}
async function axiosPostRefundApi() {}
```
