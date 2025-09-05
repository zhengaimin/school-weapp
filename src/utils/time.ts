/**
 * at formatTime (http://127.0.0.1:25721/appservice/pages-sub/common/vendor.js:1929:10)
    new Date("2025-08-31 15:24:39") 在部分 iOS 下无法正常使用，iOS 只支持 "yyyy/MM/dd"、"yyyy/MM/dd HH:mm:ss"、"yyyy-MM-dd"、"yyyy-MM-ddTHH:mm:ss"、"yyyy-MM-ddTHH:mm:ss+HH:mm" 的格式
 */

// 格式化时间显示
export function formatTime(timeStr: string | undefined | null | number | Date): string {
  // 处理 undefined 或 null 值
  if (timeStr === undefined || timeStr === null || timeStr === '') {
    return '--'
  }

  // 检查时间字符串格式并处理
  let date: Date

  // 如果是 number 类型，直接创建 Date 对象
  if (typeof timeStr === 'number') {
    date = new Date(timeStr)
  } else if (timeStr instanceof Date) {
    // 如果已经是 Date 类型，直接使用
    date = timeStr
  } else {
    // 处理字符串类型
    // 检测是否是 iOS 不支持的格式 (yyyy-MM-dd HH:mm:ss)
    const iosUnsupportedFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

    if (iosUnsupportedFormat.test(timeStr)) {
      // 转换为 iOS 支持的格式 (yyyy/MM/dd HH:mm:ss)
      const formattedTimeStr = timeStr.replace(/-/g, '/')
      date = new Date(formattedTimeStr)
    }
    else {
      // 尝试直接解析
      date = new Date(timeStr)

      // 如果是 Invalid Date，尝试替换 - 为 /
      if (Number.isNaN(date.getTime())) {
        const formattedTimeStr = timeStr.replace(/-/g, '/')
        date = new Date(formattedTimeStr)
      }
    }
  }

  // 如果还是 Invalid Date，返回原始时间字符串
  if (Number.isNaN(date.getTime())) {
    return String(timeStr)
  }

  // 使用本地时间进行比较，避免时区问题
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  // 创建不带时区的日期对象用于比较
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (compareDate.getTime() === today.getTime()) {
    // 今天格式：今天 14:00
    return `今天 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
  }
  else if (compareDate.getTime() === yesterday.getTime()) {
    // 昨天格式：昨天 14:00
    return `昨天 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
  }
  else {
    // 其他格式：年-月-日 时:分
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
  }
}

// 补零函数
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}
