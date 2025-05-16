<template>
  <div class="unified-input" :class="inputClass" :style="inputStyle">
    <img v-if="showIcon" :src="currentConfig.icon" class="left-icon" alt="" />
    <div class="input-wrapper" :class="wrapperClass">
      <input
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        class="input-field"
        :disabled="disabled"
        :class="inputFieldClass"
        :style="inputFieldStyle"
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
import type { ChannelType } from '../type/channel'
import { getThemeConfig } from '../model/theme'

const { t } = useI18n()

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

// 获取当前渠道配置
const currentConfig = computed(() => getThemeConfig(props.channel).input)

// 计算属性
const showIcon = computed(() => currentConfig.value.showIcon)

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
    backgroundColor: config.backgroundColor,
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

const inputFieldStyle = computed(() => ({
  color: currentConfig.value.textColor,
  '--placeholder-color': currentConfig.value.placeholderColor,
}))

const copyButtonClass = computed(() => ({
  'copy-button': true,
  'custom-style': props.channel === '3',
}))

const copyButtonStyle = computed(() => {
  const config = currentConfig.value.copyButton
  return props.channel === '3'
    ? {
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }
    : {
        backgroundImage: `url(${config.backgroundImage})`,
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
  border: 1px solid var(--border-color, #000);
  border-radius: 4px;
  background-color: #f5f5f5;
}

.input-field {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0;
}

.input-field::placeholder {
  color: var(--placeholder-color);
}

.copy-button {
  width: 56px;
  height: 36px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  font-size: 12px;
  font-weight: 700;
}

.copy-button.custom-style {
  width: 50px;
  height: 28px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
}

.clear-icon {
  font-size: 16px;
}
</style>
