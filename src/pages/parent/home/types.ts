import type { IMenuItem } from '@/constant/modules'

/** 首页菜单项类型 */
export type THomeMenuItem = IMenuItem | null

/** 成绩页跳转参数 */
export interface INavigateToScoreParams {
  /** 第三方页面基础地址 */
  scoreUrl: string
  /** 学校名称 */
  schoolName: string
  /** 学生唯一号（onlyCode） */
  onlyCode: string
  /** 家长手机号（家长留言场景可选） */
  tel?: string
  /** 家长昵称（家长留言场景可选） */
  nickname?: string
  /** 返回小程序按钮显示控制：0 显示；1 不显示 */
  rt: 0 | 1
}

/** 首页学生信息（选择器） */
export interface IHomeStudent {
  id: number
  name: string
  avatar?: string
  schoolName?: string
  grade?: string
  departmentName?: string
  className?: string
}

/** 学生展示信息 */
export type IStudentDisplayInfo = Pick<IHomeStudent, 'schoolName' | 'grade' | 'departmentName' | 'className'>
