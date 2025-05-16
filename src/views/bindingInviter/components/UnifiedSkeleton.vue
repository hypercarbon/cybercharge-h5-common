<template>
  <div
    class="skeleton-container"
    :class="containerClass"
    :style="skeletonStyle"
  >
    <div class="skeleton-avatar" :class="skeletonClass"></div>
    <div class="skeleton-desc" :class="skeletonClass"></div>
    <div class="skeleton-input" :class="skeletonClass"></div>
    <div class="skeleton-button" :class="skeletonClass"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChannelType } from '../type/channel'
import { getThemeConfig } from '../model/theme'

const props = defineProps({
  channel: {
    type: String as () => ChannelType,
    default: '1',
  },
})

// 获取当前渠道配置
const currentConfig = computed(() => getThemeConfig(props.channel).skeleton)

// 容器类名
const containerClass = computed(() => ({
  'skeleton-container': true,
  'custom-style': props.channel === '3',
}))

const skeletonClass = computed(() => ({
  'skeleton-base': true,
  'custom-style': props.channel === '3',
}))

// 计算骨架屏样式
const skeletonStyle = computed(() => {
  const config = currentConfig.value
  return {
    '--skeleton-bg': config.backgroundColor,
    '--gradient-start': config.gradientStart,
    '--gradient-middle': config.gradientMiddle,
    '--gradient-end': config.gradientEnd,
  }
})
</script>

<style scoped>
.skeleton-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
}

.skeleton-base {
  background: linear-gradient(
    90deg,
    var(--gradient-start) 25%,
    var(--gradient-middle) 50%,
    var(--gradient-end) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.skeleton-desc {
  width: 200px;
  height: 18px;
  border-radius: 4px;
}

.skeleton-input {
  width: 100%;
  height: 48px;
  border-radius: 8px;
}

.skeleton-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 自定义样式（channel 3） */
.skeleton-container.custom-style {
  background-color: #fff;
}

.skeleton-base.custom-style {
  background-color: var(--skeleton-bg);
}
</style>
