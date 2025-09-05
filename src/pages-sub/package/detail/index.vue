<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "套餐详情"
  }
}
</route>

<script lang="ts" setup>
import DetailBlock from '@/components/common/detail-block/index.vue'
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 示例数据：实际开发中需要通过接口获取
const packageDetails = {
  basicInfo: [
    { key: 'name', label: '套餐名称', value: '超级套餐A' },
    { key: 'type', label: '套餐类型', value: '通用套餐' },
    { key: 'price', label: '套餐价格', value: '¥99.99' },
  ],
  contentInfo: [
    { key: 'minutes', label: '通话分钟数', value: '100分钟' },
    { key: 'messages', label: '短信条数', value: '200条' },
  ],
  otherInfo: [
    { key: 'rules', label: '使用规则', value: '仅限本月使用，不可叠加' },
    { key: 'validity', label: '有效期', value: '2025-09-01 至 2025-09-30' },
  ],
}
</script>

<template>
  <Page
    title="套餐详情"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 套餐基本信息 -->
    <DetailBlock
      title="基本信息"
      :items="packageDetails.basicInfo"
    />
    <!-- 套餐内容信息 -->
    <DetailBlock
      title="套餐内容"
      :items="packageDetails.contentInfo"
    />
    <!-- 其他信息 -->
    <DetailBlock
      title="其他信息"
      :items="packageDetails.otherInfo"
    />
  </Page>
</template>

<style scoped lang="scss"></style>
