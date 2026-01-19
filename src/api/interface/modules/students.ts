export namespace Students {
  export interface IStudentVo {
    /** 学生头像URL */
    avatar: string
    /** 账户余额（单位：元） */
    balance: string
    /** 班级名称 */
    className: string
    /** 年级名称 */
    grade: string
    /** 学生ID */
    id: number
    /** 最后登录时间（ISO格式） */
    lastLoginAt: string
    /** 学生姓名 */
    name: string
    /** 关系类型：0-未知 1-父亲 2-母亲 3-祖父 4-祖母 5-外祖父 6-外祖母 7-其他 */
    relationship: number
    /** 学校名称 */
    schoolName: string
    /** 学号 */
    studentCode: string
    /** 其他属性 */
    [property: string]: any
  }

  export interface ReqPostPublicStudentApi {
    tenantId: number
    schoolId: number
    name?: string
    studentCode?: string
    idCard?: string
    UUID?: string
  }
  export interface ResPostPublicStudentApi {
    students: IStudentVo[]
    total: number
  }

  /** 获取家长的孩子列表 - 响应 */
  export interface ResGetListApi {
    students: IStudentVo[]
    total: number
  }

  /** 家长切换当前学生 - 请求参数 */
  export interface ReqPostParentSwitchChildApi {
    childUserId: number
  }
  /** 家长切换当前学生 - 响应参数 */
  export interface ResPostParentSwitchChildApi {
    currentUserId: number
    // 未切换用户的话，没有 token
    token?: string
  }

  /** 家长绑定学生 - 请求参数 */
  export interface ReqPostBindStudentApi {
    studentId: number
    relationship?: string
  }

  /** 家长绑定学生 - 响应参数 */
  export interface ResPostBindStudentApi extends Record<string, any> {}

  /** 更新学生人脸 - 请求参数 */
  export interface ReqPutStudentFaceApi {
    faceImageUrl: string
  }

  /** 更新学生人脸 - 响应参数 */
  export interface ResPutStudentFaceApi extends Record<string, any> {}
}
