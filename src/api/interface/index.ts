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
