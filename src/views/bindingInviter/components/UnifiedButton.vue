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
      :color="loadingColor"
    />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChannelType } from '../type/channel'
import btn1 from '../images/1/btn_large.png'
import btn2 from '../images/2/btn_large.png'

// 定义按钮配置接口
interface ButtonConfig {
  backgroundImage?: string
  backgroundColor: string
  textColor: string
  loadingColor: string
}

// 按钮配置映射
const buttonConfigMap: Record<ChannelType, ButtonConfig> = {
  '1': {
    backgroundImage: btn1,
    backgroundColor: 'transparent',
    textColor: '#000',
    loadingColor: '#000',
  },
  '2': {
    backgroundImage: btn2,
    backgroundColor: 'transparent',
    textColor: '#fff',
    loadingColor: '#fff',
  },
  '3': {
    backgroundColor: '#000',
    textColor: '#1AFF62',
    loadingColor: '#1AFF62',
  },
}

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
const currentConfig = computed(() => buttonConfigMap[props.channel])

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

const loadingColor = computed(() => currentConfig.value.loadingColor)

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
