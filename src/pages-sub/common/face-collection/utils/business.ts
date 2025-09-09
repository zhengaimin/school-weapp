import type { TFaceStatus } from '@/constant/modules'
import { FACE_STATUS } from '@/constant/modules'

// 人脸状态提示配置
export interface IFaceStatusConfig {
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  content: string
}

export const FACE_STATUS_CONFIG: Record<TFaceStatus, IFaceStatusConfig> = {
  [FACE_STATUS.NOT_COLLECTED]: {
    type: 'info',
    title: '人脸认证状态',
    content: '当前人脸信息未上传，请上传',
  },
  [FACE_STATUS.COLLECTED]: {
    type: 'warning',
    title: '人脸认证状态',
    content: '人脸信息已上传，请等待审核',
  },
  [FACE_STATUS.AUDITING]: {
    type: 'warning',
    title: '人脸认证状态',
    content: '人脸信息正在审核中',
  },
  [FACE_STATUS.AUDIT_PASSED]: {
    type: 'success',
    title: '人脸认证状态',
    content: '人脸信息已审核通过',
  },
  [FACE_STATUS.AUDIT_FAILED]: {
    type: 'error',
    title: '人脸认证状态',
    content: '人脸信息审核失败，请重新上传',
  },
}
