import type { ResultData } from '@/api/interface/index'
import type { Common } from '@/api/interface/modules/user'

import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { computed, ref, unref } from 'vue'

import { getUserInfoApi, getWxCode, postWxLoginApi } from '@/api/modules/user'

import { tokenManager } from '@/http/tokenManager'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string | null>(null)
    const role = ref<number | null>(null)
    // 是否需要绑定学生
    const needBind = ref<boolean>(true)
    // 定义用户信息
    const userInfo = ref<Common.IUserInfoVo>(null)
    // 用户点击登录才会获取手机号
    const phone = ref<string>('')

    const setToken = (val: string | null) => {
      token.value = val
    }
    const setUserInfo = (vale: any) => {
      userInfo.value = vale
    }
    const setRole = (val: number | null) => {
      role.value = val
    }
    const setPhone = (val: string) => {
      phone.value = val
    }
    const setNeedBind = (val: boolean) => {
      needBind.value = val
    }

    /**
     * 获取用户信息
     */
    const getUserInfo = async () => {
      try {
        const res: any = await getUserInfoApi()

        if (res.code !== 0) {
          return { code: -1, msg: res.msg || '获取用户信息失败' }
        }

        // 保存用户信息
        userInfo.value = res.data
        return { code: 0, msg: '获取用户信息成功', data: res.data }
      }
      catch (error) {
        console.error('获取用户信息失败:', error)
        return { code: -1, msg: '获取用户信息时发生错误' }
      }
    }
    /**
     * 微信登录
     */
    const wxLogin = async (): Promise<ResultData<Common.ResWxLoginApi>> => {
      try {
        // 获取微信小程序登录的code
        const { code, errMsg } = await getWxCode()

        if (errMsg !== 'login:ok') {
          return { code: -1, msg: '获取微信登录凭证失败', data: null }
        }

        // 调用登录接口
        return await postWxLoginApi({ code })
      }
      catch (error) {
        console.error('登录过程中发生错误', error)
        return { code: -1, msg: '登录过程中发生错误', data: null }
      }
    }
    const logout = () => {
      token.value = null
      userInfo.value = null
      // 清除token管理器的刷新状态
      tokenManager.clearRefreshState()
    }

    /** token过期 */
    const tokenExpires = computed(() => {
      const { expires_in } = unref(token) || {}
      const unix = dayjs().unix()

      console.log(expires_in, unix, expires_in && expires_in <= unix)
      return expires_in ? expires_in <= unix : true
    })

    /** refresh token过期 */
    const refreshTokenExpires = computed(() => {
      const { r_expires_in } = unref(token) || {}
      const unix = dayjs().unix()

      return r_expires_in ? r_expires_in <= unix : true
    })

    /** 判断是否登录 -> token 没过期 & 用户点击了获取手机号 */
    const isLogin = computed(() => {
      return !unref(tokenExpires) && unref(phone)
    })

    return {
      token,
      setToken,
      tokenExpires,
      refreshTokenExpires,

      userInfo,
      setUserInfo,
      getUserInfo,

      role,
      setRole,

      wxLogin,
      isLogin,

      phone,
      setPhone,

      needBind,
      setNeedBind,

      logout,
    }
  },
  {
    persist: true,
  },
)
