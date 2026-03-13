import type { Ref } from 'vue'
import type { FilterConfig } from '@/components/common/filter-group/index.vue'

import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { useDeviceType } from '@/hooks/useDeviceType'

export type FilterValue = string | number | number[] | [number, number]

interface DateRangeOptions {
  key?: string
  title?: string
  format?: string
  startField?: string
  endField?: string
  concise?: boolean
  defaultRange?: [number, number]
  enabled?: boolean
}

export interface ExtraFilter {
  key: string
  title: string
  options: FilterConfig['options']
  type?: FilterConfig['type']
  concise?: boolean
  inDrawer?: boolean
  defaultValue: FilterValue
  apply: (value: FilterValue, query: Record<string, unknown>) => void
}

interface DeviceTypeOptions {
  enabled?: boolean
  allValue?: string
  queryField?: string
  includeAll?: boolean
}

interface UseHistoryFiltersOptions {
  query: Ref<Record<string, unknown>>
  onRefreshList: () => void
  dateRange?: DateRangeOptions
  extraFilters?: ExtraFilter[]
  deviceType?: DeviceTypeOptions
}

const DEFAULT_DATE_RANGE_TITLE = '选择时间范围'
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_DEVICE_TYPE_VALUE = 'ALL'

export function useHistoryFilters(options: UseHistoryFiltersOptions) {
  const { query, onRefreshList } = options
  const { deviceTypeRadioOptions, supportedDeviceTypes, defaultDeviceType, isDeviceTypeSupported } = useDeviceType()
  const refreshQueued = ref(false)

  const dateRangeOptions = options.dateRange ?? {}
  const enableDateRange = dateRangeOptions.enabled !== false
  const dateRangeKey = dateRangeOptions.key ?? 'daterange'
  const dateRangeTitle = dateRangeOptions.title ?? DEFAULT_DATE_RANGE_TITLE
  const dateRangeFormat = dateRangeOptions.format ?? DEFAULT_DATE_FORMAT
  const startField = dateRangeOptions.startField ?? 'startDate'
  const endField = dateRangeOptions.endField ?? 'endDate'

  const deviceTypeOptions = options.deviceType ?? {}
  const includeDeviceTypeAll = deviceTypeOptions.includeAll !== false
  const deviceTypeAllValue = deviceTypeOptions.allValue ?? DEFAULT_DEVICE_TYPE_VALUE
  const deviceTypeQueryField = deviceTypeOptions.queryField ?? 'deviceType'
  const enableDeviceType = deviceTypeOptions.enabled !== false

  const extraFilters = options.extraFilters ?? []
  const extraFilterMap = new Map(extraFilters.map(item => [item.key, item]))

  const defaultDateRange: [number, number]
    = dateRangeOptions.defaultRange
      ?? [dayjs().subtract(1, 'year').valueOf(), dayjs().valueOf()]

  const filters = ref<FilterValue[]>([
    ...(enableDateRange ? [defaultDateRange] : []),
    ...extraFilters.map(item => item.defaultValue),
  ])

  const deviceTypeFilterOptions = computed(() => {
    if (!enableDeviceType) return []

    const deviceOptions = deviceTypeRadioOptions.value
    if (!deviceOptions || deviceOptions.length === 0) return []

    return [
      ...(includeDeviceTypeAll
        ? [
            {
              label: '全部',
              value: deviceTypeAllValue,
            },
          ]
        : []),
      ...deviceOptions,
    ]
  })

  const hasDeviceTypeOptions = computed(() => deviceTypeFilterOptions.value.length > 0)
  const hasSetDefaultDeviceType = ref(false)

  const filterConfigs = computed<FilterConfig[]>(() => {
    const configs: FilterConfig[] = []

    if (enableDateRange) {
      configs.push({
        key: dateRangeKey,
        title: dateRangeTitle,
        type: 'daterange',
        concise: dateRangeOptions.concise ?? false,
        options: [],
        inDrawer: false,
      })
    }

    extraFilters.forEach(item => configs.push({
      key: item.key,
      title: item.title,
      type: item.type,
      concise: item.concise,
      options: item.options,
      inDrawer: item.inDrawer ?? true,
    }))

    if (hasDeviceTypeOptions.value) {
      configs.push({
        key: 'deviceType',
        title: '设备类型',
        type: 'select',
        concise: false,
        options: deviceTypeFilterOptions.value,
        inDrawer: true,
      })
    }

    return configs
  })

  const baseFilterCount = computed(() => (enableDateRange ? 1 : 0) + extraFilters.length)

  const setDeviceTypeQuery = (deviceType: FilterValue) => {
    if (includeDeviceTypeAll && deviceType === deviceTypeAllValue) {
      delete query.value[deviceTypeQueryField]
      return
    }

    query.value[deviceTypeQueryField] = deviceType as string
  }

  const getDefaultDeviceType = () => {
    if (!supportedDeviceTypes.value || supportedDeviceTypes.value.length === 0) return undefined

    const candidate = defaultDeviceType.value
    if (isDeviceTypeSupported(candidate)) return candidate

    return supportedDeviceTypes.value[0]
  }

  const applyDateRange = (value: FilterValue) => {
    if (!enableDateRange) return
    const daterange = value as [number, number]
    if (!Array.isArray(daterange) || daterange.length !== 2) return

    const [startTime, endTime] = daterange
    query.value[startField] = dayjs(startTime).format(dateRangeFormat)
    query.value[endField] = dayjs(endTime).format(dateRangeFormat)
  }

  const applyFiltersToQuery = () => {
    if (enableDateRange) {
      applyDateRange(filters.value[0])
    }

    extraFilters.forEach((filter, index) => {
      const value = filters.value[(enableDateRange ? 1 : 0) + index]
      filter.apply(value, query.value)
    })

    if (!hasDeviceTypeOptions.value) {
      const fallbackDeviceType = getDefaultDeviceType()
      if (!fallbackDeviceType) {
        delete query.value[deviceTypeQueryField]
        return
      }

      query.value[deviceTypeQueryField] = fallbackDeviceType
      return
    }

    const deviceTypeIndex = baseFilterCount.value
    setDeviceTypeQuery(filters.value[deviceTypeIndex])
  }

  const onFilterChange = (key: string, value: FilterValue) => {
    if (enableDateRange && key === dateRangeKey) {
      applyDateRange(value)
    } else if (key === 'deviceType') {
      setDeviceTypeQuery(value)
    } else {
      const extraFilter = extraFilterMap.get(key)
      if (extraFilter) {
        extraFilter.apply(value, query.value)
      }
    }

    if (!refreshQueued.value) {
      refreshQueued.value = true
      Promise.resolve().then(() => {
        refreshQueued.value = false
        onRefreshList()
      })
    }
  }

  watch(
    hasDeviceTypeOptions,
    (value) => {
      if (!value) {
        filters.value = filters.value.slice(0, baseFilterCount.value)
        const fallbackDeviceType = getDefaultDeviceType()
        if (!fallbackDeviceType) {
          delete query.value[deviceTypeQueryField]
          return
        }

        query.value[deviceTypeQueryField] = fallbackDeviceType
        return
      }

      if (hasSetDefaultDeviceType.value) return

      const defaultDeviceTypeValue = includeDeviceTypeAll
        ? deviceTypeAllValue
        : (getDefaultDeviceType() || deviceTypeFilterOptions.value[0]?.value)

      filters.value = [
        ...filters.value.slice(0, baseFilterCount.value),
        defaultDeviceTypeValue,
      ]
      hasSetDefaultDeviceType.value = true
    },
    { immediate: true },
  )

  return {
    filters,
    filterConfigs,
    hasDeviceTypeOptions,
    onFilterChange,
    applyFiltersToQuery,
  }
}
