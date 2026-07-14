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
    title="用户服务协议"
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
          碳足迹管理平台用户服务协议
        </text>
        <text class="block text-sm text-gray-400">
          更新时间：{{ new Date().toLocaleDateString() }}
        </text>
      </view>

      <view class="leading-relaxed">
        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            一、协议的接受
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            欢迎使用{{ companyInfo.name }}提供的碳足迹管理平台服务。本协议是您与{{
              companyInfo.name
            }}之间关于使用碳足迹管理平台服务的法律协议。通过注册、访问或使用本平台，您表示已阅读、理解并同意受本协议的约束。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            二、服务内容
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本平台致力于为用户提供碳足迹计算、碳排放监测、碳中和方案制定等相关服务，包括但不限于：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 个人/企业碳足迹计算与分析
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 碳排放数据监测与统计
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 碳减排建议与方案推荐
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 碳中和项目信息与交易服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 环保知识普及与教育
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            三、用户权利与义务
          </text>
          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            3.1 用户权利
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 享受平台提供的各项碳足迹管理服务
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 查看和管理个人碳足迹数据
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 获得碳减排指导和建议
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 参与平台组织的环保活动
            </text>
          </view>

          <text class="my-2 block text-sm text-gray-800 font-bold leading-tight">
            3.2 用户义务
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 提供真实、准确的个人信息和碳排放数据
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 遵守国家环保法律法规
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 不得利用平台从事违法违规活动
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 保护账户安全，不得转让或出借账户
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            四、数据保护与隐私
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            我们高度重视用户隐私保护，严格按照《个人信息保护法》等相关法律法规处理用户信息：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 仅收集为提供服务所必需的信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 采用行业标准的安全措施保护用户数据
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 不会向第三方出售或泄露用户个人信息
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 用户有权查询、更正、删除个人信息
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            五、知识产权
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本平台的所有内容，包括但不限于文字、图片、音频、视频、软件、程序、版面设计等均受知识产权法保护。
            未经{{ companyInfo.name }}书面许可，用户不得复制、传播、修改或用于商业用途。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            六、免责声明
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            在法律允许的最大范围内，{{ companyInfo.name }}对以下情况不承担责任：
          </text>
          <view class="my-2">
            <text class="mb-1 block text-sm text-gray-600">
              • 因不可抗力导致的服务中断
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 用户提供错误信息导致的计算偏差
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 第三方服务提供商的服务质量
            </text>
            <text class="mb-1 block text-sm text-gray-600">
              • 用户违规使用平台造成的损失
            </text>
          </view>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            七、协议修改
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            {{ companyInfo.name }}有权根据业务发展需要修改本协议。修改后的协议将在平台上公布，
            继续使用服务即视为接受修改后的协议。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            八、争议解决
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本协议的签订、履行、解释及争议解决均适用中华人民共和国法律。
            如发生争议，双方应友好协商解决；协商不成的，可向{{
              companyInfo.name
            }}所在地人民法院提起诉讼。
          </text>
        </view>

        <view class="mb-4">
          <text class="mb-2 block text-base text-primary font-bold leading-tight">
            九、联系方式
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            如您对本协议有任何疑问或建议，请通过以下方式联系我们：
          </text>
          <view class="mt-2 border-l-3 border-green-700 rounded-6">
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
            十、协议生效
          </text>
          <text class="mb-2 block text-justify text-sm text-gray-600">
            本协议自用户点击同意或开始使用服务时生效，对双方具有法律约束力。
          </text>
        </view>
      </view>
    </view>
  </Page>
</template>

<style scoped lang="scss"></style>
