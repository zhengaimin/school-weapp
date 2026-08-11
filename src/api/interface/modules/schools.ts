export namespace Schools {
  export interface ISchoolVo {
    address: string
    code: string
    /** 客服电话 */
    customerServicePhone: string
    id: number
    name: string
    tenantID: number
    [property: string]: any
  }

  export interface IGradeVo {
    classCount: number
    code: string
    enrollYear: number
    id: number
    name: string
    studentCount: number
    [property: string]: any
  }

  export interface IClassVo {
    code: string
    id: number
    name: string
    studentCount: number
    teacherId: number
    [property: string]: any
  }

  export interface ResGetSchoolsApi {
    schools: ISchoolVo[]
    total: number
  }

  export interface ResGetGradesApi {
    grades: IGradeVo[]
    total: number
  }

  export interface ResClassesApi {
    classes: IClassVo[]
    total: number
  }
  /** 模块信息 */
  export interface IModuleVo {
    /** 模块Key */
    moduleKey: string
    /** 模块名称 */
    moduleName: string
    /** 排序 */
    sort: number
  }

  export namespace Modules {
    /** 获取学校模块列表 - 响应 */
    export interface ResGetModulesApi {
      /** 学校ID */
      schoolId: number
      /** 用户类型 */
      userType: string
      /** 模块列表 */
      modules: IModuleVo[]
    }
  }
}
