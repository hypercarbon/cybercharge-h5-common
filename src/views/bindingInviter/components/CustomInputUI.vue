<template>
  <div class="custom-input">
    <div class="input-wrapper">
      <input
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        class="input-field"
        :disabled="disabled"
      />
      <button
        v-if="showCopyButton"
        class="copy-button"
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

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  // 1 大逃杀，2 质押，3 一元购
  channel: {
    type: String,
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
.custom-input {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 12px;
  border: 1px solid #000;
  border-radius: 4px;
  background-color: #f5f5f5;
  &.disabled {
    border: 1px solid #f5f5f5;
  }
}

.input-field {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  color: #000;
  background-color: transparent;
  font-size: 14px;
  padding: 0;
}

.input-field::placeholder {
  color: var(--secondary-text-color, #bfbfbf);
}

.right-buttons {
  display: flex;
  gap: 8px;
}

.clear-icon {
  font-size: 16px;
}

.copy-button {
  width: 50px;
  height: 28px;
  background-color: #000;
  color: #1aff62;
  font-size: 12px;
  font-weight: 500;
  border: none;
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
