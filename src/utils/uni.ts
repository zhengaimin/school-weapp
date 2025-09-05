/**
 * uni API 方法封装
 * 将 uni 的原生方法封装为 Promise 形式，便于使用 async/await
 */

/**
 * 微信支付方法 - Promise 封装
 * @param params 支付参数
 * @returns Promise<any>
 */
export function requestWxPayment(params: {
  timeStamp: string
  nonceStr: string
  packageStr?: string
  package?: string
  signType: string
  paySign: string
}): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'wxpay',
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.packageStr || params.package,
      signType: params.signType,
      paySign: params.paySign,
      success: (res) => {
        console.log('支付成功', res)
        resolve(res)
      },
      fail: (error) => {
        console.log('支付失败', error)
        reject(error)
      },
    } as any)
  })
}
