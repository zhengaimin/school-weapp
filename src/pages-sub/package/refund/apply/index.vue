<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "申请退款"
  }
}
</route>

<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
// #region 导入
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getStudentActivePackageApi, postApplyPackageRefundApi } from '@/api/modules/package'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { toast } from '@/utils/toast'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, getContentHeight, onLoginSuccess, onLoginFail } = usePage()
const { formRef, validate, submitLoading, scrollToFirstError, scrollIntoView }
  = useForm('.apply-scroll')
// #endregion

// #region 定义响应式数据
const activePackage = ref<Pkg.Query.IStudentActivePackageVo>()
const formData = ref({
  reason: '',
})
// #endregion

const contentStyle = computed(() => {
  return getContentHeight('164rpx')
})

// #region 接口请求函数
// 获取学生当前正在使用的套餐
async function axiosGetStudentActivePackageApi() {
  try {
    const result = await getStudentActivePackageApi()
    if (result.code === 0) {
      activePackage.value
        = result.data.activePackages.length > 0 ? result.data.activePackages[0] : undefined
    }
    return result
  }
  catch (error) {
    console.error('获取学生当前套餐失败:', error)
    return { code: -1 }
  }
}

// 申请套餐退款
async function axiosPostApplyPackageRefundApi(packageRecordId: number, applyReason: string) {
  try {
    const params: Pkg.Refund.ReqPostApplyRefundApi = {
      packageRecordId,
      applyReason,
    }
    const result = await postApplyPackageRefundApi(params)
    if (result.code === 0) {
      toast.show('退款申请已提交')
      // 返回上一页
      uni.navigateBack()
    }
    else {
      throw new Error(result.msg || '申请退款失败')
    }
  }
  catch (error) {
    console.error('申请退款失败:', error)
    toast.show((error as Error).message || '申请退款失败，请重试')
    throw error
  }
}
// #endregion

// #region 定义验证规则
const rules = {
  reason: [
    { required: true, message: '请输入退款原因', trigger: 'blur' },
    { min: 5, max: 200, message: '退款原因应为5-200个字符', trigger: 'blur' },
  ],
}
// #endregion

// #region 方法定义
// 格式化价格显示（前缀人民币符号）
function formatPrice(price: number): string {
  return `¥${price}`
}
// #endregion

// #region 事件处理函数
// 提交退款申请
async function handleSubmit() {
  try {
    const { valid } = await validate(['reason'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    if (!activePackage.value) {
      toast.show('未找到套餐信息')
      return
    }

    submitLoading.value = true
    await axiosPostApplyPackageRefundApi(activePackage.value.packageId, formData.value.reason)
  }
  catch (error) {
    console.error('提交退款申请失败:', error)
    toast.show('提交失败，请重试')
  }
  finally {
    submitLoading.value = false
  }
}
// #endregion

// #region 生命周期钩子
onLoad(async () => {
  pageLoading.value = true
  try {
    await axiosGetStudentActivePackageApi()
  }
  finally {
    pageLoading.value = false
  }
})
// #endregion
</script>

<template>
  <Page
    title="申请退款"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <scroll-view
      class="apply-scroll"
      :style="contentStyle"
      scroll-y
      :enhanced="true"
      :show-scrollbar="false"
      :scroll-with-animation="true"
      :scroll-into-view="scrollIntoView"
    >
      <view v-if="activePackage" box-border p="x-4 t-2 b-4" flex="~ col" gap="4">
        <!-- 套餐信息 -->
        <WhiteCard p="4" flex="~ col" gap="2">
          <view text="base gray-900" font="bold">
            {{ activePackage.packageName }}
          </view>
          <view flex="~ justify-between items-center">
            <view text="sm gray-600">
              购买价格
            </view>
            <view text="lg primary" font="bold">
              {{ formatPrice(activePackage.purchasePrice) }}
            </view>
          </view>
          <view flex="~ justify-between items-center">
            <view text="sm gray-600">
              有效期
            </view>
            <view text="sm gray-500">
              {{ activePackage.startDate }} 至 {{ activePackage.endDate }}
            </view>
          </view>
        </WhiteCard>

        <!-- 退款原因 -->
        <WhiteCard>
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
              <Cell id="reason" required label="退款原因" prop="reason">
                <wd-textarea
                  v-model="formData.reason"
                  prop="reason"
                  placeholder="请输入退款原因"
                  :maxlength="200"
                />
              </Cell>
            </view>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <view p="4">
      <!-- 提交按钮 -->
      <TButton type="primary" size="large" full :loading="submitLoading" @click="handleSubmit">
        提交申请
      </TButton>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
