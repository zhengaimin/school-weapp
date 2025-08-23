<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "孩子管理"
  }
}
</route>

<script lang="ts" setup>
import type { ChildInfo } from './data'

import { ref } from 'vue'

import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

import { usePage } from '@/hooks/usePage'
import Skeleton from './components/Skeleton.vue'
import { getChildrenList } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()

// 孩子列表数据
const childrenList = ref<ChildInfo[]>(getChildrenList())

// 查看孩子详情
function goToChildDetails(child: ChildInfo) {
  uni.navigateTo({
    url: `/pages-sub/parent/student/detail/index?id=${child.id}`,
  })
}

// 绑定孩子
function addChild() {
  uni.navigateTo({
    url: '/pages-sub/parent/student/bind/index',
  })
}

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})
</script>

<template>
  <Page
    :loading="pageLoading"
    :error="pageError"
    title="学生管理"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view scroll-y :style="contentHeight">
      <!-- 孩子列表 -->
      <view p="x-4 t-4 b-20" space="y-4">
        <WhiteCard v-for="child in childrenList" :key="child.id" @click="goToChildDetails(child)">
          <!-- 孩子基本信息 -->
          <view flex="~ items-center justify-between" m="b-3">
            <view flex="~ items-center">
              <view
                w="12"
                h="12"
                border="rounded-full"
                flex="~ items-center justify-center"
                m="r-3"
                :style="{ backgroundColor: child.avatarBg }"
              >
                <Icon :name="child.avatar" :color="child.avatarColor" size="36rpx" />
              </view>
              <view>
                <view text="sm gray-900" font="medium">
                  {{ child.name }}
                </view>
                <view text="xs gray-500">
                  {{ child.school }} · {{ child.grade }}
                </view>
              </view>
            </view>
            <Icon name="arrow-right-s-line" color="#9ca3af" size="32rpx" />
          </view>

          <!-- 人脸识别警告提示 -->
          <view
            v-if="child.faceStatus === 'failed'"
            bg="red-50"
            border="~ red-200 solid rounded-md"
            p="3"
            m="b-3"
          >
            <view flex="~ items-center" text="xs red-700">
              <Icon name="information-line" color="#b91c1c" size="24rpx" />
              <text m="l-2">
                {{ child.faceMessage }}
              </text>
            </view>
          </view>

          <!-- 学号和余额信息 -->
          <view bg="gray-50" border="rounded-md" p="3">
            <view grid="~ cols-2" gap="4" text="xs">
              <view>
                <text text="gray-500">
                  学号：
                </text>
                <text text="gray-900">
                  {{ child.studentId }}
                </text>
              </view>
              <view>
                <text text="gray-500">
                  余额：
                </text>
                <text text="primary" font="medium">
                  {{ child.balance }}
                </text>
              </view>
            </view>
          </view>
        </WhiteCard>
      </view>
    </scroll-view>

    <!-- 底部绑定按钮 -->
    <view p="4" h="164rpx" box-border>
      <TButton type="primary" size="large" block @click="addChild">
        绑定学生
      </TButton>
    </view>

    <!-- 骨架屏 -->
    <template #skeleton>
      <Skeleton />
    </template>
  </Page>
</template>
