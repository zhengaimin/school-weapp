<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "亲情号码管理"
  }
}
</route>

<script lang="ts" setup>
import type { FamilyContact } from './types'

import { computed, onMounted } from 'vue'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'

import { FAMILY_EDIT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'

import { useRefresh } from '@/hooks/useRefresh'
import { useMessage, useToast } from '@/uni_modules/wot-design-uni'

import { deleteFamilyContact, getFamilyContactList } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const toast = useToast()
const message = useMessage()
const { pageLoading, pageError, onLoginSuccess, onLoginFail, getContentHeight } = usePage()

// 列表数据管理
const { loading, refreshLoading, loaded, empty, list, onRefreshList, onLoadMore }
  = useRefresh<FamilyContact>({
    get: getFamilyContactList,
    immediate: true,
  })

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

function handleToEdit(id = '') {
  uni.navigateTo({
    url: id ? FAMILY_EDIT_PATH : `${FAMILY_EDIT_PATH}?id=${id}`,
  })
}

// 显示删除确认弹框
function showDeleteConfirmModal(id: string) {
  message
    .confirm({
      title: '确认删除',
      msg: '确定要删除这个亲情号码吗？删除后无法恢复。',
    })
    .then(async () => {
      try {
        await deleteFamilyContact(id)
        toast.show('删除成功')
        onRefreshList()
      }
      catch (error) {
        console.error('删除失败:', error)
        toast.show('删除失败，请重试')
      }
    })
}

onMounted(() => {
  pageLoading.value = false
})
</script>

<template>
  <Page
    title="亲情号码管理"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 内容区域 -->
    <RefreshList
      :style="contentHeight"
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 t-2 b-4" space="y-3">
        <!-- 亲情号码列表 -->
        <WhiteCard v-for="contact in list" :key="contact.id">
          <view flex="~ items-center justify-between">
            <view>
              <view text="sm" font="medium" color="text-primary">
                {{ contact.relationship }}
              </view>
              <view text="xs" color="text-secondary" m="t-1">
                {{ contact.phoneNumber }}
              </view>
            </view>

            <view flex="~ items-center" gap="2">
              <view
                w="8"
                h="8"
                flex="~ items-center justify-center"
                @click="handleToEdit(contact.id)"
              >
                <Icon name="edit-line" icon-size="28rpx" />
              </view>
              <view
                w="8"
                h="8"
                flex="~ items-center justify-center"
                @click="showDeleteConfirmModal(contact.id)"
              >
                <Icon name="delete-bin-line" icon-size="28rpx" icon-color="#ef4444" />
              </view>
            </view>
          </view>
        </WhiteCard>
      </view>
    </RefreshList>

    <!-- 底部添加按钮 -->
    <view p="4">
      <TButton type="primary" size="large" block @click="() => handleToEdit()">
        添加亲情号码
      </TButton>
    </view>
  </Page>
</template>
