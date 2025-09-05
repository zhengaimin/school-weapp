// 充值金额选项接口
export interface RechargeAmountOption {
  value: number
  label: string
  selected: boolean
}

// 预设充值金额选项
export const rechargeAmountOptions: RechargeAmountOption[] = [
  { value: 0.01, label: '¥0.01', selected: false },
  { value: 0.02, label: '¥0.02', selected: false },
  { value: 0.03, label: '¥0.03', selected: false },
  { value: 0.04, label: '¥0.04', selected: false },
  { value: 0.05, label: '¥0.05', selected: false },
  { value: 50, label: '¥50', selected: false },
  { value: 100, label: '¥100', selected: false },
  { value: 200, label: '¥200', selected: false },
  { value: 300, label: '¥300', selected: false },
  { value: 500, label: '¥500', selected: false },
  { value: 1000, label: '¥1000', selected: false },
]

// 获取充值金额选项
export function getRechargeAmountOptions(): RechargeAmountOption[] {
  return [...rechargeAmountOptions]
}
