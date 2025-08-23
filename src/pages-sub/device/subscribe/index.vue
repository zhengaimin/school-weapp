<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "设备订阅"
  }
}
</route>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useMessage, useToast } from '@/uni_modules/wot-design-uni'
import { mockDevices, type Device } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared'
  }
})

const toast = useToast()
const message = useMessage()
const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()

// 搜索关键词
const searchKeyword = ref('')

// 模拟 API 请求
async function getDeviceList() {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  let deviceList = [...mockDevices]

  // 根据关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    deviceList = deviceList.filter(device => device.name.toLowerCase().includes(keyword))
  }

  return {
    code: 0,
    msg: 'success',
    data: {
      list: deviceList,
      total: deviceList.length
    }
  }
}

const { loading, refreshLoading, loaded, empty, list, onRefreshList, onLoadMore } =
  useRefresh<Device>({
    get: getDeviceList,
    immediate: true
  })

// 设备统计信息
const deviceStats = computed(() => {
  const total = list.value.length
  const subscribed = list.value.filter(d => d.subscribed).length
  return { total, subscribed }
})

// 刷新列表高度
const contentHeight = computed(() => {
  return getContentHeight('148rpx')
})

// 搜索
function handleSearch() {
  onRefreshList()
}

// 切换订阅状态
function toggleSubscription(deviceId: number) {
  const device = list.value.find(d => d.id === deviceId)
  if (device) {
    message
      .confirm({
        title: '提示',
        msg: device.subscribed ? '确定要取消订阅该设备吗？' : '确定要订阅该设备吗？'
      })
      .then(() => {
        device.subscribed = !device.subscribed
        // 显示提示
        toast.show(device.subscribed ? '订阅成功' : '取消订阅成功')
      })
  }
}
</script>

<template>
  <Page
    title="设备订阅"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <view p="4 t-2!">
      <view
        flex="~ items-center"
        bg="gray-50"
        border="~ gray-300 solid rounded-xl"
        p="x-3 y-3"
        focus-within="bg-white border-primary"
        transition="colors"
      >
        <Icon name="search-line" icon-color="#9ca3af" icon-size="32rpx" />
        <input
          v-model="searchKeyword"
          placeholder="搜索设备名称"
          bg="transparent"
          border="none"
          outline="none"
          flex="1"
          text="sm"
          p="l-2"
          h="6"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 设备列表区域 -->
    <RefreshList
      :custom-style="contentHeight"
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4">
        <!-- 列表标题和统计 -->
        <view flex="~ items-center justify-between" m="b-4">
          <view text="lg gray-900" font="semibold">可订阅设备</view>
          <view text="sm gray-500">
            共 {{ deviceStats.total }} 台设备，已订阅 {{ deviceStats.subscribed }} 台
          </view>
        </view>

        <!-- 设备列表 -->
        <view flex="~ col" gap="3">
          <WhiteCard v-for="device in list" :key="device.id">
            <view flex="~ items-center justify-between">
              <view flex="1" min-w="0" m="r-3">
                <view text="sm gray-900" font="medium">{{ device.name }}</view>
              </view>
              <view flex="shrink-0">
                <TButton
                  v-if="device.subscribed"
                  type="default"
                  size="small"
                  @click="toggleSubscription(device.id)"
                >
                  取消
                </TButton>
                <TButton v-else type="primary" size="small" @click="toggleSubscription(device.id)">
                  订阅
                </TButton>
              </view>
            </view>
          </WhiteCard>
        </view>
      </view>
    </RefreshList>
  </Page>
</template>
