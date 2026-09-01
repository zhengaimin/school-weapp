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
import type { ResultCard, ResultItem } from '@/components/common/result-view/index.vue'
import type { TRefundStatus } from '@/constant/modules'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getPackageRefundDetailApi, postCancelPackageRefundApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import ResultView from '@/components/common/result-view/index.vue'
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

const { pageLoading, pageError, onLoginFail, batchRequestHandler, getContentHeight } = usePage()
const { emitPackageRefund } = usePackageEmitter()

const detail = ref<Pkg.Refund.ResGetDetailApi | null>(null)

const isVideoDevice = computed(() => detail.value?.deviceType === DEVICE_TYPE.VIDEO)

const statusConfig = computed(() => {
  if (!detail.value) return null
  return REFUND_STATUS_CONFIGS[detail.value.status as TRefundStatus]
})

const canCancel = computed(() => {
  return detail.value?.status === REFUND_STATUS.PENDING
})
/** 计算内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight(canCancel.value ? '164rpx' : '0')
})

const actualAmount = computed(() => {
  if (!detail.value) return '0.00'
  return detail.value.actualAmount || detail.value.applyAmount
})

const refundCards = computed<ResultCard[]>(() => {
  if (!detail.value) return []

  const items: ResultItem[] = [
    {
      key: 'refundNo',
      label: '退款单号',
      value: detail.value.refundNo,
    },
    {
      key: 'applyTime',
      label: '申请时间',
      value: formatDateTime(detail.value.applyTime),
    },
  ]

  if (detail.value.auditTime) {
    items.push({
      key: 'auditTime',
      label: '审核时间',
      value: formatDateTime(detail.value.auditTime),
    })
  }

  if (detail.value.completeTime) {
    items.push({
      key: 'completeTime',
      label: '完成时间',
      value: formatDateTime(detail.value.completeTime),
    })
  }

  items.push(
    {
      key: 'applyReason',
      label: '申请原因',
      value: detail.value.applyReason,
    },
  )

  if (detail.value.adminRemark) {
    items.push({
      key: 'adminRemark',
      label: '管理员备注',
      value: detail.value.adminRemark,
    })
  }

  items.push(
    { key: 'divider-1', type: 'divider' },
    {
      key: 'studentName',
      label: '学生姓名',
      value: detail.value.studentName,
    },
    {
      key: 'studentCode',
      label: '学号',
      value: detail.value.studentCode,
    },
    {
      key: 'schoolName',
      label: '学校',
      value: detail.value.schoolName,
    },
    {
      key: 'className',
      label: '班级',
      value: detail.value.className,
    },
    {
      key: 'applicantUserName',
      label: '申请人',
      value: detail.value.applicantUserName,
    },
    { key: 'divider-2', type: 'divider' },
    {
      key: 'packageName',
      label: '套餐名称',
      value: detail.value.packageName,
    },
    {
      key: 'packageType',
      label: '套餐类型',
      value: PACKAGE_TYPE_I18N[detail.value.packageType],
    },
    {
      key: 'purchasePrice',
      label: '购买价格',
      value: `¥${detail.value.purchasePrice}`,
    },
    {
      key: 'purchaseDate',
      label: '购买日期',
      value: formatDate(detail.value.purchaseDate),
    },
    {
      key: 'validDate',
      label: '有效期',
      value: `${formatDate(detail.value.startDate)} ~ ${formatDate(detail.value.endDate)}`,
    },
  )

  if (isVideoDevice.value) {
    if (detail.value.packageContent?.videoCallMinutes) {
      items.push({
        key: 'videoCallMinutes',
        label: '通话分钟',
        value: detail.value.packageContent.videoCallMinutes === -1
          ? '不限'
          : `${detail.value.packageContent.videoCallMinutes}分钟`,
      })
    }
    if (detail.value.packageContent?.messageCount) {
      items.push({
        key: 'messageCount',
        label: '留言条数',
        value: detail.value.packageContent.messageCount === -1
          ? '不限'
          : `${detail.value.packageContent.messageCount}条`,
      })
    }
  } else if (detail.value.packageContent?.dryerMinutes) {
    items.push({
      key: 'dryerMinutes',
      label: '吹风时长',
      value: detail.value.packageContent.dryerMinutes === -1
        ? '不限'
        : `${detail.value.packageContent.dryerMinutes}分钟`,
    })
  }

  if (detail.value.templateDescription) {
    items.push({
      key: 'templateDescription',
      label: '套餐说明',
      value: detail.value.templateDescription,
    })
  }

  return [
    {
      key: 'amount',
      customClass: 'mb-3',
    },
    {
      key: 'detail',
      items,
    },
  ]
})

function formatDate(date: string | null) {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}
function formatDateTime(date: string | null) {
  if (!date) return '-'
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
  if (!detail.value) return

  try {
    await uni.showModal({
      title: '提示',
      content: '确认取消退款申请吗？',
    })

    uni.showLoading({ title: '取消中...', mask: true })
    const result = await postCancelPackageRefundApi(detail.value.id, detail.value.packageKind)

    if (result.code === 0) {
      toast.show('取消成功')
      emitPackageRefund(detail.value.id)
      handleBackToList()
    }
  } catch (error: any) {
    if (error?.errMsg !== 'showModal:fail cancel') {
      console.error('取消退款申请失败:', error)
      toast.show('取消失败，请重试')
    }
  } finally {
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
  } catch (error) {
    console.error('获取退款详情失败:', error)
    throw error
  }
}

function onLoginSuccess() {
  const { query } = currRoute() as { path: string, query: { id?: string } }
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
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" :style="contentHeight">
      <view p="x-4 t-2 b-4" relative z-1>
        <ResultView
          v-if="detail && statusConfig"
          :icon-name="statusConfig.icon"
          :icon-color="statusConfig.iconColor"
          :status-text="detail.statusText"
          :cards="refundCards"
        >
          <template #card-amount>
            <view class="flex flex-col items-center py-2">
              <text class="mb-1 text-sm text-gray-500">
                {{ detail.status === REFUND_STATUS.APPROVED ? '实际退款金额' : '申请退款金额' }}
              </text>
              <text class="text-2xl text-primary font-bold">
                ¥{{ Number(actualAmount).toFixed(2) }}
              </text>
            </view>
          </template>
        </ResultView>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view v-if="canCancel" p="x-4 y-3" border="t gray-100">
      <TButton type="danger" size="large" full @click="handleCancelRefund">
        取消申请
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
