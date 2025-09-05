<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
</route>

<script lang="ts" setup>
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'
import { httpPost } from '@/http'

defineOptions({
  options: {
    styleIsolation: 'apply-shared', // apply-shared shared
  },
})

const { pageLoading, pageError, batchRequestHandler, onLoginFail } = usePage()

function initVerifyMpsdk() {
  return new Promise((resolve, reject) => {
    ;(wx as any).startVerify({
      // 传入的数据
      data: {
        token: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a',
        startPath: '/pages/verify/index',
      },
      // 验证成功后触发
      success(data) {
        console.log('收到验证成功的回调')
        console.log(data)
        setTimeout(() => {
          wx.showModal({
            title: '收到验证成功的回调',
            content: `${data.BizToken}`,
            showCancel: false,
          })
        }, 500)

        resolve({ code: 0 })
      },
      // 验证失败时触发
      fail(err) {
        console.log('收到验证失败的回调', err)
        setTimeout(() => {
          wx.showModal({
            title: '收到验证失败的回调',
            content: `${err.ErrorCode} - ${err.ErrorMsg}`,
            showCancel: false,
          })
        }, 500)

        reject(new Error('组件未初始化'))
      },
    })
  })
}

// 临时方法：调用人脸识别检测接口
async function callFaceDetectAPI() {
  try {
    const response = await httpPost('http://localhost:3000/api/faceid/detect')
    console.log('人脸识别检测接口响应:', response)
    uni.showToast({
      title: '检测成功',
      icon: 'success',
    })
    return response
  }
  catch (error) {
    console.error('人脸识别检测失败:', error)
    uni.showToast({
      title: '检测失败',
      icon: 'none',
    })
    throw error
  }
}

async function onLoginSuccess() {
  await batchRequestHandler([callFaceDetectAPI()])

  await nextTick()
  setTimeout(() => {
    initVerifyMpsdk()
  }, 1000)
}
</script>

<template>
  <Page
    title="人脸核身"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <verify-mpsdk></verify-mpsdk>
  </Page>
</template>

<style scoped lang="scss"></style>
