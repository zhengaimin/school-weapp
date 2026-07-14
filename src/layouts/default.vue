<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

import { useMessage } from '@/uni_modules/wot-design-uni'

const themeVars: ConfigProviderThemeVars = {}

useMessage()
</script>

<template>
  <wd-config-provider :theme-vars="themeVars" class="relative z-1">
    <slot />

    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>
