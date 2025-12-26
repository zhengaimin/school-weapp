<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import WhiteCard from '@/components/common/white-card/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { PACKAGE_TYPE_I18N } from '@/constant/modules'
import { useSchoolModules } from '@/hooks/useSchoolModules'
import { useParentStore } from '@/store/parent'
// #endregion

// #region 属性定义
const props = defineProps<{
  activePackage: Pkg.Query.IStudentActivePackageVo
}>()
// #endregion

// #region 使用 Store
const parentStore = useParentStore()
const { balanceInfo } = storeToRefs(parentStore)
const { hasPackageMinutesModules } = useSchoolModules()
// #endregion

// #region 响应式数据
const showPopup = ref(false)
// #endregion

// #region 方法
function handleClick() {
  showPopup.value = true
}
// #endregion
</script>

<template>
  <WhiteCard v-if="activePackage" custom-class="!p-0" @click="handleClick">
    <view flex="~ row items-center justify-between" p="3" gap="3">
      <!-- 左侧：套餐信息 -->
      <view flex="~ col" gap="1" flex-1>
        <view flex="~ row items-center" gap="2">
          <text text="sm gray-800" font="medium">
            {{ PACKAGE_TYPE_I18N[activePackage?.snapshotInfo.packageType] }}
          </text>
          <wd-tag type="primary" size="small">使用中</wd-tag>
        </view>
        <view text="xs gray-400">
          到期：{{ dayjs(activePackage.endDate).format('YYYY-MM-DD') }}
        </view>
      </view>

      <!-- 右侧：剩余额度 -->
      <view flex="~ row" gap="4" text="center">
        <view v-if="hasPackageMinutesModules" flex="~ col" gap="0.5">
          <text text="base blue-600" font="bold">{{ balanceInfo.packageMinutes }}</text>
          <text text="xs gray-400">分钟</text>
        </view>
        <view flex="~ col" gap="0.5">
          <text text="base blue-600" font="bold">
            {{ activePackage.snapshotInfo.messageCount === -1 ? '∞' : activePackage.snapshotInfo.messageCount }}
          </text>
          <text text="xs gray-400">留言</text>
        </view>
      </view>

      <!-- 箭头 -->
      <wd-icon name="arrow-right" size="16px" color="#9ca3af" />
    </view>
  </WhiteCard>

  <!-- 套餐详情弹窗 -->
  <BottomPopup
    v-model="showPopup"
    title="套餐详情"
    max-height="50vh"
  >
    <view p="4" flex="~ col" gap="4">
      <!-- 套餐状态 -->
      <view flex="~ row items-center justify-between">
        <text text="base gray-800" font="medium">
          {{ PACKAGE_TYPE_I18N[activePackage?.snapshotInfo.packageType] }}
        </text>
        <wd-tag type="primary">{{ activePackage.statusText }}</wd-tag>
      </view>

      <!-- 套餐额度 -->
      <view flex="~ row" gap="4" p="4" bg="gray-50" rounded="lg">
        <view v-if="hasPackageMinutesModules" flex="~ col items-center" flex-1 gap="1">
          <text text="2xl blue-600" font="bold">{{ balanceInfo.packageMinutes }}</text>
          <text text="xs gray-500">剩余分钟</text>
        </view>
        <view flex="~ col items-center" flex-1 gap="1">
          <text text="2xl blue-600" font="bold">
            {{ activePackage.snapshotInfo.messageCount === -1 ? '∞' : activePackage.snapshotInfo.messageCount }}
          </text>
          <text text="xs gray-500">剩余留言</text>
        </view>
      </view>

      <!-- 套餐信息列表 -->
      <view flex="~ col" gap="3">
        <view flex="~ row justify-between" text="sm">
          <text text="gray-500">套餐名称</text>
          <text text="gray-800">{{ activePackage.snapshotInfo.packageName }}</text>
        </view>
        <view flex="~ row justify-between" text="sm">
          <text text="gray-500">生效日期</text>
          <text text="gray-800">{{ dayjs(activePackage.startDate).format('YYYY-MM-DD') }}</text>
        </view>
        <view flex="~ row justify-between" text="sm">
          <text text="gray-500">到期日期</text>
          <text text="gray-800">{{ dayjs(activePackage.endDate).format('YYYY-MM-DD') }}</text>
        </view>
        <view flex="~ row justify-between" text="sm">
          <text text="gray-500">套餐时长</text>
          <text text="gray-800">{{ activePackage.snapshotInfo.totalMonths }}个月</text>
        </view>
        <view v-if="activePackage.purchaserInfo" flex="~ row justify-between" text="sm">
          <text text="gray-500">购买人</text>
          <text text="gray-800">{{ activePackage.purchaserInfo.userName }}</text>
        </view>
      </view>
    </view>
  </BottomPopup>
</template>
