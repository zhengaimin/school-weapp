<script lang="ts" setup>
withDefaults(
  defineProps<{
    /** 缺省图片类型，支持传入图片 URL */
    image?: string
    /** 图片大小，默认单位为 `px` */
    imageSize?: string | number
    /** 提示文案 */
    tip?: string
    /** 预览图片的 mode 属性 */
    imageMode?: ImageMode
    /** 图片路径前缀，指向图片所在目录，用于拼接图片 URL */
    urlPrefix?: string
    customClass?: string
  }>(),
  {
    image: 'network',
    imageMode: 'aspectFit',
    urlPrefix: import.meta.env.VITE_IMAGE_BASEURL,
  },
)

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
</script>

<template>
  <wd-status-tip
    :custom-class="customClass"
    :image="image"
    :image-size="imageSize"
    :tip="tip"
    :image-mode="imageMode"
    :url-prefix="urlPrefix"
  >
    <template #image>
      <slot name="image" />
    </template>
    <slot />
  </wd-status-tip>
</template>
