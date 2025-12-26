<script lang="ts" setup>
import type { Pkg } from '@/api/interface/modules/package'
import { ref } from 'vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import PackageItem from './PackageItem.vue'

interface Props {
  /** 卡片标题 */
  title: string
  /** 套餐列表 */
  packages: Pkg.Query.IPackage[]
  /** 当前激活的套餐ID */
  activePackageId?: number
  /** 默认是否展开 */
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activePackageId: undefined,
  defaultExpanded: false,
})

const emit = defineEmits<{
  clickPackage: [pkg: Pkg.Query.IPackage]
}>()

const expanded = ref(props.defaultExpanded)

function toggleExpand() {
  expanded.value = !expanded.value
}

function handlePackageClick(pkg: Pkg.Query.IPackage) {
  emit('clickPackage', pkg)
}
</script>

<template>
  <WhiteCard :show-border="true" custom-class="!p-0 overflow-hidden">
    <!-- 卡片头部 -->
    <view
      flex="~ row items-center justify-between"
      p="x-4 y-3"
      bg="white"
      border="l-3 primary"
      @click="toggleExpand"
    >
      <view flex="~ row items-center" gap="2">
        <text text="base gray-800" font="medium">
          {{ title }}
        </text>
        <view
          v-if="packages.length"
          flex="~ items-center justify-center"
          min-w="18px"
          h="18px"
          p="x-1.5"
          rounded="full"
          bg="primary"
          text="xs white"
          font="medium"
        >
          {{ packages.length }}
        </view>
      </view>
      <view
        flex="~ items-center justify-center"
        w="6"
        h="6"
        transition="transform duration-300"
        :class="expanded ? 'rotate-180' : ''"
      >
        <wd-icon name="arrow-down" size="16px" color="#9ca3af" />
      </view>
    </view>

    <!-- 套餐列表（可折叠） -->
    <view
      overflow="hidden"
      transition="all duration-300 ease-in-out"
      :style="{
        maxHeight: expanded ? `${packages.length * 200}px` : '0',
        opacity: expanded ? '1' : '0',
      }"
    >
      <view p="3" flex="~ col" gap="3">
        <PackageItem
          v-for="pkg in packages"
          :key="pkg.id"
          :pkg="pkg"
          :is-active="pkg.id === activePackageId"
          @click="handlePackageClick"
        />
        <!-- 空状态 -->
        <view v-if="!packages.length" text="center sm gray-400" py="4">
          暂无可购买套餐
        </view>
      </view>
    </view>

    <!-- 收起状态下的简要信息 -->
    <view
      v-if="!expanded && packages.length"
      p="x-4 y-3"
      text="xs gray-500"
    >
      点击展开查看 {{ packages.length }} 个可购买套餐
    </view>
  </WhiteCard>
</template>
