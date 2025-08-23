// 孩子详情相关数据类型和模拟数据

// 孩子详细信息接口
export interface ChildDetailInfo {
  id: string
  name: string
  school: string
  grade: string
  class: string
  studentId: string
  gender: string
  uniqueId: string
  consumptionAccount: string
  physicalCardNumber: string
  avatar: string
  avatarBg: string
  avatarColor: string
}

// 功能菜单项接口
export interface FunctionMenuItem {
  id: string
  title: string
  icon: string
  iconColor: string
  iconBg: string
  path: string
}

// 消费记录项接口
export interface ConsumptionRecord {
  id: string
  title: string
  amount: string
  amountValue: number
  type: 'expense' | 'income'
  time: string
  location: string
}

// 模拟孩子详情数据
export const childDetailData: Record<string, ChildDetailInfo> = {
  xiaoming: {
    id: 'xiaoming',
    name: '张小明',
    school: '实验小学',
    grade: '三年级',
    class: '三年级二班',
    studentId: '2021001',
    gender: '男',
    uniqueId: 'ST202100001',
    consumptionAccount: 'CA202100001',
    physicalCardNumber: '1234567890123456',
    avatar: 'user-line',
    avatarBg: '#dbeafe',
    avatarColor: '#2563eb',
  },
  xiaohong: {
    id: 'xiaohong',
    name: '张小红',
    school: '育才小学',
    grade: '一年级',
    class: '一年级一班',
    studentId: '2022001',
    gender: '女',
    uniqueId: 'ST202200001',
    consumptionAccount: 'CA202200001',
    physicalCardNumber: '6543210987654321',
    avatar: 'user-line',
    avatarBg: '#fce7f3',
    avatarColor: '#ec4899',
  },
}

// 功能菜单列表
export const functionMenuList: FunctionMenuItem[] = [
  {
    id: 'recharge',
    title: '账户充值',
    icon: 'wallet-line',
    iconColor: '#10b981',
    iconBg: '#d1fae5',
    path: '/pages-sub/parent/student/recharge/index',
  },
  {
    id: 'balance',
    title: '余额查询',
    icon: 'money-dollar-circle-line',
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    path: '/pages-sub/parent/student/balance-query/index',
  },
  {
    id: 'refund',
    title: '申请退费',
    icon: 'refund-line',
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    path: '/pages-sub/parent/student/refund-apply/index',
  },
  {
    id: 'face',
    title: '人脸采集',
    icon: 'user-smile-line',
    iconColor: '#8b5cf6',
    iconBg: '#ede9fe',
    path: '/pages-sub/parent/student/face-collection/index',
  },
]

// 今日消费记录
export const todayConsumptionRecords: ConsumptionRecord[] = [
  {
    id: '1',
    title: '午餐费用',
    amount: '-¥12.50',
    amountValue: -12.5,
    type: 'expense',
    time: '今天 12:30',
    location: '学校食堂',
  },
  {
    id: '2',
    title: '早餐费用',
    amount: '-¥8.00',
    amountValue: -8.0,
    type: 'expense',
    time: '今天 08:15',
    location: '学校食堂',
  },
  {
    id: '3',
    title: '账户充值',
    amount: '+¥100.00',
    amountValue: 100.0,
    type: 'income',
    time: '昨天 19:30',
    location: '微信支付',
  },
]

// 获取孩子详情信息
export function getChildDetailInfo(childId: string): ChildDetailInfo | null {
  return childDetailData[childId] || null
}

// 获取功能菜单列表
export function getFunctionMenuList(): FunctionMenuItem[] {
  return [...functionMenuList]
}

// 获取今日消费记录
export function getTodayConsumptionRecords(): ConsumptionRecord[] {
  return [...todayConsumptionRecords]
}

// 编辑孩子信息
export function editChildInfo(childId: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 模拟编辑操作
    setTimeout(() => {
      console.log('编辑孩子信息:', childId)
      resolve(true)
    }, 500)
  })
}
