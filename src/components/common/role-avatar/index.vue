<script setup lang="ts">
import type { AvatarProps, AvatarSize, AvatarType } from './types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Icon from '@/components/icon/index.vue'
import { useCurrentStudentStore } from '@/store/business/currentStudent'

const props = withDefaults(defineProps<AvatarProps>(), {
  path: '',
  faceImg: true,
  type: 'student',
  size: 'medium',
  customStyle: '',
  customClass: '',
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const currentStudentStore = useCurrentStudentStore()
const { studentInfo } = storeToRefs(currentStudentStore)

/** 默认头像配置 */
const defaultAvatars: Record<AvatarType, { icon: string, bgColor: string, iconColor: string }> = {
  parent: {
    icon: 'parent-line',
    bgColor: 'bg-orange-100',
    iconColor: '#f97316',
  },
  teacher: {
    icon: 'user-line',
    bgColor: 'bg-green-100',
    iconColor: '#22c55e',
  },
  student: {
    icon: 'user-5-line',
    bgColor: 'bg-blue-100',
    iconColor: '#3b82f6',
  },
}

/** 尺寸配置 */
const sizeConfig: Record<AvatarSize, { container: string, icon: string }> = {
  small: {
    container: 'w-10 h-10',
    icon: '32rpx',
  },
  medium: {
    container: 'w-12 h-12',
    icon: '40rpx',
  },
  large: {
    container: 'w-16 h-16',
    icon: '56rpx',
  },
}

/** 容器样式 */
const containerClass = computed(() => {
  const sizeClass = sizeConfig[props.size].container
  const baseClasses = 'rounded-full flex items-center justify-center overflow-hidden'
  const bgColor = props.path ? 'bg-transparent' : defaultAvatars[props.type].bgColor
  return `${baseClasses} ${sizeClass} ${bgColor} ${props.customClass}`
})

/** 图标尺寸 */
const iconSize = computed(() => {
  return sizeConfig[props.size].icon
})

/** 默认头像信息 */
const defaultAvatar = computed(() => {
  return defaultAvatars[props.type]
})
</script>

<template>
  <view :class="containerClass" :style="customStyle" @click.stop="e => emit('click', e)">
    <image
      v-if="props.faceImg && studentInfo?.faceImageUrl"
      :src="studentInfo.faceImageUrl"
      class="h-full w-full"
      mode="aspectFill"
    />
    <image v-else-if="props.path" :src="props.path" class="h-full w-full" mode="aspectFill" />
    <Icon
      v-else
      :name="defaultAvatar.icon"
      :icon-color="defaultAvatar.iconColor"
      :icon-size="iconSize"
    />
  </view>
</template>
