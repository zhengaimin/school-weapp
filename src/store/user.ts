import type { ResultData } from '@/api/interface/index'
import type { User } from '@/api/interface/modules/user'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getUserInfoApi, getWxCode, postWxLoginApi } from '@/api/modules/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string | null>(null)
    const role = ref<number | null>(null)

    // 定义用户信息
    const userInfo = ref<User.Common.IUserInfoVo>(null)
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

    const currentStudent = computed(() => {
      const { roleInfo, schoolName, schoolId } = unref(userInfo) || {}

      if (!roleInfo)
        return null

      const student = {
        ...((roleInfo as User.Common.IParentRoleInfoVo)?.currentChild || {}),
        schoolName,
        schoolId,
      }

      const list = []

      if (student.schoolName) {
        list.push(student.schoolName)
      }
      if (student.departmentName) {
        list.push(student.departmentName)
      }
      if (student.grade) {
        list.push(student.grade)
      }
      if (student.className) {
        list.push(student.className)
      }

      return {
        ...student,
        fullClassName: list.join(' · '),
      }
    })

    /**
     * 获取用户信息
     */
    const getUserInfo = async () => {
      const res: any = await getUserInfoApi()

      if (res.code !== 0) {
        return { code: -1, msg: res.msg || '获取用户信息失败' }
      }

      const data = res.data
      // 保存用户信息
      userInfo.value = data
      if (data.phone) {
        setPhone(data.phone)
      }

      return { code: 0, msg: '获取用户信息成功', data: res.data }
    }
    /**
     * 微信登录
     */
    const wxLogin = async (): Promise<ResultData<User.Common.ResWxLoginApi>> => {
      // 获取微信小程序登录的code
      const { code, errMsg } = await getWxCode()

      if (errMsg !== 'login:ok') {
        return { code: -1, msg: '获取微信登录凭证失败', data: null }
      }

      // 调用登录接口
      const result = await postWxLoginApi({ code })
      if (result.code === 0 && result.data.token) {
        setToken(result.data.token)
      }
      return result
    }
    const logout = () => {
      token.value = null
      userInfo.value = null
    }

    return {
      token,
      setToken,

      userInfo,
      setUserInfo,
      getUserInfo,
      currentStudent,

      role,
      setRole,

      wxLogin,

      phone,
      setPhone,

      logout,
    }
  },
  {
    persist: true,
  },
)
