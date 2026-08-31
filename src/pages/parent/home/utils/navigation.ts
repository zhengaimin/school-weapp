import type { INavigateToScoreParams } from '../types'
import { COMMON_WEBVIEW_PATH } from '@/constant/router'

/** 构建并跳转 webview 页面 */
function navigateToWebview(targetPath: string) {
  uni.navigateTo({
    url: `${COMMON_WEBVIEW_PATH}?path=${encodeURIComponent(targetPath)}`,
  })
}

/**
 * 跳转成绩页面
 * @param params 成绩页跳转参数
 * @returns void
 */
export function navigateToScore(params: INavigateToScoreParams) {
  const { scoreUrl, schoolName, onlyCode, rt } = params
  const targetPath = `${scoreUrl}?onlycode=${onlyCode}&schoolname=${schoolName}&act=score&rt=${rt}`
  return navigateToWebview(targetPath)
}

/**
 * 跳转家长留言页面
 * @param params 家长留言页跳转参数
 * @returns void
 */
export function navigateToParentMessage(params: INavigateToScoreParams) {
  const { scoreUrl, schoolName, onlyCode, tel, nickname, rt } = params
  const targetPath = `${scoreUrl}?onlycode=${onlyCode}&schoolname=${schoolName}&tel=${tel}&nickname=${nickname}&act=msg&rt=${rt}`
  return navigateToWebview(targetPath)
}
