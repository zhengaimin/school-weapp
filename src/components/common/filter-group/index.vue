<script setup lang="ts">
import type { FilterOption } from '@/components/common/filter-selector/index.vue'

import { computed, ref, watch } from 'vue'
import CommonButton from '@/components/common/button/index.vue'
import FilterSelector from '@/components/common/filter-selector/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'

// 筛选器配置接口
export interface FilterConfig {
  key: string
  icon?: string
  title?: string
  options: FilterOption[]
  type?: 'select' | 'date' | 'daterange' | 'datetime' | 'datetimerange'
  /** 是否精简显示文字，对于 daterange 类型，默认显示月+日，设置为 false 时显示完整年月日 */
  concise?: boolean
  /** 是否放入抽屉筛选 */
  inDrawer?: boolean
}

// 组件属性
interface Props {
  /** 筛选器配置列表 */
  filters: FilterConfig[]
  /** 自定义样式类 */
  customClass?: string
  /** 筛选器之间的间距 */
  gap?: string
  /** 是否开启滚动模式 */
  scrollable?: boolean
}

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  gap: 'x-4',
  scrollable: false,
})
const emit = defineEmits<{
  change: [key: string, value: string | number | number[] | [number, number], option?: FilterOption]
}>()

// 使用 defineModel 定义双向绑定 - 改为数组形式
const modelValue = defineModel<(string | number | number[] | [number, number])[]>({
  default: () => [],
})

// 抽屉显示状态
const showDrawer = ref(false)
// 抽屉临时值
const drawerValues = ref<(string | number | number[] | [number, number])[]>([])

// 监听抽屉显示，初始化临时值
watch(showDrawer, (val) => {
  if (val) {
    drawerValues.value = [...modelValue.value]
  }
})

// 分离行内筛选和抽屉筛选
const inlineFilters = computed(() => {
  return props.filters.filter(f => !f.inDrawer)
})

const drawerFilters = computed(() => {
  return props.filters.map((f, i) => ({ ...f, index: i })).filter(f => f.inDrawer)
})

// 计算抽屉筛选的选中数量
const drawerSelectedCount = computed(() => {
  if (drawerFilters.value.length === 0) return 0

  let count = 0
  drawerFilters.value.forEach((filter) => {
    const value = modelValue.value[filter.index]
    // 假设第一个选项是"全部"，如果选中的不是第一个选项，则认为是有效筛选
    if (filter.options.length > 0 && value !== filter.options[0].value) {
      count++
    }
  })
  return count
})

// 计算抽屉筛选的摘要文字
const drawerSummary = computed(() => {
  if (drawerFilters.value.length === 0) return ''

  const summary: string[] = []
  drawerFilters.value.forEach((filter) => {
    const value = modelValue.value[filter.index]
    if (filter.options.length > 0 && value !== filter.options[0].value) {
      const option = filter.options.find(o => o.value === value)
      if (option) {
        summary.push(option.label)
      }
    }
  })
  return summary.join('/')
})

const isDrawerActive = computed(() => drawerSelectedCount.value > 0)

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

function getFilterValue(key: string) {
  const filterIndex = props.filters.findIndex(f => f.key === key)
  if (filterIndex === -1) return undefined

  const value = modelValue.value[filterIndex]
  if (value !== undefined) return value

  const filter = props.filters[filterIndex]
  return filter.options?.[0]?.value
}

function updateDrawerValue(index: number, value: string | number) {
  const nextValues = [...drawerValues.value]
  nextValues[index] = value
  drawerValues.value = nextValues
}

function handleDrawerReset() {
  const nextValues = [...drawerValues.value]
  drawerFilters.value.forEach((filter) => {
    nextValues[filter.index] = filter.options?.[0]?.value
  })
  drawerValues.value = nextValues
}

function handleDrawerConfirm() {
  drawerFilters.value.forEach((filter) => {
    updateFilter(filter.key, drawerValues.value[filter.index], undefined)
  })
  showDrawer.value = false
}
</script>

<template>
  <WhiteCard custom-class="p-0!">
    <scroll-view v-if="scrollable" scroll-x :show-scrollbar="false" class="w-full">
      <view flex="~ items-center" :gap="props.gap" class="min-w-full">
        <FilterSelector
          v-for="filter in inlineFilters"
          :key="filter.key"
          style="flex-shrink: 0"
          :icon="filter.icon"
          :popup-title="filter.title"
          :options="filter.options"
          :type="filter.type"
          :concise="filter.concise"
          :model-value="getFilterValue(filter.key)"
          @change="(value, option) => updateFilter(filter.key, value, option)"
        />
        <!-- 抽屉筛选按钮 -->
        <view
          v-if="drawerFilters.length > 0"
          flex="~ items-center justify-center"
          p="y-3 x-4"
          style="flex-shrink: 0"
          @click="showDrawer = true"
        >
          <text text="sm" :class="[isDrawerActive ? 'text-primary font-medium' : 'text-gray-600']">
            {{ isDrawerActive ? `筛选 (${drawerSelectedCount})` : '筛选' }}
          </text>
          <Icon
            name="filter-line"
            :icon-color="isDrawerActive ? '#3269dd' : '#9ca3af'"
            icon-size="32rpx"
            m="l-1"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 非滚动模式（flex布局） -->
    <view v-else flex="~ items-center" :class="[inlineFilters.length === 1 && drawerFilters.length === 0 ? 'justify-center' : '']" :gap="props.gap">
      <view
        v-for="(filter, index) in inlineFilters"
        :key="filter.key"
        :class="[index === 0 ? 'flex-1' : '']"
        min-w-0
      >
        <FilterSelector
          :icon="filter.icon"
          :popup-title="filter.title"
          :options="filter.options"
          :type="filter.type"
          :concise="filter.concise"
          :model-value="getFilterValue(filter.key)"
          @change="(value, option) => updateFilter(filter.key, value, option)"
        />
      </view>

      <!-- 抽屉筛选按钮 -->
      <view
        v-if="drawerFilters.length > 0"
        flex="~ items-center justify-end"
        p="y-3 x-4"
        style="flex-shrink: 0"
        @click="showDrawer = true"
      >
        <text
          text="sm"
          :class="[isDrawerActive ? 'text-primary font-medium' : 'text-gray-600']"
        >
          {{ isDrawerActive ? `筛选 (${drawerSelectedCount})` : '筛选' }}
        </text>
        <Icon
          name="filter-line"
          :icon-color="isDrawerActive ? '#3269dd' : '#9ca3af'"
          icon-size="32rpx"
          m="l-1"
        />
      </view>
    </view>

    <!-- 抽屉弹窗 -->
    <BottomPopup v-model="showDrawer" title="筛选" height="80vh" @close="showDrawer = false">
      <view flex="~ col" h-full>
        <scroll-view scroll-y flex-1>
          <view p="4">
            <view v-for="filter in drawerFilters" :key="filter.key" m="b-2">
              <view text="sm font-bold gray-900" display="block" p="b-3">
                {{ filter.title || '选项' }}
              </view>
              <view flex="~ wrap" gap="3">
                <CommonButton
                  v-for="option in filter.options"
                  :key="option.value"
                  size="small"
                  :type="drawerValues[filter.index] === option.value ? 'primary' : 'default'"
                  :plain="drawerValues[filter.index] !== option.value"
                  custom-class="min-w-20"
                  @click="updateDrawerValue(filter.index, option.value)"
                >
                  {{ option.label }}
                </CommonButton>
              </view>
            </view>
          </view>
        </scroll-view>
        <view p="4" flex="~ gap-4" border="t gray-100 solid">
          <CommonButton type="default" full plain flex-1 @click="handleDrawerReset">
            重置
          </CommonButton>
          <CommonButton type="primary" full flex-1 @click="handleDrawerConfirm">
            确定
          </CommonButton>
        </view>
      </view>
    </BottomPopup>
  </WhiteCard>
</template>
