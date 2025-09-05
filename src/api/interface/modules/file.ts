export namespace File {
  export namespace Upload {
    /** 上传文件 - 请求 */
    export interface ReqPostUploadApi {
      /** 文件临时路径 */
      filePath: string
      /** 业务类型 */
      bizType: string
    }

    /** 上传文件 - 响应 */
    export interface ResPostUploadApi {
      /** 文件 URL */
      url: string
      /** 文件 URL */
      fileUrl: string
      /** 文件名 */
      filename: string
      /** 文件大小 */
      size: number
      /** 文件类型 */
      mimeType: string
    }
  }
}
