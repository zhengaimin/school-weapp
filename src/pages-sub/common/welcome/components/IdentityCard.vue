<script lang="ts" setup>
import Icon from '@/components/icon/index.vue'

import { useToast } from '@/uni_modules/wot-design-uni'
import { isH5 } from '@/utils/platform'

// 身份选项类型
export interface IdentityOption {
  id: number
  title: string
  description: string
  icon: string
  iconColor: string
  iconBgColor: string
  route?: string

  [property: string]: any
}

// 组件属性
interface Props {
  /** 身份选项数据 */
  identity: IdentityOption
}
// 事件定义
interface Emits {
  (e: 'click', identity: IdentityOption): void
}

defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()

// 处理点击事件
function onGetPhoneNumber(e) {
  if (isH5) {
    toast.show('前往微信小程序进行手机号绑定')
  }
  else {
    const {
      detail: { code },
    } = e

    emit('click', {
      code,
      ...props.identity,
    })
  }
}
</script>

<template>
  <button
    bg="bg-primary!"
    border="rounded-xl none!"
    overflow-hidden
    p="6"
    cursor="pointer"
    transition="all duration-300"
    class="identity-card"
    open-type="getPhoneNumber"
    @getphonenumber="onGetPhoneNumber"
  >
    <view flex="~ items-center">
      <!-- 图标区域 -->
      <view
        w="12"
        h="12"
        border="rounded-lg"
        flex="~ items-center justify-center"
        m="r-4"
        :style="{ backgroundColor: identity.iconBgColor }"
      >
        <Icon :name="identity.icon" :icon-color="identity.iconColor" icon-size="40rpx" />
      </view>

      <!-- 内容区域 -->
      <view flex="~ col items-start 1">
        <view text="lg" font="semibold" color="text-primary">
          {{ identity.title }}
        </view>
        <view text="sm" color="text-secondary">
          {{ identity.description }}
        </view>
      </view>

      <!-- 箭头图标 -->
      <Icon name="arrow-right-s-line" icon-color="#9ca3af" icon-size="40rpx" />
    </view>
  </button>
</template>

<style scoped lang="scss">
button {
  @apply  m-0!;

  &::after {
    content: initial !important;
  }
}
</style>
