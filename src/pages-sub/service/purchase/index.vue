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
    title="用户购买协议"
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
          碳足迹管理平台用户购买协议
        </text>
        <text class="block text-sm text-gray-400">
          更新时间：{{ new Date().toLocaleDateString() }}
        </text>
      </view>

      <view class="leading-relaxed">
        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            一、协议的接受与适用
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本购买协议是您与{{ companyInfo.name }}之间关于在碳足迹管理平台购买产品或服务的法律协议。
            通过点击"同意"、下单购买或使用付费服务，您表示已阅读、理解并同意受本协议的约束。
            本协议与《用户服务协议》和《隐私政策》共同构成完整的法律文件。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            二、产品与服务
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本平台提供的付费产品和服务包括但不限于：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 高级碳足迹分析报告
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 企业碳管理解决方案
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 碳中和认证服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 专业咨询与培训服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 碳资产交易服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 其他增值服务
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            三、订单与支付
          </text>
          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            3.1 订单确认
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 您提交订单后，我们将发送订单确认信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 订单确认不代表合同成立，需等待我们的接受确认
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 我们保留因库存、技术等原因拒绝订单的权利
            </text>
          </view>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            3.2 价格与支付
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 所有价格均以人民币计价，包含法定税费
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 支持微信支付、支付宝等主流支付方式
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 付款成功后，合同正式生效
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 我们保留调整价格的权利，但不影响已确认订单
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            四、服务交付
          </text>
          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            4.1 交付方式
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 数字产品：通过平台账户或邮件交付
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 咨询服务：按约定时间和方式提供
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 报告文件：电子版通过平台下载，纸质版邮寄
            </text>
          </view>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            4.2 交付时间
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 标准产品：付款后1-3个工作日
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 定制服务：根据具体需求确定，一般7-30个工作日
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 如遇特殊情况延期，我们将及时通知您
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            五、退款与取消
          </text>
          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            5.1 退款条件
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 未开始提供服务的订单可申请全额退款
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 已交付的数字产品原则上不支持退款
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 服务质量问题可协商部分退款
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 因我方原因无法履约的，全额退款
            </text>
          </view>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            5.2 退款流程
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 通过平台客服或邮件提交退款申请
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 我们将在3个工作日内处理申请
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 退款将原路返回，到账时间视支付渠道而定
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            六、知识产权
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            购买我们的产品或服务后，您获得的权利包括：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 报告和分析结果的使用权（仅限购买方内部使用）
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 不得转售、复制或向第三方提供我们的产品
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 平台技术和算法的知识产权归我们所有
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 您提供的数据仍归您所有，我们仅用于服务提供
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            七、服务保障
          </text>
          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            7.1 质量保证
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 我们承诺按照行业标准提供专业服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 计算结果基于您提供的准确数据
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 如发现明显错误，我们将免费修正
            </text>
          </view>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            7.2 技术支持
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 提供产品使用指导和技术咨询
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 工作日9:00-18:00提供客服支持
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 重要问题24小时内响应
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            八、责任限制
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            在法律允许的最大范围内，{{ companyInfo.name }}的责任限制如下：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 我们的赔偿责任不超过您支付的服务费用
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 不承担间接损失、利润损失等责任
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 因不可抗力导致的服务中断不承担责任
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 第三方服务商的问题不承担连带责任
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            九、发票与税务
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 我们可根据您的需要开具增值税发票
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 请在订单中准确填写发票信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 发票将在服务完成后7个工作日内开具
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 各项税费已包含在服务价格中
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            十、争议解决
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本协议的签订、履行、解释及争议解决均适用中华人民共和国法律。
            如发生争议，双方应首先通过友好协商解决；协商不成的，
            可向{{ companyInfo.name }}所在地人民法院提起诉讼。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            十一、协议修改与生效
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            {{ companyInfo.name }}有权根据业务发展需要修改本协议。
            修改后的协议将在平台上公布，继续购买服务即视为接受修改后的协议。
            本协议自您确认购买时生效，对双方具有法律约束力。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            十二、联系方式
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            如您对本购买协议有任何疑问或需要帮助，请通过以下方式联系我们：
          </text>
          <view class="mt-2 border-l-3 border-primary rounded-6">
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
            <text class="mb-1 block text-sm text-gray-500">
              客服时间：工作日 9:00-18:00
            </text>
          </view>
        </view>

        <view class="mb-8 rounded-lg bg-yellow-50 p-4">
          <text class="mb-2 block text-sm text-yellow-800 font-bold">
            重要提醒：
          </text>
          <text class="block text-sm text-yellow-700">
            请您在购买前仔细阅读本协议的所有条款。如果您不同意本协议的任何条款，
            请不要购买我们的产品或服务。您的购买行为将被视为对本协议的完全接受。
          </text>
        </view>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
