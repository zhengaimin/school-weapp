// 设备类型
export interface Device {
  id: number
  name: string
  type: 'access' | 'payment' | 'lab' | 'parking'
  subscribed: boolean
}

// 模拟设备数据
export const mockDevices: Device[] = [
  { id: 1, name: '智能门禁系统 - 教学楼A栋', type: 'access', subscribed: false },
  { id: 2, name: '食堂刷卡机 - 第一食堂', type: 'payment', subscribed: true },
  { id: 3, name: '图书馆门禁 - 中央图书馆', type: 'access', subscribed: false },
  { id: 4, name: '宿舍楼门禁 - 学生公寓1号楼', type: 'access', subscribed: true },
  { id: 5, name: '实验室设备 - 计算机实验室', type: 'lab', subscribed: false },
  { id: 6, name: '体育馆刷卡机 - 综合体育馆', type: 'payment', subscribed: false },
  { id: 7, name: '停车场道闸 - 校园停车场', type: 'parking', subscribed: true },
  { id: 8, name: '教室门禁 - 教学楼B栋', type: 'access', subscribed: false },
  { id: 9, name: '医务室门禁 - 校医院', type: 'access', subscribed: false },
  { id: 10, name: '食堂刷卡机 - 第二食堂', type: 'payment', subscribed: false }
]