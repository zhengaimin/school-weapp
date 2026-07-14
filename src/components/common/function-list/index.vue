<script lang="ts" setup>
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

// 功能列表项接口
export interface FunctionListItem {
  id?: string
  title: string
  icon: string
  color?: string
  bgColor?: string
  iconColor?: string
  iconBg?: string
  path?: string
  [key: string]: any
}

interface Props {
  // 功能列表数据
  items: FunctionListItem[]
  // 是否显示分割线
  showDivider?: boolean
  // 自定义类名
  customClass?: string
}

interface Emits {
  (e: 'item-click', item: FunctionListItem, index: number): void
}

withDefaults(defineProps<Props>(), {
  showDivider: true,
  customClass: '',
})

const emit = defineEmits<Emits>()

// 处理列表项点击
function handleItemClick(item: FunctionListItem, index: number) {
  emit('item-click', item, index)
}

// 获取图标颜色
function getIconColor(item: FunctionListItem): string {
  return item.iconColor || item.color || '#6b7280'
}

// 获取图标背景色
function getIconBgColor(item: FunctionListItem): string {
  return item.iconBg || item.bgColor || '#f3f4f6'
}
</script>

<template>
  <!-- 使用卡片包装 -->
  <WhiteCard custom-class="p-0!" :class="customClass">
    <view>
      <view
        v-for="(item, index) in items"
        :key="item.id || index"
        w="full"
        p="4"
        flex="~ items-center justify-between"
        box-border
        :class="[
          showDivider && index < items.length - 1 ? 'border-b border-b-bg-muted border-b-solid' : '',
        ]"
        @click="handleItemClick(item, index)"
      >
        <view flex="~ items-center">
          <view
            w="8"
            h="8"
            m="r-3"
            border="rounded-lg"
            flex="~ items-center justify-center"
            :style="{ backgroundColor: getIconBgColor(item) }"
          >
            <Icon :name="item.icon" :icon-color="getIconColor(item)" icon-size="32rpx" />
          </view>
          <text text="sm gray-900">
            {{ item.title }}
          </text>
        </view>
        <Icon name="arrow-right-s-line" icon-color="#9ca3af" icon-size="32rpx" />
      </view>
    </view>
  </WhiteCard>
</template>
