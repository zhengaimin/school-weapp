// 消费记录数据类型
export interface ConsumptionRecord {
  id: string
  type: string
  amount: string
  studentName: string
  description: string
  time: string
  isPositive: boolean // true为充值，false为消费
}

// 统计数据类型
export interface StatisticsData {
  todayConsumption: string
  monthlyConsumption: string
  totalConsumption: string
}

// 筛选条件类型
export interface FilterParams {
  child: string
  time: string
  page?: number
  pageSize?: number
}

// 模拟消费记录数据
export const mockConsumptionRecords: ConsumptionRecord[] = [
  {
    id: '1',
    type: '吹风机使用',
    amount: '2.50',
    studentName: '张小明',
    description: '使用时长 5分钟',
    time: '今天 12:30',
    isPositive: false,
  },
  {
    id: '2',
    type: '话机通话',
    amount: '1.20',
    studentName: '张小红',
    description: '通话时长 3分钟',
    time: '今天 10:15',
    isPositive: false,
  },
  {
    id: '3',
    type: '洗衣机使用',
    amount: '3.00',
    studentName: '张小明',
    description: '使用时长 30分钟',
    time: '昨天 15:20',
    isPositive: false,
  },
  {
    id: '4',
    type: '热水器使用',
    amount: '1.50',
    studentName: '张小红',
    description: '使用时长 10分钟',
    time: '昨天 14:10',
    isPositive: false,
  },
  {
    id: '5',
    type: '饮水机使用',
    amount: '0.50',
    studentName: '张小明',
    description: '使用时长 2分钟',
    time: '昨天 08:30',
    isPositive: false,
  },
  {
    id: '6',
    type: '账户充值',
    amount: '100.00',
    studentName: '张小明账户',
    description: '微信支付',
    time: '2天前 09:30',
    isPositive: true,
  },
  {
    id: '7',
    type: '洗衣机使用',
    amount: '3.00',
    studentName: '张小红',
    description: '使用时长 25分钟',
    time: '3天前 16:45',
    isPositive: false,
  },
  {
    id: '8',
    type: '话机通话',
    amount: '2.40',
    studentName: '张小明',
    description: '通话时长 6分钟',
    time: '3天前 14:20',
    isPositive: false,
  },
  {
    id: '9',
    type: '吹风机使用',
    amount: '1.50',
    studentName: '张小红',
    description: '使用时长 3分钟',
    time: '4天前 19:10',
    isPositive: false,
  },
  {
    id: '10',
    type: '账户充值',
    amount: '50.00',
    studentName: '张小红账户',
    description: '支付宝支付',
    time: '5天前 11:30',
    isPositive: true,
  },
]

// 模拟统计数据
export const mockStatistics: StatisticsData = {
  todayConsumption: '¥45.50',
  monthlyConsumption: '¥156.30',
  totalConsumption: '¥1,234.50',
}

// 模拟API：获取消费记录列表
export async function getConsumptionRecords(params: FilterParams): Promise<{
  list: ConsumptionRecord[]
  total: number
}> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  let filteredRecords = [...mockConsumptionRecords]

  // 根据孩子筛选
  if (params.child && params.child !== 'all') {
    const childName = params.child === 'child1' ? '张小明' : '张小红'
    filteredRecords = filteredRecords.filter(record =>
      record.studentName.includes(childName),
    )
  }

  // 根据时间筛选（这里简化处理，实际应该根据真实时间筛选）
  if (params.time && params.time !== 'all') {
    switch (params.time) {
      case 'today':
        filteredRecords = filteredRecords.filter(record =>
          record.time.includes('今天'),
        )
        break
      case 'week':
        filteredRecords = filteredRecords.filter(record =>
          record.time.includes('今天') || record.time.includes('昨天'),
        )
        break
      case 'month':
        // 本月数据，这里返回所有数据作为示例
        break
    }
  }

  // 分页处理
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

  return {
    list: paginatedRecords,
    total: filteredRecords.length,
  }
}

// 模拟API：获取统计数据
export async function getStatistics(params: FilterParams): Promise<StatisticsData> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 这里可以根据筛选条件返回不同的统计数据
  // 简化处理，直接返回模拟数据
  return { ...mockStatistics }
}

// 格式化金额显示
export function formatAmount(amount: string, isPositive: boolean): string {
  const prefix = isPositive ? '+' : '-'
  return `${prefix}¥${amount}`
}

// 格式化时间显示
export function formatTime(timeStr: string): string {
  // 这里可以添加更复杂的时间格式化逻辑
  return timeStr
}

// 获取消费类型的图标
export function getConsumptionIcon(type: string): string {
  const iconMap: Record<string, string> = {
    吹风机使用: 'wind-line',
    话机通话: 'phone-line',
    洗衣机使用: 'shirt-line',
    热水器使用: 'fire-line',
    饮水机使用: 'drop-line',
    账户充值: 'wallet-line',
  }

  return iconMap[type] || 'money-dollar-circle-line'
}
