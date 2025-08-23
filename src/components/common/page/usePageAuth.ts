import type { Ref } from 'vue'
import { nextTick, onMounted, unref } from 'vue'
import { storeToRefs } from 'pinia'

import { ROLE_TYPE } from '@/constant/modules/user'
import { PARENT_STUDENT_BIND_PATH, TABBAR_HOME_PATH, WELCOME_PATH } from '@/constant/router'
import { useUserStore } from '@/store/user'
import { useParentStore } from '@/store/parent'
import { currRoute } from '@/utils'
import { isMpWeixin } from '@/utils/platform'

type Emits = (event: 'login:success' | 'login:fail') => void

/**
 * @description 页面认证和初始化 hook
 * @param isFirstLaunch 是否首次启动
 * @param emit defineEmits 的返回值
 */
export function usePageAuth(isFirstLaunch: Ref<boolean>, emit: Emits) {
  const userStore = useUserStore()
  const parentStore = useParentStore()
  const { token, phone, role, userInfo, needBind } = storeToRefs(userStore)
  const { students } = storeToRefs(parentStore)

  /**
   * @description 判断当前页面是否是指定页面
   * @param pagePath 页面路径
   */
  function isCurrentPage(pagePath: string) {
    const { path } = currRoute()
    return path.includes(pagePath)
  }

  /**
   * @description 初始化用户信息、家长学生信息
   */
  async function initInfo() {
    // 没有用户信息、或者是首次启动，则获取用户信息
    if (unref(token) && (!unref(userInfo) || unref(isFirstLaunch))) {
      await userStore.getUserInfo()
    }
    // 获取家长下的学生列表
    if (
      unref(token)
      && unref(role) === ROLE_TYPE.PARENT
      && (!unref(students).length || unref(isFirstLaunch))
    ) {
      await parentStore.axiosGetStudentListByParentApi()
    }
  }

  /**
   * @description 登录成功后的导航逻辑
   * @param needBindValue 是否需要绑定
   */
  async function loginSuccessNavigation(needBindValue: boolean) {
    const _role = unref(role)

    // 用户没有身份，优先跳转身份选择页面
    if (!_role && !isCurrentPage(WELCOME_PATH)) {
      uni.navigateTo({ url: WELCOME_PATH })
      return
    }

    // 是家长，但是没有绑定学生，且当前页面不是绑定页面，则直接跳转到绑定页面
    if (_role === ROLE_TYPE.PARENT && needBindValue && !isCurrentPage(PARENT_STUDENT_BIND_PATH)) {
      uni.navigateTo({ url: PARENT_STUDENT_BIND_PATH })
      return
    }

    // 如果不需要绑定，且当前不在首页，则跳转到首页
    if (!needBindValue && !isCurrentPage(TABBAR_HOME_PATH)) {
      uni.navigateTo({ url: `${TABBAR_HOME_PATH}?role=${_role}` })
    }
  }

  /**
   * @description 微信小程序登录
   */
  async function mpWeixinLogin() {
    try {
      const wxResult = await userStore.wxLogin()

      if (wxResult.code === 0) {
        const { token: resultToken, needBind: resultNeedBind } = wxResult.data
        // 有 token 说明之前绑定过
        if (resultToken) {
          userStore.setToken(resultToken)
        }
        userStore.setNeedBind(resultNeedBind)

        await initInfo()

        await loginSuccessNavigation(resultNeedBind)
        emit('login:success')
      }
      else {
        emit('login:fail')
      }
    }
    catch (error) {
      console.error('usePageAuth: 微信登录失败', error)
      emit('login:fail')
    }
  }

  /**
   * @description H5 等其他环境的登录逻辑
   */
  async function otherEnvLogin() {
    try {
      isFirstLaunch.value = false

      // 在实际应用中，token 通常由请求拦截器自动处理
      // 这里直接尝试获取用户信息
      const result = await userStore.getUserInfo()
      if (result.code === 0) {
        emit('login:success')
      }
      else {
        emit('login:fail')
      }
    }
    catch (error) {
      console.error('usePageAuth: H5 登录失败', error)
      emit('login:fail')
    }
  }

  onMounted(async () => {
    if (isCurrentPage(TABBAR_HOME_PATH)) {
      isFirstLaunch.value = false

      await nextTick()
    }

    if (isMpWeixin) {
      // 需要绑定、没有手机号、没有 token、首次启动，则重新登录
      if (unref(needBind) || !unref(phone) || !unref(token) || unref(isFirstLaunch)) {
        await mpWeixinLogin()
      }
      else {
        emit('login:success')
      }
    }
    else {
      await otherEnvLogin()
    }
  })
}
