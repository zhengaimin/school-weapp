<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "欢迎使用"
  }
}
</route>

<script lang="ts" setup>
import type { IdentityOption } from './components/IdentityCard.vue'
import { storeToRefs } from 'pinia'
import { unref } from 'vue'
import { getWxCode, postWxPhoneApi } from '@/api/modules/user'
import Page from '@/components/common/page/index.vue'
import { PARENT_HOME_PATH, STUDENT_BIND_PATH } from '@/constant/router'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/auth/parent'
import { useUserStore } from '@/store/user'
import IdentityCard from './components/IdentityCard.vue'
import { identityOptions } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const userStore = useUserStore()
const parentStore = useParentStore()
const { userInfo } = storeToRefs(userStore)
const { needBind, students } = storeToRefs(parentStore)
const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

/** 绑定手机号 */
async function axiosPostWxPhoneApi(phoneCode: string) {
  const { code: loginCode } = await getWxCode()

  const result = await postWxPhoneApi({
    code: phoneCode,
    loginCode,
  })

  if (result.code === 0 && result.data.phoneNumber) {
    userStore.setPhone(result.data.phoneNumber)
  }
}

/**
 * 选择身份
 *  1) 设置角色与手机号
 *  2) 判断是否需要绑定
 *  3) 获取信息并跳转
 */
async function selectIdentity(identity: IdentityOption) {
  try {
    uni.showLoading({
      title: '登录中...',
    })
    const { id, code } = identity
    userStore.setRole(id)

    if (code) {
      await axiosPostWxPhoneApi(code)
    }

    if (unref(needBind)) {
      uni.navigateTo({
        url: STUDENT_BIND_PATH,
      })

      return
    }

    // 获取用户信息
    !unref(userInfo) && (await userStore.getUserInfo())

    // 获取学生列表
    if (!unref(students)?.length) {
      const result = await parentStore.axiosGetStudentListApi()

      if (result.code !== 0) {
        uni.navigateTo({
          url: `${STUDENT_BIND_PATH}`,
        })
        return
      }
    }

    uni.redirectTo({
      url: PARENT_HOME_PATH,
    })
  } catch (error) {
    console.log('selectIdentity', error)
  } finally {
    uni.hideLoading()
  }
}
</script>

<template>
  <Page
    :show="false"
    :show-tabbar="false"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 身份选择页面 -->
    <view min-h="screen" bg="bg-secondary">
      <!-- 顶部装饰背景 -->
      <view
        h="48"
        relative
        overflow="hidden"
        style="background: linear-gradient(135deg, #3269dd 0%, #5b8cff 100%)"
      >
        <!-- 装饰圆形 -->
        <view
          w="32"
          h="32"
          bg="white"
          border="rounded-full"
          absolute
          right--80rpx
          top--80rpx
          opacity-10
        />
        <view
          w="20"
          h="20"
          bg="white"
          absolute
          left--64rpx
          top-160rpx
          opacity-15
          border="rounded-full"
        />

        <!-- 内容 -->
        <view relative z="10" pt="16" px="6" text="white">
          <!-- 主标题区域 -->
          <view text="center" m="b-6">
            <view text="3xl left" font="bold" m="b-3" class="welcome-title">
              欢迎使用
            </view>
            <view text="lg left" opacity="75" m="b-2" class="app-name">
              鑫智生活服务
            </view>
          </view>
        </view>
      </view>

      <!-- 身份选择卡片 -->
      <view px="6" relative z="10" style="margin-top: -32px">
        <view flex="~ col" gap="4" class="fade-in">
          <!-- 身份选择项 -->
          <IdentityCard
            v-for="identity in identityOptions"
            :key="identity.id"
            :identity="identity"
            @click="selectIdentity"
          />
        </view>

        <!-- 底部说明 -->
        <view m="t-8" text="center">
          <view text="xs" color="text-muted">
            首次使用需要选择身份并进行验证
          </view>
          <view text="xs" color="text-muted" m="t-1">
            一个账号可以拥有多种身份
          </view>
        </view>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss">
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.welcome-title {
  animation: slideInDown 0.8s ease-out;
}

.app-name {
  animation: slideInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
