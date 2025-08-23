<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "编辑资料"
  }
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'

import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'

import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'

import Skeleton from './components/Skeleton.vue'

// 表单数据接口
interface FormData {
  userName: string
  role: string
  phone: string
}

const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading } = useForm()

// 表单数据
const formData = ref<FormData>({
  userName: '张女士',
  role: '家长',
  phone: '138****5678',
})

// 表单验证规则
const rules = {
  userName: [
    { required: true, message: '请输入姓名' },
    { required: true, minLength: 2, message: '姓名至少2个字符' },
  ],
}

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

// 保存个人信息
async function onSaveProfile() {
  try {
    // 使用 wot ui 表单验证
    const { valid } = await validate(['userName', 'role', 'phone'])

    submitLoading.value = true
    setTimeout(() => {
      if (valid) {
        // 模拟保存
        uni.showToast({
          title: '个人信息保存成功！',
          icon: 'none',
        })

        // 延迟返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
      submitLoading.value = false
    }, 1000)
  }
  catch (error) {
    console.log('表单验证失败:', error)
  }
}
</script>

<template>
  <Page
    title="编辑信息"
    :show="true"
    :show-tabbar="false"
    :show-back="true"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <view p="4 t-2!" flex="~ col gap-4" :style="contentHeight">
      <WhiteCard>
        <!-- 表单 -->
        <Form ref="formRef" :model="formData" :rules="rules">
          <view flex="~ col" gap="2.5">
            <!-- 姓名 -->
            <Cell id="userName" required label="姓名" prop="userName">
              <wd-input
                v-model="formData.userName"
                placeholder="请输入姓名"
                suffix-icon="error-warning-line"
                :rules="rules.userName"
              />
            </Cell>

            <!-- 角色 -->
            <Cell id="role" label="角色" prop="role">
              <wd-input v-model="formData.role" readonly disabled placeholder="角色信息" />
            </Cell>

            <!-- 手机号 -->
            <Cell id="phone" label="手机号" prop="phone">
              <wd-input v-model="formData.phone" readonly disabled placeholder="手机号码" />
            </Cell>
          </view>
        </Form>
      </WhiteCard>
    </view>

    <view p="4">
      <TButton type="primary" block size="large" :loading="submitLoading" @click="onSaveProfile">
        保存
      </TButton>
    </view>

    <template #skeleton>
      <Skeleton />
    </template>
  </Page>
</template>
