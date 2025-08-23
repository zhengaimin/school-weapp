import { BUSINESS_COLOR_GRADIENT } from '@/constant/modules/business'

/** 格式化业务按钮 */
export function formatBusinessItem(item: any) {
  const { color } = item

  const colorList = BUSINESS_COLOR_GRADIENT[color]
  // linear-gradient(90deg, #fff 0%, #eff6ff 50%, #dbeafe 100%)
  const bg = `linear-gradient(90deg, #fff 0%, ${colorList[0]} 50%, ${colorList[1]} 100%)`

  return {
    ...item,
    bg,
  }
}
