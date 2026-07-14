# Store 架构设计文档

## 概述

本项目使用 Pinia 进行状态管理，采用**角色分离**和**业务分离**的设计原则，将 store 按职责划分为不同的目录和模块。

## 目录结构

```
src/store/
├── index.ts                    # Store 入口，配置 Pinia 持久化
├── app.ts                      # 应用级状态（导航栏信息等）
├── config.ts                   # 全局配置（关系选项、学校模块、菜单）
├── user.ts                     # 通用用户信息（所有角色共用）
├── auth/                       # 角色相关 Store
│   ├── parent.ts              # 家长角色
│   ├── teacher.ts             # 老师角色（未来）
│   └── student.ts             # 学生角色（未来）
└── business/                   # 业务数据 Store
    └── currentStudent.ts      # 当前操作的学生业务数据
```

## 设计原则

### 1. 角色分离（auth/）

**职责**：存储不同角色登录后的**身份特定数据**

- **auth/parent.ts**：家长角色
  - 子女列表
  - 当前选中的学生ID
  - 是否需要绑定学生

- **auth/teacher.ts**：老师角色（未来实现）
  - 管理的班级列表
  - 老师权限配置
  - 注意：老师直接查看所有学生，不需要"选择学生"

- **auth/student.ts**：学生角色（未来实现）
  - 学生的班级信息
  - 学生权限配置
  - 注意：这是"学生角色的身份数据"，不是业务数据

### 2. 业务分离（business/）

**职责**：存储**当前操作对象**的业务数据，与角色无关

- **business/currentStudent.ts**：当前操作的学生业务数据
  - **学生基本信息**（从 profile 接口的 `roleInfo.currentChild` 获取）
    - UUID、学生ID、学生姓名、学号
    - 年级、班级、级部
    - 人脸图片、人脸状态
    - IC卡号、身份证号、性别、生日等
  - 余额信息
  - 亲情号信息
  - 设备类型选择
  - 亲情号列表

**关键特性**：
- 在家长模式下，数据来自 `parent.currentStudentId` 对应的学生
- 在学生模式下，数据来自登录学生本人
- 切换学生时必须调用 `clearStudentData()` 清空旧数据
- `studentInfo` 会在调用 `userStore.getUserInfo()` 时自动从 `roleInfo.currentChild` 同步

### 3. 通用模块

- **user.ts**：所有角色共用的用户信息
  - token（登录凭证）
  - userInfo（用户基本信息）
  - role（角色类型）
  - phone（手机号）

- **app.ts**：应用级状态
  - 导航栏信息
  - 窗口尺寸等

- **config.ts**：全局配置
  - 关系选项
  - 学校模块列表
  - 动态菜单

## 核心概念

### "角色 Store" vs "业务 Store"

| 类型 | 职责 | 示例 |
|------|------|------|
| **角色 Store** (auth/) | 存储"谁登录了"的身份数据 | 家长的子女列表、老师的班级列表 |
| **业务 Store** (business/) | 存储"操作什么"的业务数据 | 当前学生的余额、亲情号 |

### 为什么要分离？

**问题场景**：
- 原来的 `student.ts` 既像"学生角色 store"，又像"当前学生业务数据"
- 当未来添加"学生登录"功能时，会产生命名冲突和职责混淆

**解决方案**：
- `auth/student.ts`：学生**角色**登录后的身份数据
- `business/currentStudent.ts`：当前**操作的学生**的业务数据

## 使用示例

### 家长模式

```typescript
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()

// 获取家长的子女列表
const students = parentStore.students

// 切换学生
function switchStudent(studentId: number) {
  // 1. 清空旧学生的业务数据
  currentStudentStore.clearStudentData()

  // 2. 设置新的学生ID
  parentStore.setCurrentStudentId(studentId)

  // 3. 重新加载新学生的业务数据
  // ...
}

// 获取当前学生的余额
const balance = currentStudentStore.balanceInfo
```

### 学生模式（未来）

```typescript
import { useStudentRoleStore } from '@/store/auth/student'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

const studentRoleStore = useStudentRoleStore()
const currentStudentStore = useCurrentStudentStore()

// 学生直接操作自己的数据，不需要"选择学生"
// currentStudent 的数据就是登录学生本人的数据
const balance = currentStudentStore.balanceInfo
```

### 老师模式（未来）

```typescript
import { useTeacherStore } from '@/store/auth/teacher'

const teacherStore = useTeacherStore()

// 老师直接查看所有学生，不需要"当前学生"的概念
// 可以直接通过 API 查询任意学生的数据
```

## 数据流

### 家长切换学生流程

```
用户点击切换学生
    ↓
调用 currentStudentStore.clearStudentData()  // 清空旧数据
    ↓
调用 parentStore.setCurrentStudentId(newId)  // 设置新ID
    ↓
重新加载新学生的业务数据
    ↓
调用 currentStudentStore.setBalanceInfo()    // 更新余额
调用 currentStudentStore.setContactInfo()    // 更新亲情号
```

## 持久化策略

所有 store 都开启了 `persist: true`，使用 `uni.getStorageSync` 进行持久化。

**注意事项**：
- `currentStudent` 的数据会持久化，但切换学生时必须手动清空
- 不要依赖持久化的 `currentStudent` 数据，每次进入页面应重新加载

## 命名规范

### Store 命名

- 角色 Store：`use{Role}Store`
  - `useParentStore`
  - `useTeacherStore`
  - `useStudentRoleStore`（避免与 `useCurrentStudentStore` 冲突）

- 业务 Store：`use{Business}Store`
  - `useCurrentStudentStore`

### 变量命名

```typescript
// ✅ 推荐
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()

// ❌ 避免
const studentStore = useCurrentStudentStore()  // 容易混淆
```

## 迁移说明

### 从旧版本迁移

**旧版本**：
```typescript
import { useParentStore } from '@/store/parent'
import { useStudentStore } from '@/store/student'

const studentStore = useStudentStore()
```

**新版本**：
```typescript
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

const currentStudentStore = useCurrentStudentStore()
```

**变更内容**：
1. `parent.ts` → `auth/parent.ts`
2. `student.ts` → `business/currentStudent.ts`
3. `useStudentStore` → `useCurrentStudentStore`
4. 变量名 `studentStore` → `currentStudentStore`

## 未来扩展

### 添加新角色

1. 在 `auth/` 目录创建新的角色 store
2. 定义角色特定的状态和方法
3. 在 `user.ts` 中添加角色类型枚举

### 添加新业务模块

1. 在 `business/` 目录创建新的业务 store
2. 确保业务数据与角色无关
3. 提供清空数据的方法

## 常见问题

### Q: 为什么不把 `currentStudent` 放在 `parent` 里？

A: 因为未来学生登录时，也需要使用 `currentStudent` 的业务数据。如果放在 `parent` 里，学生模式就无法复用。

### Q: `devices` 应该放在哪里？

A: 根据需求，`devices` 是每个学生独立的业务数据，所以放在 `business/currentStudent.ts` 中。

### Q: 切换学生时为什么要清空数据？

A: 避免显示上一个学生的数据，确保数据一致性。虽然有持久化，但不应该依赖缓存的数据。

### Q: 老师为什么不需要 `currentStudent`？

A: 老师的操作模式是"查看所有学生"，不需要"选择一个学生"的概念。老师可以直接通过 API 查询任意学生的数据。

## 维护建议

1. **严格遵守职责分离**：角色数据放 `auth/`，业务数据放 `business/`
2. **避免循环依赖**：store 之间不要相互引用
3. **及时清空数据**：切换上下文时调用 `clear` 方法
4. **文档同步更新**：添加新 store 时更新本文档

---

**最后更新**：2026-01-05
**版本**：v2.0.0
**作者**：Claude Code
