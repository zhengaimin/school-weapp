import type { ResultData } from '@/api/interface'
import { computed, nextTick, onMounted, ref, unref } from 'vue'
import { isNumber } from '@/utils/is'

interface IResponse extends ResultData {
  [property: string]: any
  list: any[]
  total: number
}
interface IRefresh {
  get?: (query: IQuery) => Promise<IResData<any>>
  formatItem?: (item: any) => any
  immediate?: boolean
  listField?: string
}
interface IQuery {
  page: number
  pageSize: number

  [property: string]: any
}

export function useRefresh<T>({ get, formatItem, immediate = true, listField = 'list' }: IRefresh) {
  const loading = ref(false)
  const refreshLoading = ref(false)
  const loaded = ref(false)
  const list = ref<T[]>([])
  const query = ref<IQuery>({
    page: 1,
    pageSize: 10,
  })

  const empty = computed(
    () => !list.value || (list.value?.length === 0 && !loading.value && !refreshLoading.value),
  )

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
      // console.log(unref(query))
      const result: ResultData<IResponse> = await get(unref(query))

      if (result.code === 0) {
        const { [listField]: data, total } = result.data

        const listData = data || []
        const _list = formatItem ? listData.map(item => formatItem(item)) : listData

        list.value = isRefresh ? _list : [...list.value, ..._list]
        loaded.value = isNumber(total) ? unref(list)?.length >= total : true
      }

      return result
    }
    catch (error) {
      loaded.value = true
      console.error('加载数据失败:', error)

      return { code: -1, message: '加载数据失败' }
    }
    finally {
      loading.value = false
      refreshLoading.value = false
    }
  }
  const onRefreshList = async () => {
    loaded.value = false
    query.value.page = 1 // 重置页码
    return await loadData(true)
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
    query,
    loading,
    refreshLoading,
    loaded,
    empty,

    list,

    onRefreshList,
    onLoadMore,
  }
}
