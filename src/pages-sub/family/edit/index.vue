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
// #region 导入
import type { Family } from '@/api/interface/modules/family'
import type { TBatchRequestList } from '@/hooks/usePage'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import {
  getFamilyContactDetailApi,
  postFamilyContactApi,
  putFamilyContactApi,
} from '@/api/modules/family/contacts'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import Picker from '@/components/form/picker/index.vue'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useConfigStore } from '@/store/config'
import { useParentStore } from '@/store/parent'
import { currRoute } from '@/utils'
import { useFamily } from '@/utils/emit/family'
import { toast } from '@/utils/toast'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Store
const configStore = useConfigStore()
const parentStore = useParentStore()
const { relationshipOptions } = storeToRefs(configStore)
const { familyContactsRelationshipMap } = storeToRefs(parentStore)
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, validate, submitLoading, scrollIntoView, scrollToFirstError }
  = useForm('.contact-scroll')
const { emitRefreshFamilyList } = useFamily()
// #endregion

// #region 定义响应式数据
const currentEditContact = ref<Family.Contact.ResGetFamilyContactsApi | null>(null)

const formData = ref<Family.Contact.ReqPostFamilyContactApi>({
  relationship: null,
  phone: '',
  nickname: '',
})
// #endregion

// #region 定义计算属性
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

// 处理关系选项，禁用已存在的关系（编辑时排除当前关系）
const processedRelationshipOptions = computed(() => {
  return relationshipOptions.value.map((option) => {
    const isCurrentRelationship = currentEditContact.value?.relationship === option.value
    const isExistingRelationship = familyContactsRelationshipMap.value[option.value]

    return {
      ...option,
      disabled: !isCurrentRelationship && !!isExistingRelationship,
    }
  })
})
// #endregion

// #region 定义验证规则
const rules: Record<string, import('@/components/form/types').RuleItem[]> = {
  relationship: [{ required: true, message: '请选择关系' }],
  phone: [
    { required: true, message: '请输入手机号' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  nickname: [{ max: 20, message: '昵称不能超过20个字符' }],
}
// #endregion

// #region 接口请求函数
async function axiosGetFamilyContactDetailApi(id: number) {
  try {
    const result = await getFamilyContactDetailApi(id)

    // 获取到当前亲情号的信息，回显到 form 中
    if (result.code === 0) {
      currentEditContact.value = result.data
      formData.value.relationship = result.data.relationship || 0
      formData.value.phone = result.data.phone || ''
      formData.value.nickname = result.data.nickname || ''
    }

    return result
  }
  catch (error) {
    console.log('获取亲情号详情失败', error)
    return { code: -1, message: '获取信息失败', data: null }
  }
}
// #endregion

// #region 事件处理函数
async function handleSubmit() {
  try {
    console.log(formData.value)
    const { valid } = await validate(['relationship', 'phone', 'nickname'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true
    const isEdit = !!currentEditContact.value

    const result = await (isEdit
      ? putFamilyContactApi(currentEditContact.value!.id!, formData.value)
      : postFamilyContactApi(formData.value))

    if (result.code === 0) {
      toast.show(isEdit ? '修改成功' : '添加成功')

      emitRefreshFamilyList()
      uni.navigateBack()
    }
  }
  catch (error) {
    console.error('操作失败:', error)
  }
  finally {
    submitLoading.value = false
  }
}
// #endregion

// #region 生命周期钩子
function onLoginSuccess() {
  const { query } = currRoute()

  // 构建请求列表，只包含统一类型的请求
  const reqList: TBatchRequestList = [
    configStore.axiosGetRelationshipOptionsApi(),
    // 获取亲情号列表用于关系禁用逻辑
    parentStore.axiosGetFamilyContactsApi(),
  ]

  if (query.id) {
    reqList.push(axiosGetFamilyContactDetailApi(+query.id))
  }

  // 使用 batchRequestHandler 处理统一类型的请求
  batchRequestHandler(reqList)
}
// #endregion
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
    <scroll-view
      scroll-y
      class="contact-scroll"
      scroll-with-animation
      :scroll-into-view="scrollIntoView"
      :style="contentHeight"
    >
      <view p="4 t-2">
        <WhiteCard>
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
              <!-- 关系选择 -->
              <Cell id="relationship" required label="关系" prop="relationship">
                <Picker
                  v-model.number="formData.relationship"
                  placeholder="请选择关系"
                  title="选择关系"
                  :options="processedRelationshipOptions"
                />
              </Cell>

              <!-- 手机号输入 -->
              <Cell id="phone" required label="手机号" prop="phone">
                <wd-input v-model="formData.phone" type="tel" placeholder="请输入手机号" />
              </Cell>

              <!-- 昵称输入 -->
              <Cell id="nickname" label="昵称" prop="nickname">
                <wd-input v-model="formData.nickname" placeholder="请输入昵称（可选）" />
              </Cell>
            </view>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <!-- 底部添加按钮 -->
    <view p="4">
      <TButton type="primary" full size="large" :loading="submitLoading" @click="handleSubmit">
        确定
      </TButton>
    </view>
  </Page>
</template>
