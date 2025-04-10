<template>
  <div
    class="custom-input"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <img :src="icon" class="left-icon" alt="" />
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
        :style="{
          backgroundImage: `url(${bindButtonImage})`,
          color: channel === '1' ? '#000' : '#fff',
        }"
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

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
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

const iconMap: Record<string, string> = {
  '1': icon1,
  '2': icon2,
}

const bgMap: Record<string, string> = {
  '1': bg1,
  '2': bg2,
}

const btnMap: Record<string, string> = {
  '1': btn1,
  '2': btn2,
}

const icon = computed(() => {
  if (props.channel) {
    return iconMap[props.channel]
  }
  return icon1
})

const backgroundImage = computed(() => {
  if (props.channel) {
    return bgMap[props.channel]
  }
  return bg1
})

const bindButtonImage = computed(() => {
  if (props.channel) {
    return btnMap[props.channel]
  }
  return btn1
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    emit('update:modelValue', target.value)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    // 尝试使用现代 API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案：使用 document.execCommand
      const textArea = document.createElement('textarea')
      textArea.value = text

      // 避免滚动到视图中
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
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
  padding-left: 12px;
  height: 56px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
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

.input-field::placeholder {
  color: var(--secondary-text-color, rgba(255, 255, 255, 0.3));
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
