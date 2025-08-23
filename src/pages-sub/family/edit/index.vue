<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "编辑亲情号码"
  }
}
</route>

<script lang="ts" setup>
import type { FamilyContact, FamilyContactForm } from '../manage/types'

import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'

import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Picker from '@/components/form/picker/index.vue'

import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'

import { addFamilyContact, getRelationshipOptions, updateFamilyContact } from '../manage/data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading, scrollToFirstError } = useForm('.contact-scroll')

const currentEditContact = ref<FamilyContact | null>(null)

// 表单数据
const formData = ref<FamilyContactForm>({
  relationship: '',
  phoneNumber: '',
})

// 关系选项
const relationshipOptions = getRelationshipOptions()

// 表单验证规则
const rules = {
  relationship: [{ required: true, message: '请选择关系' }],
  phoneNumber: [
    { required: true, message: '请输入手机号' },
    {
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
    },
  ],
}

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

// 提交表单
async function handleSubmit() {
  try {
    const { valid } = await validate(['relationship', 'phoneNumber'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true

    if (currentEditContact.value) {
      // 编辑模式
      await updateFamilyContact(currentEditContact.value.id, formData.value)
      uni.showToast({
        title: '修改成功',
        icon: 'success',
      })
    }
    else {
      // 添加模式
      await addFamilyContact(formData.value)
      uni.showToast({
        title: '添加成功',
        icon: 'success',
      })
    }
    uni.navigateBack()
  }
  catch (error) {
    console.error('操作失败:', error)
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}

onLoad((options) => {
  if (options?.item) {
    const item = JSON.parse(options.item)
    currentEditContact.value = item
    formData.value = {
      relationship: item.relationship,
      phoneNumber: item.phoneNumber,
    }
  }
})

onMounted(() => {
  pageLoading.value = false
})
</script>

<template>
  <Page
    :title="currentEditContact ? '编辑亲情号码' : '添加亲情号码'"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2" :style="contentHeight">
      <WhiteCard>
        <wd-form ref="formRef" :model="formData" :rules="rules">
          <view space="y-4">
            <!-- 关系选择 -->
            <Cell id="relationship" required label="关系" label-position="top">
              <Picker
                v-model="formData.relationship"
                placeholder="请选择关系"
                title="选择关系"
                :options="relationshipOptions"
              />
            </Cell>

            <!-- 手机号输入 -->
            <Cell id="phoneNumber" required label="手机号" label-position="top">
              <wd-input
                v-model="formData.phoneNumber"
                prop="phoneNumber"
                type="tel"
                placeholder="请输入手机号"
                :rules="rules.phoneNumber"
              />
            </Cell>
          </view>
        </wd-form>
      </WhiteCard>
    </view>

    <!-- 底部添加按钮 -->
    <view p="4">
      <TButton type="primary" block size="large" :loading="submitLoading" @click="handleSubmit">
        确定
      </TButton>
    </view>
  </Page>
</template>
