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
// #region 导入
import type { Family } from '@/api/interface/modules/family'

import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useMessage } from 'wot-design-uni'
import { deleteFamilyContactApi, getFamilyContactsApi } from '@/api/modules/family/contacts'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import { FAMILY_EDIT_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { MessageCache } from '@/pages-sub/chat/utils/cache'
import { useConfigStore } from '@/store/config'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { useFamily } from '@/utils/emit/family'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Hooks
const message = useMessage()
const { pageLoading, pageError, onLoginFail, getContentHeight, batchRequestHandler } = usePage()
const { onRefreshFamilyList } = useFamily()
// #endregion

// #region 使用 Store
const configStore = useConfigStore()
const userStore = useUserStore()
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { relationshipValueMap } = storeToRefs(configStore)
const { currentStudent } = storeToRefs(parentStore)
// #endregion

// #region 定义响应式数据
const { loading, refreshLoading, loaded, empty, list, onRefreshList, onLoadMore }
  = useRefresh<Family.Contact.ResGetFamilyContactsApi>({
    get: getFamilyContactsApi,
    immediate: false,
  })
// #endregion

// #region 定义计算属性
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})
// #endregion

// #region 接口请求函数
// 删除亲情号列表
async function axiosDeleteFamilyContactApi(id: number) {
  try {
    uni.showLoading({ title: '正在删除...', icon: 'none' })

    // 找到要删除的联系人
    const contactToDelete = list.value.find(item => item.id === id)

    const result = await deleteFamilyContactApi(id)

    uni.hideLoading()
    if (result.code === 0) {
      uni.showToast({ title: '删除成功', icon: 'none' })
      list.value = list.value.filter(item => item.id !== id)
      // 更新 store 中的亲情号列表缓存
      currentStudentStore.setFamilyContacts(list.value)

      // 如果删除的亲情号手机号和当前用户手机号一致，清除 student store 中的 contactInfo
      if (contactToDelete?.phone && contactToDelete.phone === userStore.phone) {
        currentStudentStore.setContactInfo(null)
      }
      // 清空当前学生的聊天记录缓存
      if (currentStudent.value?.id) {
        console.log(currentStudent.value.id)
        MessageCache.clearCachedMessages(currentStudent.value.id)
      }

      await nextTick()
      customOnRefreshList()
    }

    return result
  }
  catch (error) {
    console.log('删除失败', error)
    uni.hideLoading()
    return { code: -1 }
  }
}
// #endregion

// #region 事件处理函数
function handleToEdit(id?: number) {
  const url = id ? `${FAMILY_EDIT_PATH}?id=${id}` : FAMILY_EDIT_PATH

  uni.navigateTo({
    url,
  })
}

function showDeleteConfirmModal(id?: number) {
  if (!id) {
    return
  }

  message
    .confirm({
      title: '确认删除',
      msg: '确定要删除这个亲情号码吗？删除后无法恢复。',
    })
    .then(async () => {
      axiosDeleteFamilyContactApi(id)
    })
}
// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  await batchRequestHandler([configStore.axiosGetRelationshipOptionsApi(true), onRefreshList()])
  // 缓存亲情号列表到 store
  parentStore.setFamilyContacts(list.value)
}
async function customOnRefreshList() {
  const result = await onRefreshList()
  // 刷新成功后，缓存亲情号列表到 store
  parentStore.setFamilyContacts(list.value)

  return result
}

// 定义取消监听的函数
let cancelFamilyListListener: (() => void) | null = null

onMounted(() => {
  // 使用新的事件监听机制
  cancelFamilyListListener = onRefreshFamilyList(customOnRefreshList)
})

onUnmounted(() => {
  // 取消事件监听
  if (cancelFamilyListListener) {
    cancelFamilyListListener()
    cancelFamilyListListener = null
  }
})
// #endregion
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
      @refresh="customOnRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 t-2 b-4" flex="~ col" gap="3">
        <!-- 亲情号码列表 -->
        <WhiteCard v-for="contact in list" :key="contact.id">
          <view flex="~ items-center justify-between">
            <view>
              <view text="sm" font="medium" color="text-primary">
                {{ contact?.nickname || relationshipValueMap[contact.relationship]?.label }}
              </view>
              <view text="xs" color="text-secondary" m="t-1">
                {{ contact.phone }}
              </view>
            </view>

            <view flex="~ items-center" gap="3">
              <view text="sm primary" @click="handleToEdit(contact.id!)">
                编辑
              </view>
              <view text="sm red-500" @click="showDeleteConfirmModal(contact.id!)">
                删除
              </view>
            </view>
          </view>
        </WhiteCard>
      </view>
    </RefreshList>

    <!-- 底部添加按钮 -->
    <view p="4">
      <TButton type="primary" size="large" full @click="() => handleToEdit()">
        添加亲情号码
      </TButton>
    </view>
  </Page>
</template>
