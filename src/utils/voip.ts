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
  /**
   * 拨打票据
   * 设备认证 SDK 方案才需要；WMPF registerMiniProgramDevice 后禁止传入
   */
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

/** 页面阶段事件同步发送选项。 */
export interface INotifyAppVoipPageEventOptions {
  /** 是否优先走同步通道；页面销毁与关闭守卫场景保持 true，其余尽量异步。 */
  preferSync?: boolean
}

/** 小程序本地计算的 VOIP 时长诊断数据 */
interface IVoipDurationDiagnostic {
  /** 当前诊断阶段 */
  phase: 'event' | 'ended'
  /** 本地通话会话关联 ID，仅用于合并同一会话的重试日志 */
  sessionId?: string
  /** 宿主 App 创建的无敏感计费会话 ID，用于跨进程准确关联扣费记录 */
  appCallSessionId?: string
  /** 当前 VOIP 调试页版本号，用于确认宿主实际拉起的小程序包版本 */
  voipPageVersion?: string
  /** 插件事件名称 */
  eventName: string
  /** 事件发生时间（毫秒时间戳） */
  occurredAtMs: number
  /** 开始调用 initByCaller 的本地起点（毫秒时间戳） */
  sessionStartedAtMs?: number
  /** 调用 initByCaller 至当前事件的本地耗时（毫秒） */
  sessionElapsedMs?: number
  /** 当前插件版本识别到的候选接通事件名称 */
  candidateConnectedEvent?: string
  /** 候选接通事件发生时间（毫秒时间戳） */
  candidateConnectedAtMs?: number
  /** 候选接通点至结束点的本地耗时（毫秒） */
  candidateDurationMs?: number
  /** 候选接通点至结束点的本地耗时（秒，向下取整） */
  candidateDurationSec?: number
  /** 当前诊断对应的关闭/兜底原因 */
  guardReason?: string
  /** 当前原因是否允许真正执行挂断 */
  guardAllowed?: boolean
  /** 是否已进入插件稳定通话阶段 */
  activeStageEntered?: boolean
  /** 当前是否仍处于有效通话会话 */
  sessionActive?: boolean
  /** 当前会话是否已执行过 forceHangUp */
  forcedHangUp?: boolean
  /** 当前是否已经进入 closeVoipMiniProgram */
  closingMiniProgram?: boolean
  /** 生命周期兜底 grace 毫秒数 */
  lifecycleGraceMs?: number
  /** 通话发起页回传的稳定阶段标识 */
  pageEvent?: string
  /** 当前是否正跳转到插件通话页 */
  isNavigatingToCallPage?: boolean
  /** 当前会话是否已获得房间号 */
  hasRoomId?: boolean
  /** 插件事件里的安全状态值，仅透传基础类型，避免回传原始对象 */
  eventStatus?: string
  /** 插件事件 data 仅保留字段名，禁止回传原始值 */
  eventDataKeys: string[]
}

/** 插件通话界面单侧 UI 配置（callerUI / listenerUI） */
export interface IWmpfVoipUiSideConfig {
  /** 视频画面旋转角度：0 / 90 / 180 / 270 */
  cameraRotation?: number
  /** 视频画面纵横比，如 16/9、4/3 */
  aspectRatio?: number
  /** 视频画面水平镜像 */
  horMirror?: boolean
  /** 视频画面垂直镜像 */
  vertMirror?: boolean
  /**
   * 是否显示切换摄像头按钮。
   * 仅手机微信生效；WMPF 默认开摄像头且不显示开关。
   */
  enableToggleCamera?: boolean
  /** 画面与容器比例不一致时的填充方式：fill / contain */
  objectFit?: 'fill' | 'contain'
}

/** 插件 setUIConfig 入参（须在通话开始前调用） */
export interface IWmpfVoipUiConfig {
  /** 接听页自定义按钮文案 */
  btnText?: string
  /** 主叫侧通话 UI */
  callerUI?: IWmpfVoipUiSideConfig
  /** 被叫侧通话 UI */
  listenerUI?: IWmpfVoipUiSideConfig
  /**
   * 是否开启免提（true 扬声器，false 听筒）。
   * 仅设备端生效；插件默认 true，业务侧显式写入以保证默认免提。
   */
  handsFree?: boolean
  /**
   * 视频主窗口默认是否显示本端。
   * true 本端，false 对端；不能隐藏本端小窗。
   */
  isSelfWindowMax?: boolean
  /** 接听页自定义按钮弹层高度，仅 70vh / 90vh */
  customBoxHeight?: '70vh' | '90vh' | string
}

export interface IWmpfVoipPlugin {
  /** 插件通话页面路径 */
  CALL_PAGE_PATH: string
  /** 发起通话 */
  initByCaller: (params: IWmpfVoipInitByCallerParams) => Promise<IWmpfVoipInitByCallerResult>
  /** 强制结束通话 */
  forceHangUpVoip: (roomId?: string) => void
  /** 设置插件通话界面（须在通话开始前） */
  setUIConfig?: (config: IWmpfVoipUiConfig) => void
  /** 监听通话事件 */
  onVoipEvent: (listener: (event: IWmpfVoipEvent) => void) => () => void
  /** 获取从插件页面进入小程序时的启动参数 */
  getPluginEnterOptions: () => WechatMiniprogram.App.LaunchShowOption
  /** 获取插件通话页面 onLoad 时的 query 参数 */
  getPluginOnloadOptions: () => Record<string, string>
}

/** WMPF Invoke Channel 最小类型（设备端与小程序通信） */
interface IWmpfChannel {
  registerEvent: (options: {
    event: string
    success?: (res: unknown) => void
    fail?: (err: unknown) => void
  }) => void
  unregisterEvent: (options: {
    event: string
    success?: (res: unknown) => void
    fail?: (err: unknown) => void
  }) => void
  on: (event: string, callback: (res: { data?: unknown }) => void) => void
  off: (event: string, callback: (res: { data?: unknown }) => void) => void
  /** 小程序 → App 异步指令 */
  invoke?: (options: {
    command: string
    data?: string
    success?: (res: { data?: unknown }) => void
    fail?: (err: unknown) => void
  }) => void
  /** 小程序 → App 同步指令，用于页面销毁前的关键诊断 */
  invokeSync?: (options: {
    command: string
    data?: string
  }) => unknown
}

let wmpfVoipPlugin: IWmpfVoipPlugin | null = null
const wmpfVoipPluginName = import.meta.env.VITE_WMPF_VOIP_PLUGIN_NAME || 'wmpf-voip'
export const WMPF_VOIP_MODEL_ID = import.meta.env.VITE_WMPF_VOIP_MODEL_ID || 'kBD0lTsIkrMDUZ3ySeCEcQ'
/** 设备侧通过 WMPF Channel 下发的挂断事件名（closeWxaApp 无法真正结束对端微信通话） */
export const WMPF_DEVICE_HANGUP_EVENT = 'deviceHangup'
/** 小程序通话结束后通知 App 关闭 WMPF 的 command */
export const WMPF_VOIP_ENDED_COMMAND = 'voipEnded'
/** 小程序向 App 回传插件事件和本地时长诊断的 command */
export const WMPF_VOIP_EVENT_COMMAND = 'voipEvent'
/** 通话结束展示结果后关闭的默认延迟（ms） */
export const CLOSE_AFTER_CALL_MS = 1000
/** deviceHangup 监听注册失败后的重试间隔（ms）。 */
const DEVICE_HANGUP_BIND_RETRY_INTERVAL_MS = 800
/** deviceHangup 监听注册最多重试次数，避免无上限空转。 */
const DEVICE_HANGUP_BIND_RETRY_MAX_ATTEMPTS = 20
/** 单次 registerEvent 最长确认时间；超时视为卡死并重试。 */
const DEVICE_HANGUP_REGISTER_TIMEOUT_MS = 1500
/**
 * 生命周期兜底挂断的最小生效时长。
 * 插件切前台阶段可能先触发 appHide；必须等会话稳定一段时间后，才允许把 appHide 当异常退出处理。
 */
const VOIP_LIFECYCLE_HANGUP_GRACE_MS = 5000
/**
 * 对端挂断等「应立刻回 App」场景的关闭延迟。
 * 略大于 0，给 Channel.invoke(voipEnded) 一点时间到达 App。
 */
export const CLOSE_AFTER_REMOTE_END_MS = 300
/** VOIP 调试页版本，联调时用于确认设备加载的是否为最新小程序包 */
export const VOIP_PAGE_VERSION = '20260727.1'

/** 通话结束类事件名（统一小写比较） */
const CALL_END_EVENT_NAMES = new Set([
  'endvoip',
  'finishvoip',
  'hangupvoip',
  'cancelvoip',
  'rejectvoip',
  'busy',
  'timeout',
  'abortvoip',
])
/**
 * joinfail* 在实机联调里可能出现在建房成功后的插件切页/入房抖动阶段。
 * 这类事件只有在已进入稳定通话阶段后，才允许按真正结束处理；
 * 否则先只记诊断，避免把已建房但尚未稳定的会话秒关。
 */
const CALL_JOIN_FAIL_EVENT_PREFIX = 'joinfail'

/**
 * 当前插件版本的候选接通事件。
 * 实机 Logcat 未确认前仅用于诊断，禁止直接作为计费时长依据。
 */
const CALL_CONNECTED_CANDIDATE_EVENT_NAMES = new Set([
  'startvoip',
  'joinedroombycaller',
])

/** 当前通话房间号（用于 forceHangUpVoip） */
let activeVoipRoomId: string | undefined
/** 开始调用 initByCaller 的本地起点，用于观察拨号至结束的总耗时 */
let activeVoipSessionStartedAtMs: number | undefined
/** 当前本地通话会话关联 ID（不使用 roomId，避免写入诊断日志） */
let activeVoipSessionId: string | undefined
/** 宿主 App 创建的计费会话 ID；只透传给 Android，不包含联系人、房间号或票据 */
let activeVoipAppCallSessionId: string | undefined
/** 本地通话会话自增序号，与时间戳一起组成关联 ID */
let voipSessionSequence = 0
/** 首个候选接通事件的本地时间 */
let activeVoipCandidateConnectedAtMs: number | undefined
/** 首个候选接通事件名称 */
let activeVoipCandidateConnectedEvent: string | undefined
/** 通话结束后保留的不可变诊断，供 Channel 重试复用 */
let activeVoipEndedDiagnostic: IVoipDurationDiagnostic | undefined
/** 是否已进入插件稳定通话阶段；启动期 appHide/pageUnload 不应据此误挂断 */
let hasVoipEnteredActiveStage = false
/** 是否处于有效通话会话（调用 initByCaller 后至挂断/正常结束） */
let isVoipSessionActive = false
/** 是否已执行过强制挂断，避免重复调用 */
let hasForcedHangUp = false
/** 是否已注册 deviceHangup 监听 */
let deviceHangupBound = false
/** deviceHangup 注册流程是否进行中，避免重复发起 registerEvent。 */
let deviceHangupBinding = false
/** deviceHangup 延迟重试定时器。 */
let deviceHangupBindRetryTimer: ReturnType<typeof setTimeout> | null = null
/** 当前 deviceHangup 连续重试次数。 */
let deviceHangupBindRetryAttempt = 0
/** 当前 registerEvent 的超时定时器。 */
let deviceHangupRegisterTimeoutTimer: ReturnType<typeof setTimeout> | null = null
/** 是否已注册小程序生命周期兜底挂断 */
let appHangupGuardBound = false
/** 是否已注册全局 onVoipEvent */
let globalVoipEventBound = false
/** Channel 事件回调引用，便于 off */
let deviceHangupHandler: ((res: { data?: unknown }) => void) | null = null
/** 业务侧收到 deviceHangup 后的附加回调（如关闭小程序） */
let onDeviceHangupCallback: ((payload?: unknown) => void) | null = null
/** 全局 onVoipEvent 解绑 */
let offGlobalVoipEvent: (() => void) | null = null
/** 是否已触发关闭，避免重复 exit / invoke */
let isClosingMiniProgram = false
/** 延迟关闭定时器 */
let closeMiniProgramTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 获取 WMPF Channel（仅设备端存在全局 wmpf，手机微信端没有）。
 */
function getWmpfChannel(): IWmpfChannel | null {
  // Android 9 的旧 WebView 不保证存在 globalThis，需回退到宿主暴露的全局对象。
  const globalRef = (
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : null
  ) as { wmpf?: { Channel?: IWmpfChannel } } | null
  return globalRef?.wmpf?.Channel ?? null
}

/** 清理 deviceHangup 注册超时定时器。 */
function clearDeviceHangupRegisterTimeout(): void {
  if (deviceHangupRegisterTimeoutTimer == null) {
    return
  }
  clearTimeout(deviceHangupRegisterTimeoutTimer)
  deviceHangupRegisterTimeoutTimer = null
}

/** 清理 deviceHangup 延迟重试定时器。 */
function clearDeviceHangupBindRetryTimer(): void {
  if (deviceHangupBindRetryTimer == null) {
    return
  }
  clearTimeout(deviceHangupBindRetryTimer)
  deviceHangupBindRetryTimer = null
}

/** 安排下一次 deviceHangup 注册重试。 */
function scheduleDeviceHangupBindRetry(reason: string): void {
  if (deviceHangupBound || deviceHangupBinding) {
    return
  }
  if (deviceHangupBindRetryAttempt >= DEVICE_HANGUP_BIND_RETRY_MAX_ATTEMPTS) {
    console.error('bindDeviceHangupListener: retry exhausted', {
      reason,
      attempt: deviceHangupBindRetryAttempt,
      maxAttempts: DEVICE_HANGUP_BIND_RETRY_MAX_ATTEMPTS,
    })
    return
  }
  if (deviceHangupBindRetryTimer != null) {
    return
  }
  const nextAttempt = deviceHangupBindRetryAttempt + 1
  console.warn('bindDeviceHangupListener: schedule retry', {
    reason,
    nextAttempt,
    delayMs: DEVICE_HANGUP_BIND_RETRY_INTERVAL_MS,
  })
  deviceHangupBindRetryTimer = setTimeout(() => {
    deviceHangupBindRetryTimer = null
    bindDeviceHangupListener()
  }, DEVICE_HANGUP_BIND_RETRY_INTERVAL_MS)
}

/**
 * 获取插件事件 data 的字段名，避免把可能包含敏感信息的原始值写入 Logcat。
 * @param eventData 插件事件附加数据
 * @returns 最多十个字段名
 */
function resolveVoipEventDataKeys(eventData: unknown): string[] {
  if (!eventData || typeof eventData !== 'object' || Array.isArray(eventData)) {
    return []
  }
  return Object.keys(eventData as Record<string, unknown>).sort().slice(0, 10)
}

/**
 * 提取插件事件里的安全状态值，仅允许基础类型，避免把原始对象写入宿主日志。
 * @param eventData 插件事件附加数据
 * @returns 可安全透传的状态值
 */
function resolveVoipEventStatus(eventData: unknown): string | undefined {
  if (!eventData || typeof eventData !== 'object' || Array.isArray(eventData)) {
    return undefined
  }
  const status = (eventData as { status?: unknown }).status
  if (status == null) {
    return undefined
  }
  if (typeof status === 'string') {
    return status.trim() || undefined
  }
  if (typeof status === 'number' || typeof status === 'boolean') {
    return String(status)
  }
  return undefined
}

/**
 * 读取插件结束事件里的 keepTime 秒数。
 * 微信侧消息时长以该字段为准；缺失时再回退到本地候选接通点。
 * @param eventData 插件事件附加数据
 * @returns 有效的通话秒数；缺失或非法时返回 undefined
 */
function resolveVoipKeepTimeSec(eventData: unknown): number | undefined {
  if (!eventData || typeof eventData !== 'object' || Array.isArray(eventData)) {
    return undefined
  }
  const keepTime = (eventData as { keepTime?: unknown }).keepTime
  const keepTimeValue = typeof keepTime === 'number' ? keepTime : Number(keepTime)
  if (!Number.isFinite(keepTimeValue) || keepTimeValue < 0) {
    return undefined
  }
  return Math.floor(keepTimeValue)
}

/**
 * 用插件结束事件里的 keepTime 覆盖结束诊断时间线。
 * 若 closeVoipMiniProgram 先于最终结束事件触发，后续仍允许用 keepTime 修正时长口径。
 * @param diagnostic 当前结束诊断
 * @param eventName 插件结束事件名称
 * @param eventData 插件结束事件附加数据
 * @param occurredAtMs 插件结束事件发生时间
 */
function patchVoipEndedDiagnosticByKeepTime(
  diagnostic: IVoipDurationDiagnostic,
  eventName: string,
  eventData: unknown,
  occurredAtMs: number,
): void {
  const keepTimeSec = resolveVoipKeepTimeSec(eventData)
  if (keepTimeSec === undefined) {
    return
  }
  diagnostic.eventName = eventName || diagnostic.eventName
  diagnostic.occurredAtMs = occurredAtMs
  diagnostic.eventStatus = resolveVoipEventStatus(eventData)
  diagnostic.eventDataKeys = resolveVoipEventDataKeys(eventData)
  if (diagnostic.sessionStartedAtMs !== undefined) {
    diagnostic.sessionElapsedMs = Math.max(0, occurredAtMs - diagnostic.sessionStartedAtMs)
  }
  diagnostic.candidateConnectedEvent = 'keepTime'
  diagnostic.candidateConnectedAtMs = Math.max(0, occurredAtMs - keepTimeSec * 1000)
  diagnostic.candidateDurationMs = keepTimeSec * 1000
  diagnostic.candidateDurationSec = keepTimeSec
}

/**
 * 判断当前插件事件是否是候选接通点。
 * @param eventName 插件事件名称
 * @returns 是否命中候选接通事件
 */
function isVoipConnectedCandidateEvent(eventName: string): boolean {
  return CALL_CONNECTED_CANDIDATE_EVENT_NAMES.has(eventName.trim().toLowerCase())
}

/**
 * 记录首个候选接通点，后续同类事件不得覆盖，保证同一通话的计时起点稳定。
 * @param eventName 插件事件名称
 * @param occurredAtMs 事件发生时间（毫秒时间戳）
 */
function markVoipConnectedCandidate(eventName: string, occurredAtMs: number): void {
  if (!isVoipSessionActive) {
    return
  }
  // 命中插件通话阶段事件后，生命周期兜底才允许介入；启动窗口的 appHide/pageUnload 先忽略。
  hasVoipEnteredActiveStage = true
  if (activeVoipCandidateConnectedAtMs !== undefined) {
    return
  }
  activeVoipCandidateConnectedAtMs = occurredAtMs
  activeVoipCandidateConnectedEvent = eventName
}

/**
 * 判断当前挂断原因是否允许在启动期直接 forceHangUp。
 * pageUnload / appHide 在插件尚未进入稳定通话阶段前只记日志，不得误杀已建房但尚未稳定的会话。
 * @param reason 挂断原因
 * @returns 是否允许继续执行挂断
 */
function shouldAllowForceHangUp(reason: string): boolean {
  const normalizedReason = reason.trim()
  if (normalizedReason !== 'appHide' && normalizedReason !== 'pageUnload') {
    return true
  }
  if (!hasVoipEnteredActiveStage || activeVoipSessionStartedAtMs === undefined) {
    return false
  }
  return Date.now() - activeVoipSessionStartedAtMs >= VOIP_LIFECYCLE_HANGUP_GRACE_MS
}

/**
 * 生成不含联系人和插件原始数据的本地计时诊断数据。
 * @param phase 当前诊断阶段
 * @param eventName 插件事件名称
 * @param occurredAtMs 事件发生时间（毫秒时间戳）
 * @param eventData 插件事件附加数据
 * @returns 供 WMPF Channel 回传 App 的诊断数据
 */
function createVoipDurationDiagnostic(
  phase: IVoipDurationDiagnostic['phase'],
  eventName: string,
  occurredAtMs: number,
  eventData: unknown,
): IVoipDurationDiagnostic {
  const diagnostic: IVoipDurationDiagnostic = {
    phase,
    eventName,
    occurredAtMs,
    voipPageVersion: VOIP_PAGE_VERSION,
    eventStatus: resolveVoipEventStatus(eventData),
    eventDataKeys: resolveVoipEventDataKeys(eventData),
  }
  if (activeVoipSessionId) {
    diagnostic.sessionId = activeVoipSessionId
  }
  if (activeVoipAppCallSessionId) {
    diagnostic.appCallSessionId = activeVoipAppCallSessionId
  }
  if (activeVoipSessionStartedAtMs !== undefined) {
    diagnostic.sessionStartedAtMs = activeVoipSessionStartedAtMs
    diagnostic.sessionElapsedMs = Math.max(0, occurredAtMs - activeVoipSessionStartedAtMs)
  }
  if (activeVoipCandidateConnectedAtMs !== undefined) {
    const candidateDurationMs = Math.max(0, occurredAtMs - activeVoipCandidateConnectedAtMs)
    diagnostic.candidateConnectedEvent = activeVoipCandidateConnectedEvent
    diagnostic.candidateConnectedAtMs = activeVoipCandidateConnectedAtMs
    diagnostic.candidateDurationMs = candidateDurationMs
    diagnostic.candidateDurationSec = Math.floor(candidateDurationMs / 1000)
  }
  return diagnostic
}

/**
 * 获取本次结束的不可变时长诊断。
 * 结束后的重复 Channel.invoke 必须复用同一份数据，避免清理会话状态后丢失时长。
 * @param eventName 插件结束事件名称
 * @param eventData 插件结束事件附加数据
 * @param occurredAtMs 插件结束事件发生时间
 * @returns 当前通话的结束诊断
 */
function getVoipEndedDiagnostic(
  eventName = '',
  eventData?: unknown,
  occurredAtMs = Date.now(),
): IVoipDurationDiagnostic {
  if (!activeVoipEndedDiagnostic) {
    activeVoipEndedDiagnostic = createVoipDurationDiagnostic('ended', eventName, occurredAtMs, eventData)
  }
  patchVoipEndedDiagnosticByKeepTime(activeVoipEndedDiagnostic, eventName, eventData, occurredAtMs)
  return activeVoipEndedDiagnostic
}

/**
 * 汇总当前关闭链路的关键上下文，便于对比是插件终态、end 页，还是生命周期/话筒链路触发。
 * 仅输出无敏感摘要，避免把 roomId、联系人或插件原始 data 打进日志。
 * @param reason 当前关闭/守卫原因
 * @param eventName 关联事件名
 * @param eventData 关联事件数据
 */
function buildVoipCloseDebugContext(reason: string, eventName = '', eventData?: unknown) {
  const occurredAtMs = Date.now()
  const sessionElapsedMs = activeVoipSessionStartedAtMs === undefined
    ? -1
    : Math.max(0, occurredAtMs - activeVoipSessionStartedAtMs)
  return {
    reason,
    eventName,
    eventDataKeys: resolveVoipEventDataKeys(eventData),
    eventStatus: resolveVoipEventStatus(eventData),
    hasVoipEnteredActiveStage,
    isVoipSessionActive,
    hasForcedHangUp,
    isClosingMiniProgram,
    hasRoomId: Boolean(activeVoipRoomId),
    sessionElapsedMs,
    candidateConnectedEvent: activeVoipCandidateConnectedEvent || '',
    candidateConnectedAtMs: activeVoipCandidateConnectedAtMs || 0,
    hasEndedDiagnostic: Boolean(activeVoipEndedDiagnostic),
    hasAppCallSessionId: Boolean(activeVoipAppCallSessionId),
  }
}

/**
 * 输出当前会话守卫状态，便于在体验版仅靠宿主 logcat 排查秒退原因。
 * @param eventName 诊断事件名称
 * @param reason 当前触发原因
 * @param guardAllowed 当前原因是否允许继续执行挂断/关闭
 */
function notifyAppVoipGuardState(
  eventName: string,
  reason: string,
  guardAllowed: boolean,
): void {
  const occurredAtMs = Date.now()
  const diagnostic: IVoipDurationDiagnostic = {
    ...createVoipDurationDiagnostic('event', eventName, occurredAtMs, undefined),
    eventName,
    occurredAtMs,
    guardReason: reason,
    guardAllowed,
    activeStageEntered: hasVoipEnteredActiveStage,
    sessionActive: isVoipSessionActive,
    forcedHangUp: hasForcedHangUp,
    closingMiniProgram: isClosingMiniProgram,
    lifecycleGraceMs: VOIP_LIFECYCLE_HANGUP_GRACE_MS,
  }
  notifyAppVoipEvent(diagnostic, true)
}

/**
 * 将插件事件时间线回传 Android，供原生层输出 Logcat。
 * @param diagnostic 本地时长诊断数据
 * @param shouldInvokeSync 是否优先同步发送，适用于页面销毁和关闭守卫
 * @returns 是否成功发起 invoke
 */
function notifyAppVoipEvent(diagnostic: IVoipDurationDiagnostic, shouldInvokeSync = false): boolean {
  const channel = getWmpfChannel()
  if (!channel) {
    return false
  }
  const data = JSON.stringify(diagnostic)
  if (shouldInvokeSync && typeof channel.invokeSync === 'function') {
    try {
      channel.invokeSync({
        command: WMPF_VOIP_EVENT_COMMAND,
        data,
      })
      return true
    } catch (error) {
      // 旧 WMPF 或同步通道异常时回退异步通道，不能因诊断阻断通话流程。
      console.error('notifyAppVoipEvent invokeSync error:', error)
    }
  }
  if (typeof channel.invoke !== 'function') {
    return false
  }
  try {
    channel.invoke({
      command: WMPF_VOIP_EVENT_COMMAND,
      data,
      fail(error) {
        console.error('notifyAppVoipEvent invoke fail:', error)
      },
    })
    return true
  } catch (error) {
    console.error('notifyAppVoipEvent error:', error)
    return false
  }
}

/**
 * 将通话发起页生命周期和建房阶段透传给 Android Logcat。
 * @param pageEvent 页面稳定阶段标识
 * @param isNavigatingToCallPage 是否正跳转插件通话页
 * @param appCallSessionId 宿主 App 创建的无敏感会话 ID
 * @param options 页面阶段事件发送选项
 * @returns 是否成功发起 Invoke Channel 调用
 */
export function notifyAppVoipPageEvent(
  pageEvent: string,
  isNavigatingToCallPage = false,
  appCallSessionId?: string,
  options: INotifyAppVoipPageEventOptions = {},
): boolean {
  const occurredAtMs = Date.now()
  const normalizedPageEvent = pageEvent.trim().slice(0, 64) || 'unknown'
  const normalizedAppCallSessionId = appCallSessionId?.trim() || activeVoipAppCallSessionId
  const shouldInvokeSync = options.preferSync === true
  const diagnostic: IVoipDurationDiagnostic = {
    ...createVoipDurationDiagnostic('event', `callPage.${normalizedPageEvent}`, occurredAtMs, undefined),
    appCallSessionId: normalizedAppCallSessionId,
    eventName: `callPage.${normalizedPageEvent}`,
    occurredAtMs,
    pageEvent: normalizedPageEvent,
    isNavigatingToCallPage,
    hasRoomId: Boolean(activeVoipRoomId),
    activeStageEntered: hasVoipEnteredActiveStage,
    sessionActive: isVoipSessionActive,
    forcedHangUp: hasForcedHangUp,
    closingMiniProgram: isClosingMiniProgram,
  }
  return notifyAppVoipEvent(diagnostic, shouldInvokeSync)
}

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
 * 设备端默认通话 UI：免提开、主窗口显示对端。
 * 须在 initByCaller / 跳转插件通话页之前调用。
 */
export const WMPF_VOIP_DEVICE_DEFAULT_UI_CONFIG: IWmpfVoipUiConfig = {
  handsFree: true,
  isSelfWindowMax: false,
}

/**
 * 设置 VOIP 插件通话界面。
 * @param config 界面配置；默认写入设备端免提 + 主窗口对端
 * @returns 是否成功调用（插件不存在或无 setUIConfig 时返回 false）
 */
export function setWmpfVoipUiConfig(config: IWmpfVoipUiConfig = WMPF_VOIP_DEVICE_DEFAULT_UI_CONFIG) {
  const wmpfVoip = getWmpfVoipPlugin()
  if (!wmpfVoip || typeof wmpfVoip.setUIConfig !== 'function') {
    console.warn('setWmpfVoipUiConfig: plugin or setUIConfig unavailable')
    return false
  }

  try {
    const payload: IWmpfVoipUiConfig = {
      ...WMPF_VOIP_DEVICE_DEFAULT_UI_CONFIG,
      ...config,
    }
    console.log('setUIConfig:', payload)
    wmpfVoip.setUIConfig(payload)
    return true
  } catch (error) {
    console.error('setWmpfVoipUiConfig:', error)
    return false
  }
}

/**
 * 发起 VOIP 通话
 * @param params 插件发起通话参数
 * @param appCallSessionId 宿主 App 创建的无敏感计费会话 ID
 */
export function initWmpfVoipByCaller(
  params: IWmpfVoipInitByCallerParams,
  appCallSessionId?: string,
) {
  const wmpfVoip = getWmpfVoipPlugin()

  if (!wmpfVoip) {
    return Promise.reject(new Error('当前环境未接入 VOIP 通话插件'))
  }

  if (!ensureGlobalVoipEventGuard()) {
    return Promise.reject(new Error('VOIP 通话事件监听绑定失败'))
  }

  // 通话开始前固定设备端默认 UI（免提、主窗口对端）
  setWmpfVoipUiConfig(WMPF_VOIP_DEVICE_DEFAULT_UI_CONFIG)
  // WMPF 2.2 实机会在建房期间提前跳入自定义 end 页；终态统一交给全局 onVoipEvent 收尾。
  // 必须早于 initByCaller：插件若在 Promise resolve 前发候选接通事件，仍可被本地计时捕获。
  markVoipSessionActive(undefined, appCallSessionId)

  console.log('initByCaller:', {
    roomType: params.roomType,
    businessType: params.businessType || 1,
    miniprogramState: params.miniprogramState || '-',
    hasCustomQuery: Boolean(params.customQuery),
  })
  return wmpfVoip.initByCaller(params)
}

/**
 * 跳转到 VOIP 插件通话页
 * @returns 插件通话页是否跳转成功
 */
export function redirectToWmpfVoipCallPage(): Promise<boolean> {
  const wmpfVoip = getWmpfVoipPlugin()

  if (!wmpfVoip) {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    try {
      uni.redirectTo({
        url: wmpfVoip.CALL_PAGE_PATH,
        success() {
          resolve(true)
        },
        fail(error) {
          console.error('redirectToWmpfVoipCallPage:', error)
          resolve(false)
        },
      })
    } catch (error) {
      console.error('redirectToWmpfVoipCallPage:', error)
      resolve(false)
    }
  })
}

/**
 * 强制结束 VOIP 通话
 * @param roomId 通话房间号
 */
export function forceHangUpWmpfVoip(roomId?: string) {
  getWmpfVoipPlugin()?.forceHangUpVoip(roomId)
}

/**
 * 标记通话会话已开始，或在建房成功后补全房间号。
 * @param roomId 建房成功后的通话房间号
 * @param appCallSessionId 宿主 App 创建的无敏感计费会话 ID
 * @returns 当前本地通话会话 ID
 */
export function markVoipSessionActive(roomId?: string, appCallSessionId?: string) {
  if (isVoipSessionActive) {
    activeVoipRoomId = roomId || activeVoipRoomId
    return activeVoipSessionId || ''
  }

  activeVoipRoomId = roomId || undefined
  activeVoipSessionStartedAtMs = Date.now()
  activeVoipSessionId = `local-${activeVoipSessionStartedAtMs}-${++voipSessionSequence}`
  activeVoipAppCallSessionId = appCallSessionId?.trim() || undefined
  activeVoipCandidateConnectedAtMs = undefined
  activeVoipCandidateConnectedEvent = undefined
  activeVoipEndedDiagnostic = undefined
  hasVoipEnteredActiveStage = false
  isVoipSessionActive = true
  hasForcedHangUp = false
  isClosingMiniProgram = false
  if (closeMiniProgramTimer != null) {
    clearTimeout(closeMiniProgramTimer)
    closeMiniProgramTimer = null
  }
  return activeVoipSessionId
}

/**
 * 判断异步建房结果是否仍属于当前有效会话。
 * @param sessionId 调用 initByCaller 前取得的本地会话 ID
 * @returns 是否仍是当前有效会话
 */
export function isVoipSessionCurrent(sessionId: string): boolean {
  return Boolean(sessionId && isVoipSessionActive && activeVoipSessionId === sessionId)
}

/**
 * 拦截已结束会话的迟到建房结果。
 * 迟到成功返回的房间必须按明确 roomId 补挂断，且不得重新激活本地状态。
 * @param sessionId 调用 initByCaller 前取得的本地会话 ID
 * @param result 插件建房结果
 * @returns 是否允许当前页面继续补房间号并跳转插件页
 */
export function guardVoipInitResult(
  sessionId: string,
  result: IWmpfVoipInitByCallerResult,
): boolean {
  if (isVoipSessionCurrent(sessionId)) {
    return true
  }

  const staleRoomId = result.roomId || result.groupId
  if (result.isSuccess && staleRoomId) {
    try {
      forceHangUpWmpfVoip(staleRoomId)
    } catch (error) {
      console.error('guardVoipInitResult forceHangUp:', error)
    }
  }
  notifyAppVoipGuardState('guard:initByCaller:skip_stale_result', 'stale_init_result', false)
  return false
}

/**
 * 清除通话会话实时状态（插件已正常结束通话时调用，避免重复 forceHangUp）。
 * 已生成的结束诊断会保留到小程序退出，供 Channel 重试复用。
 */
export function clearVoipSession() {
  isVoipSessionActive = false
  activeVoipRoomId = undefined
  activeVoipSessionStartedAtMs = undefined
  activeVoipCandidateConnectedAtMs = undefined
  activeVoipCandidateConnectedEvent = undefined
  hasVoipEnteredActiveStage = false
}

/**
 * 在有效通话会话内强制挂断一次。
 * closeWxaApp 只关小程序，对端微信不会真正结束通话，必须走插件 forceHangUpVoip。
 * @param reason 挂断原因，仅写日志
 * @returns 是否实际执行了挂断
 */
export function forceHangUpActiveVoip(reason: string) {
  if (!isVoipSessionActive || hasForcedHangUp) {
    notifyAppVoipGuardState('guard:forceHangUp:skip_inactive', reason, false)
    return false
  }
  if (!shouldAllowForceHangUp(reason)) {
    notifyAppVoipGuardState('guard:forceHangUp:skip_lifecycle_grace', reason, false)
    console.log('forceHangUpActiveVoip skipped in lifecycle grace:', {
      reason,
      hasVoipEnteredActiveStage,
      sessionElapsedMs: activeVoipSessionStartedAtMs === undefined
        ? -1
        : Math.max(0, Date.now() - activeVoipSessionStartedAtMs),
      graceMs: VOIP_LIFECYCLE_HANGUP_GRACE_MS,
    })
    return false
  }

  notifyAppVoipGuardState('guard:forceHangUp:run', reason, true)
  hasForcedHangUp = true
  isVoipSessionActive = false
  hasVoipEnteredActiveStage = false
  const roomId = activeVoipRoomId
  activeVoipRoomId = undefined
  console.log('forceHangUpActiveVoip:', reason)

  try {
    forceHangUpWmpfVoip(roomId)
  } catch (error) {
    console.error('forceHangUpActiveVoip error:', error)
  }

  return true
}

/**
 * 通知 App：通话已结束，请 closeWxaApp。
 * @param reason 结束原因
 * @param extra 时长诊断等附加字段
 * @returns 是否成功发起 invoke（非 WMPF 或无 invoke 返回 false）
 */
export function notifyAppVoipEnded(reason: string, extra?: object) {
  const channel = getWmpfChannel()
  if (!channel || typeof channel.invoke !== 'function') {
    console.log('notifyAppVoipEnded: channel.invoke unavailable')
    return false
  }

  const extraRoomId = (extra as { roomId?: unknown } | undefined)?.roomId
  const payload = {
    reason: reason || 'voip_ended',
    roomId: activeVoipRoomId || (typeof extraRoomId === 'string' ? extraRoomId : ''),
    ts: Date.now(),
    ...(extra || {}),
  }
  const data = JSON.stringify(payload)
  console.log('notifyAppVoipEnded:', reason)

  try {
    channel.invoke({
      command: WMPF_VOIP_ENDED_COMMAND,
      data,
      success() {
        console.log('notifyAppVoipEnded success')
      },
      fail() {
        console.error('notifyAppVoipEnded fail')
      },
    })
    return true
  } catch (error) {
    console.error('notifyAppVoipEnded error:', error)
    return false
  }
}

/**
 * 立即关闭当前小程序（exitMiniProgram + 通知 App）。
 * @param reason 关闭原因
 */
export function closeVoipMiniProgram(reason: string) {
  if (isClosingMiniProgram) {
    notifyAppVoipGuardState('guard:closeMiniProgram:skip_closing', reason, false)
    return
  }
  notifyAppVoipGuardState('guard:closeMiniProgram:start', reason, true)
  isClosingMiniProgram = true
  isVoipSessionActive = false
  hasVoipEnteredActiveStage = false
  if (closeMiniProgramTimer != null) {
    clearTimeout(closeMiniProgramTimer)
    closeMiniProgramTimer = null
  }

  console.warn('closeVoipMiniProgram:', buildVoipCloseDebugContext(reason))
  // 先 Channel 通知 App：closeWxaApp + 回首页；稍后再 exit，避免抢在 App 回首页之前销毁通道。
  // 若尚未收到插件结束事件，不主动生成候选时长诊断，避免 end 页先到达时把偏早候选点写成最终扣费时长。
  const diagnostic = activeVoipEndedDiagnostic
  const notified = notifyAppVoipEnded(reason, diagnostic)
  // 再通知一次，提高对端挂断时 App 收到 voipEnded 的概率
  setTimeout(() => {
    notifyAppVoipEnded(`${reason}:retry`, diagnostic)
  }, 120)

  const runExit = () => {
    if (diagnostic && activeVoipEndedDiagnostic === diagnostic) {
      activeVoipEndedDiagnostic = undefined
    }
    if (diagnostic && activeVoipSessionId === diagnostic.sessionId) {
      activeVoipSessionId = undefined
      activeVoipAppCallSessionId = undefined
    }
    try {
      uni.exitMiniProgram({
        fail(error) {
          console.error('exitMiniProgram fail:', error)
        },
      })
    } catch (error) {
      console.error('exitMiniProgram error:', error)
    }
  }
  // 给 App 留出 closeWxaApp + bringHost 的时间（话筒路径不依赖此延迟）
  setTimeout(runExit, notified ? 450 : 200)
}

/**
 * 延迟关闭小程序（展示通话结果约 1s）。
 * @param reason 关闭原因
 * @param delayMs 延迟毫秒
 */
export function scheduleCloseVoipMiniProgram(reason: string, delayMs = CLOSE_AFTER_CALL_MS) {
  if (isClosingMiniProgram) {
    notifyAppVoipGuardState('guard:scheduleClose:skip_closing', reason, false)
    return
  }
  if (closeMiniProgramTimer != null) {
    clearTimeout(closeMiniProgramTimer)
  }
  notifyAppVoipGuardState('guard:scheduleClose:start', reason, true)
  console.log('scheduleCloseVoipMiniProgram:', reason, delayMs)
  closeMiniProgramTimer = setTimeout(() => {
    closeMiniProgramTimer = null
    closeVoipMiniProgram(reason)
  }, delayMs)
}

/**
 * 从插件事件对象解析 eventName（兼容字段名差异）。
 * @param event 插件回调
 */
export function resolveVoipEventName(event: unknown): string {
  if (!event || typeof event !== 'object') {
    return ''
  }
  const record = event as Record<string, unknown>
  const candidates = [record.eventName, record.event, record.name, record.type]
  for (const item of candidates) {
    if (typeof item === 'string' && item.trim()) {
      return item.trim()
    }
  }
  return ''
}

/**
 * 是否为通话结束类事件。
 * @param eventName 插件事件名
 */
export function isVoipCallEndEvent(eventName: string) {
  const name = eventName.trim().toLowerCase()
  if (!name) {
    return false
  }
  if (CALL_END_EVENT_NAMES.has(name)) {
    return true
  }
  // joinfail* 在建房后、进入稳定通话阶段前可能只是插件侧过渡失败；
  // 过早按终态处理会直接触发 voipEnded + exitMiniProgram。
  if (name.startsWith(CALL_JOIN_FAIL_EVENT_PREFIX)) {
    return hasVoipEnteredActiveStage
  }
  return false
}

/**
 * 监听设备下发的 deviceHangup，并调用 forceHangUpVoip。
 * 模块级注册，跳转插件通话页后仍可收到事件。
 * @param onHangup 挂断后的业务回调（如延迟关闭小程序）
 * @returns 是否成功绑定（非 WMPF 环境返回 false）
 */
export function bindDeviceHangupListener(onHangup?: (payload?: unknown) => void) {
  if (onHangup) {
    onDeviceHangupCallback = onHangup
  } else if (!onDeviceHangupCallback) {
    // 默认：挂断后 1s 关小程序
    onDeviceHangupCallback = () => {
      scheduleCloseVoipMiniProgram('deviceHangup', CLOSE_AFTER_CALL_MS)
    }
  }

  if (deviceHangupBound) {
    console.log('bindDeviceHangupListener: already bound', {
      attempt: deviceHangupBindRetryAttempt,
    })
    return true
  }
  if (deviceHangupBinding) {
    console.log('bindDeviceHangupListener: binding in progress', {
      attempt: deviceHangupBindRetryAttempt,
    })
    return false
  }

  const channel = getWmpfChannel()
  if (!channel) {
    console.warn('bindDeviceHangupListener: channel unavailable', {
      attempt: deviceHangupBindRetryAttempt,
      hasGlobalWmpf: typeof ((typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : null) as { wmpf?: unknown } | null)?.wmpf !== 'undefined',
    })
    scheduleDeviceHangupBindRetry('channel_unavailable')
    return false
  }

  if (!deviceHangupHandler) {
    deviceHangupHandler = (res) => {
      console.log('deviceHangup event received')
      forceHangUpActiveVoip('deviceHangup')
      onDeviceHangupCallback?.(res?.data)
    }
  }

  deviceHangupBinding = true
  clearDeviceHangupBindRetryTimer()
  clearDeviceHangupRegisterTimeout()
  const nextAttempt = deviceHangupBindRetryAttempt + 1
  deviceHangupRegisterTimeoutTimer = setTimeout(() => {
    deviceHangupRegisterTimeoutTimer = null
    if (!deviceHangupBinding || deviceHangupBound) {
      return
    }
    deviceHangupBinding = false
    console.error('registerEvent deviceHangup timeout', {
      attempt: nextAttempt,
      timeoutMs: DEVICE_HANGUP_REGISTER_TIMEOUT_MS,
    })
    scheduleDeviceHangupBindRetry('register_timeout')
  }, DEVICE_HANGUP_REGISTER_TIMEOUT_MS)

  try {
    channel.registerEvent({
      event: WMPF_DEVICE_HANGUP_EVENT,
      success() {
        clearDeviceHangupRegisterTimeout()
        deviceHangupBinding = false
        deviceHangupBound = true
        deviceHangupBindRetryAttempt = 0
        console.log('registerEvent deviceHangup success', {
          attempt: nextAttempt,
        })
      },
      fail(err) {
        clearDeviceHangupRegisterTimeout()
        deviceHangupBinding = false
        console.error('registerEvent deviceHangup fail', {
          attempt: nextAttempt,
          err,
        })
        scheduleDeviceHangupBindRetry('register_fail')
      },
    })
    channel.on(WMPF_DEVICE_HANGUP_EVENT, deviceHangupHandler)
    deviceHangupBindRetryAttempt = nextAttempt
    console.log('bindDeviceHangupListener: register requested', {
      attempt: nextAttempt,
    })
    return false
  } catch (error) {
    clearDeviceHangupRegisterTimeout()
    deviceHangupBinding = false
    console.error('bindDeviceHangupListener:', error)
    scheduleDeviceHangupBindRetry('register_throw')
    return false
  }
}

/**
 * 取消 deviceHangup 监听。
 * 注意：跳转插件通话页期间不要调用，否则听筒挂断收不到事件。
 */
export function unbindDeviceHangupListener() {
  onDeviceHangupCallback = null
  clearDeviceHangupBindRetryTimer()
  clearDeviceHangupRegisterTimeout()
  deviceHangupBinding = false
  deviceHangupBindRetryAttempt = 0

  if (!deviceHangupBound) {
    deviceHangupHandler = null
    return
  }

  const channel = getWmpfChannel()
  if (channel && deviceHangupHandler) {
    try {
      channel.off(WMPF_DEVICE_HANGUP_EVENT, deviceHangupHandler)
      channel.unregisterEvent({
        event: WMPF_DEVICE_HANGUP_EVENT,
      })
      console.log('unbindDeviceHangupListener: success')
    } catch (error) {
      console.error('unbindDeviceHangupListener:', error)
    }
  }

  deviceHangupHandler = null
  deviceHangupBound = false
}

/**
 * 全局监听插件通话事件。
 * 官方要求：通话开始前绑定；不要放在页面 onLoad 里重复绑（应用启动时绑一次）。
 * 对端/本端挂断后：尽快 notify App voipEnded + exitMiniProgram，回到宿主 App。
 */
export function ensureGlobalVoipEventGuard() {
  if (globalVoipEventBound || __UNI_PLATFORM__ !== 'mp-weixin') {
    return globalVoipEventBound
  }

  const plugin = getWmpfVoipPlugin()
  if (!plugin || typeof plugin.onVoipEvent !== 'function') {
    console.warn('ensureGlobalVoipEventGuard: plugin.onVoipEvent unavailable')
    return false
  }

  try {
    const off = plugin.onVoipEvent((event: IWmpfVoipEvent) => {
      const eventName = resolveVoipEventName(event)
      const occurredAtMs = Date.now()
      console.log('onVoipEvent(global):', {
        eventName,
        eventDataKeys: resolveVoipEventDataKeys(event.data),
      })
      if (isVoipConnectedCandidateEvent(eventName)) {
        // 候选接通事件仅用于本地兜底诊断；真正计费优先取结束事件里的 keepTime。
        markVoipConnectedCandidate(eventName, occurredAtMs)
      }
      notifyAppVoipEvent(createVoipDurationDiagnostic('event', eventName, occurredAtMs, event.data))
      const isJoinFailEvent = eventName.trim().toLowerCase().startsWith(CALL_JOIN_FAIL_EVENT_PREFIX)
      if (isJoinFailEvent && !hasVoipEnteredActiveStage) {
        notifyAppVoipGuardState('guard:joinfail:skip_pre_active', eventName, false)
        console.warn('onVoipEvent(global) joinfail ignored before active stage:', {
          eventName,
          eventDataKeys: resolveVoipEventDataKeys(event.data),
          hasVoipEnteredActiveStage,
          sessionElapsedMs: activeVoipSessionStartedAtMs === undefined
            ? -1
            : Math.max(0, occurredAtMs - activeVoipSessionStartedAtMs),
        })
        return
      }
      if (!isVoipCallEndEvent(eventName)) {
        return
      }
      console.warn('onVoipEvent(global) terminal event:', buildVoipCloseDebugContext(
        `voip_event:${eventName}`,
        eventName,
        event.data,
      ))
      const diagnostic = getVoipEndedDiagnostic(eventName, event.data, occurredAtMs)
      // 插件侧已正常结束，避免 appHide 再 forceHangUp
      clearVoipSession()
      // 立刻通知 App 关壳并回首页（不等待结果页）
      notifyAppVoipEnded(`voip_event:${eventName}`, diagnostic)
      // 再延迟 close（二次 notify + exitMiniProgram）
      scheduleCloseVoipMiniProgram(`voip:${eventName}`, CLOSE_AFTER_REMOTE_END_MS)
    })
    offGlobalVoipEvent = typeof off === 'function' ? off : null
    globalVoipEventBound = true
    console.log('ensureGlobalVoipEventGuard: bound')
    return true
  } catch (error) {
    globalVoipEventBound = false
    console.error('ensureGlobalVoipEventGuard:', error)
    return false
  }
}

/**
 * 小程序切后台/关闭时兜底挂断（设备仅 closeWxaApp 时也能结束对端通话）。
 * 全局只注册一次。
 */
export function ensureVoipLifecycleHangupGuard() {
  if (appHangupGuardBound || __UNI_PLATFORM__ !== 'mp-weixin') {
    return
  }

  appHangupGuardBound = true

  try {
    uni.onAppHide(() => {
      // 跳转插件页不会触发 onAppHide；closeWxaApp / 杀进程前一般会触发。
      // 但启动窗口里可能先 hide 再真正进入插件通话页，此时不能误判为异常退出直接挂断。
      forceHangUpActiveVoip('appHide')
    })
  } catch (error) {
    console.error('ensureVoipLifecycleHangupGuard:', error)
  }
}

/**
 * 一次性安装设备端 VOIP 运行期守卫（模块级，页面 redirectTo 后仍有效）。
 * - deviceHangup → forceHangUpVoip → 延迟关小程序
 * - onVoipEvent 结束 → 延迟关小程序 + 通知 App
 * - onAppHide 兜底 forceHangUp
 */
export function ensureVoipRuntimeGuards() {
  ensureVoipLifecycleHangupGuard()
  ensureGlobalVoipEventGuard()
  const bound = bindDeviceHangupListener()
  console.log('ensureVoipRuntimeGuards:', {
    globalVoipEventBound,
    appHangupGuardBound,
    deviceHangupBound,
    deviceHangupBinding,
    bindRequested: bound,
  })
}
