<script setup lang="ts">
import { ref } from 'vue'
import BottomPopup from './index.vue'

// 弹框显示状态
const showBasic = ref(false)
const showCustomHeader = ref(false)
const showWithFooter = ref(false)
const showScrollable = ref(false)
const showForm = ref(false)

// 表单数据
const formData = ref({
  name: '',
  phone: '',
  email: '',
  remark: '',
})

// 确认操作
function handleConfirm() {
  uni.showToast({
    title: '操作成功',
    icon: 'success',
  })
  showWithFooter.value = false
}

// 提交表单
function handleSubmit() {
  if (!formData.value.name || !formData.value.phone) {
    uni.showToast({
      title: '请填写必填项',
      icon: 'error',
    })
    return
  }

  uni.showToast({
    title: '保存成功',
    icon: 'success',
  })
  showForm.value = false
}
</script>

<template>
  <view class="demo-container" p="4" space="y-4">
    <view text="xl" font="bold" m="b-6">
      BottomPopup 组件示例
    </view>

    <!-- 基础用法 -->
    <view>
      <view text="lg" font="medium" m="b-3">
        基础用法
      </view>
      <wd-button type="primary" @click="showBasic = true">
        基础弹框
      </wd-button>
    </view>

    <!-- 自定义标题栏 -->
    <view>
      <view text="lg" font="medium" m="b-3">
        自定义标题栏
      </view>
      <wd-button type="success" @click="showCustomHeader = true">
        自定义标题栏
      </wd-button>
    </view>

    <!-- 带底部操作栏 -->
    <view>
      <view text="lg" font="medium" m="b-3">
        带底部操作栏
      </view>
      <wd-button type="warning" @click="showWithFooter = true">
        带底部操作栏
      </wd-button>
    </view>

    <!-- 滚动内容 -->
    <view>
      <view text="lg" font="medium" m="b-3">
        滚动内容
      </view>
      <wd-button type="info" @click="showScrollable = true">
        滚动内容
      </wd-button>
    </view>

    <!-- 表单弹框 -->
    <view>
      <view text="lg" font="medium" m="b-3">
        表单弹框
      </view>
      <wd-button type="primary" @click="showForm = true">
        表单弹框
      </wd-button>
    </view>

    <!-- 基础弹框 -->
    <BottomPopup v-model="showBasic" title="基础弹框">
      <view p="4" space="y-4">
        <view text="base">
          这是一个基础的底部弹框示例。
        </view>
        <view text="sm text-gray-600">
          弹框使用 wot-design-uni 的 wd-popup 组件实现，
          提供了统一的标题样式和灵活的内容区域。
        </view>
      </view>
    </BottomPopup>

    <!-- 自定义标题栏弹框 -->
    <BottomPopup v-model="showCustomHeader" :show-close="false">
      <template #header>
        <view flex="~ items-center justify-between" w="full">
          <view flex="~ items-center">
            <wd-icon name="star" color="#f59e0b" size="32rpx" />
            <text m="l-2" text="lg" font="bold">
              自定义标题
            </text>
          </view>
          <view text="sm primary" @click="showCustomHeader = false">
            完成
          </view>
        </view>
      </template>

      <view p="4" space="y-4">
        <view text="base">
          这是自定义标题栏的示例。
        </view>
        <view text="sm text-gray-600">
          可以通过 header 插槽完全自定义标题栏的内容和样式。
        </view>
      </view>
    </BottomPopup>

    <!-- 带底部操作栏弹框 -->
    <BottomPopup v-model="showWithFooter" title="确认操作">
      <view p="4" space="y-4">
        <view text="base">
          确定要执行此操作吗？
        </view>
        <view text="sm text-gray-600">
          此操作不可撤销，请谨慎操作。
        </view>
      </view>

      <template #footer>
        <view flex="~ gap-3" p="4" border="t gray-100">
          <wd-button type="info" size="large" block @click="showWithFooter = false">
            取消
          </wd-button>
          <wd-button type="primary" size="large" block @click="handleConfirm">
            确认
          </wd-button>
        </view>
      </template>
    </BottomPopup>

    <!-- 滚动内容弹框 -->
    <BottomPopup v-model="showScrollable" title="长列表" height="80vh">
      <scroll-view scroll-y class="h-full">
        <view p="4" space="y-2">
          <view
            v-for="item in 50"
            :key="item"
            p="3"
            bg="gray-50"
            border="rounded"
            flex="~ items-center justify-between"
          >
            <text>列表项 {{ item }}</text>
            <wd-icon name="arrow-right" color="#999" size="24rpx" />
          </view>
        </view>
      </scroll-view>
    </BottomPopup>

    <!-- 表单弹框 -->
    <BottomPopup v-model="showForm" title="编辑信息" height="70vh">
      <view p="4">
        <wd-form :model="formData">
          <wd-cell-group>
            <wd-field
              v-model="formData.name"
              label="姓名"
              placeholder="请输入姓名"
              required
            />
            <wd-field
              v-model="formData.phone"
              label="手机号"
              placeholder="请输入手机号"
              type="tel"
              required
            />
            <wd-field
              v-model="formData.email"
              label="邮箱"
              placeholder="请输入邮箱"
              type="email"
            />
            <wd-field
              v-model="formData.remark"
              label="备注"
              placeholder="请输入备注"
              type="textarea"
              :rows="3"
            />
          </wd-cell-group>
        </wd-form>
      </view>

      <template #footer>
        <view flex="~ gap-3" p="4" border="t gray-100">
          <wd-button type="info" size="large" block @click="showForm = false">
            取消
          </wd-button>
          <wd-button type="primary" size="large" block @click="handleSubmit">
            保存
          </wd-button>
        </view>
      </template>
    </BottomPopup>
  </view>
</template>

<style scoped lang="scss">
.demo-container {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
