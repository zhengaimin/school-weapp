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
  type?: 'select' | 'date' | 'daterange' | 'datetime' | 'datetimerange'
  /** 是否精简显示文字，对于 daterange 类型，默认显示月+日，设置为 false 时显示完整年月日 */
  concise?: boolean
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
  change: [key: string, value: string | number | number[] | [number, number], option?: FilterOption]
}>()

// 使用 defineModel 定义双向绑定 - 改为数组形式
const modelValue = defineModel<(string | number | number[] | [number, number])[]>({
  default: () => [],
})

// 更新筛选值
function updateFilter(
  key: string,
  value: string | number | number[] | [number, number],
  option?: FilterOption,
) {
  const filterIndex = props.filters.findIndex(f => f.key === key)

  if (filterIndex !== -1) {
    const newValue = [...modelValue.value]
    newValue[filterIndex] = value
    modelValue.value = newValue
  }
  emit('change', key, value, option)
}

// 获取筛选器的当前值
function getFilterValue(key: string) {
  const filterIndex = props.filters.findIndex(f => f.key === key)
  return filterIndex !== -1 ? modelValue.value[filterIndex] : undefined
}

// 计算每个筛选器的宽度
const selectorWidth = computed(() => {
  return props.filters.length > 0 ? `${100 / props.filters.length}%` : 'auto'
})
</script>

<template>
  <WhiteCard custom-class="p-0!">
    <view flex="~ items-center justify-between" :gap="props.gap">
      <FilterSelector
        v-for="filter in props.filters"
        :key="filter.key"
        :style="{ width: selectorWidth }"
        :icon="filter.icon"
        :popup-title="filter.title"
        :options="filter.options"
        :type="filter.type"
        :concise="filter.concise"
        :model-value="getFilterValue(filter.key)"
        @change="(value, option) => updateFilter(filter.key, value, option)"
      />
    </view>
  </WhiteCard>
</template>
