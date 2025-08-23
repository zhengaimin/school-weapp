import { API_V1 } from '@/api/config/servicePort'

import { getEnvBaseUploadUrl } from '@/utils'

const VITE_UPLOAD_BASEURL = `${getEnvBaseUploadUrl()}`

export function useAssetsPath() {
  const regex = /^https?:\/\//i

  const getUploadPathById = (id: string | number) => {
    return `${VITE_UPLOAD_BASEURL}${API_V1}/common/preview/${id}`
  }

  const getUploadThumbPathById = (id: string | number, length = 100) => {
    return `${VITE_UPLOAD_BASEURL}${API_V1}/common/thumbnail/${id}?width=${length}&height=${length}`
  }

  /** 获取上传组件地址 */
  const getUploadPath = (path: string) => {
    if (regex.test(path)) {
      return path
    }

    return `${VITE_UPLOAD_BASEURL}/api${path}`
  }

  return {
    getUploadPathById,
    getUploadThumbPathById,
    getUploadPath,
  }
}
