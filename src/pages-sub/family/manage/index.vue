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
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { useFamily } from '@/utils/emit/family'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const message = useMessage()
const { pageLoading, pageError, onLoginFail, getContentHeight, batchRequestHandler } = usePage()
const { onRefreshFamilyList } = useFamily()

const userStore = useUserStore()
const currentStudentStore = useCurrentStudentStore()
const { relationshipValueMap } = storeToRefs(currentStudentStore)
const { studentInfo } = storeToRefs(currentStudentStore)

const { loading, refreshLoading, loaded, empty, list, onRefreshList, onLoadMore }
  = useRefresh<Family.Contact.ResGetFamilyContactsApi>({
    get: getFamilyContactsApi,
    immediate: false,
  })

/** 内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

/** 删除亲情号 */
async function axiosDeleteFamilyContactApi(id: number) {
  try {
    uni.showLoading({ title: '正在删除...', icon: 'none' })

    const contactToDelete = list.value.find(item => item.id === id)
    const result = await deleteFamilyContactApi(id)

    uni.hideLoading()
    if (result.code === 0) {
      uni.showToast({ title: '删除成功', icon: 'none' })
      list.value = list.value.filter(item => item.id !== id)
      currentStudentStore.setFamilyContacts(list.value)

      if (contactToDelete?.phone && contactToDelete.phone === userStore.phone) {
        currentStudentStore.setContactInfo(null)
      }
      if (studentInfo.value?.studentId) {
        MessageCache.clearCachedMessages(studentInfo.value.studentId)
      }

      await nextTick()
      customOnRefreshList()
    }

    return result
  } catch (error) {
    console.error('删除失败', error)
    uni.hideLoading()
    return { code: -1 }
  }
}

/** 跳转到编辑页面 */
function handleToEdit(id?: number) {
  const url = id ? `${FAMILY_EDIT_PATH}?id=${id}` : FAMILY_EDIT_PATH
  uni.navigateTo({ url })
}

/** 显示删除确认弹窗 */
function showDeleteConfirmModal(id?: number) {
  if (!id) return

  message
    .confirm({
      title: '确认删除',
      msg: '确定要删除这个亲情号码吗？删除后无法恢复。',
    })
    .then(() => {
      axiosDeleteFamilyContactApi(id)
    })
}

/** 登录成功处理 */
async function onLoginSuccess() {
  await batchRequestHandler([currentStudentStore.axiosGetRelationshipOptionsApi(true), onRefreshList()])
  currentStudentStore.setFamilyContacts(list.value)
}

/** 自定义刷新列表 */
async function customOnRefreshList() {
  const result = await onRefreshList()
  currentStudentStore.setFamilyContacts(list.value)
  return result
}

let cancelFamilyListListener: (() => void) | null = null

onMounted(() => {
  cancelFamilyListListener = onRefreshFamilyList(customOnRefreshList)
})

onUnmounted(() => {
  if (cancelFamilyListListener) {
    cancelFamilyListListener()
    cancelFamilyListListener = null
  }
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
