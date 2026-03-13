import { ref } from 'vue'

const localCache = new Map<string, string>()
const downloading = new Set<string>()

/**
 * @description 规范化媒体路径，过滤无效的缓存路径
 * @param originUrl 资源原始 URL
 * @param candidatePath 候选缓存路径
 * @returns 可用路径
 */
function normalizeMediaPath(originUrl: string, candidatePath?: string | null): string {
  if (!candidatePath) return originUrl
  // 某些端会返回类似 http://store/... 的路径，image 组件无法正常展示，需回退原始 URL
  if (/^https?:\/\/store\//i.test(candidatePath)) return originUrl
  return candidatePath
}

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
    const cachePath = normalizeMediaPath(url, localCache.get(url))
    localCache.set(url, cachePath)
    localPath.value = cachePath
    return { localPath }
  }

  if (downloading.has(url)) {
    // 如果文件正在下载，则等待下载完成
    const checkInterval = setInterval(() => {
      if (localCache.has(url)) {
        localPath.value = normalizeMediaPath(url, localCache.get(url))
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
        const path = normalizeMediaPath(url, res.tempFilePath)
        localCache.set(url, path)
        localPath.value = path
        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            const savedPath = normalizeMediaPath(url, saveRes.savedFilePath)
            localCache.set(url, savedPath)
            localPath.value = savedPath
          },
          fail: () => {
            // 保存失败，使用临时路径
            localPath.value = path
          },
        })
      } else {
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
