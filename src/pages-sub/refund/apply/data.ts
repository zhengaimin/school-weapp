import { CUSTOMER_SERVICE_PHONE } from '@/constant/modules'

// 孩子余额信息
export interface ChildBalanceInfo {
  id: string
  name: string
  balance: number
  balanceText: string
  school?: string
  grade?: string
}

// 退费类型
export interface RefundType {
  value: 'all' | 'partial'
  label: string
}

// 退费原因
export interface RefundReason {
  value: 'graduate' | 'unused' | 'other'
  label: string
}

// 退费申请表单
export interface RefundApplicationForm {
  childId: string
  refundType: 'all' | 'partial'
  partialAmount?: number
  reason: 'graduate' | 'unused' | 'other'
  otherReason?: string
  contactName: string
  contactPhone: string
}

// 简化的退费申请表单（用于UI）
export interface SimpleRefundForm {
  reason: string
}

// 模拟孩子列表数据
const childrenBalanceList: ChildBalanceInfo[] = [
  {
    id: 'xiaoming',
    name: '小明',
    balance: 120.5,
    balanceText: '¥120.50',
    school: '实验小学',
    grade: '三年级',
  },
  {
    id: 'xiaohong',
    name: '小红',
    balance: 88.0,
    balanceText: '¥88.00',
    school: '实验小学',
    grade: '二年级',
  },
  {
    id: 'xiaogang',
    name: '小刚',
    balance: 200.0,
    balanceText: '¥200.00',
    school: '第一中学',
    grade: '初一',
  },
]

// 模拟退费类型选项
const refundTypeOptions: RefundType[] = [
  { value: 'all', label: '全部退费' },
  { value: 'partial', label: '部分退费' },
]

// 模拟退费原因选项
const refundReasonOptions: RefundReason[] = [
  { value: 'graduate', label: '毕业' },
  { value: 'unused', label: '长期未使用' },
  { value: 'other', label: '其他原因' },
]

// 退费说明内容
export const refundProcessSteps = [
  '提交退费申请，填写相关信息',
  '我们将在3-5个工作日内审核您的申请',
  '审核通过后，退费金额将原路返回到您的支付账户',
]

export const refundRules = [
  '全部退费：退还账户内所有余额',
  '退费金额将原路返回，到账时间1-7个工作日',
]

export const refundNotices = [
  '退费申请一旦提交不可撤销，请谨慎操作',
  `如有疑问请联系客服：${CUSTOMER_SERVICE_PHONE}（工作时间：9:00-18:00）`,
]

// 模拟获取孩子列表
export function getChildrenBalanceList(): ChildBalanceInfo[] {
  return childrenBalanceList
}

// 模拟获取单个孩子信息
export function getChildBalanceInfo(childId: string): ChildBalanceInfo | undefined {
  return childrenBalanceList.find(child => child.id === childId)
}

// 模拟获取退费类型选项
export function getRefundTypeOptions(): RefundType[] {
  return refundTypeOptions
}

// 模拟获取退费原因选项
export function getRefundReasonOptions(): RefundReason[] {
  return refundReasonOptions
}

// 模拟提交退费申请
export async function submitRefundApplication(
  formData: RefundApplicationForm,
): Promise<{ refundAmount: number }> {
  console.log('提交的退费申请:', formData)
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  const child = getChildBalanceInfo(formData.childId)
  if (!child) {
    throw new Error('未找到孩子信息')
  }

  let refundAmount = 0
  if (formData.refundType === 'all') {
    refundAmount = child.balance
  }
  else if (formData.refundType === 'partial' && formData.partialAmount) {
    refundAmount = formData.partialAmount
  }

  // 模拟提交成功
  return { refundAmount }
}
