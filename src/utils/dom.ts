import { isMpWeixin } from '@/utils/platform'

/** 查询元素 */
export function querySelector(
  selector: string,
  options = { id: true, rect: true },
  content?: any,
): Promise<any[]> {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery()
    if (options === null) {
      options = { id: true, rect: true }
    }

    if (isMpWeixin && content) {
      query.in(content)
    }

    query.selectAll(selector).fields({ ...options }, (fieldElements) => {
      if (fieldElements && Array.isArray(fieldElements)) {
        resolve(fieldElements)
      }
      else {
        resolve([])
      }
    })
    query.exec()
  })
}

export function boundingClientRect(selector: string, content?: any) {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery()

    if (isMpWeixin && content) {
      query.in(content)
    }

    query.select(selector).boundingClientRect((errorElement) => {
      resolve(errorElement)
    })
    query.exec()
  })
}

/**
 * 获取元素的宽度和高度
 * @param selector 元素选择器
 * @param content 可选的上下文
 * @returns Promise<{width: number, height: number}>
 */
export async function getElementRect(selector: string, content?: any): Promise<{ width: number, height: number }> {
  const rect = await boundingClientRect(selector, content) as UniApp.NodeInfo | null
  if (rect) {
    return { width: rect.width, height: rect.height }
  }
  return { width: 0, height: 0 }
}
