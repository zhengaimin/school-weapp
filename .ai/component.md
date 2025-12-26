# 组件开发规范

## Setup 代码区域划分
使用 `#region` 和 `#endregion` 注释来划分 setup 中的代码区域，提高代码可读性和维护性。

### 标准区域划分
```typescript
<script lang="ts" setup>
// #region 导入
import type { ComponentType } from '@/types'
import Component from '@/components/component/index.vue'
// #endregion

// #region 属性定义
const props = defineProps<{
  data: ComponentType
}>()

const emit = defineEmits<{
  click: [event: Event]
  action: [data: ComponentType]
}>()
// #endregion

// #region 响应式数据
const loading = ref(false)
const visible = ref(false)
// #endregion

// #region 计算属性
const computedValue = computed(() => {
  return props.data.value * 2
})
// #endregion

// #region 方法
function handleClick(event: Event) {
  emit('click', event)
}

function handleAction() {
  emit('action', props.data)
}
// #endregion

// #region 生命周期
onMounted(() => {
  // 初始化逻辑
})
// #endregion
</script>
```

## Template 点击事件规范
如果 template 中只有一个根节点，需要添加标准的点击事件处理：

### 事件处理规范
1. 添加 `@click.stop="e => emit('click', e)"` 事件
2. 确保在 `defineEmits` 中定义了正确的 `click` 事件类型
3. 事件类型必须为 `click: [event: Event]`

### 示例
```vue
<script lang="ts" setup>
// #region 导入
import type { DataType } from '@/types'
// #endregion

// #region 属性定义  
const props = defineProps<{
  data: DataType
}>()

const emit = defineEmits<{
  click: [event: Event]
  action: [data: DataType]
}>()
// #endregion

// #region 方法
function handleAction() {
  emit('action', props.data)
}
// #endregion
</script>

<template>
  <view class="component-wrapper" @click.stop="e => emit('click', e)">
    <!-- 组件内容 -->
    <view>{{ data.title }}</view>
    <button @click.stop="handleAction">操作</button>
  </view>
</template>
```

## 注意事项
1. 所有区域注释必须使用 `// #region` 和 `// #endregion` 格式
2. 区域名称要清晰明确，便于理解代码用途
3. 点击事件的事件参数类型必须为 `Event`
4. 使用 `@click.stop` 防止事件冒泡
5. 确保 TypeScript 类型定义正确
6. 所有方法定义必须在函数上方添加简短的单行注释（使用 // 开头），说明函数目的与行为，便于阅读与维护
7. 间距使用规范：在组件模板中，应避免直接使用 space="y-<n>" 这类垂直间距原子类，建议使用弹性布局配合 gap 来控制垂直间距。示例：
```vue
<!-- 不推荐 -->
<view p="4" space="y-3">
  ...
</view>

<!-- 推荐：使用 flex + gap -->
<view p="4" flex="~ col" gap="3">
  ...
</view>
```
此规则适用于所有组件模板，确保布局语义清晰且与项目的 UnoCSS/Attributify 风格保持一致。

## Icon 组件使用规范

Icon 组件使用 `icon-color` 和 `icon-size` 属性，而不是 `color` 和 `size` 字段：

```vue
<Icon name="history-line" :icon-color="NAVIGATION_SUFFIX_COLOR" :icon-size="NAVIGATION_SUFFIX_SIZE" />
```

## 帮助弹框组件使用规范

使用 BottomPopup 组件创建帮助弹框：

```vue
<BottomPopup v-model="showHelpModal" title="绑定说明" height="auto">
  <view p="4 b-6" text-sm color-text-secondary space-y-2>
    <view v-for="(item, index) in helpContent" :key="index" flex="~">
      <text mr-2>
        ·
      </text>
      <text flex-1>
        {{ item }}
      </text>
    </view>
  </view>
</BottomPopup>
```