<route lang="jsonc">
{
  "style": {
    "navigationBarTitleText": "跳转小程序示例"
  }
}
</route>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useParentStore } from '@/store/auth/parent'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const parentStore = useParentStore()
const { userInfo } = storeToRefs(userStore)

function handleNavigate() {
  const openId = 'o5KRp17_viVMfo_Kck1QbCju9ANA'

  const fullPath = `/pages/otherGroupBind/index?serverUrl=https://school.geniuscarbon.cn&bindingFlag=Y&openId=${openId}&depUuid=SKFASKIWJKAFISDUFSDFD&schoolUuid=1&schoolName=长沙中学&userContactUuid=2`
  console.log(fullPath, 'develop')
  console.log('wx577bb6f100f10192')

  uni.navigateToMiniProgram({
    appId: 'wxf86491ae0549468c',
    path: '/pages/launch/index',
    envVersion: 'release', // 目标小程序的版本，支持 develop，trial，release； 如果小程序已经发布，则次参数无效，默认打开正式版
    success(res) {
      console.log('跳转成功', res)
    },
    fail(err) {
      console.error('跳转失败', err)
      uni.showToast({
        title: '跳转失败，请稍后重试',
        icon: 'none',
      })
    },
  })
}
</script>

<template>
  <view class="h-full flex items-center justify-center">
    <wd-button type="primary" @click="handleNavigate">
      跳转到第三方小程序
    </wd-button>
  </view>
</template>

<style scoped lang="scss"></style>
