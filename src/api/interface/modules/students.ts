export namespace Students {
  export interface IStudentVo {
    className: string
    grade: string
    id: number
    name: string
    schoolName: string
    status: number
    studentCode: string
    [property: string]: any
  }

  export interface ReqPostPublicStudentApi {
    tenantId: number
    schoolId: number
    gradeId: number
    classId: number
    searchType: string
    searchValue: string
    [property: string]: any
  }
  export interface ResPostPublicStudentApi {
    students: IStudentVo[]
    total: number
  }

  /** 获取家长的绑定的孩子列表 */
  export interface ResGetStudentListByParent {
    students: IStudentVo[]
    total: number
  }
}
