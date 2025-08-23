// 充值相关数据类型和模拟数据

// 充值账户信息接口
export interface RechargeAccountInfo {
  id: string
  name: string
  school: string
  grade: string
  currentBalance: string
  currentBalanceAmount: number
}

// 充值金额选项接口
export interface RechargeAmountOption {
  value: number
  label: string
  selected: boolean
}

// 充值信息接口
export interface RechargeInfo {
  studentName: string
  amount: number
  time: string
  orderId?: string
}

// 预设充值金额选项
export const rechargeAmountOptions: RechargeAmountOption[] = [
  { value: 50, label: '¥50', selected: false },
  { value: 100, label: '¥100', selected: false },
  { value: 200, label: '¥200', selected: false },
  { value: 300, label: '¥300', selected: false },
  { value: 500, label: '¥500', selected: false },
  { value: 1000, label: '¥1000', selected: false },
]

// 模拟充值账户数据
export const rechargeAccountData: RechargeAccountInfo = {
  id: 'xiaoming',
  name: '张小明',
  school: '实验小学',
  grade: '三年级二班',
  currentBalance: '¥85.30',
  currentBalanceAmount: 85.30,
}

// 获取充值账户信息
export function getRechargeAccountInfo(studentId?: string): RechargeAccountInfo {
  // 这里可以根据 studentId 获取不同学生的数据
  // 目前返回模拟数据
  return rechargeAccountData
}

// 获取充值金额选项
export function getRechargeAmountOptions(): RechargeAmountOption[] {
  return [...rechargeAmountOptions]
}

// 提交充值申请
export function submitRechargeRequest(studentId: string, amount: number): Promise<RechargeInfo> {
  return new Promise((resolve) => {
    // 模拟API调用
    setTimeout(() => {
      const rechargeInfo: RechargeInfo = {
        studentName: rechargeAccountData.name,
        amount,
        time: new Date().toLocaleString('zh-CN'),
        orderId: `RCH${Date.now()}`,
      }
      resolve(rechargeInfo)
    }, 1000)
  })
}

// 调用微信支付
export function callWechatPay(amount: number): Promise<boolean> {
  return new Promise((resolve) => {
    // 模拟微信支付调用
    setTimeout(() => {
      // 模拟支付成功
      resolve(true)
    }, 2000)
  })
}
