# 接口定义标准

> 命名规范请参考 [naming.md](./naming.md)

本文档旨在规范项目中的 API 接口定义，确保代码的一致性、可读性和可维护性。所有前端开发者在定义新的 API 接口时应遵循此标准。

## 1. 文件结构约定

为了清晰地分离接口定义和实现，我们将相关文件组织在以下两个主要目录中：

- **接口类型定义**: `src/api/interface/modules/[module].ts`
  - 该文件负责定义指定模块（如 `devices`, `family`）的所有请求和响应的 TypeScript 接口和类型。
- **API 函数实现**: `src/api/modules/[module]/[feature].ts`
  - 该文件负责实现具体的 API 请求函数。`[feature].ts` 通常对应一个具体的功能点（如 `groups.ts`）。

## 2. 命名空间组织

为了避免不同功能模块下的接口名称冲突，并更好地组织代码，我们采用 **TypeScript 命名空间（namespace）** 对接口进行分组。

- **规则**: 在 `interface` 文件中，使用 `export namespace [Module]` 作为顶层命名空间，包裹该模块所有的接口定义。如果模块内存在功能子分组，可以在模块命名空间内再创建 `export namespace [Feature]`。

**示例** (`src/api/interface/modules/refund.ts`):

```typescript
// src/api/interface/modules/refund.ts
export namespace Refund {
  /** 单个退款申请信息 */
  export interface IRefundApplicationVo {
    // ... 字段定义
  }

  /** 退款明细信息 */
  export interface IRefundDetailVo {
    // ... 字段定义
  }

  export namespace Application {
    /** 申请退款 - 请求 */
    export interface ReqPostApplyApi {
      // ... 字段定义
    }

    /** 申请退款 - 响应 */
    export interface ResPostApplyApi {
      // ... 字段定义
    }
    // ... 其他 Application 相关接口
  }
}
```

## 3. 命名规范

统一的命名规范是代码可读性的关键。

### 接口函数命名规则

1.  **以 HTTP 请求方式为开头**（`get`、`post`、`put`、`delete` 等）。
2.  **以 `Api` 为结尾**。
3.  **示例**:
    - `getDeviceGroupsApi`
    - `postSubscribeDeviceGroupApi`
    - `putUpdateDeviceGroupApi`
    - `deleteDeviceGroupApi`

### 接口类型命名规则

1.  **请求接口**: `Req[HttpMethod][Action][Feature]Api`
    - **示例**: `ReqGetDeviceGroupsApi`、`ReqPostSubscribeDeviceGroupApi`
2.  **响应接口**: `Res[HttpMethod][Action][Feature]Api`
    - **示例**: `ResGetDeviceGroupsApi`、`ResPostSubscribeDeviceGroupApi`

## 4. 类型导入规范

- **规则**: 在导入 TypeScript 接口或类型时，**必须** 使用 `import type`。这可以确保在编译时类型信息被完全移除，避免不必要的运行时代码。

**示例**:

```typescript
// 正确做法
import type { Group } from '@/api/interface/modules/devices'

// 错误做法
import { Group } from '@/api/interface/modules/devices'
```

## 5. API 路径常量与 HTTP 客户端使用

- **API 路径常量**: 在每个 API 实现文件中，应将所有 API 端点路径提取到一个常量对象中（例如 `MODULE_API`）。该常量应包含字符串路径或返回字符串路径的函数（用于动态路径，如包含 ID 的路径）。
- **函数签名**: API 函数应接收一个与请求接口匹配的 `params` 对象，并明确返回一个 `Promise`，其泛型为对应的响应接口。
- **HTTP 客户端**: 项目统一使用封装的 `http` 客户端。通过泛型 `http.get<ResType>` 来指定期望的响应数据结构，Alova 会自动进行类型推断和校验。

**示例** (`src/api/modules/refund/index.ts`):

```typescript
import type { Refund } from '@/api/interface/modules/refund'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const REFUND_API = {
  APPLY: `${API}/refund/apply`,
  APPLICATIONS: `${API}/refund/applications`,
  APPLICATION_DETAIL: (id: number) => `${API}/refund/applications/${id}`,
  APPLICATION_CANCEL: (id: number | string) => `${API}/refund/applications/${id}/cancel`,
  PENDING: `${API}/refund/pending`,
}

/**
 * @description 申请退款
 * @param {Refund.Application.ReqPostApplyApi} params
 * @returns {Promise<Refund.Application.ResPostApplyApi>}
 */
export function postApplyRefundApi(params: Refund.Application.ReqPostApplyApi) {
  return http.post<Refund.Application.ResPostApplyApi>(REFUND_API.APPLY, params)
}

/**
 * @description 获取退款申请详情
 * @param {number} id - 退款申请ID
 * @returns {Promise<Refund.Application.ResGetDetailApi>}
 */
export function getRefundApplicationDetailApi(id: number) {
  return http.get<Refund.Application.ResGetDetailApi>(REFUND_API.APPLICATION_DETAIL(id))
}
```

## 6. 完整示例模板

下面是一个从接口定义到函数实现的完整流程示例。

#### 步骤 1: 定义接口 (`src/api/interface/modules/devices.ts`)

```typescript
// src/api/interface/modules/devices.ts
export namespace Devices {
  // 定义单个设备分组的数据结构
  export interface DeviceGroup {
    id: number
    name: string
    deviceCount: number
    createdAt: string
  }

  // 使用命名空间包裹功能点
  export namespace Group {
    /** 获取设备分组列表 - 请求 */
    export interface ReqGetDeviceGroupsApi {
      page: number
      size: number
      name?: string // 可选的搜索参数
    }

    /** 获取设备分组列表 - 响应 */
    export interface ResGetDeviceGroupsApi {
      deviceGroups: DeviceGroup[]
      total: number
    }
  }
}
```

#### 步骤 2: 实现 API 函数 (`src/api/modules/devices/groups.ts`)

```typescript
// src/api/modules/devices/groups.ts
import type { Devices } from '@/api/interface/modules/devices'
import { API } from '@/api/config/servicePort'
import { http } from '@/http'

const DEVICES_GROUPS_API = {
  GROUPS: `${API}/devices/groups`,
  // ... 其他设备分组相关的 API 路径
}

/**
 * @description 获取设备分组列表
 * @param {Devices.Group.ReqGetDeviceGroupsApi} params
 * @returns {Promise<Devices.Group.ResGetDeviceGroupsApi>}
 */
export function getDeviceGroupsApi(params: Devices.Group.ReqGetDeviceGroupsApi) {
  // 使用 http.get 并传入响应类型
  return http.get<Devices.Group.ResGetDeviceGroupsApi>(DEVICES_GROUPS_API.GROUPS, params)
}
```

## 7. 根据 API 文档完善接口定义

在开发新功能时，`Res[Action][Feature]Api` 接口初始可能为空。开发者需要根据后端同学提供的 API 文档来填充其具体字段。

#### 场景：完善 `ResGetDeviceGroupsApi`

假设后端返回的数据结构如下：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": 1,
        "group_name": "教学楼A栋",
        "device_count": 12,
        "created_at": "2023-10-01 10:00:00"
      }
    ],
    "total_count": 1
  }
}
```

我们的 `http` 客户端会自动解析 `data` 字段，因此我们只需要根据 `data` 内部的结构来定义接口。

**完善前**:

```typescript
export namespace Group {
  // ...
  /** 获取设备分组列表 - 响应 */
  export interface ResGetDeviceGroupsApi {} // 初始为空
}
```

**完善后**:

首先，定义单个设备分组的类型，注意字段名需要从下划线 `group_name` 转换为驼峰 `groupName`。

```typescript
// 单个设备分组的数据结构
export namespace Devices {
  export interface DeviceGroup {
    id: number
    groupName: string
    deviceCount: number
    createdAt: string
  }
}
```

然后，填充 `ResGetDeviceGroupsApi` 接口。

```typescript
export namespace Devices {
  export namespace Group {
    // ...
    /** 获取设备分组列表 - 响应 */
    export interface ResGetDeviceGroupsApi {
      // 对应后端返回的 list 字段
      deviceGroups: DeviceGroup[]
      // 对应后端返回的 total_count 字段
      total: number
    }
  }
}
## 8. 代码风格特点总结

基于当前项目的代码实践，我们总结出以下接口开发的代码风格特点：

- **模块化导入与导出**：
  - 接口类型定义 (`interface`) 和 API 函数实现 (`modules`) 按模块划分，并通过各自模块的 `index.ts` 文件进行统一导出，方便集中管理和调用。
  - **示例**: `src/api/modules/devices/index.ts` 中使用 `export * from './groups'` 导出所有分组相关的 API 函数。

- **严格的类型导入**：
  - 始终使用 `import type` 导入 TypeScript 类型和接口。这确保了类型信息在编译后被完全擦除，减小了打包体积，并避免了潜在的循环依赖问题。

- **JSDoc 注释规范**：
  - 每个 API 函数都配有详细的 JSDoc 注释，清晰地描述了函数的功能、参数 (`@param`) 和返回值 (`@returns`)。这不仅提升了代码的可读性，也为 IDE 提供了更好的智能提示和类型检查。

- **路径别名**:
  - 项目广泛使用路径别名（如 `@/http`）来简化导入路径，提高了代码的整洁度和可维护性。

- **函数声明风格**：
  - API 函数统一使用函数声明 (`export function`) 的方式定义，而非箭头函数。这保持了代码风格的一致性。

- **常量管理 API 地址**：
  - API 的具体端点通过模块级别的常量对象进行管理（如 `REFUND_API`），避免了在代码中硬编码 URL，便于维护和修改。该常量对象应定义在 API 实现文件的顶部。

## 9. 完整的开发流程

为了确保所有开发者遵循统一的标准，我们制定了从接口定义到实现的完整开发流程：

1. **需求分析与接口确认**：
   - 在开始开发前，与后端工程师沟通，获取或共同制定 API 文档，明确请求参数、响应数据结构和业务逻辑。

2. **定义 TypeScript 接口**：
    - 在 `src/api/interface/modules/[module].ts` 文件中，使用 `export namespace [Module]` 定义模块的顶层命名空间，并在其中定义所有相关的接口。
    - 根据 API 文档，在模块命名空间内或其子命名空间中，创建请求接口 `Req[Action][Feature]Api` 和响应接口 `Res[Action][Feature]Api`。
    - 如果响应数据结构复杂，可以先在模块命名空间内定义独立的数据结构类型（如 `DeviceGroup`），然后在响应接口中引用。

3. **实现 API 请求函数**：
    - 在 `src/api/modules/[module]/[feature].ts` 文件中，创建对应的 API 函数。
    - 在文件顶部定义一个 API 路径常量对象（例如 `MODULE_FEATURE_API`），用于管理该功能点的所有 API 端点。
    - 使用 `import type` 导入刚刚定义的接口。
    - 编写函数，确保函数签名中的参数类型和返回值类型与接口定义一致。
    - 使用 `http` 客户端发起请求，并通过泛型指定响应类型，例如 `http.get<Devices.Group.ResGetDeviceGroupsApi>(MODULE_FEATURE_API.GROUPS, params)`。请求的 URL 应从常量对象中获取。

4. **统一导出**：
   - 在对应模块的 `index.ts` 文件中（如 `src/api/modules/devices/index.ts`），导出新创建的 API 函数，确保其在项目中可以被统一访问。

5. **业务逻辑调用**：
   - 在页面或组件中，从 `@/api` 导入并调用 API 函数，享受完整的类型提示和编译时检查。

## 10. 常见问题和注意事项

- **Q1: 后端返回的字段是下划线（snake_case），前端如何处理？**
  - **A**: 前端的数据模型（接口定义）应统一使用驼峰命名（camelCase）。在定义接口时，需要手动将后端的下划线字段转换为驼峰形式。`http` 客户端或数据转换层会自动处理这一映射关系。

- **Q2: 什么时候应该创建新的 `[feature].ts` 文件？**
  - **A**: 当一个模块下的功能点变得复杂时，应考虑将其拆分到独立的 `feature.ts` 文件中。例如，一个 `devices` 模块可以包含 `groups.ts`（设备分组）、`management.ts`（设备管理）、`logs.ts`（设备日志）等。

- **Q3: 响应接口 `Res...Api` 初始为空，何时填充？**
  - **A**: 在与后端联调或拿到确切的 API 文档后，应立即根据返回的 `data` 字段来完善响应接口的定义。这可以尽早发现潜在的类型问题。

- **Q4: 如何处理分页请求的参数？**
  - **A**: 分页参数（如 `page`, `pageSize`）应作为请求接口 `Req...Api` 的一部分，而不是硬编码在函数内部。这使得 API 函数更加通用和可复用。

## 11. 总结

本标准旨在通过规范化的文件结构、命名约定和编码实践，提升项目 API 层的质量和可维护性。遵循此标准不仅能减少因接口定义不一致导致的问题，还能借助 TypeScript 的类型系统，在开发阶段就发现并修复潜在错误，从而提高整体开发效率和代码健壮性。

希望所有团队成员都能严格遵守，共同维护一个清晰、可靠的代码库。

## 12. 常量管理与索引

在 API 开发过程中，经常需要使用和定义各种常量（如状态码、类型枚举等）。项目维护了统一的常量管理规范和索引系统：

### 常量定义规范

所有常量定义遵循 [@.ai/constant.md](.ai/constant.md) 规范，采用 TYPE、I18N、OPTIONS 三层结构。

### 常量索引文件

**重要**: 项目维护了集中的常量索引文件 `.ai/constant-index.md`，用于快速查询和定位所有常量定义。

### 同步要求

在 API 开发中涉及常量的增删改查时，**必须同步更新** `.ai/constant-index.md` 文件：

1. **新增常量**: 在索引中添加对应条目
2. **修改常量**: 同步更新索引中的说明
3. **删除常量**: 从索引中删除对应条目
4. **查询常量**: 优先查阅索引文件快速定位

详细规范请参考 [@.ai/constant.md](.ai/constant.md) 的"常量索引管理"章节。
