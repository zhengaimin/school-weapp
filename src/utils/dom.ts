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
