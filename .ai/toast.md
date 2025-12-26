# Toast 提示规范

## 统一使用 toast.show

在项目中，所有的 toast 提示都必须使用 `toast.show` 方法，而不是 `uni.showToast`。

### 导入方式

```typescript
import { toast } from '@/utils/toast'
```

### 使用方法

```typescript
// 正确做法
toast.show('操作成功')
toast.error('请检查网络连接')
toast.success('提交成功')
toast.warning('请注意')
toast.info('信息提示')

// 错误做法
uni.showToast({
  title: '操作成功',
  icon: 'none',
  duration: 2000,
})
```

### toast 方法说明

- `toast.show(message)` - 显示普通提示（默认 none 图标）
- `toast.success(message)` - 显示成功提示
- `toast.error(message)` - 显示错误提示
- `toast.warning(message)` - 显示警告提示
- `toast.info(message)` - 显示信息提示

### 优势

1. **统一性**: 确保项目中所有 toast 提示的样式和行为一致
2. **可维护性**: 集中管理 toast 的配置和行为
3. **简洁性**: 减少重复代码，使用更加简洁

### 适用范围

此规范适用于项目中所有需要显示 toast 提示的场景：

- 成功提示
- 错误提示
- 警告提示
- 信息提示
- 网络错误提示
- 表单验证提示
- API 请求结果提示

### 注意事项

- 不要混用 `uni.showToast` 和 `toast.show`
- 所有现有的 `uni.showToast` 都应该逐步替换为 `toast.show`
- 在代码审查时，需要检查是否遵循此规范
- 所有错误处理 Hook 和工具函数都必须使用 `toast.show`

### 实施建议

1. **代码审查**：在代码审查过程中，检查是否使用了正确的 toast 方法
2. **IDE 配置**：可以配置 IDE 的代码检查工具，自动检测 `uni.showToast` 的使用
3. **团队培训**：确保团队成员了解并遵守此规范
4. **重构现有代码**：逐步重构现有代码中的 `uni.showToast`，使其符合规范