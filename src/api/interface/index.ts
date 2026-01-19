/**
 * @description 分页列表返回结果
 */
export interface ListResult<T> {
  /**
   * 列表数据
   */
  list: T[]
  /**
   * 总数
   */
  total: number
}

/**
 * @description 接口返回结果
 */
export interface ResultData<T = any> {
  /**
   * 状态码
   */
  code: number
  /**
   * 消息
   */
  msg: string
  /**
   * 数据
   */
  data: T
}

export type { Devices } from './modules/devices'
export type { Family } from './modules/family'
export type { File } from './modules/file'
export type { Gifts } from './modules/gifts'
export type { Message } from './modules/message'
export type { Overview } from './modules/overview'
export type { Pkg } from './modules/package'
export type { Payment } from './modules/payment'
export type { Refund } from './modules/refund'
export type { Schools } from './modules/schools'
export type { Students } from './modules/students'
export type { User } from './modules/user'
