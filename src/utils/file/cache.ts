import { ref } from 'vue'

const localCache = new Map<string, string>()
const downloading = new Set<string>()

/**
 * 缓存远程文件到本地
 * @param url 远程文件URL
 * @returns 本地文件路径
 */
export function useCachedMedia(url: string) {
  const localPath = ref<string | null>(null)

  if (!url || !url.startsWith('http')) {
    localPath.value = url
    return { localPath }
  }

  if (localCache.has(url)) {
    localPath.value = localCache.get(url)!
    return { localPath }
  }

  if (downloading.has(url)) {
    // 如果文件正在下载，则等待下载完成
    const checkInterval = setInterval(() => {
      if (localCache.has(url)) {
        localPath.value = localCache.get(url)!
        clearInterval(checkInterval)
      }
    }, 100)
    return { localPath }
  }

  downloading.add(url)

  uni.downloadFile({
    url,
    success: (res) => {
      if (res.statusCode === 200) {
        const path = res.tempFilePath
        localCache.set(url, path)
        localPath.value = path
        uni.saveFile({
          tempFilePath: path,
          success: (saveRes) => {
            localCache.set(url, saveRes.savedFilePath)
            localPath.value = saveRes.savedFilePath
          },
          fail: () => {
            // 保存失败，使用临时路径
            localPath.value = path
          },
        })
      }
      else {
        // 下载失败，直接使用远程URL
        localPath.value = url
      }
    },
    fail: () => {
      // 下载失败，直接使用远程URL
      localPath.value = url
    },
    complete: () => {
      downloading.delete(url)
    },
  })

  return { localPath }
}
