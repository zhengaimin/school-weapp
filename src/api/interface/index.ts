// 请求响应参数（不包含data）
export interface Result {
  code: number
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T
}

// 分页响应参数
export interface ResPage<T> {
  list: T[]
  page: number
  page_size: number
  total: number
}

// 分页请求参数
export interface ReqPage {
  pageNum: number
  pageSize: number
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    email: string
    password: string
    /* 验证码 id */
    id: string
    /* 验证码 */
    captcha: string
  }
  export interface ResLoginForm {
    expires_in: number
    token: string
    user: any
  }
  export interface ResLogin {
    access_token: string
  }
  export interface ResAuthButtons {
    [key: string]: string[]
  }
}

// 用户管理模块
export namespace User {
  // 注册
  export interface ReqRegister {
    captcha: string
    email: string
    image?: string
    name: string
    password: string
    phone: string
    postcode: string
    street: string
    house_number: string
  }
  // 用户信息
  export interface ResUserInfo {
    id: number
    email: string
    name: string
    image?: string
    avatar_id?: number
    phone?: string
    role: number
    status: number
    remarks?: string

    postcode?: string
    street?: string
    house_number?: string

    created_at?: string
    updated_at?: string
    [property: string]: any
  }
  // 更新用户信息 - 请求
  export interface ReqPutMeInfoApi {
    name?: string
    avatar_id?: number
    old_password?: string
    password?: string
    phone?: string
    postcode?: string
    street?: string
    house_number?: string
    status?: string
  }
  // 重置密码 - 请求
  export interface ReqResetPassword {
    new_password: string
    token: string
  }
}

// 通用模块
export namespace Common {
  // 获取公钥
  export interface ResGetPublicKey {
    public_key: string
  }

  // 获取验证码
  export interface ResGetCaptcha {
    id: string
    base_64_blob: string
  }
  // 发送测试邮件
  export interface ReqPostTestEmail {
    company_name: string
    domain: string
    email: string
    logo: string
    password: string
    smtp_host: string
    smtp_port: string
    smtp_protocol: string
  }
  export interface ReqPostSendCaptcha {
    email: string
  }
  /** 初始化系统配置  */
  export interface InitConfig {
    company_name: string
    domain: string
    email: string
    is_init: boolean
    logo: string
    logo_full?: string
    password: string
    smtp_host: string
    smtp_port: number
    smtp_protocol: string
  }
}

// 设备模块
export namespace Equipment {}

// 订单
export namespace Order {
  // 支付 - 请求
  export interface ReqPostOrderPay {
    return_url?: string
  }
  /* 支付 - 响应 */
  export interface ResPostOrderPay {
    // 支付平台流水号
    pspReference: string
  }
}

export namespace Process {
  export interface ReqPostProcess {
    operation_id: number
    status: number
  }
}

export namespace Notice {
  export interface ReqGetNotice {
    status: number
    page: number
    page_size: number
  }
}
