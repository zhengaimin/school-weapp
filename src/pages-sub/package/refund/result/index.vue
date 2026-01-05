<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "退款详情"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import type { TRefundStatus } from '@/constant/modules'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getPackageRefundDetailApi, postCancelPackageRefundApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { DEVICE_TYPE, PACKAGE_TYPE_I18N, REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules'
import { PACKAGE_REFUND_HISTORY_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginFail, batchRequestHandler } = usePage()
const { emitPackageRefund } = usePackageEmitter()

const detail = ref<Pkg.Refund.ResGetDetailApi | null>(null)

const isVideoDevice = computed(() => detail.value?.deviceType === DEVICE_TYPE.VIDEO)

const statusConfig = computed(() => {
  if (!detail.value)
    return null
  return REFUND_STATUS_CONFIGS[detail.value.status as TRefundStatus]
})

const canCancel = computed(() => {
  return detail.value?.status === REFUND_STATUS.PENDING
})

const actualAmount = computed(() => {
  if (!detail.value)
    return '0.00'
  return detail.value.actualAmount || detail.value.applyAmount
})

function formatDate(date: string | null) {
  if (!date)
    return '-'
  return dayjs(date).format('YYYY-MM-DD')
}
function formatDateTime(date: string | null) {
  if (!date)
    return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

function handleBackToList() {
  uni.navigateBack({
    fail: () => {
      uni.redirectTo({ url: PACKAGE_REFUND_HISTORY_PATH })
    },
  })
}
async function handleCancelRefund() {
  if (!detail.value)
    return

  try {
    await uni.showModal({
      title: '提示',
      content: '确认取消退款申请吗？',
    })

    uni.showLoading({ title: '取消中...', mask: true })
    const result = await postCancelPackageRefundApi(detail.value.id)

    if (result.code === 0) {
      toast.show('取消成功')
      emitPackageRefund()
      handleBackToList()
    }
  }
  catch (error: any) {
    if (error?.errMsg !== 'showModal:fail cancel') {
      console.error('取消退款申请失败:', error)
      toast.show('取消失败，请重试')
    }
  }
  finally {
    uni.hideLoading()
  }
}

/** 获取退款详情 */
async function axiosGetPackageRefundDetailApi(id: number) {
  try {
    const result = await getPackageRefundDetailApi(id)
    if (result.code === 0) {
      detail.value = result.data
    }
    return result
  }
  catch (error) {
    console.error('获取退款详情失败:', error)
    throw error
  }
}

function onLoginSuccess() {
  const { query } = currRoute()
  const id = query?.id

  if (!id) {
    toast.show('参数错误')
    handleBackToList()
    return
  }

  batchRequestHandler([axiosGetPackageRefundDetailApi(Number(id))])
}
</script>

<template>
  <Page
    title="退款详情"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="x-4 t-2 b-4" relative z-1>
      <!-- 状态图标和标题 -->
      <view v-if="statusConfig" flex="~ row items-center justify-center" gap="3" p="t-7 b-6">
        <Icon :name="statusConfig.icon" :icon-color="statusConfig.iconColor" icon-size="64rpx" />
        <view text="xl gray-900" font="medium">
          {{ detail?.statusText }}
        </view>
      </view>

      <!-- 退款金额 -->
      <WhiteCard v-if="detail" m="b-3">
        <view flex="~ col items-center" p="y-2">
          <text text="sm gray-500" m="b-1">
            {{ detail.status === REFUND_STATUS.APPROVED ? '实际退款金额' : '申请退款金额' }}
          </text>
          <text text="2xl primary" font="bold">
            ¥{{ Number(actualAmount).toFixed(2) }}
          </text>
        </view>
      </WhiteCard>

      <!-- 详情卡片 -->
      <WhiteCard v-if="detail">
        <view flex="~ col" gap="3">
          <!-- 退款信息 -->
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              退款单号
            </text>
            <text text="sm gray-900">
              {{ detail.refundNo }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              申请时间
            </text>
            <text text="sm gray-900">
              {{ formatDateTime(detail.applyTime) }}
            </text>
          </view>
          <view v-if="detail.auditTime" flex="~ row justify-between items-center">
            <text text="sm gray-500">
              审核时间
            </text>
            <text text="sm gray-900">
              {{ formatDateTime(detail.auditTime) }}
            </text>
          </view>
          <view v-if="detail.completeTime" flex="~ row justify-between items-center">
            <text text="sm gray-500">
              完成时间
            </text>
            <text text="sm gray-900">
              {{ formatDateTime(detail.completeTime) }}
            </text>
          </view>
          <view flex="~ row justify-between items-start">
            <text text="sm gray-500" flex-shrink-0>
              申请原因
            </text>
            <text text="sm gray-900" text-right max-w="60%">
              {{ detail.applyReason }}
            </text>
          </view>
          <view v-if="detail.adminRemark" flex="~ row justify-between items-start">
            <text text="sm gray-500" flex-shrink-0>
              管理员备注
            </text>
            <text text="sm gray-900" text-right max-w="60%">
              {{ detail.adminRemark }}
            </text>
          </view>

          <!-- 分隔线 -->
          <view h="1px" bg="gray-100" m="y-1" />

          <!-- 学生信息 -->
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              学生姓名
            </text>
            <text text="sm gray-900">
              {{ detail.studentName }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              学号
            </text>
            <text text="sm gray-900">
              {{ detail.studentCode }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              学校
            </text>
            <text text="sm gray-900">
              {{ detail.schoolName }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              班级
            </text>
            <text text="sm gray-900">
              {{ detail.className }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              申请人
            </text>
            <text text="sm gray-900">
              {{ detail.applicantUserName }}
            </text>
          </view>

          <!-- 分隔线 -->
          <view h="1px" bg="gray-100" m="y-1" />

          <!-- 套餐信息 -->
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              套餐名称
            </text>
            <text text="sm gray-900">
              {{ detail.packageName }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              套餐类型
            </text>
            <text text="sm gray-900">
              {{ PACKAGE_TYPE_I18N[detail.packageType] }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              购买价格
            </text>
            <text text="sm gray-900">
              ¥{{ detail.purchasePrice }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              购买日期
            </text>
            <text text="sm gray-900">
              {{ formatDate(detail.purchaseDate) }}
            </text>
          </view>
          <view flex="~ row justify-between items-center">
            <text text="sm gray-500">
              有效期
            </text>
            <text text="sm gray-900">
              {{ formatDate(detail.startDate) }} ~ {{ formatDate(detail.endDate) }}
            </text>
          </view>

          <!-- 套餐内容 - 话机 -->
          <template v-if="isVideoDevice">
            <view v-if="detail.packageContent.videoCallMinutes" flex="~ row justify-between items-center">
              <text text="sm gray-500">
                通话分钟
              </text>
              <text text="sm gray-900">
                {{ detail.packageContent.videoCallMinutes === -1 ? '不限' : `${detail.packageContent.videoCallMinutes}分钟` }}
              </text>
            </view>
            <view v-if="detail.packageContent.messageCount" flex="~ row justify-between items-center">
              <text text="sm gray-500">
                留言条数
              </text>
              <text text="sm gray-900">
                {{ detail.packageContent.messageCount === -1 ? '不限' : `${detail.packageContent.messageCount}条` }}
              </text>
            </view>
          </template>
          <!-- 套餐内容 - 吹风机 -->
          <template v-else>
            <view v-if="detail.packageContent.dryerMinutes" flex="~ row justify-between items-center">
              <text text="sm gray-500">
                吹风时长
              </text>
              <text text="sm gray-900">
                {{ detail.packageContent.dryerMinutes === -1 ? '不限' : `${detail.packageContent.dryerMinutes}分钟` }}
              </text>
            </view>
          </template>

          <!-- 套餐说明 -->
          <view v-if="detail.templateDescription" flex="~ row justify-between items-start">
            <text text="sm gray-500" flex-shrink-0>
              套餐说明
            </text>
            <text text="sm gray-900" text-right max-w="60%">
              {{ detail.templateDescription }}
            </text>
          </view>
        </view>
      </WhiteCard>
    </view>

    <!-- 底部按钮 -->
    <view p="4" flex="~ col" gap="3">
      <TButton v-if="canCancel" type="danger" size="large" full @click="handleCancelRefund">
        取消申请
      </TButton>
      <TButton type="default" size="large" full @click="handleBackToList">
        返回
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
