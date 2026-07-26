/*
 * @Author: 菲鸽
 * @Date: 2024-03-28 19:13:55
 * @Last Modified by: 菲鸽
 * @Last Modified time: 2024-03-28 19:24:55
 */
export const platform = __UNI_PLATFORM__
export const isH5 = __UNI_PLATFORM__ === 'h5'
export const isApp = __UNI_PLATFORM__ === 'app'
export const isMp = __UNI_PLATFORM__.startsWith('mp-')
export const isMpWeixin = __UNI_PLATFORM__.startsWith('mp-weixin')
export const isMpAplipay = __UNI_PLATFORM__.startsWith('mp-alipay')
export const isMpToutiao = __UNI_PLATFORM__.startsWith('mp-toutiao')

/**
 * 微信小程序运行环境版本：develop 开发版 / trial 体验版 / release 正式版。
 * 非微信小程序环境返回空字符串。与 getEnvBaseUrl 同源，用于按环境区分 UI 与行为。
 */
export const weixinEnvVersion = (() => {
  if (!isMpWeixin) {
    return ''
  }
  try {
    const { miniProgram } = uni.getAccountInfoSync()
    return miniProgram?.envVersion || ''
  } catch {
    return ''
  }
})()

/** 是否为微信小程序正式版（生产环境） */
export const isMpWeixinRelease = isMpWeixin && weixinEnvVersion === 'release'

const PLATFORM = {
  platform,
  isH5,
  isApp,
  isMp,
  isMpWeixin,
  isMpAplipay,
  isMpToutiao,
}
export default PLATFORM
