import { toast } from '@/utils/toast'

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本内容
 * @param label 复制成功的提示标签，用于显示在 toast 中
 * @returns Promise<void>
 */
export function copyToClipboard(text: string, label: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        toast.show(`${label}已复制`)
        resolve()
      },
      fail: (error) => {
        toast.show('复制失败')
        reject(error)
      },
    })
  })
}
