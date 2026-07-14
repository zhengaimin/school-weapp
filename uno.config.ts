// https://www.npmjs.com/package/@uni-helper/unocss-preset-uni
import { presetUni } from '@uni-helper/unocss-preset-uni'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        // prefix: 'fg-', // 如果加前缀，则需要在代码里面使用 `fg-` 前缀，如：<div fg-border="1px solid #000"></div>
        prefixedOnly: false, // 允许无前缀使用
      },
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // 支持css class属性化
    presetAttributify(),
  ],
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      center: 'flex justify-center items-center',
    },
  ],
  safelist: [],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    // 自定义边框规则
    ['border-top-gray', { 'border-top': '1px solid #f3f4f6' }],
    ['border-top-gray-200', { 'border-top': '1px solid #e5e7eb' }],
    // 确保边框显示的规则
    ['border-1', { 'border-width': '1px' }],
    ['border-2', { 'border-width': '2px' }],
    ['border-solid', { 'border-style': 'solid' }],
    ['border-t-1', { 'border-top-width': '1px' }],
  ],
  theme: {
    colors: {
      // 主色调系列
      'primary': '#3269dd',
      'primary-light': '#5b8cff',
      'primary-dark': '#1e4ba8',
      'primary-50': '#f0f4ff',
      'primary-100': '#e1eaff',

      // 副色调系列
      'secondary': '#44bbdd',
      'secondary-light': '#6bc9e3',
      'secondary-dark': '#2a9bc1',

      // 强调色系列
      'accent': '#f57b32',
      'accent-light': '#f89a5b',
      'accent-dark': '#e55a0a',

      // 文字颜色
      'text-primary': '#1a202c',
      'text-secondary': '#4a5568',
      'text-muted': '#9ca3af',

      // 背景颜色
      'bg-primary': '#ffffff',
      'bg-secondary': '#f7fafc',
      'bg-muted': '#edf2f7',

      // 状态颜色系列
      'success': '#10b981',
      'success-light': '#34d399',
      'success-dark': '#059669',
      'success-bg': '#d1fae5',

      'error': '#ef4444',
      'error-light': '#f87171',
      'error-dark': '#dc2626',
      'error-bg': '#fee2e2',

      'cancel': '#6b7280',
      'cancel-light': '#9ca3af',
      'cancel-dark': '#4b5563',
      'cancel-bg': '#f3f4f6',

      'warning': '#f59e0b',
      'warning-light': '#fbbf24',
      'warning-dark': '#d97706',
      'warning-bg': '#fef3c7',

      // Icon背景色扩展配置
      'icon-bg-user': 'rgba(245, 123, 50, 0.1)',
      'icon-bg-finance': 'rgba(68, 187, 221, 0.1)',
      'icon-bg-action': 'rgba(245, 123, 50, 0.15)',
      'icon-bg-system': 'rgba(50, 105, 221, 0.1)',
      'icon-bg-feedback': 'rgba(139, 92, 246, 0.1)',
      'icon-bg-info': 'rgba(156, 163, 175, 0.1)',
    },
    fontSize: {
      /** 提供更小号的字体，用法如：text-2xs */
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx'],
    },
  },
})
