// 退款记录相关数据类型和模拟数据

// 退款记录状态类型
export type RefundStatus = 'success' | 'failed' | 'pending' | 'cancelled' | 'reviewing'

// 时间筛选类型
export type TimeFilterType = 'all' | 'week' | 'month' | 'quarter'

// 退款记录接口
export interface RefundRecord {
  id: string
  studentName: string
  amount: number
  time: string
  status: RefundStatus
  refundMethod: string
  orderNo: string
  reason: string
  applyTime: string
  processTime?: string
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
export const statusConfigs: Record<RefundStatus, StatusConfig> = {
  success: {
    label: '退款成功',
    class: 'label-success',
    icon: 'checkbox-circle-line',
    iconColor: '#10b981',
    bgColor: '#d1fae5',
  },
  failed: {
    label: '退款失败',
    class: 'label-error',
    icon: 'close-circle-line',
    iconColor: '#ef4444',
    bgColor: '#fee2e2',
  },
  pending: {
    label: '退款中',
    class: 'label-warning',
    icon: 'time-line',
    iconColor: '#f59e0b',
    bgColor: '#fef3c7',
  },
  reviewing: {
    label: '审核中',
    class: 'label-info',
    icon: 'search-line',
    iconColor: '#3b82f6',
    bgColor: '#dbeafe',
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
  { value: 'reviewing', label: '审核中' },
  { value: 'pending', label: '退款中' },
  { value: 'success', label: '退款成功' },
  { value: 'failed', label: '退款失败' },
  { value: 'cancelled', label: '已取消' },
]

// 模拟退款记录数据
export const refundRecordsData: RefundRecord[] = [
  {
    id: '1',
    studentName: '张小明',
    amount: 50.00,
    time: '2024-01-15 14:30:25',
    status: 'success',
    refundMethod: '原路退回',
    orderNo: 'RF202401151430001',
    reason: '账户余额过多',
    applyTime: '2024-01-14 10:20:15',
    processTime: '2024-01-15 14:30:25',
  },
  {
    id: '2',
    studentName: '张小明',
    amount: 100.00,
    time: '2024-01-12 16:45:30',
    status: 'reviewing',
    refundMethod: '原路退回',
    orderNo: 'RF202401121645002',
    reason: '学生转学',
    applyTime: '2024-01-12 16:45:30',
  },
  {
    id: '3',
    studentName: '张小红',
    amount: 30.00,
    time: '2024-01-10 09:15:42',
    status: 'pending',
    refundMethod: '原路退回',
    orderNo: 'RF202401100915003',
    reason: '误充值',
    applyTime: '2024-01-09 14:20:10',
    processTime: '2024-01-10 09:15:42',
  },
  {
    id: '4',
    studentName: '张小红',
    amount: 80.00,
    time: '2024-01-05 11:22:18',
    status: 'failed',
    refundMethod: '原路退回',
    orderNo: 'RF202401051122004',
    reason: '账户异常',
    applyTime: '2024-01-04 15:30:25',
    processTime: '2024-01-05 11:22:18',
  },
  {
    id: '5',
    studentName: '张小明',
    amount: 200.00,
    time: '2023-12-28 13:45:33',
    status: 'success',
    refundMethod: '原路退回',
    orderNo: 'RF202312281345005',
    reason: '学期结束',
    applyTime: '2023-12-27 09:15:20',
    processTime: '2023-12-28 13:45:33',
  },
  {
    id: '6',
    studentName: '张小红',
    amount: 25.00,
    time: '2023-12-20 10:20:15',
    status: 'cancelled',
    refundMethod: '原路退回',
    orderNo: 'RF202312201020006',
    reason: '重复充值',
    applyTime: '2023-12-20 10:20:15',
  },
]

// 获取状态配置
export function getStatusConfig(status: RefundStatus): StatusConfig {
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

// 获取退款记录列表
export function getRefundRecords(studentId?: string): RefundRecord[] {
  // 这里可以根据 studentId 筛选数据
  return [...refundRecordsData]
}

// 筛选退款记录
export function filterRefundRecords(
  records: RefundRecord[],
  timeFilter: TimeFilterType,
  statusFilter: string,
): RefundRecord[] {
  let filteredRecords = [...records]
  const now = new Date()

  // 时间筛选
  if (timeFilter !== 'all') {
    filteredRecords = filteredRecords.filter((record) => {
      const recordDate = new Date(record.applyTime)
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

// 获取退款记录详情
export function getRefundRecordDetail(recordId: string): RefundRecord | null {
  return refundRecordsData.find(record => record.id === recordId) || null
}

// 格式化退款原因显示
export function formatRefundReason(reason: string): string {
  const reasonMap: Record<string, string> = {
    账户余额过多: '余额过多',
    学生转学: '学生转学',
    误充值: '误充值',
    账户异常: '账户异常',
    学期结束: '学期结束',
    重复充值: '重复充值',
  }

  return reasonMap[reason] || reason
}

// 获取退款进度描述
export function getRefundProgress(record: RefundRecord): string {
  switch (record.status) {
    case 'reviewing':
      return '正在审核您的退款申请'
    case 'pending':
      return '审核通过，正在处理退款'
    case 'success':
      return '退款已成功到账'
    case 'failed':
      return '退款失败，请联系客服'
    case 'cancelled':
      return '退款申请已取消'
    default:
      return '状态未知'
  }
}
