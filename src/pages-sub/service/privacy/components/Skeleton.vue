<script setup lang="ts">
// 隐私条款页面骨架屏组件
</script>

<template>
  <!-- 隐私条款页面骨架屏 -->
  <view class="p-4">
    <!-- 页面标题区域骨架屏 -->
    <view class="mb-4 border-b border-gray-200 text-center">
      <!-- 主标题骨架 -->
      <wd-skeleton
        :loading="true"
        animation="gradient"
        :row-col="[{ width: '70%', height: '48rpx', borderRadius: '4rpx' }]"
        :custom-style="{ marginBottom: '16rpx' }"
      />

      <!-- 更新时间骨架 -->
      <wd-skeleton
        :loading="true"
        animation="gradient"
        :row-col="[{ width: '40%', height: '28rpx', borderRadius: '4rpx' }]"
      />
    </view>

    <!-- 内容区域骨架屏 -->
    <view class="leading-relaxed">
      <!-- 第一章节 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          :loading="true"
          animation="gradient"
          :row-col="[{ width: '30%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 - 多行文本 -->
        <wd-skeleton
          :loading="true"
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '95%', height: '28rpx', borderRadius: '4rpx' },
            { width: '88%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第二章节 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          :loading="true"
          animation="gradient"
          :row-col="[{ width: '35%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          :loading="true"
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '92%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 子标题骨架 -->
        <wd-skeleton
          :loading="true"
          animation="gradient"
          :row-col="[{ width: '45%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <!-- 列表项骨架 -->
        <view class="my-2">
          <wd-skeleton
            :loading="true"
            animation="gradient"
            :row-col="[
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '78%', height: '24rpx', borderRadius: '4rpx' },
              { width: '82%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第三章节 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '40%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '90%', height: '28rpx', borderRadius: '4rpx' },
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第四章节 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '38%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '88%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第五章节 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '42%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '95%', height: '28rpx', borderRadius: '4rpx' },
            { width: '80%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第六章节 - 您的权利 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 权利列表骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '70%', height: '24rpx', borderRadius: '4rpx' },
              { width: '68%', height: '24rpx', borderRadius: '4rpx' },
              { width: '65%', height: '24rpx', borderRadius: '4rpx' },
              { width: '72%', height: '24rpx', borderRadius: '4rpx' },
              { width: '60%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第七章节 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '36%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '92%', height: '28rpx', borderRadius: '4rpx' },
            { width: '88%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第八章节 - 未成年人保护 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '40%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第九章节 - 政策更新 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '90%', height: '28rpx', borderRadius: '4rpx' },
            { width: '75%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第十章节 - 联系我们 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '30%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 联系信息区域骨架 -->
        <view class="mt-2 rounded-6">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '80%', height: '24rpx', borderRadius: '4rpx' },
              { width: '95%', height: '24rpx', borderRadius: '4rpx' },
              { width: '60%', height: '24rpx', borderRadius: '4rpx' },
              { width: '70%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第十一章节 - 政策生效 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '35%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '80%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>
    </view>
  </view>
</template>
