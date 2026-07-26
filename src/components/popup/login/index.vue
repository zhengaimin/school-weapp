<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { getWxCode, postWxPhoneApi } from '@/api/modules/user'
import { useUserStore } from '@/store/user'

interface Props {}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

defineProps<Props>()
const emit = defineEmits<Emits>()
const show = defineModel('modelValue', { default: false })

const loginDialogAgree = ref(false)
const userStore = useUserStore()
const { phone, userInfo } = storeToRefs(userStore)

// 点击协议链接处理
function onLoginDialogAgree(e: any) {
  const target = e.target || e.currentTarget

  // 点击用户服务协议
  if (target?.id === 'service-agreement') {
    uni.navigateTo({
      url: '/pages/common/service-agreement/index',
    })
  } else if (target?.id === 'privacy-policy') { // 点击隐私条款
    uni.navigateTo({
      url: '/pages/common/privacy-policy/index',
    })
  }
  // 其他区域点击不处理，让checkbox自己处理勾选状态
}

function loginSuccess() {
  uni.showToast({
    title: '登录成功',
    icon: 'none',
  })
  show.value = false
  emit('success')
}

// 登录上次账号
async function onGetPhoneNumber(e: any) {
  const {
    detail: { code },
  } = e

  if (!code) {
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none',
    })
    return
  }

  // 用户之前已经绑定过手机号，则不再绑定
  if (userInfo.value.phone) {
    phone.value = userInfo.value.phone

    loginSuccess()
  } else { // 用户之前没有绑定过手机号，则调用绑定手机号接口
    uni.showLoading({
      title: '加载中',
    })

    try {
      const { code: loginCode } = await getWxCode()
      const result = await postWxPhoneApi({ code, loginCode })

      if (result.code === 0) {
        const { phoneNumber } = result.data
        phone.value = phoneNumber
        userInfo.value.phone = phoneNumber

        loginSuccess()
      } else {
        uni.hideLoading()
      }
    } catch (error) {
      uni.hideLoading()
      console.error('获取手机号失败:', error)
    }
  }
}
// 提示：需要同意协议
function onTipLoginAgree() {
  uni.showToast({
    title: '请同意协议',
    icon: 'none',
  })
}

// 关闭登录
function onLoginDialogClose() {
  emit('close')
  show.value = false
}
</script>

<template>
  <!-- 登录弹框 -->
  <wd-popup
    v-model="show"
    :z-index="999999"
    position="center"
    :close-on-click-modal="false"
    custom-style="border-radius: 32rpx; overflow: visible; width: 90vw;"
  >
    <view class="login-popup-wrapper relative flex flex-col px-7 py-8">
      <view class="title mb-8 text-center text-[22px] text-[#1f304c] font-normal leading-[22px]">
        请先登录哦~
      </view>

      <wd-checkbox
        v-model="loginDialogAgree"
        size="16px"
        shape="square"
        custom-style="display: flex; flex-direction: row;"
      >
        <view class="whitespace-normal leading-[20px] -mt-0.5" @tap="onLoginDialogAgree">
          我已阅读并同意惠碳商城
          <text id="service-agreement" class="text-primary">
            《用户服务协议》
          </text>
          和
          <text id="privacy-policy" class="text-primary">
            《隐私条款》
          </text>
        </view>
      </wd-checkbox>

      <view class="btn-group mt-5">
        <!-- 同意协议，获取手机号 -->
        <button
          v-if="loginDialogAgree"
          class="btn btn-submit w-full"
          open-type="getPhoneNumber"
          @getphonenumber="onGetPhoneNumber"
        >
          登录上次账号
        </button>
        <!-- 不同意协议，提示要同意 -->
        <button v-else class="btn btn-submit w-full" @tap="onTipLoginAgree">
          登录上次账号
        </button>
      </view>

      <view class="close-wrapper absolute left-1/2 transform -bottom-15 -translate-x-1/2">
        <view class="line absolute bottom-8.5 left-1/2 h-6 w-0.5 transform -translate-x-1/2"></view>
        <image
          class="h-8 w-8 cursor-pointer"
          src="@img/wrong-circle-o.svg"
          alt="关闭"
          @tap="onLoginDialogClose"
        />
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.login-popup-wrapper {
  .btn-submit {
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 40rpx;
    height: 88rpx;
    font-size: 32rpx;
    font-weight: 500;

    &::after {
      border: none;
    }
  }

  .line {
    background: repeating-linear-gradient(
      180deg,
      #fff 0px,
      #fff 10rpx,
      transparent 10rpx,
      transparent 20rpx
    );
    background-size: 20rpx;
  }
}

:deep(.wd-checkbox) {
  .wd-checkbox__shape {
    flex-grow: 0;
  }

  .wd-checkbox__label {
    flex: 1;
  }
}
</style>
