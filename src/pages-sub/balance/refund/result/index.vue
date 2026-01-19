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
import dayjs from 'dayjs'
import { computed, ref, unref } from 'vue'
import { useMessage } from 'wot-design-uni'
import { getRefundApplicationDetailApi, postCancelRefundApplicationApi } from '@/api/modules/refund'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { REFUND_STATUS, REFUND_STATUS_CONFIGS } from '@/constant/modules'
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

/** 获取退款详情 */
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
  }
  catch {
    // 用户取消或接口报错
  }
  finally {
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
        <!-- 结果图标和状态 -->
        <view v-if="resultInfo" flex="~ row items-center justify-center" gap="3" p="t-4 b-6">
          <Icon
            :name="statusConfig.icon"
            :icon-color="statusConfig.iconColor"
            icon-size="64rpx"
          />
          <view text="xl gray-900" font="medium">
            {{ resultInfo.statusText }}
          </view>
        </view>

        <!-- 详情卡片 -->
        <WhiteCard v-if="resultInfo">
          <view flex="~ col" gap="3">
            <!-- 退款状态 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                退款状态
              </text>
              <text text="sm" :style="{ color: statusConfig.iconColor }">
                {{ resultInfo.statusText }}
              </text>
            </view>
            <!-- 退款金额 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                退款金额
              </text>
              <text text="base primary" font="medium">
                ¥{{ Number.parseFloat(resultInfo.applyAmount).toFixed(2) }}
              </text>
            </view>
            <!-- 申请原因 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                申请原因
              </text>
              <text text="sm gray-900">
                {{ resultInfo.applyReason || '-' }}
              </text>
            </view>
            <!-- 驳回原因 -->
            <view v-if="resultInfo.status === REFUND_STATUS.REJECTED && resultInfo.adminRemark" flex="~ row justify-between items-center">
              <text text="sm gray-500">
                驳回原因
              </text>
              <text text="sm gray-900">
                {{ resultInfo.adminRemark }}
              </text>
            </view>
            <!-- 申请时间 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                申请时间
              </text>
              <text text="sm gray-900">
                {{ formattedApplyTime || '-' }}
              </text>
            </view>
            <!-- 退款单号 -->
            <view flex="~ row justify-between items-center">
              <text text="sm gray-500">
                退款单号
              </text>
              <text text="sm gray-900">
                {{ resultInfo.refundNo || '-' }}
              </text>
            </view>
          </view>
        </WhiteCard>

        <!-- 第三方退款详情 -->
        <template v-if="filteredRefundDetails.length > 0">
          <view v-for="(detail, index) in filteredRefundDetails" :key="index" m="t-4">
            <WhiteCard>
              <view flex="~ col" gap="3">
                <view text="sm gray-900" font="medium">
                  退款渠道 {{ index + 1 }}
                </view>
                <view h="1px" bg="gray-100" />
                <view flex="~ row justify-between items-center">
                  <text text="sm gray-500">
                    第三方退款ID
                  </text>
                  <text text="sm gray-900">
                    {{ detail.thirdPartyRefundId }}
                  </text>
                </view>
                <view flex="~ row justify-between items-center">
                  <text text="sm gray-500">
                    原始金额
                  </text>
                  <text text="sm gray-900">
                    ¥{{ Number.parseFloat(detail.originalAmount).toFixed(2) }}
                  </text>
                </view>
                <view flex="~ row justify-between items-center">
                  <text text="sm gray-500">
                    退款状态
                  </text>
                  <text text="sm gray-900">
                    {{ detail.refundStatusText }}
                  </text>
                </view>
              </view>
            </WhiteCard>
          </view>
        </template>
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
