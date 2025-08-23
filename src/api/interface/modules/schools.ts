export namespace Schools {
  export interface ISchoolVo {
    address: string
    code: string
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
}
