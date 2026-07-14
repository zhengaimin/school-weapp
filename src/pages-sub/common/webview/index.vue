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
import { onMounted, ref } from 'vue'
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
import { currRoute } from '@/utils'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

const url = ref('')

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
    } catch (error) {
      // 如果解码失败，说明已经是解码后的字符串或格式不正确
      console.warn('URL 解码失败:', error)
      break
    }
  }

  return currentUrl
}

/**
 * 解析 URL 查询参数（仅用于日志输出）
 * @param targetUrl 目标 URL
 * @returns 查询参数对象
 */
function getUrlQueryParams(targetUrl: string): Record<string, string> {
  if (!targetUrl || !targetUrl.includes('?')) {
    return {}
  }

  const queryString = targetUrl.split('?')[1]?.split('#')[0] || ''
  if (!queryString) {
    return {}
  }

  return queryString.split('&').reduce((acc, pair) => {
    if (!pair) {
      return acc
    }
    const [key, value = ''] = pair.split('=')
    if (key) {
      acc[decodeURIComponent(key)] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>)
}

// 处理fab按钮点击
function handleFabClick() {
  console.log('fab按钮被点击')
}

onMounted(() => {
  const { path: webviewPath, query } = currRoute()

  const path = query?.path || ''
  const decodedPath = decodeUrl(path)
  const webviewPagePath = `${webviewPath}?path=${encodeURIComponent(decodedPath)}`

  console.log('[WebView] 页面路径:', webviewPagePath)
  console.log('[WebView] 目标链接:', decodedPath)
  console.log('[WebView] 目标链接参数:', getUrlQueryParams(decodedPath))

  if (decodedPath) {
    url.value = decodedPath
  }
})
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
