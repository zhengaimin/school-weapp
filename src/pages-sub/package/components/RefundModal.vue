<script lang="ts" setup>
import { ref } from 'vue'
import { postApplyPackageRefundApi } from '@/api/modules/package/refund'
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

const rules = {
  reason: [
    { required: true, message: '请输入退款理由' },
    { min: 5, max: 200, message: '退款理由应为5-200个字符' },
  ],
}

/** 提交退款申请 */
async function handleConfirm() {
  if (!props.id) return

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
}
</script>

<template>
  <BottomPopup v-model:model-value="visible" title="申请退款" height="auto" @close="handleCancel">
    <view p="4 b-0">
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
          @click="handleConfirm"
        >
          提交申请
        </TButton>
      </view>
    </template>
  </BottomPopup>
</template>
