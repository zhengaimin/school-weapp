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
import type { Devices } from '@/api/interface/modules/devices'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import {
  getDeviceGroupsApi,
  postConfirmDeviceGroupSubscriptionApi,
  postPrepareDeviceGroupSubscriptionApi,
  postUnsubscribeDeviceGroupApi,
} from '@/api/modules/devices/groups'
import Page from '@/components/common/page/index.vue'
import RefreshList from '@/components/common/refresh-list/index.vue'
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { isMpWeixin } from '@/utils/platform'
import { toast } from '@/utils/toast'
import SubscriptionItem from './components/SubscriptionItem.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, pageLoaded, onLoginFail, getContentHeight, batchRequestHandler }
  = usePage()
const { loading, refreshLoading, loaded, empty, list, onRefreshList, onLoadMore }
  = useRefresh<Devices.IDeviceGroupVo>({
    get: getDeviceGroupsApi,
    listField: 'deviceGroups',
    immediate: false,
  })
const currentStudentStore = useCurrentStudentStore()
const { contactInfo } = storeToRefs(currentStudentStore)

/** 正在更新订阅状态的设备组 ID */
const updatingId = ref<number | null>(null)

/** 内容区域高度 */
const contentHeight = computed(() => getContentHeight())

/**
 * 查询微信设备组授权状态
 * @param deviceVoipApi 微信设备 VOIP API
 * @param groupId 微信设备组 ID
 * @returns 1 表示已授权，0 表示已拒绝或取消，无记录或无法查询返回 null
 */
function getDeviceGroupAuthorizationStatus(
  deviceVoipApi: WechatMiniprogram.Wx,
  groupId: string,
) {
  const getDeviceVoIPList = deviceVoipApi.getDeviceVoIPList
  if (typeof getDeviceVoIPList !== 'function') {
    return Promise.resolve<0 | 1 | null>(null)
  }

  return new Promise<0 | 1 | null>((resolve) => {
    getDeviceVoIPList({
      success(result) {
        const authorization = result.list.find(item => item.group_id === groupId)
        resolve(authorization?.status ?? null)
      },
      fail(error) {
        console.error('getDeviceVoIPList:', error)
        resolve(null)
      },
    })
  })
}

/** 切换设备组订阅状态 */
async function handleToggleSubscription(device: Devices.IDeviceGroupVo) {
  if (updatingId.value !== null) {
    return
  }

  const familyContactId = unref(contactInfo)?.id
  if (familyContactId == null) {
    await uni.showModal({
      title: '提示',
      content: '当前手机号不在该学生亲情号中，请先添加亲情号',
      showCancel: false,
      confirmText: '确定',
    })
    return
  }

  if (device.isSubscribed) {
    const modalResult = await uni.showModal({
      title: '取消订阅',
      content: `确认取消订阅“${device.name}”吗？`,
      confirmText: '取消订阅',
      confirmColor: '#ef4444',
    })
    if (!modalResult.confirm) {
      return
    }
  } else if (!isMpWeixin) {
    toast.info('请在微信小程序中订阅设备组')
    return
  }

  updatingId.value = device.id
  let hasWechatAuthorization = false
  let isSubscriptionConfirmed = false

  try {
    if (device.isSubscribed) {
      // 微信不提供主动撤销设备组授权的 API，此处只取消业务订阅。
      const result = await postUnsubscribeDeviceGroupApi({
        familyContactId,
        deviceGroupId: device.id,
      })
      if (result.code !== 0) {
        return
      }
    } else {
      // 订阅需要依次完成业务预校验、微信授权和业务确认。
      const prepareResult = await postPrepareDeviceGroupSubscriptionApi({
        familyContactId,
        deviceGroupId: device.id,
      })
      if (prepareResult.code !== 0) {
        return
      }

      const wxApi = typeof wx === 'undefined'
        ? null
        : wx
      if (!wxApi) {
        toast.info('请升级微信后重试')
        return
      }

      const groupId = prepareResult.data.wechatAuth.groupId
      let authorizationStatus = await getDeviceGroupAuthorizationStatus(wxApi, groupId)
      if (authorizationStatus === 0) {
        const modalResult = await uni.showModal({
          title: '需要重新授权',
          content: '微信中的设备组授权已关闭，请前往小程序设置，在“语音、视频通话提醒”中重新开启。',
          confirmText: '去设置',
          cancelText: '暂不开启',
        })
        if (!modalResult.confirm) {
          return
        }

        await uni.openSetting()
        authorizationStatus = await getDeviceGroupAuthorizationStatus(wxApi, groupId)
        if (authorizationStatus !== 1) {
          toast.info('未开启设备组授权，订阅未生效')
          return
        }
      }

      // 已授权时跳过授权请求，避免重复打扰用户。
      hasWechatAuthorization = authorizationStatus === 1
      if (!hasWechatAuthorization) {
        const requestDeviceVoIP = wxApi.requestDeviceVoIP
        if (typeof requestDeviceVoIP !== 'function') {
          toast.info('请升级微信后重试')
          return
        }

        hasWechatAuthorization = await new Promise<boolean>((resolve) => {
          requestDeviceVoIP({
            isGroup: true,
            groupId,
            success() {
              resolve(true)
            },
            fail(error) {
              console.error('requestDeviceVoIP:', error)
              resolve(false)
            },
          })
        })
        if (!hasWechatAuthorization) {
          // 授权回调失败时复查实际状态，避免授权已生效但回调异常导致误判。
          authorizationStatus = await getDeviceGroupAuthorizationStatus(wxApi, groupId)
          hasWechatAuthorization = authorizationStatus === 1
          if (authorizationStatus === 0) {
            toast.info('微信授权已关闭，请在小程序设置中重新开启')
            return
          }
        }
      }
      if (!hasWechatAuthorization) {
        toast.info('未完成设备组授权，订阅未生效')
        return
      }

      // 微信授权与业务订阅相互独立，授权成功后仍需服务端确认。
      const confirmResult = await postConfirmDeviceGroupSubscriptionApi({
        familyContactId,
        deviceGroupId: device.id,
      })
      if (confirmResult.code !== 0) {
        await uni.showModal({
          title: '订阅确认失败',
          content: '微信设备组已授权，但业务订阅尚未完成，请再次点击订阅重试确认。',
          showCancel: false,
          confirmText: '知道了',
        })
        return
      }
      isSubscriptionConfirmed = true
    }

    toast.success(device.isSubscribed ? '取消订阅成功' : '订阅成功')
    await onRefreshList()
  } catch (error) {
    console.error('更新设备组订阅状态失败:', error)
    if (!device.isSubscribed && isSubscriptionConfirmed) {
      // 服务端已确认时，后续异常不应将已成功的订阅提示为失败。
      toast.success('订阅成功')
      return
    }
    if (!device.isSubscribed && hasWechatAuthorization) {
      // 微信已授权但确认结果不明确时，以刷新后的服务端状态为准。
      try {
        await onRefreshList()
      } catch (refreshError) {
        console.error('刷新设备组订阅状态失败:', refreshError)
      }

      const refreshedDevice = unref(list).find(item => item.id === device.id)
      if (refreshedDevice?.isSubscribed) {
        toast.success('订阅成功')
        return
      }

      await uni.showModal({
        title: '订阅确认失败',
        content: '微信设备组已授权，但业务订阅尚未完成，请再次点击订阅重试确认。',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }
    toast.error('操作失败，请稍后重试')
  } finally {
    updatingId.value = null
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  await batchRequestHandler([onRefreshList()])
}

onShow(() => {
  if (unref(pageLoaded)) {
    onRefreshList()
  }
})
</script>

<template>
  <Page
    title="设备订阅"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <RefreshList
      :custom-style="contentHeight"
      :loading="loading"
      :refresh-loading="refreshLoading"
      :loaded="loaded"
      :empty="empty"
      @refresh="onRefreshList"
      @loadmore="onLoadMore"
    >
      <view p="x-4 t-2 b-4">
        <view v-if="list.length" flex="~ items-center justify-between" m="b-4">
          <view text="lg gray-900" font="semibold">
            设备组列表
          </view>
        </view>

        <view flex="~ col" gap="3">
          <SubscriptionItem
            v-for="item in list"
            :key="item.id"
            :device="item"
            :loading="updatingId === item.id"
            :disabled="updatingId !== null && updatingId !== item.id"
            @toggle-subscription="handleToggleSubscription"
          />
        </view>
      </view>
    </RefreshList>
  </Page>
</template>
