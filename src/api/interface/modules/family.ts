export namespace Family {
  export namespace Contact {
    export interface IFamilyContactVo {
      /** 班级名称 */
      className: string
      /** 创建时间 */
      createdAt: string
      /** 亲情号ID */
      id: number
      /** 是否主联系人 */
      isPrimary: boolean
      /** 是否绑定微信 */
      isWechatBind: boolean
      /** 别称（用户自定义） */
      nickname: string
      /** 手机号码 */
      phone: string
      /** 称谓类型（1-爸爸，2-妈妈，3-爷爷，4-奶奶，5-外公，6-外婆，7-姐姐，8-哥哥，9-其他） */
      relationship: number
      /** 称谓名称 */
      relationshipName: string
      /** 学校名称 */
      schoolName: string
      /** 显示排序值 */
      sortOrder: number
      /** 学生编码 */
      studentCode: string
      /** 学生ID */
      studentId: number
      /** 学生姓名 */
      studentName: string
      /** 更新时间 */
      updatedAt: string
      /** 微信账户ID */
      wechatAccountId: number
      /** 微信绑定时间 */
      wechatBindTime: string
    }

    /** 获取学生的亲情号列表 - 请求参数 */
    export interface ReqGetFamilyContactsApi {
      /** 是否主联系人筛选 */
      isPrimary?: boolean
      /** 是否绑定微信筛选 */
      isWechatBind?: boolean
      /** 页码，默认1 */
      page?: number
      /** 每页数量，默认20，最大100 */
      pageSize?: number
      /** 手机号筛选（模糊搜索） */
      phone?: string
      /** 称谓类型筛选 */
      relationship?: number
    }

    /** 获取学生的亲情号列表 - 响应项 */
    export interface ResGetFamilyContactsApi {
      /** 班级名称 */
      className?: string
      /** 创建时间 */
      createdAt?: string
      /** 亲情号ID */
      id?: number
      /** 是否主联系人 */
      isPrimary?: boolean
      /** 是否绑定家长微信 */
      isWechatBind?: boolean
      /** 别称（用户自定义） */
      nickname?: string
      /** 地址 */
      address?: string
      /** 手机号码 */
      phone?: string
      /**
       * 称谓类型：
       * 1-爸爸，2-妈妈，3-爷爷，4-奶奶，
       * 5-外公，6-外婆，7-姐姐，8-哥哥，9-其他
       */
      relationship?: number
      /** 显示排序值 */
      sortOrder?: number
      /** 学生ID */
      studentId?: number
      /** 学生姓名 */
      studentName?: string
      /** 微信绑定时间 */
      wechatBindTime?: string | null
    }

    /** 获取亲情号详情 - 响应 */
    export interface ResGetFamilyContactDetailApi {
      /** 班级名称 */
      className?: string
      /** 创建时间 */
      createdAt?: string
      /** 亲情号ID */
      id?: number
      /** 是否主联系人 */
      isPrimary?: boolean
      /** 是否绑定家长微信 */
      isWechatBind?: boolean
      /** 别称（用户自定义） */
      nickname?: string
      /** 地址 */
      address?: string
      /** 手机号码 */
      phone?: string
      /**
       * 称谓类型：
       * 1-爸爸，2-妈妈，3-爷爷，4-奶奶，
       * 5-外公，6-外婆，7-姐姐，8-哥哥，9-其他
       */
      relationship?: number
      /** 显示排序值 */
      sortOrder?: number
      /** 学生ID */
      studentId?: number
      /** 学生姓名 */
      studentName?: string
      /** 微信绑定时间 */
      wechatBindTime?: string | null
    }

    /** 创建亲情号 - 请求参数 */
    export interface ReqPostFamilyContactApi {
      /** 手机号码 */
      phone: string
      /**
       * 称谓类型：
       * 1-爸爸，2-妈妈，3-爷爷，4-奶奶，
       * 5-外公，6-外婆，7-姐姐，8-哥哥，9-其他
       */
      relationship: number
      /** 别称（用户自定义） */
      nickname?: string
      /** 地址 */
      address?: string
      /** 是否主联系人 */
      isPrimary?: boolean
    }

    /** 更新亲情号 - 请求参数 */
    export interface ReqPutFamilyContactApi {
      /** 手机号码 */
      phone?: string
      /**
       * 称谓类型：
       * 1-爸爸，2-妈妈，3-爷爷，4-奶奶，
       * 5-外公，6-外婆，7-姐姐，8-哥哥，9-其他
       */
      relationship?: number
      /** 别称（用户自定义） */
      nickname?: string
      /** 是否主联系人 */
      isPrimary?: boolean
    }

    /** 本人亲情号信息 */
    export interface ISelfContactVo {
      /** 亲情号ID */
      id: number
      /** 是否主联系人 */
      isPrimary: boolean
      /** 别称（用户自定义） */
      nickname: string
      /** 手机号码 */
      phone: string
      /** 称谓类型（1-爸爸，2-妈妈，3-爷爷，4-奶奶，5-外公，6-外婆，7-姐姐，8-哥哥，9-其他） */
      relationship: number
      /** 称谓名称 */
      relationshipName: string
    }

    /** 检查本人是否存在亲情号列表中 - 响应 */
    export interface ResGetCheckSelfApi {
      exists: boolean
      message: string
      /** 亲情号和登录用户手机号一致的亲情号信息 */
      contactInfo?: ISelfContactVo
    }
  }

  export namespace Relationship {
    export interface IRelationshipOptionVo {
      value: number
      label: string
      [property: string]: any
    }

    export interface ResGetRelationshipOptionsApi {
      options: IRelationshipOptionVo[]
    }
  }
}
