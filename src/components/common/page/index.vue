<script lang="ts" setup>
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { inject, onMounted, ref } from 'vue'
import { bool, string } from 'vue-types'

import Loading from '@/components/common/loading/index.vue'

import Navigation from '@/components/common/navigation/index.vue'

import { ROLE_TYPE } from '@/constant/modules/user'

import { PARENT_STUDENT_BIND_PATH, TABBAR_HOME_PATH, WELCOME_PATH } from '@/constant/router'
import { useUserStore } from '@/store/user'
import { useParentStore } from '@/store/parent'

import { currRoute } from '@/utils'
import { isMpWeixin } from '@/utils/platform'

defineProps({
  // navigation 组件
  title: string().def(''),
  showTabbar: bool().def(false),
  showBack: bool().def(true),

  error: string().def(''),

  // scroll 组件
  scrollY: bool().def(true)
})

const emit = defineEmits(['scroll', 'login:success', 'login:fail'])

const isFirstLaunch = inject<Ref<boolean>>('isFirstLaunch', ref(true))

const loading = defineModel<boolean>('loading', { default: false })
const show = defineModel<boolean>('show', { default: true })

const userStore = useUserStore()
const parentStore = useParentStore()
const { token, phone, role, userInfo, needBind } = storeToRefs(userStore)
const { students } = storeToRefs(parentStore)

function isCurrentPage(path) {
  const pages = getCurrentPages()

  if (pages.length === 1 && `/${pages[0].route}`.includes(path)) {
    return true
  }

  if (pages.length > 1) {
    const { path } = currRoute()

    return path.includes(path)
  }

  return false
}

function handleScroll(e) {
  emit('scroll', e)
}

async function initInfo() {
  // 没有用户信息、或者是首次启动，则获取用户信息
  if (unref(token) && (!unref(userInfo) || unref(isFirstLaunch))) {
    if (!unref(userInfo) || unref(isFirstLaunch)) {
      await userStore.getUserInfo()
    }
  }
  // 获取家长下的学生列表
  if (
    unref(token) &&
    unref(role) === ROLE_TYPE.PARENT &&
    (!unref(students).length || unref(isFirstLaunch))
  ) {
    await parentStore.axiosGetStudentListByParentApi()
  }
}

// 处理登录成功后的导航逻辑
async function loginSuccessNavigation(needBind: boolean) {
  const _role = unref(role)

  // 用户没有身份，优先跳转身份选择页面
  if (!_role && !isCurrentPage(WELCOME_PATH)) {
    uni.navigateTo({ url: WELCOME_PATH })
    return
  }

  // 是家长，但是没有绑定学生，且当前页面不是绑定页面，则直接跳转到绑定页面
  if (_role === ROLE_TYPE.PARENT && needBind && !isCurrentPage(PARENT_STUDENT_BIND_PATH)) {
    uni.navigateTo({ url: PARENT_STUDENT_BIND_PATH })
    return
  }

  if (!needBind && !isCurrentPage(TABBAR_HOME_PATH)) {
    uni.navigateTo({ url: `${TABBAR_HOME_PATH}?role=${_role}` })
  }
}

async function mpWeixinLogin() {
  try {
    const wxResult = await userStore.wxLogin()

    if (wxResult.code === 0) {
      const { token, needBind } = wxResult.data
      // 有 token 说明之前绑定过
      token && userStore.setToken(token)
      userStore.setNeedBind(needBind)

      await initInfo()

      await loginSuccessNavigation(needBind)
      emit('login:success')
    } else {
      emit('login:fail')
    }
  } catch (error) {
    console.error('page 组件', error)
    emit('login:fail')
  }
}

// H5 等其他环境的登录逻辑
async function otherEnvLogin() {
  try {
    isFirstLaunch.value = false

    // 在实际应用中，token 通常由请求拦截器自动处理
    // 这里直接尝试获取用户信息
    const result = await userStore.getUserInfo()
    if (result.code === 0) {
      emit('login:success')
    } else {
      emit('login:fail')
    }
  } catch (error) {
    console.error('H5 login error:', error)
    emit('login:fail')
  }
}

onMounted(async () => {
  if (isCurrentPage(TABBAR_HOME_PATH)) {
    isFirstLaunch.value = false

    await nextTick()
  }

  if (isMpWeixin) {
    // 不需要绑定，有手机号，
    if (unref(needBind) || !unref(phone) || !unref(token) || unref(isFirstLaunch)) {
      await mpWeixinLogin()
    } else {
      emit('login:success')
    }
  } else {
    otherEnvLogin()
  }
})
</script>

<template>
  <view relative z-1 h-screen flex="~ col" bg-gray-50 pb-safe>
    <!-- 导航 -->
    <Navigation v-if="show" :title="title" :show-back="showBack">
      <template #right>
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

    <!-- 页面加载完毕且没有错误 -->
    <template v-if="!loading && !error">
      <scroll-view
        v-if="!loading"
        enable-flex
        flex="~ 1 col"
        :class="{ 'bottom-line-exclude': showTabbar }"
        :scroll-y="scrollY"
        @scroll="handleScroll"
      >
        <slot />
      </scroll-view>
    </template>
    <!-- 错误区域 -->
    <view
      v-else-if="!loading && error"
      flex="~ 1"
      overflow-hidden
      :class="{ 'bottom-line-exclude': showTabbar }"
    >
      <view flex="~ 1 items-center justify-center">
        <wd-status-tip image="network" :tip="error" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
