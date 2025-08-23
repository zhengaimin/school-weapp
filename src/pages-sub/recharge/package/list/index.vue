<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "设备充值"
  }
}
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { RECHARGE_PACKAGE_HISTORY_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'

// 模拟套餐数据
const packageList = ref([
  {
    id: 1,
    name: '套餐一',
    description: '包含30元话费',
    amount: 30,
  },
  {
    id: 2,
    name: '套餐二',
    description: '包含50元话费',
    amount: 50,
  },
  {
    id: 3,
    name: '套餐三',
    description: '包含100元话费',
    amount: 100,
  },
])

const router = useRouter()
const { pageLoading, pageError, onLoginFail, onLoginSuccess, getContentHeight } = usePage()
const { loading, refreshLoading, loaded, empty, list: recordsList, onRefreshList, onLoadMore } = useRefresh<{
  id: number
  name: string
  description: string
  amount: number
}>({
  get: async (query) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟分页
    const { page = 1, page_size = 10 } = query
    const start = (page - 1) * page_size
    const end = start + page_size
    const list = packageList.value.slice(start, end)

    return {
      code: 0,
      msg: 'success',
      data: {
        list,
        total: packageList.value.length,
      },
    } as any
  },
  immediate: true,
})

const contentStyle = computed(() => {
  return getContentHeight('0')
})

// 跳转到充值历史记录
function goToRechargeHistory() {
  router.push({
    path: RECHARGE_PACKAGE_HISTORY_PATH,
  })
}

function handleRecharge(item: any) {
  // TODO: 实现扣费操作
  console.log('充值套餐:', item)
}

onMounted(() => {
  onRefreshList()
})
</script>

<template>
  <Page
    title="话机套餐"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #header-right>
      <Icon
        name="history-line"
        :icon-color="NAVIGATION_SUFFIX_COLOR"
        :icon-size="NAVIGATION_SUFFIX_SIZE"
        @click="goToRechargeHistory"
      />
    </template>

    <RefreshList
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="4" space="y-3">
        <WhiteCard v-for="item in recordsList" :key="item.id" p="4" @click="handleRecharge(item)">
          <view flex="~ col" gap="2">
            <view flex="~ justify-between items-center" text="base gray-900" font="medium">
              {{ (item as any).name }}
              <view text="lg gray-900" font="bold">
                ¥{{ (item as any).amount }}
              </view>
            </view>
            <view text="sm gray-500">
              {{ (item as any).description }}
            </view>
          </view>
        </WhiteCard>
      </view>
    </RefreshList>
  </Page>
</template>
