import type { ResultData } from '@/api/interface'
import { computed, nextTick, onMounted, ref, unref } from 'vue'

interface IResponse extends ResultData {
  list: any[]
  total: number
}
interface IRefresh {
  get?: (query: any) => Promise<IResData<any>>
  formatItem?: (item: any) => any
  immediate?: boolean
}

export function useRefresh<T>({ get, formatItem, immediate = true }: IRefresh) {
  const loading = ref(false)
  const refreshLoading = ref(false)
  const loaded = ref(false)
  const list = ref<T[]>([])
  const query = ref<any>({
    page: 1,
    page_size: 10,
  })

  const empty = computed(() => list.value.length === 0 && !loading.value && !refreshLoading.value)

  const loadData = async (isRefresh = false) => {
    if (!get) {
      throw new Error('get is required')
    }

    await nextTick()
    if (isRefresh) {
      refreshLoading.value = true
      list.value = []
    }
    else {
      loading.value = true
    }

    try {
      const result: ResultData<IResponse> = await get(unref(query))

      if (result.code === 0) {
        const { list: data, total } = result.data

        const _list = formatItem ? data.map(item => formatItem(item)) : data

        list.value = isRefresh ? _list : [...list.value, ..._list]
        loaded.value = unref(list).length >= total
      }
    }
    catch (error) {
      console.error('加载数据失败:', error)
    }
    finally {
      loading.value = false
      refreshLoading.value = false
    }
  }
  const onRefreshList = async () => {
    loaded.value = false
    query.value.page = 1 // 重置页码
    await loadData(true)
  }
  const onLoadMore = async () => {
    if (!loaded.value && !loading.value && !refreshLoading.value) {
      query.value.page += 1 // 增加页码
      await loadData(false)
    }
  }

  onMounted(async () => {
    if (immediate) {
      // 等待组件完全挂载后再执行刷新
      await new Promise(resolve => setTimeout(resolve, 100))
      onRefreshList()
    }
  })

  return {
    loading,
    refreshLoading,
    loaded,
    empty,

    list,

    onRefreshList,
    onLoadMore,
  }
}
