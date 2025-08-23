import type { Common } from '@/api/interface/modules/user'
import dayjs from 'dayjs'

import { postRefreshTokenApi } from '@/api/modules/user/common'

import { useUserStore } from '@/store'

/**
 * Token管理器
 * 处理token过期检查和自动刷新，支持多个接口同时请求时的并发控制
 */
class TokenManager {
  private refreshPromise: Promise<boolean> | null = null
  private readonly REFRESH_THRESHOLD = 60 // 提前60秒刷新token
  private isRefreshing = false // 标记是否正在刷新token
  private pendingRequests: Array<{
    resolve: (value: boolean) => void
    reject: (reason?: any) => void
  }> = [] // 等待token刷新完成的请求队列

  /**
   * 检查token是否即将过期或已过期
   * @param token token信息
   * @returns 是否需要刷新
   */
  private isTokenExpiring(token: Common.ResWxLoginApi | null): boolean {
    if (!token?.expires_in) {
      return true
    }

    const currentTime = dayjs().unix()
    const expiresIn = token.expires_in
    const timeUntilExpiry = expiresIn - currentTime

    // 如果token已过期或即将在60秒内过期，则需要刷新
    const needsRefresh = timeUntilExpiry <= this.REFRESH_THRESHOLD

    return needsRefresh
  }

  /**
   * 检查refresh token是否过期
   * @param token token信息
   * @returns refresh token是否过期
   */
  private isRefreshTokenExpired(token: Common.ResWxLoginApi | null): boolean {
    if (!token?.r_expires_in) {
      return true
    }

    const currentTime = dayjs().unix()
    const isExpired = token.r_expires_in <= currentTime

    return isExpired
  }

  /**
   * 刷新token
   * @returns 刷新是否成功
   */
  private async refreshToken(): Promise<boolean> {
    const userStore = useUserStore()
    const currentToken = userStore.token

    if (!currentToken?.r_token) {
      this.handleRefreshFailure('没有refresh token')
      return false
    }

    // 检查refresh token是否过期
    if (this.isRefreshTokenExpired(currentToken)) {
      this.handleRefreshFailure('refresh token已过期')
      userStore.logout()
      // 跳转到登录页
      uni.reLaunch({ url: '/pages/common/login/index' })
      return false
    }

    try {
      const response = await postRefreshTokenApi({ refresh_token: currentToken.r_token })

      if (response.code === 0) {
        // 更新token
        userStore.setToken(response.data)
        this.handleRefreshSuccess()
        return true
      }
      else {
        this.handleRefreshFailure(response.msg || 'Token刷新失败')
        return false
      }
    }
    catch (error) {
      this.handleRefreshFailure('Token刷新请求失败')
      return false
    }
  }

  /**
   * 处理刷新成功的情况
   */
  private handleRefreshSuccess(): void {
    this.isRefreshing = false
    // 通知所有等待的请求刷新成功
    this.pendingRequests.forEach(({ resolve }) => resolve(true))
    this.pendingRequests = []
  }

  /**
   * 处理刷新失败的情况
   */
  private handleRefreshFailure(reason: string): void {
    this.isRefreshing = false
    // 通知所有等待的请求刷新失败
    this.pendingRequests.forEach(({ reject }) => reject(new Error(`Token刷新失败: ${reason}`)))
    this.pendingRequests = []
  }

  /**
   * 确保token有效
   * 如果token即将过期，会自动刷新
   * 支持多个接口同时请求时的并发控制
   * @returns 是否有有效的token
   */
  async ensureValidToken(): Promise<boolean> {
    const userStore = useUserStore()
    const currentToken = userStore.token

    // 如果token不需要刷新，直接返回true
    if (!this.isTokenExpiring(currentToken)) {
      return true
    }

    // 如果已经有刷新请求在进行中，将当前请求加入等待队列
    if (this.isRefreshing) {
      return new Promise<boolean>((resolve, reject) => {
        this.pendingRequests.push({ resolve, reject })
      })
    }

    // 如果已经有刷新Promise在进行中，等待其完成
    if (this.refreshPromise) {
      return await this.refreshPromise
    }

    // 标记正在刷新
    this.isRefreshing = true

    // 开始刷新token
    this.refreshPromise = this.refreshToken()

    try {
      const result = await this.refreshPromise
      return result
    }
    catch (error) {
      this.handleRefreshFailure(error instanceof Error ? error.message : '未知错误')
      return false
    }
    finally {
      // 清除刷新Promise，允许下次刷新
      this.refreshPromise = null
    }
  }

  /**
   * 清除刷新状态（用于登出时）
   */
  clearRefreshState(): void {
    this.refreshPromise = null
    this.isRefreshing = false
    // 清除所有等待的请求
    this.pendingRequests.forEach(({ reject }) =>
      reject(new Error('用户已登出，取消token刷新')),
    )
    this.pendingRequests = []
  }

  /**
   * 获取当前token状态信息（用于调试）
   */
  getTokenStatus(): {
    hasToken: boolean
    isExpiring: boolean
    isRefreshTokenExpired: boolean
    isRefreshing: boolean
    pendingRequestsCount: number
  } {
    const userStore = useUserStore()
    const currentToken = userStore.token

    return {
      hasToken: !!currentToken?.token,
      isExpiring: this.isTokenExpiring(currentToken),
      isRefreshTokenExpired: this.isRefreshTokenExpired(currentToken),
      isRefreshing: this.isRefreshing,
      pendingRequestsCount: this.pendingRequests.length,
    }
  }
}

// 导出单例实例
export const tokenManager = new TokenManager()
