# Pencil 设计稿修改提示词

项目路径：`D:\Code\weapp\school-weapp`

目标文件：`D:\Code\weapp\school-weapp\.agent\weapp.pen`

请修改这个 Pencil 设计稿，并优先使用 Pencil MCP 完成读取、修改、布局校验和预览导出。

## 前置检查

先确认 Pencil MCP 可用，不要直接猜测式大改。

1. 调用 `get_editor_state` 或 `batch_get` 读取设计稿。
2. 如果报错：

```text
failed to connect to running Pencil app: visual_studio_code
transport not connected to app: visual_studio_code
```

请先停止并说明 MCP 连接问题，不要继续大范围修改。

已知可能原因：

- 本机可能有多个残留 `mcp-server-windows-x64.exe --app visual_studio_code` 进程。
- `\\.\pipe\pencil-visual_studio_code` 可能不存在，说明 VS Code 侧 Pencil transport server 没有监听。
- Pencil 日志里可能出现过 `EADDRINUSE` 或 `EBUSY`，表示管道或 MCP 二进制被旧进程占用。

可建议用户先关闭所有 VS Code 窗口，结束残留 `mcp-server-windows-x64.exe`，重新打开 VS Code 和 `.agent/weapp.pen` 后再试。

## 当前设计稿状态

开始前请读取实际文件确认，不要只相信这里的描述。上一次文件已经被 JSON 方式改过，当前预期状态大致如下：

- `page-container`：`layout: "none"`。
- `balance-hero`：`height: 280`，`fill: "#3269dd"`。
- `stats-card`：`x: 16`，`y: 146`，在蓝色背景区域上，半透明白色样式。
- `card-video`：`x: 16`，`y: 264`，第一个设备卡稍微盖住蓝色背景底部。
- `card-dryer`：`x: 16`，`y: 714`，在内容区内。

## 修改目标

1. “学生信息”和“账户统计”都要放到蓝色背景区域上。
2. 蓝色背景保持纯色 `#3269dd`，不要渐变，不要装饰圆。
3. “账户统计”使用透明胶囊 / 半透明白色样式，参考页面代码里的透明胶囊风格，不要白色卡片。
4. “视频话机”和“吹风机”两个设备 card 需要整体在内容区。
5. 第一个“视频话机”card 要稍微盖住蓝色背景底部，参考页面代码：

```text
D:\Code\weapp\school-weapp\src\pages-sub\balance\home\index.vue
```

其中：

```scss
.balance-content {
  margin-top: -32rpx;
}
```

设计稿里如果按 375px 小程序宽度换算，可用约 `16px` 的覆盖量：蓝色背景 `height: 280` 时，`card-video.y` 可设为 `264`。

## 页面代码参考

重点参考：

```text
D:\Code\weapp\school-weapp\src\pages-sub\balance\home\index.vue
D:\Code\weapp\school-weapp\src\pages-sub\balance\home\components\StatisticsCard.vue
```

`StatisticsCard.vue` 的透明样式要点：

- 外层：`background: rgba(255, 255, 255, 0.14)`。
- 外层：`border: 1rpx solid rgba(255, 255, 255, 0.18)`。
- 外层：`border-radius: 28rpx`，折算为约 `14px`。
- 内层统计面板：`border-radius: 999rpx`。
- 内层统计面板：`background: rgba(255, 255, 255, 0.12)`。
- 文字使用白色和半透明白色。

## 推荐校验点

修改后请用 Pencil MCP 做这些校验：

1. `batch_get` 读取：
   - `page-container`
   - `balance-hero`
   - `student-area` 或学生信息相关节点
   - `stats-card`
   - `card-video`
   - `card-dryer`
2. `snapshot_layout` 检查 `page-container` 内是否有明显重叠、溢出或裁切问题。
3. 尽量用 `export_nodes` 导出 `page-container` 到：

```text
D:\Code\weapp\school-weapp\.agent\preview
```

4. 如能导出，请在最终说明中给出导出图片路径。

## 验收标准

- 蓝色背景只有纯色 `#3269dd`。
- 蓝色背景内没有渐变、装饰圆、无关背景装饰。
- “学生信息”在蓝色区域上。
- “账户统计”在蓝色区域上，并且是半透明白色 / 透明胶囊风格，不是白色实心卡片。
- “视频话机”卡片顶部轻微覆盖蓝色背景底部，覆盖量约 `16px`。
- “吹风机”卡片在内容区中，不压到蓝色背景。
- Pencil MCP 读取和布局校验成功；如果失败，明确说明失败原因和失败的 MCP 调用。

