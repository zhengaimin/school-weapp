<script setup></script>

<template>
  <!-- 用户购买协议页面骨架屏 -->
  <view class="p-4">
    <!-- 页面标题区域骨架屏 -->
    <view class="mb-4 border-b border-gray-200 text-center">
      <!-- 主标题骨架 -->
      <wd-skeleton
        animation="gradient"
        :row-col="[{ width: '80%', height: '48rpx', borderRadius: '4rpx' }]"
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
      <!-- 第一章节 - 协议的接受与适用 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '48%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 - 多行文本 -->
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

      <!-- 第二章节 - 产品与服务 -->
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
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 产品列表骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '80%', height: '24rpx', borderRadius: '4rpx' },
              { width: '70%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '72%', height: '24rpx', borderRadius: '4rpx' },
              { width: '65%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第三章节 - 订单与支付 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '38%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 子标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <!-- 列表项骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '92%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>

        <!-- 第二个子标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '35%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <!-- 第二组列表项骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '82%', height: '24rpx', borderRadius: '4rpx' },
              { width: '90%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '95%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第四章节 - 服务交付 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 子标题和内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '78%', height: '24rpx', borderRadius: '4rpx' },
              { width: '92%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>

        <!-- 第二个子标题 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '80%', height: '24rpx', borderRadius: '4rpx' },
              { width: '95%', height: '24rpx', borderRadius: '4rpx' },
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第五章节 - 退款与取消 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '38%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 子标题和内容 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '82%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>

        <!-- 第二个子标题 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '90%', height: '24rpx', borderRadius: '4rpx' },
              { width: '78%', height: '24rpx', borderRadius: '4rpx' },
              { width: '95%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第六章节 - 知识产权 -->
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
              { width: '95%', height: '24rpx', borderRadius: '4rpx' },
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '92%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第七章节 - 服务保障 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 子标题和内容 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '82%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>

        <!-- 第二个子标题 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '32%', height: '32rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginTop: '16rpx', marginBottom: '12rpx' }"
        />

        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '78%', height: '24rpx', borderRadius: '4rpx' },
              { width: '70%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第八章节 - 责任限制 -->
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
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 责任列表骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '82%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第九章节 - 发票与税务 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '38%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 发票相关列表骨架 -->
        <view class="my-2">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '85%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
              { width: '88%', height: '24rpx', borderRadius: '4rpx' },
              { width: '70%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 第十章节 - 争议解决 -->
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
            { width: '85%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第十一章节 - 协议修改与生效 -->
      <view class="mb-4">
        <!-- 章节标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '48%', height: '36rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 章节内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '28rpx', borderRadius: '4rpx' },
            { width: '90%', height: '28rpx', borderRadius: '4rpx' },
            { width: '80%', height: '28rpx', borderRadius: '4rpx' },
          ]"
          :custom-style="{ marginBottom: '16rpx' }"
        />
      </view>

      <!-- 第十二章节 - 联系方式 -->
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

        <!-- 联系信息区域骨架 -->
        <view class="mt-2 border-l-3 border-primary rounded-6">
          <wd-skeleton
            animation="gradient"
            :row-col="[
              { width: '80%', height: '24rpx', borderRadius: '4rpx' },
              { width: '95%', height: '24rpx', borderRadius: '4rpx' },
              { width: '60%', height: '24rpx', borderRadius: '4rpx' },
              { width: '70%', height: '24rpx', borderRadius: '4rpx' },
              { width: '75%', height: '24rpx', borderRadius: '4rpx' },
            ]"
            :custom-style="{ marginBottom: '8rpx' }"
          />
        </view>
      </view>

      <!-- 重要提醒区域骨架 -->
      <view class="mb-8 rounded-lg bg-yellow-50 p-4">
        <!-- 提醒标题骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[{ width: '25%', height: '28rpx', borderRadius: '4rpx' }]"
          :custom-style="{ marginBottom: '16rpx' }"
        />

        <!-- 提醒内容骨架 -->
        <wd-skeleton
          animation="gradient"
          :row-col="[
            { width: '100%', height: '24rpx', borderRadius: '4rpx' },
            { width: '95%', height: '24rpx', borderRadius: '4rpx' },
            { width: '85%', height: '24rpx', borderRadius: '4rpx' },
          ]"
        />
      </view>
    </view>
  </view>
</template>
