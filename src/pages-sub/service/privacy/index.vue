<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": ""
  }
}
</route>

<script lang="ts" setup>
import Page from '@/components/common/page/index.vue'
import { usePage } from '@/hooks/usePage'

import Skeleton from './components/Skeleton.vue'

defineOptions({
  options: {
    styleIsolation: 'apply-shared', // apply-shared shared
  },
})

const { pageLoading, pageError, onLoginSuccess, onLoginFail } = usePage()

// 公司信息变量 - 请根据实际情况填写
const companyInfo = {
  name: '武汉碳科数智科技有限公司',
  address: '湖北省武汉市东湖新技术开发区光谷大道3号未来之光7栋1802室',
  phone: '027-86951388',
  email: 'info@geniuscarbon.cn',
}
</script>

<template>
  <Page
    title="隐私条款"
    :loading="pageLoading"
    :error="pageError"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <template #skeleton>
      <Skeleton />
    </template>
    <view class="p-4">
      <view class="mb-4 border-b border-gray-200 text-center">
        <text class="mb-2 block text-xl text-gray-800 font-bold leading-tight">
          碳足迹管理平台隐私政策
        </text>
        <text class="block text-sm text-gray-400">
          更新时间：{{ new Date().toLocaleDateString() }}
        </text>
      </view>

      <view class="leading-relaxed">
        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            一、引言
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            {{ companyInfo.name }}（以下简称"我们"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
            我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、
            最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            二、我们收集的信息
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            为了向您提供更好的碳足迹管理服务，我们可能会收集以下信息：
          </text>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            2.1 您主动提供的信息
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 注册信息：用户名、手机号码、邮箱地址等
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 身份信息：真实姓名、身份证号码（如需实名认证）
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 碳足迹数据：出行记录、用电量、用水量等环保相关数据
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 反馈信息：您向我们提供的问题反馈、建议等
            </text>
          </view>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            2.2 我们自动收集的信息
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 设备信息：设备型号、操作系统版本、设备标识符等
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 日志信息：IP地址、访问时间、访问页面、操作记录等
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 位置信息：GPS位置、网络位置（用于碳足迹计算）
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 使用数据：功能使用频率、停留时长等统计信息
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            三、信息使用目的
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们收集您的个人信息主要用于以下目的：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 提供碳足迹计算、分析和管理服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 验证用户身份，保障账户安全
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 改进和优化我们的产品和服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 向您推送相关的环保资讯和活动信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 处理您的咨询和投诉
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 遵守法律法规要求
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            四、信息共享与披露
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们承诺不会出售、出租或以其他方式披露您的个人信息给第三方，除非：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 获得您的明确同意
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 根据法律法规要求或政府部门要求
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 为维护我们的合法权益
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 与我们的合作伙伴共享（仅限于提供服务所必需的信息）
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 经过去标识化处理的统计数据
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            五、信息安全保护
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们采用行业标准的安全保护措施，保护您的个人信息安全：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 数据传输加密：采用SSL/TLS等加密技术
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 数据存储加密：敏感信息采用加密存储
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 访问控制：严格限制数据访问权限
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 安全审计：定期进行安全评估和漏洞扫描
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 员工培训：定期对员工进行信息安全培训
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            六、您的权利
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            根据相关法律法规，您享有以下权利：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 知情权：了解我们处理您个人信息的情况
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 访问权：查询我们收集的您的个人信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 更正权：要求我们更正错误的个人信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 删除权：要求我们删除您的个人信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 撤回同意权：撤回您之前给予的同意
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 投诉举报权：向监管部门投诉举报
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            七、Cookie和类似技术
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们使用Cookie和类似技术来改善用户体验：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 记住您的登录状态和偏好设置
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 分析网站使用情况，优化服务性能
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 提供个性化的内容和推荐
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 您可以通过浏览器设置管理Cookie
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            八、未成年人保护
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们非常重视未成年人的个人信息保护。如果您是未成年人，
            请在监护人的陪同下阅读本政策，并在监护人同意后使用我们的服务。
            我们不会主动收集未成年人的个人信息。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            九、政策更新
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们可能会适时更新本隐私政策。更新后的政策将在平台上发布，
            并通过适当方式通知您。如果您不同意更新内容，可以选择停止使用我们的服务。
            继续使用服务将被视为您接受更新后的政策。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            十、联系我们
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            如您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
          </text>
          <view class="mt-2 rounded-6">
            <text class="mb-1 block text-sm text-gray-500">
              公司名称：{{ companyInfo.name }}
            </text>
            <text class="mb-1 block text-sm text-gray-500">
              公司地址：{{ companyInfo.address }}
            </text>
            <text class="mb-1 block text-sm text-gray-500">
              联系电话：{{ companyInfo.phone }}
            </text>
            <text class="mb-1 block text-sm text-gray-500">
              电子邮箱：{{ companyInfo.email }}
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            十一、政策生效
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本隐私政策自发布之日起生效。我们保留在法律允许的范围内修改本政策的权利。
          </text>
        </view>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
