// rpx转px
export function rpxToPx(rpx: number) {
  const { screenWidth } = uni.getWindowInfo()
  return (screenWidth * rpx) / 750
}

// px转rpx
export function pxToRpx(px: number) {
  const { screenWidth } = uni.getWindowInfo()
  return (750 * px) / screenWidth
}
