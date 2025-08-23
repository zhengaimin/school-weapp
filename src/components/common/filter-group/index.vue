<script setup lang="ts">
import type { FilterOption } from '@/components/common/filter-selector/index.vue'

import FilterSelector from '@/components/common/filter-selector/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'

// 筛选器配置接口
export interface FilterConfig {
  key: string
  icon?: string
  title?: string
  options: FilterOption[]
}

// 组件属性
interface Props {
  /** 筛选器配置列表 */
  filters: FilterConfig[]
  /** 自定义样式类 */
  customClass?: string
  /** 筛选器之间的间距 */
  gap?: string
}

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  gap: 'x-4',
})
const emit = defineEmits<{
  change: [key: string, value: string | number, option: FilterOption]
}>()

// 使用 defineModel 定义双向绑定
const modelValue = defineModel<Record<string, string | number>>({
  default: () => ({}),
})

// 更新筛选值
function updateFilter(key: string, value: string | number, option: FilterOption) {
  modelValue.value = { ...modelValue.value, [key]: value }
  emit('change', key, value, option)
}

// 获取筛选器的当前值
function getFilterValue(key: string) {
  return modelValue.value[key] || ''
}
</script>

<template>
  <WhiteCard custom-class="p-0!">
    <view flex="~ items-center justify-between" :gap="props.gap">
      <FilterSelector
        v-for="filter in props.filters"
        :key="filter.key"
        :icon="filter.icon"
        :popup-title="filter.title"
        :options="filter.options"
        :model-value="getFilterValue(filter.key)"
        @change="(value, option) => updateFilter(filter.key, value, option)"
      />
    </view>
  </WhiteCard>
</template>
