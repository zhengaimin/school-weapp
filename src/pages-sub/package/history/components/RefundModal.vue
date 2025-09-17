<script lang="ts" setup>
// 单 textarea 框无法校验 - 小程序
// #region 导入
import type { Pkg } from '@/api/interface/modules/package'
import { ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { useForm } from '@/hooks/useForm'
// #endregion

// #region 属性定义
const props = defineProps<{
  record?: Pkg.Query.IPackagePurchaseVo
}>()

const emit = defineEmits<{
  confirm: [params: { record: Pkg.Query.IPackagePurchaseVo, reason: string }]
}>()

const visible = defineModel<boolean>('visible', { default: false })
// #endregion

// #region 使用 Hooks
const { formRef, validate, submitLoading } = useForm()
// #endregion

// #region 定义响应式数据
const formData = ref({
  reason: '',
})
// #endregion

// #region 定义验证规则
const rules = {
  reason: [
    { required: true, message: '请输入退款理由', trigger: 'blur' },
    { min: 5, max: 200, message: '退款理由应为5-200个字符', trigger: 'blur' },
  ],
}
// #endregion

// #region 事件处理函数
// 确认退款申请
async function handleConfirm() {
  if (!props.record)
    return

  try {
    const { valid } = await validate(['reason'])
    if (!valid)
      return

    submitLoading.value = true

    emit('confirm', {
      record: props.record,
      reason: formData.value.reason,
    })
  }
  catch (error) {
    console.error('表单验证失败:', error)
  }
  finally {
    submitLoading.value = false
  }
}

// 取消操作
function handleCancel() {
  visible.value = false
  formData.value.reason = ''
}
// #endregion
</script>

<template>
  <BottomPopup v-model:model-value="visible" title="申请退款" height="auto" @close="handleCancel">
    <view p="4 b-0">
      <!-- 退款理由表单 -->
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

    <!-- 操作按钮 -->
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
          :disabled="formData.reason?.length < 5"
          :loading="submitLoading"
          @click="handleConfirm"
        >
          提交申请
        </TButton>
      </view>
    </template>
  </BottomPopup>
</template>
