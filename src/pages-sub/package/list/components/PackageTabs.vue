<script setup lang="ts">
import type { FilterOption } from '@/components/common/filter-selector/index.vue'

export interface TabOption {
  label: string
  value: string | number
}

type StyleVariant = 'segmented' | 'pill' | 'tag' | 'underline'

interface Props {
  /** 状态 Tab 选项列表 */
  tabs: TabOption[]
  /** 设备类型选项列表 */
  deviceOptions: FilterOption[]
  /** 当前选中的状态 Tab 索引 */
  activeTab?: number
  /** 当前选中的设备类型索引 */
  deviceIndex?: number
  /** 样式风格 */
  variant?: StyleVariant
}

interface Emits {
  (e: 'update:activeTab', value: number): void
  (e: 'update:deviceIndex', value: number): void
  (e: 'tabChange', index: number): void
  (e: 'deviceChange', index: number): void
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: 0,
  deviceIndex: 0 as number,
  variant: 'segmented',
})

const emit = defineEmits<Emits>()

function handleTabChange(index: number) {
  emit('update:activeTab', index)
  emit('tabChange', index)
}

function handleDeviceChange(index: number) {
  emit('update:deviceIndex', index)
  emit('deviceChange', index)
}
</script>

<template>
  <view flex="~ col" gap="3" p="x-4 y-2!" class="package-tabs">
    <!-- 状态 Tab -->
    <view
      class="tab-row"
      :class="[`variant-${variant}`]"
    >
      <view
        v-for="(tab, index) in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @click="handleTabChange(index)"
      >
        <text class="tab-text">
          {{ tab.label }}
        </text>
      </view>
    </view>

    <!-- 设备类型 Tab -->
    <view
      v-if="deviceOptions.length > 1"
      class="tab-row"
      :class="[`variant-${variant}`]"
    >
      <view
        v-for="(opt, index) in deviceOptions"
        :key="opt.value"
        class="tab-item"
        :class="{ active: deviceIndex === index }"
        @click="handleDeviceChange(index)"
      >
        <text class="tab-text">
          {{ opt.label }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.package-tabs {
  --tab-bg: #f3f4f6;
  --tab-active-bg: #ffffff;
  --tab-text: #6b7280;
  --tab-active-text: #3269dd;
  --tab-border: #e5e7eb;
  --tab-radius: 8rpx;
}

.tab-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  .tab-text {
    font-size: 28rpx;
    transition: all 0.2s ease;
  }
}

/* ===== 分段控制器风格 ===== */
.variant-segmented {
  background: var(--tab-bg);
  border-radius: 12rpx;
  padding: 4rpx;
  gap: 4rpx;

  .tab-item {
    padding: 16rpx 0;
    border-radius: 8rpx;

    .tab-text {
      color: var(--tab-text);
      font-weight: 500;
    }

    &.active {
      background: var(--tab-active-bg);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

      .tab-text {
        color: var(--tab-active-text);
        font-weight: 600;
      }
    }
  }
}

/* ===== 胶囊按钮风格 ===== */
.variant-pill {
  gap: 16rpx;

  .tab-item {
    padding: 16rpx 24rpx;
    border-radius: 40rpx;
    background: var(--tab-bg);

    .tab-text {
      color: var(--tab-text);
    }

    &.active {
      background: var(--tab-active-text);

      .tab-text {
        color: #ffffff;
        font-weight: 600;
      }
    }
  }
}

/* ===== 标签风格 ===== */
.variant-tag {
  gap: 16rpx;

  .tab-item {
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    border: 2rpx solid var(--tab-border);
    background: transparent;

    .tab-text {
      color: var(--tab-text);
    }

    &.active {
      border-color: var(--tab-active-text);
      background: rgba(50, 105, 221, 0.05);

      .tab-text {
        color: var(--tab-active-text);
        font-weight: 600;
      }
    }
  }
}

/* ===== 下划线指示器风格 ===== */
.variant-underline {
  gap: 0;

  .tab-item {
    padding: 12rpx 0;
    flex: 1;

    .tab-text {
      color: var(--tab-text);
    }

    &.active {
      .tab-text {
        color: var(--tab-active-text);
        font-weight: 600;
        font-size: 30rpx;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 48rpx;
        height: 6rpx;
        background: var(--tab-active-text);
        border-radius: 6rpx;
      }
    }
  }
}
</style>
