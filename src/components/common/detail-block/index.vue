<script lang="ts" setup>
import WhiteCard from '@/components/common/white-card/index.vue'

interface DetailItem {
  key: string
  label: string
  value?: string
  [property: string]: any
}

withDefaults(
  defineProps<{
    title?: string
    items: DetailItem[]
    rightTextClass?: string
    customClass?: string
  }>(),
  {
    rightTextClass: 'text-sm font-medium',
  },
)
</script>

<template>
  <WhiteCard :custom-class="`pb-6 ${title ? 'pt-4' : 'pt-6'} ${customClass || ''}`">
    <view v-if="title" text="base" font="medium" m="b-4">
      {{ title }}
    </view>
    <view flex="~ col" gap="4">
      <view v-for="item in items" :key="item.key" flex="~ justify-between items-start" gap="4">
        <text shrink-0 text="sm">
          {{ item.label }}
        </text>
        <slot :name="item.key">
          <text break-all :class="rightTextClass" text="right">
            {{ item.value }}
          </text>
        </slot>
      </view>
    </view>
  </WhiteCard>
</template>
