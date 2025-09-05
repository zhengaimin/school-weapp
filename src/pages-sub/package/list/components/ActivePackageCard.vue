<script lang="ts" setup>
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import dayjs from 'dayjs'
import { computed } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { PACKAGE_TYPE, PACKAGE_TYPE_I18N } from '@/constant/modules/package/common'
import { useParentStore } from '@/store/parent'
// #endregion

// #region 属性定义
const props = defineProps<{
  activePackage: Pkg.Query.IStudentActivePackageVo
}>()

const emit = defineEmits<{
  click: [pkg: Pkg.Query.IStudentActivePackageVo]
}>()
// #endregion

// #region 使用 Store
const parentStore = useParentStore()
// #endregion

// #region 定义计算属性
// 获取套餐总时长文本
const getTotalMinutesText = computed(() => {
  const { videoCallMinutes, packageType } = props.activePackage.snapshotInfo

  if (videoCallMinutes === -1) {
    return '无限制'
  }

  if (packageType === PACKAGE_TYPE.GENERAL) {
    // 通用套餐显示为当月总时长
    return `${videoCallMinutes}分钟`
  }
  else {
    // 固定套餐显示为套餐总时长
    return `${videoCallMinutes}分钟`
  }
})

// 获取剩余时长
const getRemainingMinutes = computed(() => {
  const balanceInfo = parentStore.balanceInfo
  if (!balanceInfo)
    return 0

  const packageMinutes = balanceInfo.packageMinutes || 0
  const packageMinutesUsed = balanceInfo.packageMinutesUsed || 0

  return Math.max(0, packageMinutes - packageMinutesUsed)
})

// 获取剩余时长文本
const getRemainingMinutesText = computed(() => {
  const remainingMinutes = getRemainingMinutes.value
  return `${remainingMinutes}分钟`
})
// #endregion

// #region 方法
function handleClick() {
  emit('click', props.activePackage)
}
// #endregion
</script>

<template>
  <WhiteCard @click="handleClick">
    <view flex="~ col" gap="3">
      <!-- 套餐名称 -->
      <view flex="~ justify-between items-center">
        <view text="base gray-900" font="medium">
          {{ PACKAGE_TYPE_I18N[activePackage.snapshotInfo.packageType] }}
        </view>
        <view bg="blue-50" text="xs blue-700" px="2" py="1" border="rounded">
          使用中
        </view>
      </view>

      <!-- 套餐内容：上面显示值，下面显示说明文字；不展示 icon -->
      <view flex="~ row justify-around" gap="2" p="3" bg="gray-50" border="rounded-lg">
        <!-- 视频通话总时长 -->
        <view flex="~ col" gap="1" items-center>
          <view text="lg gray-900" font="bold">
            {{ getTotalMinutesText }}
          </view>
          <view text="sm gray-600">
            {{ activePackage.snapshotInfo.packageType === PACKAGE_TYPE.GENERAL ? '当月总时长' : '套餐总时长' }}
          </view>
        </view>

        <!-- 剩余时长 -->
        <view flex="~ col" gap="1" items-center>
          <view text="lg gray-900" font="bold">
            {{ getRemainingMinutesText }}
          </view>
          <view text="sm gray-600">
            剩余时长
          </view>
        </view>

        <!-- 留言条数 -->
        <view flex="~ col" gap="1" items-center>
          <view text="lg gray-900" font="bold">
            {{ activePackage.snapshotInfo.messageCount === -1 ? '无限制' : `${activePackage.snapshotInfo.messageCount}条` }}
          </view>
          <view text="sm gray-600">
            剩余留言数
          </view>
        </view>
      </view>

      <!-- 套餐类型 & 过期时间 -->
      <view flex="~ items-center justify-end" text="xs gray-500">
        <view>过期时间：{{ dayjs(activePackage.endDate).format('YYYY-MM-DD') }}</view>
      </view>
    </view>
  </WhiteCard>
</template>
