<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package.ts'
import WhiteCard from '@/components/common/white-card/index.vue'
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
  <WhiteCard @click="handleClick">
    <view flex="~ col" gap="3">
      <!-- 套餐头部信息 -->
      <view flex="~ justify-between items-start">
        <view flex="~ col" gap="1">
          <view text="base gray-900" font="medium">
            {{ getPackageTypeText(pkg.packageType) }}
          </view>
        </view>
        <view text="right lg gray-900" font="bold">
          {{ formatPrice(pkg.purchasePrice) }}
        </view>
      </view>

      <!-- 套餐说明 | 使用规则 -->
      <view
        v-if="pkg.templateDescription || pkg.usageRules"
        flex="~ col"
        gap="2"
        p="3"
        bg="gray-50"
        border="rounded-lg"
      >
        <!-- 套餐说明 -->
        <view v-if="pkg.templateDescription" text="sm gray-600" line="clamp-2">
          {{ pkg.templateDescription }}
        </view>
        <!-- 使用规则 -->
        <view v-if="pkg.usageRules" text="sm gray-600" line="clamp-2">
          {{ pkg.usageRules }}
        </view>
      </view>

      <!-- 固定套餐时间信息 -->
      <view v-if="pkg.packageType === 'FIXED'" p="2" bg="blue-50" border="rounded">
        <view text="xs blue-700">
          固定套餐时间：{{ pkg.startTime }} 至 {{ pkg.endTime }}
        </view>
        <view v-if="pkg.monthlyDecrease" text="xs blue-600" m="t-1">
          按月递减使用
        </view>
      </view>

      <!-- 底部信息 -->
      <view flex="~ items-center justify-between" text="xs gray-500">
        <!-- 使用中 + 套餐类型 -->
        <view flex="~ row items-center">
          <text v-if="isActive" text="xs blue-700">
            使用中
          </text>
        </view>
        <!-- 有效期 -->
        <text>有效期：{{ pkg.totalMonths }}个月</text>
      </view>
    </view>
  </WhiteCard>
</template>
