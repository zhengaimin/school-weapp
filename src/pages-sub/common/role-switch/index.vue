<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "切换身份"
  }
}
</route>

<script lang="ts" setup>
import type { RoleInfo, RoleType } from './data'
import { onMounted, ref } from 'vue'
import GradientHeader from '@/components/common/gradient-header/index.vue'
import Page from '@/components/common/page/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Icon from '@/components/icon/index.vue'
import { usePage } from '@/hooks/usePage'
import {
  getAvailableRoles,
  getCurrentRoleInfo,
  getRoleConfig,
  getRoleHomePage,
  switchToRole,
} from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 当前角色信息
const currentRole = ref<RoleInfo>(getCurrentRoleInfo())
// 可切换角色列表
const availableRoles = ref<RoleInfo[]>([])
// 切换状态
const switching = ref(false)

// 加载可切换角色
function loadAvailableRoles() {
  availableRoles.value = getAvailableRoles(currentRole.value.type)
}

// 切换到指定角色
async function handleSwitchRole(roleType: RoleType, roleId: string) {
  const roleConfig = getRoleConfig(roleType)

  try {
    const confirmed = await new Promise<boolean>((resolve) => {
      uni.showModal({
        title: '切换身份',
        content: `确定要切换到${roleConfig.name}吗？`,
        success: (res) => {
          resolve(res.confirm)
        },
      })
    })

    if (!confirmed)
      return

    switching.value = true

    // 执行角色切换
    const success = await switchToRole(roleType, roleId)

    if (success) {
      uni.showToast({
        title: '切换成功',
        icon: 'success',
      })

      // 跳转到对应首页
      const homePage = getRoleHomePage(roleType)
      setTimeout(() => {
        uni.reLaunch({
          url: homePage,
        })
      }, 1500)
    }
    else {
      uni.showToast({
        title: '切换失败，请重试',
        icon: 'none',
      })
    }
  }
  catch (error) {
    console.error('角色切换失败:', error)
    uni.showToast({
      title: '切换失败，请重试',
      icon: 'none',
    })
  }
  finally {
    switching.value = false
  }
}

// 添加新身份
function addNewRole() {
  uni.navigateTo({
    url: '/pages-sub/auth/add-role/index',
  })
}

onMounted(() => {
  pageLoading.value = false
  loadAvailableRoles()
})
</script>

<template>
  <Page
    :show="false"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <!-- 顶部装饰背景 -->
    <GradientHeader
      title="切换身份"
      subtitle="选择您要切换的身份"
    />

    <!-- 身份列表 -->
    <view p="x-4" style="margin-top: -32rpx" relative z="10">
      <WhiteCard
        custom-class="rounded-2xl border-gray-100 p-6"
      >
        <!-- 当前身份 -->
        <view m="b-6">
          <view text="sm gray-700" font="medium" m="b-3">
            当前身份
          </view>
          <view
            flex="~ items-center"
            p="4"
            bg="primary opacity-5"
            border="~ primary opacity-20 solid rounded-lg"
          >
            <view
              w="12"
              h="12"
              :class="getRoleConfig(currentRole.type).bgColor"
              border="rounded-full"
              flex="~ items-center justify-center"
              m="r-3"
            >
              <Icon
                :name="getRoleConfig(currentRole.type).icon"
                :icon-color="getRoleConfig(currentRole.type).textColor.replace('text-', '')"
                icon-size="40rpx"
              />
            </view>
            <view flex="1">
              <view text="sm gray-800" font="medium">
                {{ currentRole.name }}
              </view>
              <view text="xs gray-500" m="t-1">
                {{ currentRole.description }}
              </view>
            </view>
            <view bg="primary" text="sm white" p="x-2 y-1" border="rounded">
              当前
            </view>
          </view>
        </view>

        <!-- 可切换身份 -->
        <view m="b-6">
          <view text="sm gray-700" font="medium" m="b-3">
            可切换身份
          </view>
          <view v-if="availableRoles.length > 0" space="y-3">
            <view
              v-for="role in availableRoles"
              :key="role.id"
              class="role-card"
              flex="~ items-center"
              p="4"
              bg="gray-50"
              border="rounded-lg"
              transition-colors
              @click="handleSwitchRole(role.type, role.id)"
            >
              <view
                w="12"
                h="12"
                :class="getRoleConfig(role.type).bgColor"
                border="rounded-full"
                flex="~ items-center justify-center"
                m="r-3"
              >
                <Icon
                  :name="getRoleConfig(role.type).icon"
                  :color="getRoleConfig(role.type).textColor.replace('text-', '')"
                  size="40rpx"
                />
              </view>
              <view flex="1">
                <view text="sm gray-800" font="medium">
                  {{ role.name }}
                </view>
                <view text="xs gray-500" m="t-1">
                  {{ role.description }}
                </view>
              </view>
              <Icon name="arrow-right-s-line" color="#9ca3af" size="32rpx" />
            </view>
          </view>
          <view v-else text="center gray-500" p="y-4">
            <view text="sm">
              暂无其他可切换身份
            </view>
          </view>
        </view>

        <!-- 添加新身份 -->
        <view
          w="full"
          flex="~ items-center justify-center"
          p="4"
          border="2 dashed gray-300 rounded-lg"
          text="gray-500"
          transition-all
          @click="addNewRole"
        >
          <Icon name="add-line" color="#9ca3af" size="32rpx" />
          <text m="l-2">
            添加新身份
          </text>
        </view>
      </WhiteCard>
    </view>

    <!-- 底部说明 -->
    <view p="x-4 t-4 b-8">
      <WhiteCard
        custom-class="bg-primary bg-opacity-5 border-primary border-opacity-20 rounded-lg"
      >
        <view flex="~ items-start">
          <Icon name="information-line" color="#3269dd" size="36rpx" />
          <view m="l-3">
            <view text="primary-dark sm" font="medium" m="b-1">
              身份切换说明
            </view>
            <view text="gray-600 xs" style="line-height: 1.5">
              • 您可以在不同身份之间自由切换
              <br />
              • 切换身份后将跳转到对应的首页
              <br />
              • 每种身份都有独立的功能和权限
              <br />
              • 如需添加新身份请重新进行验证
            </view>
          </view>
        </view>
      </WhiteCard>
    </view>
  </Page>
</template>

<style lang="scss" scoped>
.role-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    box-shadow: 0 8px 25px rgba(50, 105, 221, 0.15);
    border-color: #3269dd;
  }
}
</style>
