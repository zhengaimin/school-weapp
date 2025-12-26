<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package.ts'
import { PACKAGE_TYPE_I18N } from '@/constant/modules'
// #endregion

// #region 属性定义
const props = defineProps<{
  pkg: Pkg.Query.IPackage
  isActive?: boolean
}>()

const emit = defineEmits<{
  click: [pkg: Pkg.Query.IPackage]
}>()
// #endregion

// #region 方法
// 格式化价格显示（前缀人民币符号）
function formatPrice(price: number): string {
  return `¥${price}`
}

// 根据套餐类型常量返回中文展示文本
function getPackageTypeText(type: string): string {
  return PACKAGE_TYPE_I18N[type as keyof typeof PACKAGE_TYPE_I18N] || '未知类型'
}

function handleClick() {
  emit('click', props.pkg)
}

// #endregion
</script>

<template>
  <view
    v-if="pkg"
    flex="~ col"
    gap="2"
    p="3"
    bg="gray-50"
    rounded="lg"
    @click="handleClick"
  >
    <!-- 套餐头部信息 -->
    <view flex="~ justify-between items-center">
      <view flex="~ row items-center" gap="2">
        <text text="sm gray-800" font="medium">
          {{ getPackageTypeText(pkg.packageType) }}
        </text>
        <view
          v-if="isActive"
          text="xs white"
          bg="blue-500"
          px="1.5"
          py="0.5"
          rounded="sm"
        >
          使用中
        </view>
      </view>
      <text text="base red-500" font="bold">
        {{ formatPrice(pkg.purchasePrice) }}
      </text>
    </view>

    <!-- 套餐说明 -->
    <view v-if="pkg.templateDescription" text="xs gray-500" line="clamp-2">
      {{ pkg.templateDescription }}
    </view>

    <!-- 底部信息 -->
    <view flex="~ items-center justify-between" text="xs gray-400">
      <text>有效期：{{ pkg.totalMonths }}个月</text>
      <!-- 固定套餐时间 -->
      <text v-if="pkg.packageType === 'FIXED'">
        {{ pkg.startTime }} 至 {{ pkg.endTime }}
      </text>
    </view>
  </view>
</template>
