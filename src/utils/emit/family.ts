// 定义事件名称
const REFRESH_FAMILY_LIST_EVENT = 'family:refreshList'

// 定义事件回调函数的类型
type RefreshFamilyListCallback = () => void

/**
 * 监听刷新家庭列表事件
 * @param callback 回调函数
 */
function onRefreshFamilyList(callback: RefreshFamilyListCallback) {
  uni.$on(REFRESH_FAMILY_LIST_EVENT, callback)

  // 返回一个取消监听的函数
  return () => {
    uni.$off(REFRESH_FAMILY_LIST_EVENT, callback)
  }
}

/**
 * 发送刷新家庭列表事件
 */
function emitRefreshFamilyList() {
  uni.$emit(REFRESH_FAMILY_LIST_EVENT)
}

/**
 * 家庭相关的 hook
 */
export function useFamily() {
  return {
    onRefreshFamilyList,
    emitRefreshFamilyList,
  }
}
