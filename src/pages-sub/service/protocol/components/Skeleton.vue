<script setup></script>

<template>
  <!-- 用户服务协议页面骨架屏 -->
  <view class="p-4">
    <!-- 页面标题区域骨架屏 -->
    <view class="mb-4 border-b border-gray-200 text-center">
      <!-- 主标题骨架 -->
      <wd-skeleton
        animation="gradient"
        :row-col="[{ width: '75%', height: '48rpx', borderRadius: '4rpx' }]"
        :custom-style="{ marginBottom: '16rpx' }"
      />
      <!-- 更新时间骨架 -->
      <wd-skeleton
        animation="gradient"
        :row-col="[{ width: '40%', height: '28rpx', borderRadius: '4rpx' }]"
      />
    </view>

    <!-- 内容区域骨架屏 -->
    <view class="leading-relaxed">
      <!-- 第一章节 - 协议的接受 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '38%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 - 多行文本 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '95%', height: '28rpx', borderRadius: '4rpx' },
            { width: '90%', height: '28rpx', borderRadius: '4rpx' },
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第二章节 - 服务内容 -->
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
            { width: '88%', height: '28rpx', borderRadius: '4rpx' },
            { width: '92%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第三章节 - 用户注册 -->
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

        <!-- 列表项骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '80%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '78%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第四章节 - 用户行为规范 -->
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
            { width: '90%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 禁止行为列表骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '82%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '90%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第五章节 - 知识产权 -->
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
            { width: '95%', height: '28rpx', borderRadius: '4rpx' },
            { width: '88%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第六章节 - 免责声明 -->
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
            { width: '92%', height: '28rpx', borderRadius: '4rpx' },
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第七章节 - 协议修改 -->
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
            { width: '88%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第八章节 - 争议解决 -->
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
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第九章节 - 联系我们 -->
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

      <!-- 第十章节 - 协议生效 -->
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
            { width: '80%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>
    </view>
  </view>
</template>
