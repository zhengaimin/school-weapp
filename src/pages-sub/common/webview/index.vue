<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
</route>

<script lang="ts" setup>
// #region 导入
import { onMounted, ref } from 'vue'
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'
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
const url = ref('')
// #endregion

// #region 方法定义
/**
 * 智能解码 URL，自动检测并执行必要次数的 decodeURIComponent
 * @param encodedUrl 可能被编码的 URL 字符串
 * @returns 完全解码后的 URL 字符串
 */
function decodeUrl(encodedUrl: string): string {
  if (!encodedUrl) {
    return ''
  }

  let currentUrl = encodedUrl
  let previousUrl = ''

  // 持续解码直到 URL 不再改变
  while (currentUrl !== previousUrl) {
    previousUrl = currentUrl
    try {
      const decoded = decodeURIComponent(currentUrl)
      // 如果解码后的字符串与原字符串相同，说明已经完全解码
      if (decoded === currentUrl) {
        break
      }
      currentUrl = decoded
    }
    catch (error) {
      // 如果解码失败，说明已经是解码后的字符串或格式不正确
      console.warn('URL 解码失败:', error)
      break
    }
  }

  return currentUrl
}
// #endregion

// #region 事件处理函数
// 处理fab按钮点击
function handleFabClick() {
  console.log('fab按钮被点击')
}
// #endregion

// #region 生命周期钩子
onMounted(() => {
  const { query } = currRoute()

  const { path } = query

  console.log(decodeUrl(path))
  if (path) {
    url.value = decodeUrl(path)
  }
})
// #endregion
</script>

<template>
  <Page
    :show="false"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <web-view v-if="url" :src="url" />
    <view v-else flex="~ 1 items-center justify-center" text="sm gray-500">
      请提供有效的网页地址
    </view>
  </Page>
</template>
