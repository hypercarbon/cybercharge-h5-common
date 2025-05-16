<template>
  <div class="unified-input" :class="inputClass" :style="inputStyle">
    <img v-if="showIcon" :src="icon" class="left-icon" alt="" />
    <div class="input-wrapper" :class="wrapperClass">
      <input
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        class="input-field"
        :disabled="disabled"
        :class="inputFieldClass"
      />
      <button
        v-if="showCopyButton"
        class="copy-button"
        :class="copyButtonClass"
        :style="copyButtonStyle"
        size="small"
        @click="handleCopy"
      >
        {{ t('bindingInviter.Copy') }}
      </button>
      <van-icon
        v-if="!disabled && modelValue"
        color="#999"
        name="clear"
        class="clear-icon"
        @click="$emit('update:modelValue', '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import { computed } from 'vue'
import icon1 from '../images/1/icon_game.png'
import icon2 from '../images/2/icon_game.png'
import bg1 from '../images/1/input_bg.png'
import bg2 from '../images/2/input_bg.png'
import btn1 from '../images/1/btn_small.png'
import btn2 from '../images/2/btn_small.png'
import type { ChannelType } from '../type/channel'

const { t } = useI18n()

// 定义背景配置接口
interface BackgroundConfig {
  backgroundImage?: string
  backgroundColor?: string
  showIcon?: boolean
}

// 背景配置映射
const backgroundConfigMap: Record<ChannelType, BackgroundConfig> = {
  '1': {
    backgroundImage: bg1,
    showIcon: true,
  },
  '2': {
    backgroundImage: bg2,
    showIcon: true,
  },
  '3': {
    backgroundColor: '#f5f5f5',
    showIcon: false,
  },
}

// 按钮配置映射
const buttonConfigMap: Record<
  ChannelType,
  { image: string; textColor: string }
> = {
  '1': {
    image: btn1,
    textColor: '#000',
  },
  '2': {
    image: btn2,
    textColor: '#fff',
  },
  '3': {
    image: '',
    textColor: '#1aff62',
  },
}

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  channel: {
    type: String as () => ChannelType,
    default: '1',
  },
  placeholder: {
    type: String,
    default: '',
  },
  showCopyButton: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 计算属性
const currentConfig = computed(() => backgroundConfigMap[props.channel])
const currentButtonConfig = computed(() => buttonConfigMap[props.channel])

const showIcon = computed(() => currentConfig.value.showIcon)
const icon = computed(() => {
  if (props.channel === '1') return icon1
  if (props.channel === '2') return icon2
  return icon1
})

// 样式计算属性
const inputClass = computed(() => ({
  'unified-input': true,
  'custom-style': props.channel === '3',
}))

const inputStyle = computed(() => {
  const config = currentConfig.value
  return {
    backgroundImage: config.backgroundImage
      ? `url(${config.backgroundImage})`
      : 'none',
    backgroundColor: config.backgroundColor || 'transparent',
  }
})

const wrapperClass = computed(() => ({
  'input-wrapper': true,
  'custom-style': props.channel === '3',
}))

const inputFieldClass = computed(() => ({
  'input-field': true,
  'custom-style': props.channel === '3',
}))

const copyButtonClass = computed(() => ({
  'copy-button': true,
  'custom-style': props.channel === '3',
}))

const copyButtonStyle = computed(() => {
  const config = currentButtonConfig.value
  return props.channel === '3'
    ? {}
    : {
        backgroundImage: `url(${config.image})`,
        color: config.textColor,
      }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    // 只允许输入数字
    const value = target.value.replace(/[^\d]/g, '')
    // 限制最大长度为6
    const limitedValue = value.slice(0, 6)
    emit('update:modelValue', limitedValue)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    // 优先使用 document.execCommand
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '0'
    textArea.setAttribute('readonly', 'readonly')
    document.body.appendChild(textArea)

    // 选择文本
    textArea.select()
    textArea.setSelectionRange(0, textArea.value.length)

    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch {
      document.body.removeChild(textArea)
      // 如果 execCommand 失败，尝试使用 clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      }
      return false
    }
  } catch (err) {
    console.error('复制失败:', err)
    return false
  }
}

const handleCopy = async () => {
  if (!props.modelValue) return

  const success = await copyToClipboard(props.modelValue)
  if (success) {
    showToast(t('bindingInviter.CopySuccess'))
  } else {
    showToast(t('bindingInviter.CopyFailed'))
  }
}
</script>

<style scoped>
.unified-input {
  width: 100%;
  padding-left: 12px;
  height: 56px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.unified-input.custom-style {
  padding-left: 0;
  background: none;
}

.left-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 12px;
}

.input-wrapper.custom-style {
  border: 1px solid #000;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.input-field {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 0;
}

.input-field.custom-style {
  color: #000;
}

.input-field::placeholder {
  color: var(--secondary-text-color, rgba(255, 255, 255, 0.3));
}

.input-field.custom-style::placeholder {
  color: #bfbfbf;
}

.right-buttons {
  display: flex;
  gap: 8px;
}

.clear-icon {
  font-size: 16px;
}

.copy-button {
  width: 56px;
  height: 36px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  color: #000;
  font-size: 12px;
  font-weight: 700;
}

.copy-button.custom-style {
  width: 50px;
  height: 28px;
  background-color: #000;
  color: #1aff62;
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
}

.action-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 1;
}
</style>
