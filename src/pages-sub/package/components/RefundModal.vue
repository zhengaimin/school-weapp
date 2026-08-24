<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'

import { ref, watch } from 'vue'
import { postApplyPackageRefundApi, postRefundPreviewApi } from '@/api/modules/package/refund'
import TButton from '@/components/common/button/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { useForm } from '@/hooks/useForm'
import { usePackageEmitter } from '@/utils/emit/package'
import { toast } from '@/utils/toast'

const props = defineProps<{
  id?: number
}>()

const emit = defineEmits<{
  success: [id: number]
}>()

const visible = defineModel<boolean>('visible', { default: false })

const { formRef, validate, submitLoading } = useForm()
const { emitPackageRefund } = usePackageEmitter()

const formData = ref({
  reason: '',
})

/** 退款预览 */
const preview = ref<Pkg.Refund.ResPostRefundPreviewApi | null>(null)
const previewLoading = ref(false)

/** 拉取退款预览（预计金额 + 场景明细） */
async function fetchPreview(id: number) {
  previewLoading.value = true
  preview.value = null
  try {
    const result = await postRefundPreviewApi({ packageRecordId: id })
    if (result.code === 0) {
      preview.value = result.data
    }
  } catch (error) {
    console.error('获取退款预览失败:', error)
  } finally {
    previewLoading.value = false
  }
}

watch(
  () => [visible.value, props.id] as const,
  ([show, id]) => {
    if (show && id) fetchPreview(id)
  },
  { immediate: true },
)

const rules = {
  reason: [
    { required: true, message: '请输入退款理由' },
    { min: 5, max: 200, message: '退款理由应为5-200个字符' },
  ],
}

/** 提交退款申请 */
async function handleConfirm() {
  if (!props.id) return

  if (preview.value && !preview.value.canRefund) {
    toast.show(preview.value.refundReason || '当前套餐不可退款')
    return
  }

  try {
    const { valid } = await validate(['reason'])
    if (!valid) return

    submitLoading.value = true

    const result = await postApplyPackageRefundApi({
      packageRecordId: props.id,
      applyReason: formData.value.reason,
    })

    if (result.code === 0) {
      toast.show('退款申请提交成功')
      emitPackageRefund()
      visible.value = false
      formData.value.reason = ''
      preview.value = null
      emit('success', props.id)
    }
  } catch (error) {
    console.error('退款申请失败:', error)
    toast.show('退款申请失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

/** 取消操作 */
function handleCancel() {
  visible.value = false
  formData.value.reason = ''
  preview.value = null
}
</script>

<template>
  <BottomPopup v-model:model-value="visible" title="申请退款" height="auto" @close="handleCancel">
    <view p="4 b-0">
      <!-- 退款预览：预计金额 + 场景明细 -->
      <view v-if="previewLoading" text="sm gray-400" m="b-3">
        正在计算预计退款…
      </view>
      <view v-else-if="preview" m="b-3" p="3" rounded="lg" :bg="preview.canRefund ? '#f0f9ff' : '#fef2f2'">
        <template v-if="preview.canRefund">
          <view flex="~ row items-center justify-between" m="b-2">
            <text text="sm gray-700" font="medium">
              预计退款金额
            </text>
            <text text="base red-500" font="bold">
              ¥{{ preview.refundAmount }}
            </text>
          </view>
          <view v-if="preview.calculation" flex="~ col gap-1">
            <view flex="~ row items-center justify-between">
              <text text="xs gray-500">
                退款场景
              </text>
              <text text="xs gray-700">
                {{ preview.calculation.scenario }}
              </text>
            </view>
            <view v-if="Number(preview.calculation.firstMonthActualPrice) > 0" flex="~ row items-center justify-between">
              <text text="xs gray-500">
                首月实收
              </text>
              <text text="xs gray-700">
                ¥{{ preview.calculation.firstMonthActualPrice }}
              </text>
            </view>
            <view flex="~ row items-center justify-between">
              <text text="xs gray-500">
                已生效完整月
              </text>
              <text text="xs gray-700">
                {{ preview.calculation.fullMonths }} 个月
              </text>
            </view>
            <view v-if="Number(preview.calculation.currentMonthDeduct) > 0" flex="~ row items-center justify-between">
              <text text="xs gray-500">
                当月扣除
              </text>
              <text text="xs gray-700">
                ¥{{ preview.calculation.currentMonthDeduct }}
              </text>
            </view>
          </view>
        </template>
        <text v-else text="sm red-500">
          {{ preview.refundReason || '当前套餐不可退款' }}
        </text>
      </view>

      <Form ref="formRef" :model="formData" :rules="rules">
        <view flex="~ col" gap="2.5">
          <Cell id="reason" required label="退款理由" prop="reason">
            <wd-textarea
              v-model="formData.reason"
              :show-confirm-bar="false"
              placeholder="请详细说明退款原因，至少5个字符"
              :maxlength="200"
            />
          </Cell>
        </view>
      </Form>
    </view>

    <template #footer>
      <view flex="~ row" gap="3" p="4">
        <TButton type="default" size="large" full flex="1" @click="handleCancel">
          取消
        </TButton>
        <TButton
          type="primary"
          size="large"
          full
          flex="1"
          :loading="submitLoading"
          :disabled="previewLoading || (preview ? !preview.canRefund : false)"
          @click="handleConfirm"
        >
          提交申请
        </TButton>
      </view>
    </template>
  </BottomPopup>
</template>
