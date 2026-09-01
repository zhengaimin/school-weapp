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
const popupVisible = ref(false)

const { formRef, validate, submitLoading } = useForm()
const { emitPackageRefund } = usePackageEmitter()

const formData = ref({
  reason: '',
})

/** 退款预览 */
const preview = ref<Pkg.Refund.ResPostRefundPreviewApi | null>(null)
const previewLoading = ref(false)
/** 用于忽略过期的退款预览响应 */
let previewRequestId = 0

/** 拉取退款预览（预计金额 + 场景明细） */
async function fetchPreview(id: number) {
  const requestId = ++previewRequestId
  previewLoading.value = true
  preview.value = null
  try {
    const result = await postRefundPreviewApi({ packageRecordId: id })
    if (requestId !== previewRequestId || !visible.value || props.id !== id) return

    if (result.code !== 0) {
      visible.value = false
      return
    }

    preview.value = result.data
    if (!result.data.canRefund) {
      toast.show(result.data.refundReason || '当前套餐不可退款')
      visible.value = false
      return
    }

    popupVisible.value = true
  } catch (error) {
    console.error('获取退款预览失败:', error)
    if (requestId === previewRequestId) {
      visible.value = false
    }
  } finally {
    if (requestId === previewRequestId) {
      previewLoading.value = false
    }
  }
}

watch(
  () => [visible.value, props.id] as const,
  ([show, id]) => {
    popupVisible.value = false
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
      popupVisible.value = false
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
  popupVisible.value = false
  formData.value.reason = ''
  preview.value = null
}
</script>

<template>
  <BottomPopup v-model:model-value="popupVisible" title="申请退款" height="auto" @close="handleCancel">
    <view p="4 b-0">
      <!-- 退款预览：预计退款金额 -->
      <view v-if="previewLoading" text="sm gray-400" m="b-3">
        正在计算预计退款…
      </view>
      <view v-else-if="preview?.canRefund" m="b-3" p="3" rounded="lg" bg="#f0f9ff">
        <template v-if="preview.canRefund">
          <view flex="~ row items-center justify-between">
            <text text="sm gray-700" font="medium">
              预计退款金额
            </text>
            <text text="base red-500" font="bold">
              ¥{{ preview.refundAmount }}
            </text>
          </view>
        </template>
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
