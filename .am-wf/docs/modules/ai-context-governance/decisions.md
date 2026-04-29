# AI 上下文治理 - 设计决策

## 决策流程

```mermaid
graph LR
  A[流程重且引用失效] --> B[收敛到轻量上下文]
  B --> C[规范入口前置到 context/index]
  C --> D[脚本与 lint 规则对齐]
```

## 决策记录

1. 移除强制 memory 依赖，改为可选辅助流程，减少默认上下文负担。
2. 新增并前置 `page-views` 规则入口，先定结构再定实现细节。
3. `scripts/sync-ai-context.mjs` 显式 `import process from 'node:process'`，与 ESLint `node/prefer-global/process` 对齐。
4. 保持脚本行为不变，优先修复规范与工具链一致性。

## 代码落点

- `AGENTS.md`
- `.aimin-skill/context/ai-rules/usage.md`
- `.aimin-skill/context/ai-rules/page-views.md`
- `scripts/sync-ai-context.mjs`

## 迁移来源

- `.aimin-skill/doc/设计/ai-context-aimin-skills-refresh.md`
- `.aimin-skill/doc/设计/ai-rules-page-views-module-split.md`
- `.aimin-skill/doc/设计/sync-ai-context-eslint-process.md`
