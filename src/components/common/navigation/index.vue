<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'
import { bool, object, string } from 'vue-types'

import Icon from '@/components/icon/index.vue'

import { LAUNCH_PATH, TABBAR_HOME_PATH } from '@/constant/router'

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
  // 颜色配置
  bgColor: string(),
  textColor: string(),
  iconColor: string(),
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const { navBarInfo } = storeToRefs(useAppStore())

/** 是否显示回到首页按钮 */
const showHomeButton = computed(() => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    return false
  }

  const currentPage = pages[0] as { fullPath: string }
  return currentPage.fullPath !== LAUNCH_PATH
})

/** 导航栏样式 */
const navStyle = computed(() => {
  const info = unref(navBarInfo)

  if (!info) return { display: 'none' }

  const style: any = {
    height: `${info.navBarHeight || 60}px`,
    ...props.customStyle,
  }

  if (props.bgColor) style.backgroundColor = props.bgColor

  if (props.textColor) style.color = props.textColor

  return style
})

/** 标题区域样式 */
const titleStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info) return {}

  const { menuHeight, menuBottom } = info

  return {
    height: `${menuHeight}px`,
    paddingLeft: props.showBack ? '100rpx' : '30rpx',
    paddingRight: '100rpx',
    bottom: `${menuBottom}px`,
  }
})

/** 标题文本样式 */
const titleTextStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info) return {}

  const { menuHeight } = info

  const style: any = {
    height: `${menuHeight}px`,
    lineHeight: `${menuHeight}px`,
  }

  if (props.textColor) style.color = props.textColor

  return style
})

/** 返回按钮样式 */
const backStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info) return {}

  const { menuHeight, menuBottom } = info

  return {
    height: `${menuHeight}px`,
    bottom: `${menuBottom}px`,
    left: '0',
    width: '100rpx',
  }
})

/** 右侧区域样式 */
const rightStyle = computed(() => {
  const info = unref(navBarInfo)
  if (!info) return {}

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

/** 图标颜色 */
const resolvedIconColor = computed(() => props.iconColor || 'currentColor')

/** 返回上一页 */
function handleBack() {
  if (showHomeButton.value) {
    uni.reLaunch({ url: isMpWeixin ? LAUNCH_PATH : TABBAR_HOME_PATH })
    return
  }

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
    @click.stop="e => emit('click', e)"
  >
    <!-- 前置图标插槽或返回/回到首页按钮 -->
    <view class="absolute z-9999 h-full flex items-center justify-center" :style="backStyle">
      <slot name="pre-icon">
        <!-- 默认返回按钮 -->
        <view v-if="showBack" class="flex items-center" @click="handleBack">
          <Icon
            v-if="showHomeButton"
            name="home-3-line"
            :icon-color="resolvedIconColor"
            icon-size="40rpx"
          />
          <Icon v-else name="arrow-left-line" :icon-color="resolvedIconColor" icon-size="40rpx" />
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
