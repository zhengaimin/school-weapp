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
import type { TRefundStatus } from '@/constant/modules/refund'
import dayjs from 'dayjs'
import { computed, ref, unref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRefundApplicationDetailApi, postCancelRefundApplicationApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import DetailBlock from '@/components/common/detail-block/index.vue'
import Page from '@/components/common/page/index.vue'
import { REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules/refund'
import { usePage } from '@/hooks/usePage'
import { currRoute, getPrevPageExposed } from '@/utils'
import { useRefundEmitter } from '@/utils/emit/refund'
import { toast } from '@/utils/toast'

// #region 组件选项
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const message = useMessage()
const { emitRefundSuccess } = useRefundEmitter()
// #endregion

// #region 数据
const resultInfo = ref<Refund.Application.ResGetDetailApi | null>(null)
const cancelLoading = ref(false)
// #endregion

// #region 计算属性
const statusColor = computed(() => {
  const { status } = unref(resultInfo) || {}
  return REFUND_STATUS_CONFIGS[status] ? REFUND_STATUS_CONFIGS[status]?.iconColor : ''
})

const contentHeight = computed(() => {
  const { status } = unref(resultInfo) || {}

  return getContentHeight(status === REFUND_STATUS.PENDING ? '164rpx' : '0')
})

const formattedApplyTime = computed(() => {
  const { applyTime } = unref(resultInfo) || {}

  if (!applyTime) {
    return ''
  }
  return dayjs(applyTime).format('YYYY-MM-DD HH:mm:ss')
})

const statusBgColors = computed(() => {
  const status = resultInfo.value?.status
  const colors: Record<TRefundStatus, string[]> = {
    [REFUND_STATUS.PENDING]: ['bg-yellow-200', 'bg-blue-100', 'bg-gray-200'],
    [REFUND_STATUS.APPROVED]: ['bg-blue-200', 'bg-cyan-100', 'bg-yellow-100'],
    [REFUND_STATUS.PROCESSING]: ['bg-amber-200', 'bg-sky-100', 'bg-gray-200'],
    [REFUND_STATUS.COMPLETED]: ['bg-green-200', 'bg-cyan-200', 'bg-blue-100'],
    [REFUND_STATUS.PARTIAL]: ['bg-yellow-200', 'bg-orange-100', 'bg-gray-200'],
    [REFUND_STATUS.REJECTED]: ['bg-red-200', 'bg-orange-200', 'bg-gray-300'],
    [REFUND_STATUS.CANCELLED]: ['bg-gray-200', 'bg-gray-100', 'bg-gray-300'],
  }
  if (status === undefined) {
    return colors[REFUND_STATUS.PENDING]
  }
  return colors[status as TRefundStatus]
})

const filteredRefundDetails = computed(() => {
  return resultInfo.value?.refundDetails?.filter(detail => !!detail.thirdPartyRefundId) || []
})

const refundItems = computed(() => {
  if (!resultInfo.value) {
    return []
  }
  const { statusText, applyAmount, applyReason, refundNo, adminRemark, status }
    = unref(resultInfo) || {}
  const items = [
    { key: 'status', label: '退款状态', value: statusText },
    { key: 'amount', label: '退款金额', value: `¥${Number.parseFloat(applyAmount).toFixed(2)}` },
    { key: 'reason', label: '申请原因', value: applyReason },
  ]
  if (status === REFUND_STATUS.REJECTED && adminRemark) {
    items.push({ key: 'adminRemark', label: '驳回原因', value: adminRemark })
  }
  items.push(
    { key: 'applyTime', label: '申请时间', value: formattedApplyTime.value },
    { key: 'refundNo', label: '退款单号', value: refundNo },
  )
  return items
})
// #endregion

// #region 接口请求
async function axiosGetRefundDetailApi(id: number) {
  try {
    const result = await getRefundApplicationDetailApi(id)
    if (result.code === 0 && result.data) {
      resultInfo.value = { ...result.data }
    }

    return result
  }
  catch (error) {
    console.error('获取退款详情失败:', error)
    throw error
  }
}
// #endregion

// #region 事件处理
async function handleCancel() {
  if (!resultInfo.value)
    return
  try {
    await message.confirm({
      msg: '确定要取消退款申请吗？',
    })
    cancelLoading.value = true
    await postCancelRefundApplicationApi(resultInfo.value.id)
    toast.show('取消成功')

    // 发送退款事件
    emitRefundSuccess({
      id: resultInfo.value.id.toString(),
      status: 'cancelled',
      amount: Number.parseFloat(resultInfo.value.applyAmount),
    })

    // 更新当前页面的状态并返回
    resultInfo.value.status = REFUND_STATUS.CANCELLED
    resultInfo.value.statusText = '用户取消'
  }
  catch (error) {
    // 用户取消或者接口报错
  }
  finally {
    cancelLoading.value = false
  }
}
// #endregion

// #region 生命周期
async function onLoginSuccess() {
  const { query } = currRoute()
  if (query.id) {
    batchRequestHandler([axiosGetRefundDetailApi(+query.id)])
  }
}
// #endregion
</script>

<template>
  <Page
    title="退款详情"
    :loading="pageLoading"
    :error="pageError"
    :show-bg="!pageLoading"
    :bg-colors="statusBgColors"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view v-if="resultInfo" scroll-y :style="contentHeight">
      <view p="x-4 t-2 b-4" relative z-1>
        <!-- 提示区域 -->
        <view text="center" p="y-8">
          <view text="xl gray-900" font="medium" m="b-2">
            {{ resultInfo?.statusText }}
          </view>
          <view text="base gray-900" m="t-2">
            ¥{{ Number.parseFloat(resultInfo?.applyAmount).toFixed(2) }}
          </view>
        </view>

        <!-- 退款详情 -->
        <DetailBlock :items="refundItems" custom-class="mb-4">
          <template #status>
            <text text="sm" :style="{ color: statusColor }">
              {{ resultInfo?.statusText }}
            </text>
          </template>
        </DetailBlock>

        <!-- 第三方退款详情 -->
        <template v-if="filteredRefundDetails.length > 0">
          <view v-for="(detail, index) in filteredRefundDetails" :key="index" m="b-4">
            <DetailBlock
              :title="`退款渠道 ${index + 1}`"
              :items="[
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
                  key: 'refundStatusText',
                  label: '退款状态',
                  value: detail.refundStatusText,
                },
              ]"
            />
          </view>
        </template>
      </view>
    </scroll-view>

    <!-- 取消申请按钮 -->
    <view v-if="resultInfo?.status === REFUND_STATUS.PENDING" p="4">
      <TButton type="danger" full size="large" :loading="cancelLoading" @click="handleCancel">
        取消申请
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
