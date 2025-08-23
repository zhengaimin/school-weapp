<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

import FgTabbar from './fg-tabbar/fg-tabbar.vue'

const themeVars: ConfigProviderThemeVars = {}
</script>

<template>
  <wd-config-provider :theme-vars="themeVars">
    <slot />

    <FgTabbar />
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>
