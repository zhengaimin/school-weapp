// 充值成功页面相关数据类型和模拟数据
import {
  RECHARGE_BALANCE_HISTORY_PATH,
  FINANCE_BALANCE_PATH,
  TABBAR_HOME_PATH
} from '@/constant/router'

// 充值结果信息接口
export interface RechargeResultInfo {
  studentName: string
  amount: number
  time: string
  paymentMethod: string
  status: string
  orderId: string
}

// 操作按钮接口
export interface ActionButton {
  id: string
  title: string
  icon: string
  type: 'primary' | 'default'
  path: string
}

// 操作按钮列表
export const actionButtons: ActionButton[] = [
  {
    id: 'home',
    title: '返回首页',
    icon: 'home-line',
    type: 'primary',
    path: TABBAR_HOME_PATH
  },
  {
    id: 'balance',
    title: '查看余额',
    icon: 'wallet-3-line',
    type: 'default',
    path: FINANCE_BALANCE_PATH
  },
  {
    id: 'history',
    title: '查看充值记录',
    icon: 'history-line',
    type: 'default',
    path: RECHARGE_BALANCE_HISTORY_PATH
  }
]

// 获取充值结果信息
export function getRechargeResultInfo(params: {
  amount?: string
  studentName?: string
  orderId?: string
}): RechargeResultInfo {
  return {
    studentName: params.studentName || '张小明',
    amount: Number(params.amount) || 100.0,
    time: new Date().toLocaleString('zh-CN'),
    paymentMethod: '微信支付',
    status: '成功',
    orderId: params.orderId || `RCH${Date.now()}`
  }
}

// 获取操作按钮列表
export function getActionButtons(): ActionButton[] {
  return [...actionButtons]
}

// 格式化金额显示
export function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

// 格式化时间显示
export function formatTime(time: string): string {
  return time
}
