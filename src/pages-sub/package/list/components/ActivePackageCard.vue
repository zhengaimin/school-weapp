<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import WhiteCard from '@/components/common/white-card/index.vue'
import { PACKAGE_TYPE_I18N } from '@/constant/modules'
import { PACKAGE_DETAIL_PATH } from '@/constant/router'
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

// #region 方法
function handleClick() {
  const { packageId } = props.activePackage

  uni.navigateTo({
    url: `${PACKAGE_DETAIL_PATH}?id=${packageId}`,
  })
}
// #endregion
</script>

<template>
  <WhiteCard v-if="activePackage" @click="handleClick">
    <view flex="~ col" gap="3">
      <!-- 套餐类型 -->
      <view flex="~ justify-between items-center">
        <view text="base gray-900" font="medium">
          {{ PACKAGE_TYPE_I18N[activePackage?.snapshotInfo.packageType] }}
        </view>
        <view bg="blue-50" text="xs blue-700" px="2" py="1" border="rounded">
          使用中
        </view>
      </view>

      <!-- 套餐内容：上面显示值，下面显示说明文字；不展示 icon -->
      <view flex="~ row justify-around" gap="2" p="3" bg="gray-50" border="rounded-lg">
        <!-- 剩余时长 -->
        <!-- 剩余时长 -->
        <view v-if="hasPackageMinutesModules" flex="~ col" gap="1" items-center>
          <view text="lg gray-900" font="bold">
            {{ balanceInfo.packageMinutes }}(分钟)
          </view>
          <view text="sm gray-600">
            剩余时长
          </view>
        </view>

        <!-- 留言条数 -->
        <view flex="~ col" gap="1" items-center>
          <view text="lg gray-900" font="bold">
            {{
              activePackage.snapshotInfo.messageCount === -1
                ? '无限制'
                : `${activePackage.snapshotInfo.messageCount}条`
            }}
          </view>
          <view text="sm gray-600">
            剩余留言数
          </view>
        </view>
      </view>

      <!-- 套餐类型 & 过期时间 -->
      <view flex="~ items-center justify-between" text="xs gray-500">
        <view>生效日期：{{ dayjs(activePackage.startDate).format('YYYY-MM-DD') }}</view>
        <view>过期时间：{{ dayjs(activePackage.endDate).format('YYYY-MM-DD') }}</view>
      </view>
    </view>
  </WhiteCard>
</template>
