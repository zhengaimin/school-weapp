export type TWmpfVoipRoomType = 'voice' | 'video'
export type TWmpfVoipCameraStatus = 0 | 1
export type TWmpfVoipBusinessType = 1 | 2
export type TWmpfVoipMiniProgramState = 'formal' | 'trial' | 'developer'

export interface IWmpfVoipUser {
  /** 用户 openId 或设备 SN */
  id: string
  /** 通话页面展示名称 */
  name?: string
  /** 摄像头状态，0 开启，1 关闭 */
  cameraStatus?: TWmpfVoipCameraStatus
}

export interface IWmpfVoipInitByCallerParams {
  /** 通话类型 */
  roomType: TWmpfVoipRoomType
  /** 拨打方信息 */
  caller: IWmpfVoipUser
  /** 接听方信息 */
  listener: IWmpfVoipUser
  /** 业务类型，1 设备呼叫手机微信，2 手机微信呼叫硬件设备 */
  businessType?: TWmpfVoipBusinessType
  /** 拨打票据，按 businessType 和设备接入方式传入 */
  voipToken?: string
  /** 接听方点击通知时打开的小程序版本 */
  miniprogramState?: TWmpfVoipMiniProgramState
  /** 接听方点击通知打开小程序时追加到插件页面的 query */
  customQuery?: string
  /** 最大通话时长，单位秒 */
  timeLimit?: number
}

export interface IWmpfVoipError {
  /** 错误码 */
  errCode?: number
  /** 错误信息 */
  errMsg?: string
  /** 插件错误对象 */
  errObj?: unknown
}

export interface IWmpfVoipInitByCallerResult extends IWmpfVoipError {
  /** 是否调用成功 */
  isSuccess: boolean
  /** 本次通话房间号 */
  roomId?: string
  /** 与 roomId 相同 */
  groupId?: string
  /** 计费方式 */
  chargeType?: 'duration' | 'license' | string
}

export interface IWmpfVoipEvent {
  /** 事件名称 */
  eventName: string
  /** 本次通话房间号 */
  roomId?: string
  /** 与 roomId 相同 */
  groupId?: string
  /** 事件附加参数 */
  data?: Record<string, unknown>
}

export interface IWmpfVoipPlugin {
  /** 插件通话页面路径 */
  CALL_PAGE_PATH: string
  /** 发起通话 */
  initByCaller: (params: IWmpfVoipInitByCallerParams) => Promise<IWmpfVoipInitByCallerResult>
  /** 强制结束通话 */
  forceHangUpVoip: (roomId?: string) => void
  /** 监听通话事件 */
  onVoipEvent: (listener: (event: IWmpfVoipEvent) => void) => () => void
  /** 获取从插件页面进入小程序时的启动参数 */
  getPluginEnterOptions: () => WechatMiniprogram.App.LaunchShowOption
  /** 获取插件通话页面 onLoad 时的 query 参数 */
  getPluginOnloadOptions: () => Record<string, string>
}

let wmpfVoipPlugin: IWmpfVoipPlugin | null = null
const wmpfVoipPluginName = import.meta.env.VITE_WMPF_VOIP_PLUGIN_NAME || 'wmpf-voip'
export const WMPF_VOIP_DEVICE_SN = import.meta.env.VITE_WMPF_VOIP_DEVICE_SN || 'GTD2202310278007732'
export const WMPF_VOIP_LISTENER_OPEN_ID = import.meta.env.VITE_WMPF_VOIP_LISTENER_OPEN_ID || 'o5KRp17_viVMfo_Kck1QbCju9ANA'
export const WMPF_VOIP_MODEL_ID = import.meta.env.VITE_WMPF_VOIP_MODEL_ID || 'kBD0lTsIkrMDUZ3ySeCEcQ'

/**
 * 获取 VOIP 通话插件实例
 */
export function getWmpfVoipPlugin(): IWmpfVoipPlugin | null {
  if (__UNI_PLATFORM__ !== 'mp-weixin') {
    return null
  }

  if (wmpfVoipPlugin) {
    return wmpfVoipPlugin
  }

  if (typeof requirePlugin !== 'function') {
    return null
  }

  try {
    const pluginModule = requirePlugin(wmpfVoipPluginName) as { default?: IWmpfVoipPlugin }
    wmpfVoipPlugin = pluginModule.default || null
    return wmpfVoipPlugin
  } catch (error) {
    console.error('getWmpfVoipPlugin:', error)
    return null
  }
}

/**
 * 发起 VOIP 通话
 * @param params 插件发起通话参数
 */
export function initWmpfVoipByCaller(params: IWmpfVoipInitByCallerParams) {
  const wmpfVoip = getWmpfVoipPlugin()

  if (!wmpfVoip) {
    return Promise.reject(new Error('当前环境未接入 VOIP 通话插件'))
  }

  return wmpfVoip.initByCaller(params)
}

/**
 * 跳转到 VOIP 插件通话页
 */
export function redirectToWmpfVoipCallPage() {
  const wmpfVoip = getWmpfVoipPlugin()

  if (!wmpfVoip) {
    return false
  }

  uni.redirectTo({
    url: wmpfVoip.CALL_PAGE_PATH,
  })
  return true
}

/**
 * 强制结束 VOIP 通话
 * @param roomId 通话房间号
 */
export function forceHangUpWmpfVoip(roomId?: string) {
  getWmpfVoipPlugin()?.forceHangUpVoip(roomId)
}
