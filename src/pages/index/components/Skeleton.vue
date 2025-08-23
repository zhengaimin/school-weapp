<script setup lang="ts">
// 家长中心首页骨架屏组件
</script>

<template>
  <view class="relative">
    <!-- 顶部背景区域骨架屏 -->
    <view class="header-bg-skeleton relative overflow-hidden">
      <!-- 顶部信息骨架 -->
      <view class="px-6 pt-6">
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '200rpx', height: '48rpx', borderRadius: '6rpx' }]"
          :custom-style="{ marginBottom: '24rpx', opacity: 0.3 }"
        />
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '120rpx', height: '36rpx', borderRadius: '6rpx' }]"
          :custom-style="{ opacity: 0.3 }"
        />
      </view>
    </view>

    <!-- 白色卡片区域骨架屏 -->
    <view class="relative z-10 min-h-screen rounded-t-xl bg-white -mt-6">
      <view class="p-4 pt-6">
        <!-- 功能按钮网格骨架屏 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            [
              { width: '22%', height: '80rpx', borderRadius: '12rpx' },
              { width: '22%', height: '80rpx', borderRadius: '12rpx', marginLeft: '4%' },
              { width: '22%', height: '80rpx', borderRadius: '12rpx', marginLeft: '4%' },
              { width: '22%', height: '80rpx', borderRadius: '12rpx', marginLeft: '4%' },
            ],
          ]"
          :custom-style="{ marginBottom: '32rpx' }"
        />

        <!-- 余额信息卡片骨架屏 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '208rpx', borderRadius: '16rpx', backgroundColor: '#0ec69a' },
          ]"
          :custom-style="{ marginBottom: '32rpx' }"
        />

        <!-- 我的孩子标题骨架屏 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            [
              { width: '144rpx', height: '56rpx' },
              { width: '128rpx', height: '32rpx', marginLeft: 'auto' },
            ],
          ]"
          :custom-style="{ marginBottom: '24rpx' }"
        />

        <!-- 孩子列表骨架屏 - 第1个孩子 -->
        <view class="mb-3 flex items-center rounded-lg bg-gray-50 p-4">
          <!-- 头像骨架 -->
          <wd-skeleton
            animation="gradient"
            :row-col="[{ width: '96rpx', height: '96rpx', borderRadius: '96rpx' }]"
            :custom-style="{ marginRight: '24rpx' }"
          />

          <!-- 信息区域 -->
          <view class="flex-1">
            <!-- 姓名 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '160rpx', height: '32rpx' }]"
              :custom-style="{ marginBottom: '12rpx' }"
            />
            <!-- 班级和学号 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '140rpx', height: '28rpx' }]"
            />
          </view>

          <!-- 消费信息 -->
          <view class="text-right">
            <!-- 本月消费标签 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '120rpx', height: '32rpx' }]"
              :custom-style="{ marginBottom: '12rpx' }"
            />
            <!-- 消费金额 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '80rpx', height: '28rpx', marginLeft: 'auto' }]"
            />
          </view>
        </view>

        <!-- 孩子列表骨架屏 - 第2个孩子 -->
        <view class="mb-6 flex items-center rounded-lg bg-gray-50 p-4">
          <!-- 头像骨架 -->
          <wd-skeleton
            animation="gradient"
            :row-col="[{ width: '96rpx', height: '96rpx', borderRadius: '96rpx' }]"
            :custom-style="{ marginRight: '24rpx' }"
          />

          <!-- 信息区域 -->
          <view class="flex-1">
            <!-- 姓名 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '160rpx', height: '32rpx' }]"
              :custom-style="{ marginBottom: '12rpx' }"
            />
            <!-- 班级和学号 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '140rpx', height: '28rpx' }]"
            />
          </view>

          <!-- 消费信息 -->
          <view class="text-right">
            <!-- 本月消费标签 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '120rpx', height: '32rpx' }]"
              :custom-style="{ marginBottom: '12rpx' }"
            />
            <!-- 消费金额 -->
            <wd-skeleton
              animation="gradient"
              :row-col="[{ width: '80rpx', height: '28rpx', marginLeft: 'auto' }]"
            />
          </view>
        </view>

        <!-- 消费趋势标题骨架屏 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            [
              { width: '144rpx', height: '56rpx' },
              { width: '128rpx', height: '32rpx', marginLeft: 'auto' },
            ],
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 消费趋势图表骨架屏 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <wd-skeleton
            animation="gradient"
            :row-col="[{ width: '100%', height: '400rpx', borderRadius: '8rpx' }]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
          <!-- 图例骨架屏 -->
          <wd-skeleton
            animation="gradient"
            :row-col="[
              [
                { width: '60rpx', height: '24rpx', borderRadius: '6rpx' },
                { width: '60rpx', height: '24rpx', borderRadius: '6rpx', marginLeft: '12rpx' },
              ],
            ]"
            :custom-style="{ justifyContent: 'center', display: 'flex', width: '100%' }"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.header-bg-skeleton {
  height: 260rpx;
  background: linear-gradient(135deg, #0ec69a 0%, #0bb88a 50%, #08a67a 100%);
}
</style>
