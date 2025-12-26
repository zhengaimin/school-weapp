<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "登录测试"
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import { ref } from 'vue'
import { postDemoLoginApi } from '@/api/modules/demo'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
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
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
// #endregion

// #region 定义响应式数据
const formData = ref({
  onlyCode: '250224',
  schoolName: '测试学校',
})

const loading = ref(false)
const responseData = ref<any>(null)
const errorMsg = ref('')
// #endregion

// #region 事件处理函数
async function axiosPostDemoLoginApi() {
  try {
    loading.value = true
    errorMsg.value = ''
    responseData.value = null

    const result = await postDemoLoginApi({
      onlyCode: formData.value.onlyCode,
      schoolName: formData.value.schoolName,
    })

    console.log(result)
    return result
  }
  catch (error: any) {
    console.error('登录测试失败:', error)
    return {
      code: -1,
    }
  }
  finally {
    loading.value = false
  }
}
// #endregion

onMounted(() => {
  setTimeout(() => {
    axiosPostDemoLoginApi()
  }, 2000)
})
</script>

<template>
  <Page
    title="登录测试"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  ></Page>
</template>

<style scoped lang="scss"></style>
