<script lang="ts" setup>
import type { Ref } from 'vue'

import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, onMounted, ref, unref } from 'vue'
import { array, bool, string } from 'vue-types'
import DefaultBg from '@/components/common/default-bg/index.vue'
import Loading from '@/components/common/loading/index.vue'
import Navigation from '@/components/common/navigation/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import { ROLE_TYPE } from '@/constant/modules'
import { LAUNCH_PATH, STUDENT_BIND_PATH, TABBAR_HOME_PATH, WELCOME_PATH } from '@/constant/router'
import { useParentStore } from '@/store/auth/parent'
import { useUserStore } from '@/store/user'
import { currRoute } from '@/utils'
import { isMpWeixin } from '@/utils/platform'

const props = defineProps({
  // navigation 组件
  title: string().def(''),
  showTabbar: bool().def(false),
  showBack: bool().def(true),
  navbar: bool().def(true),
  navBgColor: string(),
  navTextColor: string(),
  navIconColor: string(),

  error: string().def(''),

  // scroll 组件
  scrollY: bool().def(true),

  // 背景
  showBg: bool().def(false),
  bgColors: array<string>(),
})

const emit = defineEmits(['scroll', 'login:success', 'login:fail'])
/** 是否已触发登录事件 */
const hasEmittedLogin = ref(false)

/** 仅触发一次登录事件，避免重复执行后续逻辑 */
function emitLoginEvent(type: 'login:success' | 'login:fail') {
  if (hasEmittedLogin.value) return
  hasEmittedLogin.value = true
  emit(type)
}

/** 是否首次启动 */
const isFirstLaunch = inject<Ref<boolean>>('isFirstLaunch', ref(true))

/** 页面加载状态 */
const loading = defineModel<boolean>('loading', { default: false })
/** 页面显示状态 */
const show = defineModel<boolean>('show', { default: true })

const userStore = useUserStore()
const parentStore = useParentStore()
const { token, phone, role } = storeToRefs(userStore)
const { needBind } = storeToRefs(parentStore)

/** 是否需要登录 */
const needsLogin = computed(() => {
  return !unref(token)
})

/** 判断是否为当前页面 */
function isCurrentPage(targetPath: string) {
  const pages = getCurrentPages()

  if (pages.length === 1 && `/${pages[0].route}`.includes(targetPath)) {
    return true
  }

  if (pages.length > 1) {
    const { path: currentPath } = currRoute()

    return currentPath.includes(targetPath)
  }

  return false
}
/** 延迟跳转，避免与当前渲染/路由切换冲突 */
function delayedRedirect(url: string) {
  setTimeout(() => {
    uni.redirectTo({ url })
  }, 500)
}
/** 延迟导航，用于 push 形式的路由切换 */
function delayedNavigate(url: string) {
  setTimeout(() => {
    uni.navigateTo({ url })
  }, 500)
}

/** 处理滚动事件 */
function handleScroll(e: any) {
  emit('scroll', e)
}
/** 初始化用户信息和学生列表 */
async function initInfo() {
  if (!isFirstLaunch.value) {
    return
  }
  // 没有 token，直接返回
  if (!unref(token)) {
    return
  }

  try {
    await userStore.getUserInfo()
    const isParent = unref(role) === ROLE_TYPE.PARENT
    if (isParent) {
      await parentStore.axiosGetStudentListApi()
    }
  } finally {
    isFirstLaunch.value = false
  }
}
/** 已登录后的处理流程 */
async function handleLoggedInFlow() {
  if (!unref(phone)) {
    if (!isCurrentPage(WELCOME_PATH)) {
      delayedRedirect(WELCOME_PATH)
    }
    emitLoginEvent('login:success')
    return
  }

  const isParent = unref(role) === ROLE_TYPE.PARENT
  if (isParent && unref(needBind) && !isCurrentPage(STUDENT_BIND_PATH)) {
    delayedNavigate(STUDENT_BIND_PATH)
    emitLoginEvent('login:success')
    return
  }

  await initInfo()

  // 检查路由栈第一个页面是否为启动页
  const pages = getCurrentPages()
  const isFromLaunchPage = pages.length > 0 && `/${pages[0].route}` === LAUNCH_PATH
  const shouldGoToHome = !isCurrentPage(TABBAR_HOME_PATH) && isFromLaunchPage
  if (shouldGoToHome) {
    const _role = unref(role)
    delayedRedirect(`${TABBAR_HOME_PATH}?role=${_role}`)
    emitLoginEvent('login:success')
    return
  }

  emitLoginEvent('login:success')
}

/** 微信小程序登录逻辑 */
async function mpWeixinLogin() {
  try {
    const wxResult = await userStore.wxLogin()

    if (wxResult.code === 0) {
      const { token, needBind: _needBind } = wxResult.data
      token && userStore.setToken(token)
      parentStore.setNeedBind(_needBind)
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('page 组件', error)
    return false
  }
}
/** H5 等其他环境的登录逻辑 */
async function otherEnvLogin() {
  try {
    parentStore.setNeedBind(false)
    userStore.setRole(ROLE_TYPE.PARENT)
    return true
  } catch (error) {
    console.error('H5 login error:', error)
    return false
  }
}

/** 页面挂载入口，统一登录与跳转流程 */
onMounted(async () => {
  try {
    if (isCurrentPage(TABBAR_HOME_PATH) && isMpWeixin) {
      await nextTick()
    }

    if (!isMpWeixin) {
      const loginOk = await otherEnvLogin()
      if (loginOk) {
        await handleLoggedInFlow()
      } else {
        emitLoginEvent('login:fail')
      }
      return
    }

    if (needsLogin.value) {
      const loginOk = await mpWeixinLogin()
      if (!loginOk) {
        emitLoginEvent('login:fail')
        return
      }
    }

    await handleLoggedInFlow()
  } catch (error) {
    console.error('page 组件', error)
    emitLoginEvent('login:fail')
  }
})
</script>

<template>
  <view class="t-page" flex="~ col" relative z-1 box-border h-screen bg-gray-50 pb-safe>
    <!-- 导航 -->
    <Navigation
      v-if="show && navbar"
      :title="title"
      :show-back="showBack"
      :bg-color="navBgColor"
      :text-color="navTextColor"
      :icon-color="navIconColor"
    >
      <template v-if="!loading" #right>
        <slot name="header-right" />
      </template>
    </Navigation>

    <!-- loading 区域 -->
    <view v-if="loading" flex="~ 1" overflow-hidden :class="{ 'bottom-line-exclude': showTabbar }">
      <view v-if="$slots.skeleton" w-full flex="~ col">
        <slot name="skeleton" />
      </view>
      <!-- loading 区域 -->
      <view v-else flex="~ 1 items-center justify-center">
        <Loading />
      </view>
    </view>

    <!-- 内容区域 -->
    <template v-if="!loading">
      <!-- 错误区域 -->
      <view v-if="error" flex="~ 1" overflow-hidden :class="{ 'bottom-line-exclude': showTabbar }">
        <view flex="~ 1 items-center justify-center">
          <StatusTip image="network" :tip="error" />
        </view>
      </view>
      <!-- 页面加载完毕且没有错误 -->
      <scroll-view
        v-else
        enable-flex
        flex="~ 1 col"
        :class="{ 'bottom-line-exclude': showTabbar }"
        :scroll-y="scrollY"
        @scroll="handleScroll"
      >
        <slot />
      </scroll-view>
    </template>

    <DefaultBg v-if="showBg" :colors="bgColors" />
  </view>
</template>
