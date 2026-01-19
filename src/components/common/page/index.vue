<script lang="ts" setup>
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref, unref } from 'vue'
import { array, bool, string } from 'vue-types'
import DefaultBg from '@/components/common/default-bg/index.vue'
import Loading from '@/components/common/loading/index.vue'
import Navigation from '@/components/common/navigation/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import { DEVICE_TYPE_I18N, ROLE_TYPE } from '@/constant/modules'
import { LAUNCH_PATH, STUDENT_BIND_PATH, TABBAR_HOME_PATH, WELCOME_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
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

/** 是否首次启动 */
const isFirstLaunch = inject<Ref<boolean>>('isFirstLaunch', ref(true))

/** 页面加载状态 */
const loading = defineModel<boolean>('loading', { default: false })
/** 页面显示状态 */
const show = defineModel<boolean>('show', { default: true })

const userStore = useUserStore()
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { axiosGetUserBalanceApi } = useBalance()
const { token, phone, role, userInfo } = storeToRefs(userStore)
const { students, needBind } = storeToRefs(parentStore)
const { deviceType } = storeToRefs(currentStudentStore)

/** 是否需要登录 */
const needsLogin = computed(() => {
  return unref(needBind) || !unref(phone) || !unref(token) || unref(isFirstLaunch)
})

/** 显示的标题（包含设备类型） */
const displayTitle = computed(() => {
  if (!props.title) return ''

  if (deviceType.value) {
    const deviceName = DEVICE_TYPE_I18N[deviceType.value]
    if (deviceName) {
      return `${props.title} · ${deviceName}`
    }
  }
  return props.title
})

/** 判断是否为当前页面 */
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

/** 处理滚动事件 */
function handleScroll(e) {
  emit('scroll', e)
}

/** 初始化用户信息和学生列表 */
async function initInfo() {
  // 没有 token，直接返回
  if (!unref(token)) return

  // 没有用户信息、或者是首次启动，则获取用户信息
  if (!unref(userInfo) || unref(isFirstLaunch)) await userStore.getUserInfo()

  // 获取家长下的学生列表
  const isParent = unref(role) === ROLE_TYPE.PARENT
  const noStudents = !unref(students).length
  if (isParent && (noStudents || unref(isFirstLaunch))) await parentStore.axiosGetStudentListApi()
}

/** 处理登录成功后的导航逻辑 */
async function loginSuccessNavigation(_needBind: boolean) {
  const _role = unref(role)

  // 用户没有身份，优先跳转身份选择页面
  const shouldGoToWelcome = !_role && !isCurrentPage(WELCOME_PATH)
  if (shouldGoToWelcome) {
    setTimeout(() => {
      uni.redirectTo({ url: WELCOME_PATH })
    }, 500)
    return
  }

  // 是家长，但是没有绑定学生，且当前页面不是绑定页面，则直接跳转到绑定页面
  const shouldGoToBind
    = _role === ROLE_TYPE.PARENT && _needBind && !isCurrentPage(STUDENT_BIND_PATH)
  if (shouldGoToBind) {
    setTimeout(() => {
      uni.navigateTo({ url: STUDENT_BIND_PATH })
    }, 500)
    return
  }

  // 检查路由栈第一个页面是否为启动页
  const pages = getCurrentPages()
  const isFromLaunchPage = pages.length > 0 && `/${pages[0].route}` === LAUNCH_PATH

  const shouldGoToHome = !_needBind && !isCurrentPage(TABBAR_HOME_PATH) && isFromLaunchPage
  if (shouldGoToHome) {
    setTimeout(() => {
      uni.redirectTo({ url: `${TABBAR_HOME_PATH}?role=${_role}` })
    }, 500)
  }
}

/** 微信小程序登录逻辑 */
async function mpWeixinLogin() {
  try {
    const wxResult = await userStore.wxLogin()

    if (wxResult.code === 0) {
      const { token, needBind: _needBind } = wxResult.data
      // 有 token 说明之前绑定过
      token && userStore.setToken(token)
      parentStore.setNeedBind(_needBind)

      await initInfo()

      await loginSuccessNavigation(_needBind)
      emit('login:success')
    }
    else {
      emit('login:fail')
    }

    return null
  }
  catch (error) {
    console.error('page 组件', error)
    emit('login:fail')
  }
}

/** H5 等其他环境的登录逻辑 */
async function otherEnvLogin() {
  try {
    parentStore.setNeedBind(false)
    userStore.setRole(ROLE_TYPE.PARENT)
    userStore.setPhone('15972227364')
    userStore.setToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWNoYXRBY2NvdW50SWQiOjE1LCJjdXJyZW50VXNlcklkIjo0NCwidXNlcm5hbWUiOiJ3ZWNoYXRfdXNlcl8xNSIsImlkZW50aXRpZXMiOnsiNDQiOnsidXNlcklkIjozOSwicm9sZUlkIjo0LCJyb2xlQ29kZSI6InBhcmVudCIsInRlbmFudElkIjoyLCJ0ZW5hbnRDb2RlIjoidGVzdF90ZW5hbnRfMDAxIiwic2Nob29sSWQiOjEsInNjaG9vbENvZGUiOiJTQ0hPT0xfM18xNzU1NjE1NjYwIiwidXNlclR5cGUiOiJwYXJlbnQifX0sInVzZXJUeXBlIjoiVVNFUiIsImV4cCI6MTc2ODYxNTU3OCwibmJmIjoxNzY4NTI5MTc4LCJpYXQiOjE3Njg1MjkxNzh9.QPR6T9T40ECDy5GH8yTmbJds2e0StalS12AvnroDE34',
    )

    if (unref(isFirstLaunch)) {
      isFirstLaunch.value = false
      await userStore.getUserInfo()
      await parentStore.axiosGetStudentListApi()
    }

    emit('login:success')
  }
  catch (error) {
    console.error('H5 login error:', error)
    emit('login:fail')
  }
}

onMounted(async () => {
  try {
    if (isCurrentPage(TABBAR_HOME_PATH) && isMpWeixin) {
      isFirstLaunch.value = false

      await nextTick()
    }

    !isFirstLaunch.value && unref(token) && (await axiosGetUserBalanceApi())
    if (!isMpWeixin) {
      otherEnvLogin()
    }
    else if (isMpWeixin && needsLogin.value) {
      await mpWeixinLogin()
    }
    else {
      emit('login:success')
    }
  }
  catch (error) {
    console.error('page 组件', error)
  }
})
</script>

<template>
  <view class="t-page" flex="~ col" relative z-1 box-border h-screen bg-gray-50 pb-safe>
    <!-- 导航 -->
    <Navigation
      v-if="show && navbar"
      :title="displayTitle"
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
