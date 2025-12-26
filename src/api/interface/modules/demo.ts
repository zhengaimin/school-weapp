export namespace Demo {
  export namespace Login {
    /** 测试登录 - 请求 */
    export interface ReqPostLoginApi {
      /** 唯一码 */
      onlyCode: string
      /** 学校名称 */
      schoolName: string
    }

    /** 测试登录 - 响应 */
    export interface ResPostLoginApi {
      [key: string]: any
    }
  }
}
