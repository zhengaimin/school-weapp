import {
  BALANCE_HOME_PATH,
  COMMON_ROLE_SWITCH_PATH,
  DEVICE_SUBSCRIBE_PATH,
  FACE_COLLECTION_PATH,
  FAMILY_MANAGE_PATH,
  FUND_BALANCE_HISTORY_PATH,
  PACKAGE_LIST_PATH,
  PARENT_CONSUMPTION_HISTORY_PATH,
  PARENT_STUDENT_BIND_PATH,
  PARENT_STUDENT_DETAIL_PATH,
  PROFILE_EDIT_PATH,
  REFUND_APPLY_PATH
} from '@/constant/router'

/**
 * 色系都是参考 tailwind 来设计的：https://tailwindcss.com/docs/colors
 * 按钮之间的颜色不能重复
 * color 都是 500，bgColor 都是 100
 */

export interface IMenuItem {
  id?: string
  title: string
  icon: string
  color: string
  bgColor: string
  path?: string
}

/** 个人信息设置 - orange */
export const MENU_PROFILE: IMenuItem = {
  id: 'profile',
  title: '个人信息',
  icon: 'parent-line',
  color: '#f97316', // orange-500
  bgColor: '#ffedd4', // orange-100
  path: PROFILE_EDIT_PATH
}

/** 学生信息 - amber */
export const MENU_CHILDREN_DETAIL: IMenuItem = {
  id: 'student_info',
  title: '学生信息',
  icon: 'user-5-line',
  color: '#f59e0b', // amber-500
  bgColor: '#fef3c7', // amber-100
  path: PARENT_STUDENT_DETAIL_PATH
}

/** 绑定学生 - teal */
export const MENU_STUDENT_BIND: IMenuItem = {
  id: 'bind_student',
  title: '绑定学生',
  icon: 'user-add-line',
  color: '#14b8a6', // teal-500
  bgColor: '#ccfbf1', // teal-100
  path: PARENT_STUDENT_BIND_PATH
}

/** 切换身份 - lime - TODO */
export const MENU_SWITCH_ROLE: IMenuItem = {
  id: 'switch-role',
  title: '切换身份',
  icon: 'user-settings-line',
  color: '#84cc16', // lime-500
  bgColor: '#ecfccb', // lime-100
  path: COMMON_ROLE_SWITCH_PATH
}

/** 人脸识别 - purple */
export const MENU_FACE_COLLECTION: IMenuItem = {
  id: 'face_collection',
  title: '人脸采集',
  icon: 'user-smile-line',
  color: '#8b5cf6', // purple-500
  bgColor: '#ede9fe', // purple-100
  path: FACE_COLLECTION_PATH
}

/** 亲情号 - pink */
export const MENU_FAMILY_NUMBER: IMenuItem = {
  id: 'family_contact',
  title: '亲情号',
  icon: 'heart-3-line',
  color: '#ec4899', // pink-500
  bgColor: '#fce7f3', // pink-100
  path: FAMILY_MANAGE_PATH
}

/** 账户信息 - blue */
export const MENU_ACCOUNT_INFO: IMenuItem = {
  id: 'account_info',
  title: '账户信息',
  icon: 'wallet-3-line',
  color: '#3b82f6', // blue-500
  bgColor: '#dbeafe', // blue-100
  path: BALANCE_HOME_PATH
}

/** 套餐购买 - emerald */
export const MENU_PACKAGE: IMenuItem = {
  id: 'package_purchase',
  icon: 'coupon-line',
  title: '套餐购买',
  color: '#10b981', // emerald-500
  bgColor: '#d1fae5', // emerald-100
  path: PACKAGE_LIST_PATH
}

/** 申请退费 - red */
export const MENU_REFUND_APPLY_PATH: IMenuItem = {
  id: 'refund_apply',
  icon: 'refund-2-line',
  title: '申请退费',
  color: '#ef4444', // red-500
  bgColor: '#fee2e2', // red-100
  path: REFUND_APPLY_PATH
}

/** 意见反馈 - rose */
export const MENU_FEEDBACK: IMenuItem = {
  icon: 'feedback-line',
  title: '意见反馈',
  color: '#f43f5e', // rose-500
  bgColor: '#ffe4e6', // rose-100
  path: '/pages-sub/common/feedback/index'
}

/** 留言 - violet */
export const MENU_MESSAGE: IMenuItem = {
  id: 'message',
  title: '留言',
  icon: 'message-3-line',
  color: '#8b5cf6', // violet-500
  bgColor: '#ede9fe', // violet-100
  path: '/pages-sub/chat/index'
}

/** 关于我们 - gray */
export const MENU_ABOUT: IMenuItem = {
  icon: 'information-line',
  title: '关于我们',
  color: '#6b7280', // gray-500
  bgColor: '#f3f4f6', // gray-100
  path: '/pages-sub/common/about/index'
}

/** 设备订阅 - cyan */
export const MENU_DEVICE_SUBSCRIBE: IMenuItem = {
  id: 'device_subscription',
  icon: 'smartphone-line',
  title: '设备订阅',
  color: '#06b6d4', // cyan-500
  bgColor: '#cffafe', // cyan-100
  path: DEVICE_SUBSCRIBE_PATH
}

/** 消费记录 - indigo */
export const MENU_CONSUMPTION_RECORD: IMenuItem = {
  id: 'consumption_record',
  icon: 'file-list-3-line',
  title: '消费记录',
  color: '#6366f1', // indigo-500
  bgColor: '#e0e7ff', // indigo-100
  path: PARENT_CONSUMPTION_HISTORY_PATH
}

/** 充值明细 - sky */
export const MENU_BALANCE_DETAILS: IMenuItem = {
  id: 'fund_flow',
  title: '充值明细',
  icon: 'bill-line',
  color: '#0ea5e9', // sky-500
  bgColor: '#e0f2fe', // sky-100
  path: FUND_BALANCE_HISTORY_PATH
}

/** 成绩查询 - fuchsia */
export const MENU_SCORE: IMenuItem = {
  id: 'score',
  title: '成绩',
  icon: 'file-chart-line',
  color: '#d946ef', // fuchsia-500
  bgColor: '#fae8ff' // fuchsia-100
}

// 首页功能按钮配置
export const MENU_LIST = [
  MENU_ACCOUNT_INFO,

  MENU_REFUND_APPLY_PATH,

  MENU_CONSUMPTION_RECORD,
  MENU_BALANCE_DETAILS,
  MENU_PACKAGE,

  MENU_FACE_COLLECTION,
  MENU_FAMILY_NUMBER,
  MENU_DEVICE_SUBSCRIBE,
  MENU_MESSAGE,

  MENU_STUDENT_BIND,
  MENU_PROFILE,
  MENU_CHILDREN_DETAIL,
  MENU_SCORE

  // MENU_FEEDBACK,
  // MENU_ABOUT,
  // MENU_SWITCH_ROLE,
]
