// 余额查询相关数据类型和模拟数据

// 学生余额信息接口
export interface StudentBalanceInfo {
  id: string
  name: string
  school: string
  grade: string
  studentId: string
  balance: string
  balanceAmount: number
  accountStatus: string
  openDate: string
  monthlyConsumptionCount: number
  monthlyConsumptionAmount: string
  lastRechargeDate: string
  lastUpdateTime: string
}

// 余额统计信息接口
export interface BalanceStatistics {
  monthlyConsumptionCount: number
  monthlyConsumptionAmount: string
  lastRechargeDate: string
}

// 模拟学生余额数据
export const studentBalanceData: StudentBalanceInfo = {
  id: 'xiaoming',
  name: '张小明',
  school: '实验小学',
  grade: '三年级二班',
  studentId: '2021001',
  balance: '¥85.30',
  balanceAmount: 85.30,
  accountStatus: '正常使用',
  openDate: '2023年9月1日',
  monthlyConsumptionCount: 12,
  monthlyConsumptionAmount: '¥24.70',
  lastRechargeDate: '3天前',
  lastUpdateTime: '刚刚',
}

// 获取学生余额信息
export function getStudentBalanceInfo(studentId?: string): StudentBalanceInfo {
  // 这里可以根据 studentId 获取不同学生的数据
  // 目前返回模拟数据
  return studentBalanceData
}

// 刷新余额信息
export function refreshBalanceInfo(): Promise<StudentBalanceInfo> {
  return new Promise((resolve) => {
    // 模拟API调用
    setTimeout(() => {
      resolve(studentBalanceData)
    }, 1000)
  })
}
