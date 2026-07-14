import type { ConsumptionRecord, ConsumptionRecordsQuery } from '../types'
import { computed } from 'vue'
import { getConsumptionRecordsApi } from '@/api/modules/user/consumption'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import { useRefresh } from '@/hooks/useRefresh'

/**
 * 消费记录页数据逻辑
 * @returns 消费记录列表、筛选状态与刷新方法
 */
export function useConsumptionRecords() {
  const { hasVideoDevice, hasDryerDevice, defaultDeviceType } = useDeviceType()
  const showDeviceType = computed(() => {
    const count = Number(hasVideoDevice.value) + Number(hasDryerDevice.value)
    return count > 1
  })

  /**
   * 组装消费记录接口请求参数
   * @param query 通用刷新查询参数
   * @returns 满足接口要求的消费记录查询参数
   */
  function buildConsumptionRecordsQuery(query: Record<string, unknown>): ConsumptionRecordsQuery {
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 10
    const params = {
      ...query,
      page,
      pageSize,
    }

    if (!showDeviceType.value && !params.deviceType) {
      params.deviceType = defaultDeviceType.value
    }

    return params as ConsumptionRecordsQuery
  }

  /**
   * 获取消费记录列表
   * @param query 通用刷新查询参数
   * @returns 消费记录接口响应
   */
  function getConsumptionRecords(query: Record<string, unknown>) {
    return getConsumptionRecordsApi(buildConsumptionRecordsQuery(query))
  }

  const {
    loading,
    refreshLoading,
    loaded,
    empty,
    list: recordsList,
    onRefreshList,
    onLoadMore,
    query,
  } = useRefresh<ConsumptionRecord>({
    get: getConsumptionRecords,
    immediate: false,
    listField: 'records',
  })

  const { filters, filterConfigs, onFilterChange, applyFiltersToQuery } = useHistoryFilters({
    query,
    onRefreshList,
  })

  /**
   * 刷新消费记录
   * 显式收窄为 Promise<{ code?: number }>，避免导出类型泄漏 useRefresh 内部类型。
   * @returns 仅包含 code 的结果，供 usePage.batchRequestHandler 使用
   */
  const onRefreshRecords = async (): Promise<{ code?: number }> => {
    const result = await onRefreshList()
    return { code: result?.code }
  }

  /**
   * 加载更多消费记录
   * 显式收窄为 Promise<{ code?: number }>，避免导出类型泄漏 useRefresh 内部类型。
   * @returns 仅包含 code 的结果，供统一请求处理复用
   */
  const onLoadMoreRecords = async (): Promise<{ code?: number }> => {
    await onLoadMore()
    return { code: 0 }
  }

  return {
    loading,
    refreshLoading,
    loaded,
    empty,
    recordsList,
    onRefreshList: onRefreshRecords,
    onLoadMore: onLoadMoreRecords,
    filters,
    filterConfigs,
    onFilterChange,
    applyFiltersToQuery,
    showDeviceType,
  }
}
