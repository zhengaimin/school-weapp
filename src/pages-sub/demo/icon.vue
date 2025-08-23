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
import Page from '@/components/common/page/index.vue'

import Icon from '@/components/icon/index.vue'

import { usePage } from '@/hooks/usePage'

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()
</script>

<template>
  <Page
    title=""
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <Icon name="arrow-up-s-line" icon-color="red" icon-size="48rpx" />
  </Page>
</template>

<style scoped lang="scss"></style>
