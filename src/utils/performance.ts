/**
 * 节流函数
 * @param func 需要节流的函数
 * @param delay 延迟时间（ms）
 * @returns 节流后的函数
 */
export function throttle(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return function(this: any, ...args: any[]) {
    const currentTime = Date.now()
    const remainingTime = delay - (currentTime - lastExecTime)

    if (remainingTime <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastExecTime = currentTime
      func.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now()
        timeoutId = null
        func.apply(this, args)
      }, remainingTime)
    }
  }
}