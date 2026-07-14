<script lang="ts" setup>
import { getEnvBaseUrl } from '@/utils'

type ImageMode
  = | 'scaleToFill'
    | 'aspectFit'
    | 'aspectFill'
    | 'widthFix'
    | 'heightFix'
    | 'top'
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'

const props = withDefaults(
  defineProps<{
    /** 缺省图片类型，支持传入图片 URL */
    image?: string
    /** 图片大小，默认单位为 `px` */
    imageSize?: string | number
    /** 提示文案 */
    tip?: string
    /** 预览图片的 mode 属性 */
    imageMode?: ImageMode
    customClass?: string
  }>(),
  {
    image: 'network',
    imageMode: 'aspectFit',
    imageSize: 150,
  },
)

const imagePath = computed(() => {
  return `${getEnvBaseUrl()}/img/${props.image}.png`
})
</script>

<template>
  <wd-status-tip
    v-if="imagePath"
    :custom-class="customClass"
    :image="imagePath"
    :image-size="imageSize"
    :tip="tip"
    :image-mode="imageMode"
  >
    <slot />
  </wd-status-tip>
</template>
