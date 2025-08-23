// 充值记录相关数据类型和模拟数据

// 充值记录状态类型
export type RechargeStatus = 'success' | 'failed' | 'pending' | 'cancelled'

// 时间筛选类型
export type TimeFilterType = 'all' | 'week' | 'month' | 'quarter'

// 充值记录接口
export interface RechargeRecord {
  id: string
  studentName: string
  amount: number
  time: string
  status: RechargeStatus
  paymentMethod: string
  orderNo: string
  packageName: string // 套餐名称
  rechargeSource: string // 充值来源
}

// 状态配置接口
export interface StatusConfig {
  label: string
  class: string
  icon: string
  iconColor: string
  bgColor: string
}

// 筛选选项接口
export interface FilterOption {
  label: string
  value: string | number
}

// 状态配置映射
export const statusConfigs: Record<RechargeStatus, StatusConfig> = {
  success: {
    label: '成功',
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  failed: {
    label: '失败',
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  pending: {
    label: '处理中',
    class: 'label-warning',
    icon: 'time-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
  cancelled: {
    label: '已取消',
    class: 'label-cancel',
    icon: 'stop-circle-line',
    iconColor: '#6b7280',
    bgColor: '#f3f4f6',
  },
}

// 时间筛选选项
export const timeFilterOptions: FilterOption[] = [
  { value: 'all', label: '全部' },
  { value: 'week', label: '最近一周' },
  { value: 'month', label: '最近一月' },
  { value: 'quarter', label: '最近三月' },
]

// 状态筛选选项
export const statusFilterOptions: FilterOption[] = [
  { value: 'all', label: '全部状态' },
  { value: 'success', label: '成功' },
  { value: 'failed', label: '失败' },
  { value: 'pending', label: '处理中' },
  { value: 'cancelled', label: '已取消' },
]

// 模拟充值记录数据
export const rechargeRecordsData: RechargeRecord[] = [
  {
    id: '1',
    studentName: '张小明',
    amount: 100.00,
    time: '2024-01-15 14:30:25',
    status: 'success',
    paymentMethod: '微信支付',
    orderNo: 'RC202401151430001',
    packageName: '基础套餐',
    rechargeSource: '爸爸',
  },
  {
    id: '2',
    studentName: '张小明',
    amount: 50.00,
    time: '2024-01-10 09:15:42',
    status: 'failed',
    paymentMethod: '支付宝',
    orderNo: 'RC202401100915002',
    packageName: '体验套餐',
    rechargeSource: '妈妈',
  },
  {
    id: '3',
    studentName: '张小明',
    amount: 200.00,
    time: '2024-01-05 16:22:18',
    status: 'success',
    paymentMethod: '微信支付',
    orderNo: 'RC202401051622003',
    packageName: '高级套餐',
    rechargeSource: '爷爷',
  },
  {
    id: '4',
    studentName: '张小明',
    amount: 30.00,
    time: '2023-12-28 11:45:33',
    status: 'pending',
    paymentMethod: '银行卡',
    orderNo: 'RC202312281145004',
    packageName: '新手套餐',
    rechargeSource: '奶奶',
  },
  {
    id: '5',
    studentName: '张小明',
    amount: 150.00,
    time: '2023-12-20 13:20:15',
    status: 'success',
    paymentMethod: '微信支付',
    orderNo: 'RC202312201320005',
    packageName: '进阶套餐',
    rechargeSource: '外公',
  },
  {
    id: '6',
    studentName: '张小明',
    amount: 80.00,
    time: '2023-12-15 10:30:22',
    status: 'cancelled',
    paymentMethod: '支付宝',
    orderNo: 'RC202312151030006',
    packageName: '普通套餐',
    rechargeSource: '外婆',
  },
]

// 获取状态配置
export function getStatusConfig(status: RechargeStatus): StatusConfig {
  return statusConfigs[status] || statusConfigs.cancelled
}

// 获取时间筛选选项
export function getTimeFilterOptions(): FilterOption[] {
  return [...timeFilterOptions]
}

// 获取状态筛选选项
export function getStatusFilterOptions(): FilterOption[] {
  return [...statusFilterOptions]
}

// 获取充值记录列表
export function getRechargeRecords(studentId?: string): RechargeRecord[] {
  // 这里可以根据 studentId 筛选数据
  return [...rechargeRecordsData]
}

// 筛选充值记录
export function filterRechargeRecords(
  records: RechargeRecord[],
  timeFilter: TimeFilterType,
  statusFilter: string,
): RechargeRecord[] {
  let filteredRecords = [...records]
  const now = new Date()

  // 时间筛选
  if (timeFilter !== 'all') {
    filteredRecords = filteredRecords.filter((record) => {
      const recordDate = new Date(record.time)
      const diffTime = now.getTime() - recordDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (timeFilter) {
        case 'week':
          return diffDays <= 7
        case 'month':
          return diffDays <= 30
        case 'quarter':
          return diffDays <= 90
        default:
          return true
      }
    })
  }

  // 状态筛选
  if (statusFilter !== 'all') {
    filteredRecords = filteredRecords.filter((record) => {
      return record.status === statusFilter
    })
  }

  return filteredRecords
}

// 获取充值记录详情
export function getRechargeRecordDetail(recordId: string): RechargeRecord | null {
  return rechargeRecordsData.find(record => record.id === recordId) || null
}
