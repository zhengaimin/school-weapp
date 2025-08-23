export namespace Common {
  export interface IUserInfoVo {
    id: number
    avatar_id?: number
    company?: string
    /** 部门 */
    department?: string
    /** 职位 */
    position?: string
    username?: string
    [property: string]: any
  }

  /** 获取微信绑定的手机号 */
  export interface ReqWxPhoneApi {
    /** 点击 button 获取到的手机号 code */
    code: string
    /** 微信 code */
    loginCode: string
  }
  export interface ResWxPhoneApi {
    /** 国家代码 */
    countryCode: string
    /** 用户手机号 */
    phoneNumber: string
    /** 没有国家代码的手机号 */
    purePhoneNumber: string
  }

  export interface ReqWxLoginApi {
    code: string
  }
  /** 微信登录返回的信息 */
  export interface ResWxLoginApi {
    isNew: boolean
    needBind: boolean
    token?: string
  }
}

export namespace Parent {
  export interface IChild {
    studentId: number
  }

  export interface IReqPostParentRegisterApi {
    loginCode: string
    chooseChildUserId: number
    children: IChild[]
  }
  export interface IResPostParentRegisterApi {
    currentUserId: number
    hasRegistered: boolean
    token: string
  }
}
