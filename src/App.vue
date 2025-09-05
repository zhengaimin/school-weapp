<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { provide, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { isMpWeixin } from './utils/platform'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

const { initNavBarInfo } = useAppStore()

const isFirstLaunch = ref(true)
provide('isFirstLaunch', isFirstLaunch)

function initWxVerity() {
  if (!isMpWeixin)
    return

  // eslint-disable-next-line ts/no-require-imports
  const verify = require('./wxcomponents/verify_mpsdk/main')

  verify?.init()
}

onLaunch(() => {
  initNavBarInfo()

  initWxVerity()
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
