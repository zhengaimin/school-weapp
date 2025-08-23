<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'
import { bool, object, string } from 'vue-types'

import Icon from '@/components/icon/index.vue'

import { TABBAR_HOME_PATH } from '@/constant/router'

import { useAppStore } from '@/store/app'
import { isMpWeixin } from '@/utils/platform'

const props = defineProps({
  title: string().def(''),
  // 是否显示导航栏（默认显示）
  show: bool().def(true),
  // 是否显示返回按钮（默认显示）
  showBack: bool().def(true),
  // 自定义样式
  customStyle: object().def(() => ({})),
  customClass: object().def(() => ({})),
})

const { navBarInfo } = storeToRefs(useAppStore())

// 计算导航栏样式
const navStyle = computed(() => {
  const info = unref(navBarInfo)

  if (!info)
    return { display: 'none' }

  return {
    height: `${info.navBarHeight || 60}px`,
    ...props.customStyle,
  }
})
// 计算标题样式
const titleStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info)
    return {}

  const { menuHeight, menuBottom } = info

  return {
    height: `${menuHeight}px`,
    paddingLeft: props.showBack ? '100rpx' : '30rpx',
    paddingRight: '100rpx',
    bottom: `${menuBottom}px`,
  }
})
const titleTextStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info)
    return {}

  const { menuHeight } = info

  return {
    height: `${menuHeight}px`,
    lineHeight: `${menuHeight}px`,
  }
})
const backStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info)
    return {}

  const { menuHeight, menuBottom } = info

  return {
    height: `${menuHeight}px`,
    bottom: `${menuBottom}px`,
    left: '0',
    width: '100rpx',
  }
})
const rightStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info)
    return {}

  const { menuHeight, menuBottom, width } = info

  const result: any = {
    height: `${menuHeight}px`,
    lineHeight: `${menuHeight}px`,
    bottom: `${menuBottom}px`,
    right: '0',
  }

  if (isMpWeixin) {
    result.paddingRight = `calc(30rpx + ${width}px)`
  }

  return result
})

// 返回上一页
function handleBack() {
  uni.navigateBack({
    fail() {
      uni.switchTab({
        url: TABBAR_HOME_PATH,
      })
    },
  })
}
</script>

<template>
  <view
    class="navigation relative w-full flex shrink-0 items-center justify-center"
    :style="navStyle"
    :class="customClass"
  >
    <!-- 前置图标插槽或返回/回到首页按钮 -->
    <view class="absolute z-9999 h-full flex items-center justify-center" :style="backStyle">
      <slot name="pre-icon">
        <!-- 默认返回按钮 -->
        <view v-if="showBack" class="flex items-center" @click="handleBack">
          <Icon name="arrow-left-line" icon-color="currentColor" icon-size="40rpx" />
        </view>
      </slot>
    </view>

    <!-- 标题 -->
    <view class="absolute box-border w-full text-left" :style="titleStyle">
      <text :style="titleTextStyle">
        {{ title }}
      </text>
    </view>

    <!-- 右侧图标 -->
    <view v-if="$slots.right" absolute z-10 h-full p="x-4" :style="rightStyle">
      <slot name="right" />
    </view>
  </view>
</template>
