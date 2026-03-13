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
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { putMeInfoApi } from '@/api/modules/user'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import { ROLE_TYPE_I18N } from '@/constant/modules'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'

interface FormData {
  userName: string
  role: string
  phone: string
}

const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading } = useForm()

const userStore = useUserStore()
const { userInfo, role, phone } = storeToRefs(userStore)

/** 表单数据 */
const formData = ref<FormData>({
  userName: userInfo.value?.userName || '',
  role: ROLE_TYPE_I18N[role.value],
  phone: phone.value ? `${phone.value.slice(0, 3)}****${phone.value.slice(-4)}` : '',
})

/** 内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

const rules = {
  userName: [
    { required: true, message: '请输入姓名' },
    { required: true, minLength: 2, message: '姓名至少2个字符' },
  ],
}

/** 保存个人信息 */
async function handleSaveProfile() {
  try {
    const { valid } = await validate(['userName'])
    if (!valid) return

    submitLoading.value = true

    // 调用更新用户信息 API
    const result = await putMeInfoApi({
      name: formData.value.userName,
      phone: phone.value,
    })

    if (result.code === 0) {
      // 更新成功，更新 store 中的用户信息
      await userStore.getUserInfo()

      toast.success('个人信息保存成功！')

      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      toast.error(result.msg || '保存失败，请重试')
    }
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败，请重试')
  } finally {
    submitLoading.value = false
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
              <wd-input v-model="formData.userName" placeholder="请输入姓名" />
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
      <TButton type="primary" full size="large" :loading="submitLoading" @click="handleSaveProfile">
        保存
      </TButton>
    </view>
  </Page>
</template>
