<template>
  <button
    class="unified-button"
    :class="buttonClass"
    :style="buttonStyle"
    :disabled="disabled"
    @click="handleClick"
  >
    <van-loading
      v-if="loading"
      class="loading-icon"
      :size="loadingSize"
      :color="currentConfig.loadingColor"
    />
    <slot></slot>
  </button>
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
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingSize: {
    type: String,
    default: '20px',
  },
})

const emit = defineEmits(['click'])

// 获取当前渠道配置
const currentConfig = computed(() => getThemeConfig(props.channel).button)

// 样式计算属性
const buttonClass = computed(() => ({
  'unified-button': true,
  'custom-style': props.channel === '3',
  disabled: props.disabled,
}))

const buttonStyle = computed(() => {
  const config = currentConfig.value
  const baseStyle = {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
  }

  if (props.channel === '3') {
    return baseStyle
  }

  return {
    ...baseStyle,
    backgroundImage: `url(${config.backgroundImage})`,
  }
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.unified-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.unified-button.custom-style {
  border-radius: 4px;
}

.unified-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-icon {
  margin-right: 8px;
}
</style>
