<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "公话充值"
  }
}
</route>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'

import Icon from '@/components/icon/index.vue'
import { RECHARGE_BALANCE_PATH, RECHARGE_PACKAGE_LIST_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const router = useRouter()
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 跳转到公话充值
function goToPublicRecharge() {
  router.push({
    path: RECHARGE_PACKAGE_LIST_PATH,
  })
}

// 跳转到消费充值
function goToConsumptionRecharge() {
  router.push({
    path: RECHARGE_BALANCE_PATH,
  })
}
</script>

<template>
  <Page
    title="公话充值"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2!" flex="~ col" gap="4">
      <!-- 话机套餐 -->
      <WhiteCard p="4" @click="goToPublicRecharge">
        <view flex="~ items-center justify-between">
          <view text="base gray-900" font="medium">
            话机套餐
          </view>
          <view w="12" h="12" bg="blue-50" border="rounded-xl" flex="~ items-center justify-center">
            <Icon name="tablet-line" icon-color="#2563eb" icon-size="36rpx" />
          </view>
        </view>
      </WhiteCard>

      <!-- 余额充值 -->
      <WhiteCard p="4" @click="goToConsumptionRecharge">
        <view flex="~ items-center justify-between">
          <view text="base gray-900" font="medium">
            余额充值
          </view>
          <view
            w="12"
            h="12"
            bg="purple-50"
            border="rounded-xl"
            flex="~ items-center justify-center"
          >
            <Icon name="money-cny-circle-line" icon-color="#7c3aed" icon-size="36rpx" />
          </view>
        </view>
      </WhiteCard>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
