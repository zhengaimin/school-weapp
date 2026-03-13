<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "退款结果"
  }
}
</route>

<script lang="ts" setup>
import type { Refund } from '@/api/interface/modules/refund'
import type { ResultCard, ResultItem } from '@/components/common/result-view/index.vue'
import dayjs from 'dayjs'
import { computed, ref, unref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRefundApplicationDetailApi, postCancelRefundApplicationApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import ResultView from '@/components/common/result-view/index.vue'
import { DEVICE_TYPE_I18N, REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const message = useMessage()
const { emitRefundSuccess } = useRefundEmitter()

/** 退款结果信息 */
const resultInfo = ref<Refund.Application.ResGetDetailApi | null>(null)
/** 取消加载状态 */
const cancelLoading = ref(false)

/** 获取状态配置 */
const statusConfig = computed(() => {
  const { status } = unref(resultInfo) || {}
  if (status === undefined) {
    return REFUND_STATUS_CONFIGS[REFUND_STATUS.PENDING]
  }
  return REFUND_STATUS_CONFIGS[status]
})
/** 计算内容区域高度 */
const contentHeight = computed(() => {
  const { status } = unref(resultInfo) || {}
  return getContentHeight(status === REFUND_STATUS.PENDING ? '164rpx' : '0')
})
/** 格式化申请时间 */
const formattedApplyTime = computed(() => {
  const { applyTime } = unref(resultInfo) || {}
  if (!applyTime) return ''
  return dayjs(applyTime).format('YYYY-MM-DD HH:mm:ss')
})
/** 过滤后的退款详情 */
const filteredRefundDetails = computed(() => {
  return resultInfo.value?.refundDetails?.filter(detail => !!detail.thirdPartyRefundId) || []
})

const refundCards = computed<ResultCard[]>(() => {
  if (!resultInfo.value) return []

  const items: ResultItem[] = [
    {
      key: 'status',
      label: '退款状态',
      value: resultInfo.value.statusText,
      valueStyle: statusConfig.value?.iconColor ? { color: statusConfig.value.iconColor } : undefined,
    },
    {
      key: 'amount',
      label: '退款金额',
      value: `¥${Number.parseFloat(resultInfo.value.applyAmount).toFixed(2)}`,
      valueClass: 'text-base text-primary font-medium',
    },
    {
      key: 'deviceType',
      label: '设备类型',
      value: resultInfo.value.deviceType ? DEVICE_TYPE_I18N[resultInfo.value.deviceType] : '-',
    },
    {
      key: 'reason',
      label: '申请原因',
      value: resultInfo.value.applyReason || '-',
    },
  ]

  if (resultInfo.value.status === REFUND_STATUS.REJECTED && resultInfo.value.adminRemark) {
    items.push({
      key: 'adminRemark',
      label: '驳回原因',
      value: resultInfo.value.adminRemark,
    })
  }

  items.push(
    {
      key: 'applyTime',
      label: '申请时间',
      value: formattedApplyTime.value || '-',
    },
    {
      key: 'refundNo',
      label: '退款单号',
      value: resultInfo.value.refundNo || '-',
    },
  )

  const detailCards = filteredRefundDetails.value.map((detail, index) => ({
    key: `channel-${index + 1}`,
    title: `退款渠道 ${index + 1}`,
    customClass: 'mt-4',
    items: [
      {
        key: 'thirdPartyRefundId',
        label: '第三方退款ID',
        value: detail.thirdPartyRefundId,
      },
      {
        key: 'originalAmount',
        label: '原始金额',
        value: `¥${Number.parseFloat(detail.originalAmount).toFixed(2)}`,
      },
      {
        key: 'refundStatus',
        label: '退款状态',
        value: detail.refundStatusText,
      },
    ],
  }))

  return [{ key: 'refund', items }, ...detailCards]
})

/** 获取退款详情 */
async function axiosGetRefundDetailApi(id: number) {
  try {
    const result = await getRefundApplicationDetailApi(id)
    if (result.code === 0 && result.data) {
      resultInfo.value = { ...result.data }
    }
    return result
  } catch (error) {
    console.error('获取退款详情失败:', error)
    throw error
  }
}

/** 取消退款申请 */
async function handleCancel() {
  if (!resultInfo.value) return
  try {
    await message.confirm({ msg: '确定要取消退款申请吗？' })
    cancelLoading.value = true
    await postCancelRefundApplicationApi(resultInfo.value.id)
    toast.show('取消成功')
    emitRefundSuccess({
      id: resultInfo.value.id.toString(),
      status: 'cancelled',
      amount: Number.parseFloat(resultInfo.value.applyAmount),
    })
    resultInfo.value.status = REFUND_STATUS.CANCELLED
    resultInfo.value.statusText = '用户取消'
  } catch {
    // 用户取消或接口报错
  } finally {
    cancelLoading.value = false
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  const { query } = currRoute()
  if (query.id) {
    batchRequestHandler([axiosGetRefundDetailApi(+query.id)])
  }
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
          v-if="resultInfo"
          :icon-name="statusConfig.icon"
          :icon-color="statusConfig.iconColor"
          :status-text="resultInfo.statusText"
          :cards="refundCards"
        />
      </view>
    </scroll-view>

    <!-- 取消申请按钮 -->
    <view v-if="resultInfo?.status === REFUND_STATUS.PENDING" p="x-4 y-3" border="t gray-100">
      <TButton type="warning" full size="large" :loading="cancelLoading" @click="handleCancel">
        取消申请
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
