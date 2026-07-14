import type { File } from '@/api/interface/modules/file'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/toast'

const FILE_API = {
  UPLOAD: '/common/files/upload',
}

/**
 * @description 上传文件
 * @param {File.Upload.ReqPostUploadApi} params
 * @returns {Promise<IResData<File.Upload.ResPostUploadApi>>}
 */
export function postUploadFileApi(params: File.Upload.ReqPostUploadApi) {
  const userStore = useUserStore()
  // uni-app 文件上传
  return new Promise<IResData<File.Upload.ResPostUploadApi>>((resolve, reject) => {
    uni.uploadFile({
      url: FILE_API.UPLOAD,
      filePath: params.filePath, // 使用 filePath
      name: 'file',
      formData: {
        bizType: params.bizType,
      },
      header: {
        Authorization: `Bearer ${userStore.token}`,
      },
      success: (uploadRes) => {
        const { statusCode, data } = uploadRes
        const result = JSON.parse(data || '{}') as IResData<File.Upload.ResPostUploadApi>

        console.log(result)
        if (statusCode === 200 && result.code === 0) {
          resolve(result)
        } else {
          toast.info(result.msg || '上传失败')
          reject(result)
        }
      },
      fail: (err) => {
        toast.info('网络错误，上传失败')
        reject(err)
      },
    })
  })
}
