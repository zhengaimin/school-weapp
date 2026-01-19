# 常量定义规范

> 命名规范请参考 [naming.md](./naming.md)

本文档旨在统一项目中常量的定义方式，特别是在处理涉及类型、国际化（I18N）文本和UI组件选项列表时的场景。遵循此规范有助于提高代码的可读性、可维护性和类型安全。

## 核心原则

我们将常量定义拆分为三个明确的部分，各司其职：

1.  **`TYPE`**: 定义常量的核心键值对。这是所有相关定义的“唯一真实来源（Single Source of Truth）”。
2.  **`I18N`**: 定义与 `TYPE` 对应的国际化显示文本。
3.  **`OPTIONS`**: 定义用于UI组件（如下拉菜单、单选框组）的选项列表，它结合了 `TYPE` 和 `I18N` 的内容。

## 结构与命名规范

### 1. TYPE - 类型定义

-   **常量对象**:
    -   使用 `as const` 进行定义，以获得最严格的类型推断。
    -   命名采用 **大写蛇形命名法** (`UPPERCASE_SNAKE_CASE`)。
-   **TypeScript 类型**:
    -   通过 `(typeof ...)[keyof typeof ...]` 从常量对象中派生出联合类型。
    -   命名采用 **T + 大驼峰命名法** (`TPascalCase`)。

**示例**:
```typescript
// Types
export const SEARCH_TYPE = {
  CODE: 'code',
  ID_CARD: 'idCard',
} as const

export type TSearchType = (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE]```

### 2. I18N - 国际化文本

-   **定义**: 使用 `Record<T, string>` 类型，将 `TYPE` 中定义的每个值映射到一个用于UI显示的字符串。
-   **命名**: 采用 **`[TYPE_NAME]_I18N`** 的格式。

**示例**:
```typescript
// I18N
export const SEARCH_TYPE_I18N: Record<TSearchType, string> = {
  [SEARCH_TYPE.CODE]: '学号',
  [SEARCH_TYPE.ID_CARD]: '身份证号',
}
```

### 3. OPTIONS - UI 选项

-   **定义**:
    -   一个包含对象的数组，通常每个对象都有 `label` 和 `value` 属性。
    -   **重要**: 必须 **逐项显式列出**，禁止使用 `.map()` 或 `.entries()` 等方法动态生成。这使得常量的结构一目了然，且避免了不必要的运行时计算。
    -   `label` 和 `value` 的值应直接引用自 `I18N` 和 `TYPE` 常量，以保持同步。
-   **命名**: 采用 **`[TYPE_NAME]_OPTIONS`** 的格式。

**示例**:
```typescript
// Options
export const SEARCH_TYPE_OPTIONS = [
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.CODE], value: SEARCH_TYPE.CODE },
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.ID_CARD], value: SEARCH_TYPE.ID_CARD },
]
```

## 代码组织与区域注释

为了进一步增强代码的可读性和组织性，我们推荐使用区域注释（Region Comments）将相关的常量定义（`TYPE`, `I18N`, `OPTIONS`）包裹起来。

-   **开始标记**: `// #region [常量名称]`
-   **结束标记**: `// #endregion`

在区域注释内部，应按照 `Types` -> `I18N` -> `Options` 的顺序组织代码，并使用简单注释作为分隔。

## 完整示例

以下是一个完整的常量定义文件示例，整合了上述所有规范，并应用了区域注释风格：

`src/constant/modules/user/student.ts`
```typescript
// #region 搜索类型
// Types
export const SEARCH_TYPE = {
  CODE: 'code',
  ID_CARD: 'idCard',
} as const

export type TSearchType = (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE]

// I18N
export const SEARCH_TYPE_I18N: Record<TSearchType, string> = {
  [SEARCH_TYPE.CODE]: '学号',
  [SEARCH_TYPE.ID_CARD]: '身份证号',
}

// Options
export const SEARCH_TYPE_OPTIONS = [
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.CODE], value: SEARCH_TYPE.CODE },
  { label: SEARCH_TYPE_I18N[SEARCH_TYPE.ID_CARD], value: SEARCH_TYPE.ID_CARD },
]
// #endregion
```

## 规范优势

-   **类型安全**: 利用 `as const` 和派生类型，在编译时捕获错误。
-   **关注点分离**: 将原始值 (`TYPE`)、显示文本 (`I18N`) 和UI结构 (`OPTIONS`) 清晰地分开。
-   **易于维护**: 修改文本只需更新 `I18N` 对象，无需触碰业务逻辑代码。
-   **代码清晰**: 显式列出 `OPTIONS` 使得数据结构一目了然，更易于理解和调试。

## 常量索引管理

**重要**: 项目维护了一个集中的常量索引文件 `.ai/constant-index.md`，用于快速查询和定位所有常量定义。

### 同步规则

在对常量进行增删改查操作时，**必须同步更新** `.ai/constant-index.md` 文件：

1. **新增常量**:
   - 在对应模块目录下创建或编辑常量文件
   - 遵循本规范定义 TYPE、I18N、OPTIONS
   - 在 `.ai/constant-index.md` 中添加对应的索引条目
   - 更新相关的 `index.ts` 导出文件

2. **修改常量**:
   - 修改常量文件中的定义
   - 同步更新 `.ai/constant-index.md` 中的说明和导出内容
   - 检查并更新所有引用该常量的代码

3. **删除常量**:
   - 从常量文件中删除定义
   - 从 `.ai/constant-index.md` 中删除对应条目
   - 全局搜索并清理所有引用

4. **查询常量**:
   - 优先查阅 `.ai/constant-index.md` 快速定位
   - 按模块、类型或文件路径进行查询
   - 确认常量的导出内容和使用方式

### 索引文件结构

`.ai/constant-index.md` 按以下结构组织：

- **业务模块** (business): 用户、设备、资金、支付、退款、套餐、赠费、消息
- **UI 模块** (ui): 菜单配置
- **HTTP 模块** (http): 状态码
- **应用模块** (app): 导航配置
- **通用模块** (common): 通用常量

每个常量条目包含：
- 常量名称
- 类型 (TYPE/I18N/OPTIONS/CONFIGS)
- 说明
- 导出内容
- 文件路径