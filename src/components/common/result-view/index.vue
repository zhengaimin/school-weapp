<script lang="ts" setup>
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

export interface ResultItem {
  key: string
  label?: string
  value?: string | number | null
  type?: 'item' | 'divider'
  labelClass?: string
  valueClass?: string
  valueStyle?: string | Record<string, string>
}

export interface ResultCard {
  key: string
  title?: string
  items?: ResultItem[]
  showBorder?: boolean
  customClass?: string
  customStyle?: string | Record<string, string>
}

const props = withDefaults(defineProps<{
  iconName?: string
  iconColor?: string
  statusText?: string
  iconSize?: string
  cards?: ResultCard[]
}>(), {
  iconSize: '64rpx',
  cards: () => [],
})

// Slots:
// - value-{cardKey}-{itemKey}: custom value cell for a specific item
// - card-{cardKey}: custom body for a card (when items is empty)
</script>

<template>
  <view>
    <view v-if="iconName || statusText" class="flex items-center justify-center gap-3 pb-6 pt-4">
      <Icon v-if="iconName" :name="iconName" :icon-color="iconColor" :icon-size="iconSize" />
      <view v-if="statusText" class="text-xl text-gray-900 font-medium">
        {{ statusText }}
      </view>
    </view>

    <template v-for="card in props.cards" :key="card.key">
      <WhiteCard
        :show-border="card.showBorder"
        :custom-class="card.customClass"
        :custom-style="card.customStyle"
      >
        <view v-if="card.title" class="text-sm text-gray-900 font-medium">
          {{ card.title }}
        </view>
        <view v-if="card.title" class="my-3 h-px bg-gray-100" />

        <view v-if="card.items?.length" class="flex flex-col gap-3">
          <template v-for="item in card.items" :key="item.key">
            <view v-if="item.type === 'divider'" class="my-1 h-px bg-gray-100" />
            <view v-else class="flex items-start justify-between gap-2">
              <text class="shrink-0 whitespace-nowrap text-sm text-gray-500" :class="item.labelClass">
                {{ item.label }}
              </text>
              <view
                class="flex-1 whitespace-normal break-all text-right text-sm text-gray-900"
                style="overflow-wrap: anywhere"
                :class="item.valueClass"
                :style="item.valueStyle"
              >
                <slot :name="`value-${card.key}-${item.key}`">
                  {{ item.value ?? '-' }}
                </slot>
              </view>
            </view>
          </template>
        </view>

        <slot v-else :name="`card-${card.key}`" />
      </WhiteCard>
    </template>

    <slot />
  </view>
</template>
