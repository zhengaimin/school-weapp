/**
 * 首页数据配置
 */
import type { IMenuItem } from '@/constant/modules/menu'
import { MENU_LIST } from '@/constant/modules/menu'

// 孩子信息接口
export interface ChildInfo {
  id: string
  name: string
  school: string
  balance: string
  todayConsumption: string
  monthlyConsumption: string
  lastRecharge: string
  totalBalance: number
  totalConsumption: number
  totalRecharge: number
  faceCollectionStatus: 'success' | 'failed' | 'pending'
  faceCollectionMessage: string
}

// 用户信息接口
export interface UserInfo {
  name: string
  greeting: string
}

// 统计数据接口
export interface StatsData {
  currentBalance: number
  monthlyConsumption: number
  totalRecharge: number
}

// 孩子数据
export const childrenData: Record<string, ChildInfo> = {
  xiaoming: {
    id: 'xiaoming',
    name: '张小明',
    school: '实验小学 · 三年级二班',
    balance: '¥85.30',
    todayConsumption: '¥8.50',
    monthlyConsumption: '¥45.50',
    lastRecharge: '3天前',
    totalBalance: 85.30,
    totalConsumption: 45.50,
    totalRecharge: 130.80,
    faceCollectionStatus: 'failed',
    faceCollectionMessage: '人脸采集未通过',
  },
  xiaohong: {
    id: 'xiaohong',
    name: '张小红',
    school: '育才小学 · 一年级一班',
    balance: '¥43.20',
    todayConsumption: '¥6.00',
    monthlyConsumption: '¥26.00',
    lastRecharge: '1周前',
    totalBalance: 43.20,
    totalConsumption: 26.00,
    totalRecharge: 69.20,
    faceCollectionStatus: 'success',
    faceCollectionMessage: '人脸采集已完成',
  },
}

// 用户信息
export const userInfo: UserInfo = {
  name: '张女士',
  greeting: '晚上好',
}

// 功能按钮配置
export const functionButtons: IMenuItem[] = MENU_LIST

// 默认选中的孩子
export const defaultChildId = 'xiaoming'

// 获取问候语
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6)
    return '凌晨好'
  if (hour < 9)
    return '早上好'
  if (hour < 12)
    return '上午好'
  if (hour < 14)
    return '中午好'
  if (hour < 18)
    return '下午好'
  if (hour < 22)
    return '晚上好'
  return '夜深了'
}

// 获取孩子列表
export function getChildrenList(): ChildInfo[] {
  return Object.values(childrenData)
}

// 根据ID获取孩子信息
export function getChildById(id: string): ChildInfo | undefined {
  return childrenData[id]
}

// 获取当前用户信息
export function getCurrentUserInfo(): UserInfo {
  return {
    ...userInfo,
    greeting: getGreeting(),
  }
}
