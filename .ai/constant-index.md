# 常量索引文档

> 命名规范请参考 [naming.md](./naming.md)

本文档提供项目中所有常量的索引，便于快速查询和定位。所有常量定义遵循 [constant.md](./constant.md) 规范。

## 索引说明

- **TYPE**: 常量对象名称
- **I18N**: 国际化文本映射
- **OPTIONS**: UI 组件选项列表
- **CONFIGS**: 状态配置映射（包含样式、图标等）
- **文件路径**: 相对于 `src/constant/modules/` 的路径

---

## 业务模块 (business)

### 用户相关 (user)

#### 学生 (student)
**文件**: `business/user/student.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| SEARCH_TYPE | TYPE | 学生搜索类型 | CODE, ID_CARD, UUID |
| TSearchType | Type | 搜索类型 TS 类型 | - |
| SEARCH_TYPE_I18N | I18N | 搜索类型文本 | 学号、身份证号、唯一号 |
| SEARCH_TYPE_OPTIONS | OPTIONS | 搜索类型选项 | - |
| FACE_STATUS | TYPE | 人脸状态 | NOT_COLLECTED, COLLECTED, AUDITING, AUDIT_PASSED, AUDIT_FAILED |
| TFaceStatus | Type | 人脸状态 TS 类型 | - |
| FACE_STATUS_I18N | I18N | 人脸状态文本 | 未采集、已采集、审核中、审核通过、审核失败 |
| FACE_STATUS_OPTIONS | OPTIONS | 人脸状态选项 | - |

#### 关系 (relation)
**文件**: `business/user/relation.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| RELATION_TYPE | TYPE | 亲情号称谓类型 | FATHER, MOTHER, GRANDFATHER, GRANDMOTHER, MATERNAL_GRANDFATHER, MATERNAL_GRANDMOTHER, SISTER, BROTHER, OTHER |
| TRelationType | Type | 关系类型 TS 类型 | - |
| RELATION_TYPE_I18N | I18N | 关系类型文本 | 爸爸、妈妈、爷爷、奶奶、外公、外婆、姐姐、哥哥、其他 |
| RELATION_TYPE_OPTIONS | OPTIONS | 关系类型选项 | - |

#### 角色 (role)
**文件**: `business/user/role.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| ROLE_TYPE | TYPE | 角色类型 | PARENT, TEACHER, STUDENT |
| TRoleType | Type | 角色类型 TS 类型 | - |
| ROLE_TYPE_I18N | I18N | 角色类型文本 | 家长、教师、学生 |
| ROLE_TYPE_OPTIONS | OPTIONS | 角色类型选项 | - |
| USER_TYPE | TYPE | 用户类型 | PARENT, TEACHER |
| TUserType | Type | 用户类型 TS 类型 | - |
| USER_TYPE_I18N | I18N | 用户类型文本 | 家长、教师 |
| USER_TYPE_OPTIONS | OPTIONS | 用户类型选项 | - |

#### 消费 (consumption)
**文件**: `business/user/consumption.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| CONSUMPTION_SOURCE | TYPE | 消费来源 | GIFT, PACKAGE, BALANCE, MIXED |
| TConsumptionSource | Type | 消费来源 TS 类型 | - |
| CONSUMPTION_SOURCE_I18N | I18N | 消费来源文本 | 赠送、套餐、余额、混合 |
| CONSUMPTION_SOURCE_OPTIONS | OPTIONS | 消费来源选项 | - |

---

### 设备相关 (device)

#### 服务类型 (service)
**文件**: `business/device/service.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| SERVICE_TYPE | TYPE | 服务类型 | MESSAGE, CALL |
| TServiceType | Type | 服务类型 TS 类型 | - |
| SERVICE_TYPE_I18N | I18N | 服务类型文本 | 留言、通话 |
| SERVICE_TYPE_OPTIONS | OPTIONS | 服务类型选项 | - |

#### 订阅状态 (subscription)
**文件**: `business/device/subscription.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| SUBSCRIPTION_STATUS | TYPE | 订阅状态 | UNSUBSCRIBED, SUBSCRIBED |
| TSubscriptionStatus | Type | 订阅状态 TS 类型 | - |
| SUBSCRIPTION_STATUS_I18N | I18N | 订阅状态文本 | 未订阅、已订阅 |
| SUBSCRIPTION_STATUS_OPTIONS | OPTIONS | 订阅状态选项 | - |

---

### 资金相关 (fund)

#### 余额 (balance)
**文件**: `business/fund/balance.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| AMOUNT_TYPE | TYPE | 金额类型 | RECHARGE, CONSUMPTION, REFUND, FREEZE, UNFREEZE, ADJUST, PACKAGE_PURCHASE |
| TAmountType | Type | 金额类型 TS 类型 | - |
| AMOUNT_TYPE_I18N | I18N | 金额类型文本 | 充值、消费、退款、冻结、解冻、调整、套餐购买 |
| AMOUNT_TYPE_OPTIONS | OPTIONS | 金额类型选项 | - |
| AMOUNT_TYPE_ICON_MAP | Mapping | 金额类型图标映射 | 各类型对应的图标名称 |
| POSITIVE_AMOUNT_TYPES | Array | 正向金额类型 | RECHARGE, REFUND, UNFREEZE |

---

### 支付相关 (payment)

#### 充值 (recharge)
**文件**: `business/payment/recharge.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| PAYMENT_METHOD | TYPE | 支付方式 | MOCK, WECHAT |
| TPaymentMethod | Type | 支付方式 TS 类型 | - |
| PAYMENT_METHOD_I18N | I18N | 支付方式文本 | 模拟支付、微信支付 |
| PAYMENT_METHOD_OPTIONS | OPTIONS | 支付方式选项 | - |
| PAYMENT_STATUS | TYPE | 支付状态 | PENDING, SUCCESS, FAILED, REFUND, CANCELLED, EXPIRED |
| TPaymentStatus | Type | 支付状态 TS 类型 | - |
| PAYMENT_STATUS_I18N | I18N | 支付状态文本 | 待支付、支付成功、支付失败、已退款、已取消、已过期 |
| PAYMENT_STATUS_OPTIONS | OPTIONS | 支付状态选项 | - |
| RECHARGE_RESULT_STATUS_CONFIG | CONFIGS | 充值结果状态配置 | 包含背景色、图标、标题、描述 |

---

### 退款相关 (refund)

#### 余额退款 (balance)
**文件**: `business/refund/balance.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| REFUND_APPLICATION_STATUS | TYPE | 退款申请状态 | PENDING, APPROVED, REJECTED, COMPLETED |
| TRefundApplicationStatus | Type | 退款申请状态 TS 类型 | - |
| REFUND_APPLICATION_STATUS_I18N | I18N | 退款申请状态文本 | 待审核、审核通过、审核拒绝、退款完成 |
| REFUND_APPLICATION_STATUS_OPTIONS | OPTIONS | 退款申请状态选项 | - |
| REFUND_APPLICATION_STATUS_CONFIGS | CONFIGS | 退款申请状态配置 | 包含样式类、图标、颜色、背景色 |
| REFUND_TYPE | TYPE | 退款类型 | FULL |
| TRefundType | Type | 退款类型 TS 类型 | - |
| REFUND_TYPE_I18N | I18N | 退款类型文本 | 全额退款 |
| REFUND_TYPE_OPTIONS | OPTIONS | 退款类型选项 | - |
| REFUND_STATUS | TYPE | 退款状态 | PENDING, APPROVED, PROCESSING, COMPLETED, PARTIAL, REJECTED, CANCELLED, ALL_CANCELLED |
| TRefundStatus | Type | 退款状态 TS 类型 | - |
| REFUND_STATUS_I18N | I18N | 退款状态文本 | 待审核、审核通过、退款处理中、全部退款完成、部分退款完成、审核拒绝、用户取消、全部取消 |
| REFUND_STATUS_OPTIONS | OPTIONS | 退款状态选项 | - |
| REFUND_STATUS_CONFIGS | CONFIGS | 退款状态配置 | 包含样式类、图标、颜色、背景色 |

---

### 套餐相关 (package)

#### 通用 (common)
**文件**: `business/package/common.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| DEVICE_TYPE | TYPE | 设备类型 | VIDEO, DRYER |
| TDeviceType | Type | 设备类型 TS 类型 | - |
| DEVICE_TYPE_I18N | I18N | 设备类型文本 | 视频话机、吹风机 |
| DEVICE_TYPE_OPTIONS | OPTIONS | 设备类型选项 | - |
| PACKAGE_TYPE | TYPE | 套餐类型 | GENERAL, FIXED |
| TPackageType | Type | 套餐类型 TS 类型 | - |
| PACKAGE_TYPE_I18N | I18N | 套餐类型文本 | 通用套餐、固定套餐 |
| PACKAGE_TYPE_OPTIONS | OPTIONS | 套餐类型选项 | - |
| PACKAGE_STATUS | TYPE | 套餐状态 | PENDING, WAITING_ACTIVE, ACTIVE, EXPIRED, USED_UP, REFUNDED, CANCELLED, REFUND_PENDING |
| TPackageStatus | Type | 套餐状态 TS 类型 | - |
| PACKAGE_STATUS_I18N | I18N | 套餐状态文本 | 待支付、待激活、有效/已激活、已过期、已用完、已退款、已取消、申请退款中 |
| PACKAGE_STATUS_OPTIONS | OPTIONS | 套餐状态选项 | - |
| PACKAGE_STATUS_CONFIGS | CONFIGS | 套餐状态配置 | 包含样式类、图标、颜色、背景色 |

#### 购买 (buy)
**文件**: `business/package/buy.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| PACKAGE_BUY_STATUS | TYPE | 套餐购买状态 | PENDING, WAITING_ACTIVE, ACTIVE, EXPIRED, USED_UP, REFUNDED, CANCELLED, REFUND_PENDING |
| TPackageBuyStatus | Type | 套餐购买状态 TS 类型 | - |
| PACKAGE_BUY_STATUS_I18N | I18N | 套餐购买状态文本 | 待支付、待激活、有效、已过期、已用完、已退款、已取消、申请退款中 |
| PACKAGE_BUY_STATUS_OPTIONS | OPTIONS | 套餐购买状态选项 | - |

---

### 赠费相关 (gift)

#### 来源 (source)
**文件**: `business/gift/source.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| GIFT_SOURCE | TYPE | 赠费来源类型 | ADMIN_GIFT, PROMOTION, COMPENSATION, REWARD |
| TGiftSource | Type | 赠费来源 TS 类型 | - |
| GIFT_SOURCE_I18N | I18N | 赠费来源文本 | 管理员赠送、活动赠送、补偿赠送、奖励赠送 |
| GIFT_SOURCE_OPTIONS | OPTIONS | 赠费来源选项 | - |

#### 状态 (status)
**文件**: `business/gift/status.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| GIFT_STATUS | TYPE | 赠费状态 | VALID, SOON_TO_EXPIRE, EXPIRED, USED_UP |
| TGiftStatus | Type | 赠费状态 TS 类型 | - |
| GIFT_STATUS_I18N | I18N | 赠费状态文本 | 有效、即将到期、已过期、已用完 |
| GIFT_STATUS_OPTIONS | OPTIONS | 赠费状态选项 | - |
| GIFT_STATUS_CONFIGS | CONFIGS | 赠费状态配置 | 包含样式类、图标、颜色、背景色 |

---

### 消息相关 (message)

**文件**: `business/message/index.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| FILE_TYPE | TYPE | 文件类型 | TEXT, AUDIO, IMAGE, VIDEO |
| TFileType | Type | 文件类型 TS 类型 | - |
| FILE_TYPE_I18N | I18N | 文件类型文本 | 文本、语音、图片、视频 |
| FILE_TYPE_OPTIONS | OPTIONS | 文件类型选项 | - |
| MESSAGE_DIRECTION | TYPE | 消息方向 | STUDENT_TO_GUARDIAN, GUARDIAN_TO_STUDENT |
| TMessageDirection | Type | 消息方向 TS 类型 | - |
| MESSAGE_DIRECTION_I18N | I18N | 消息方向文本 | 学生发送、家长发送 |
| MESSAGE_DIRECTION_OPTIONS | OPTIONS | 消息方向选项 | - |

---

## UI 模块 (ui)

### 菜单 (menu)
**文件**: `ui/menu.ts`

| 常量名称 | 类型 | 说明 |
|---------|------|------|
| IMenuItem | Interface | 菜单项接口定义 |
| MENU_PROFILE | Config | 个人信息菜单 (orange) |
| MENU_CHILDREN_DETAIL | Config | 学生信息菜单 (amber) |
| MENU_STUDENT_BIND | Config | 绑定学生菜单 (teal) |
| MENU_SWITCH_ROLE | Config | 切换身份菜单 (lime) |
| MENU_FACE_COLLECTION | Config | 人脸采集菜单 (purple) |
| MENU_FAMILY_NUMBER | Config | 亲情号菜单 (pink) |
| MENU_ACCOUNT_INFO | Config | 账户信息菜单 (blue) |
| MENU_PACKAGE | Config | 套餐购买菜单 (emerald) |
| MENU_REFUND_APPLY_PATH | Config | 申请退费菜单 (red) |
| MENU_FEEDBACK | Config | 意见反馈菜单 (rose) |
| MENU_MESSAGE | Config | 留言菜单 (violet) |
| MENU_ABOUT | Config | 关于我们菜单 (gray) |
| MENU_DEVICE_SUBSCRIBE | Config | 设备订阅菜单 (cyan) |
| MENU_CONSUMPTION_RECORD | Config | 消费记录菜单 (indigo) |
| MENU_BALANCE_DETAILS | Config | 充值明细菜单 (sky) |
| MENU_SCORE | Config | 成绩查询菜单 (fuchsia) |
| MENU_LIST | Array | 首页功能按钮配置列表 |

---

## HTTP 模块 (http)

### 状态码 (status)
**文件**: `http/status.ts`

| 常量名称 | 类型 | 说明 | 导出内容 |
|---------|------|------|---------|
| HTTP_STATUS_CODES | Const | HTTP 状态码映射 | 4xx 和 5xx 错误码及对应消息 |
| THttpStatusCode | Type | HTTP 状态码 TS 类型 | - |
| getHttpStatusMessage | Function | 获取状态码消息 | - |
| isKnownHttpStatusCode | Function | 判断是否为已知状态码 | - |
| isClientError | Function | 判断是否为客户端错误 | - |
| isServerError | Function | 判断是否为服务器错误 | - |

---

## 应用模块 (app)

### 导航 (navigation)
**文件**: `app/navigation.ts`

| 常量名称 | 类型 | 说明 | 值 |
|---------|------|------|-----|
| NAVIGATION_SUFFIX_COLOR | Const | 导航栏右侧图标默认颜色 | #4a5568 |
| NAVIGATION_SUFFIX_SIZE | Const | 导航栏右侧图标默认大小 | 40rpx |

---

## 通用模块 (common)

**文件**: `common/index.ts`

| 常量名称 | 类型 | 说明 | 值 |
|---------|------|------|-----|
| ALL | Const | 通用常量 | 'all' |

---

## 使用说明

### 查询常量

1. **按模块查询**: 根据业务模块（如 user、device、payment）快速定位
2. **按类型查询**: 查找 TYPE、I18N、OPTIONS、CONFIGS
3. **按文件路径**: 直接定位到具体文件

### 新增常量

当新增常量时，请按以下步骤操作：

1. 在对应模块目录下创建或编辑常量文件
2. 遵循 [@.ai/constant.md](.ai/constant.md) 规范定义常量
3. 在本索引文件中添加对应条目
4. 更新相关的 `index.ts` 导出文件

### 修改常量

修改常量时：

1. 修改对应的常量文件
2. 同步更新本索引文件中的说明
3. 检查是否影响其他模块的引用

### 删除常量

删除常量时：

1. 从常量文件中删除定义
2. 从本索引文件中删除对应条目
3. 全局搜索并更新所有引用该常量的代码

---

## 常量命名规范速查

- **TYPE 常量**: `UPPERCASE_SNAKE_CASE` (如 `SEARCH_TYPE`)
- **TS 类型**: `T + PascalCase` (如 `TSearchType`)
- **I18N 映射**: `[TYPE_NAME]_I18N` (如 `SEARCH_TYPE_I18N`)
- **OPTIONS 列表**: `[TYPE_NAME]_OPTIONS` (如 `SEARCH_TYPE_OPTIONS`)
- **CONFIGS 映射**: `[TYPE_NAME]_CONFIGS` (如 `REFUND_STATUS_CONFIGS`)

---

**最后更新**: 2025-12-30
**维护者**: 开发团队
**相关文档**: [constant.md](./constant.md)
