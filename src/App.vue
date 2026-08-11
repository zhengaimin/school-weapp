<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { provide, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { ensureVoipRuntimeGuards } from '@/utils/voip'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

const { initNavBarInfo } = useAppStore()

const isFirstLaunch = ref(true)
provide('isFirstLaunch', isFirstLaunch)

onLaunch(() => {
  initNavBarInfo()
  // 插件事件必须在通话开始前完成绑定，页面加载时再执行一次幂等兜底。
  try {
    ensureVoipRuntimeGuards()
  } catch (error) {
    console.error('ensureVoipRuntimeGuards onLaunch:', error)
  }
})
</script>

<style lang="scss">
// @import 'http://192.168.110.217:8848/css/remixicon.css';
// @import 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css';

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.swiper {
  .uni-swiper-dot,
  .wx-swiper-dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 10rpx;

    &.uni-swiper-dot-active,
    &.wx-swiper-dot-active {
      width: 38rpx;
    }
  }
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
