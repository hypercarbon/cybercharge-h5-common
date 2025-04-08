<template>
  <div
    class="custom-input"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <img :src="icon" class="left-icon" alt="" />
    <input
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      class="input-field"
      :disabled="disabled"
    />
    <div class="right-buttons">
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
        {{ t('Copy') }}
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

const icon = computed(() => {
  if (props.channel) {
    return `src/views/bindingInviter/images/${props.channel}/icon_game.png`
  }
  return `src/views/bindingInviter/images/1/icon_game.png`
})

const backgroundImage = computed(() => {
  if (props.channel) {
    return `src/views/bindingInviter/images/${props.channel}/input_bg.png`
  }
  return `src/views/bindingInviter/images/1/input_bg.png`
})

const bindButtonImage = computed(() => {
  if (props.channel) {
    return `src/views/bindingInviter/images/${props.channel}/btn_small.png`
  } else {
    return 'src/views/bindingInviter/images/1/btn_small.png'
  }
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
    showToast(t('Copied successfully'))
  } else {
    showToast(t('Copy failed, please manually copy'))
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

.left-icon {
  width: 24px;
  height: 24px;
  margin-left: 12px;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 12px;
  color: var(--text-color, #fff);
  font-size: 16px;
}

.input-field::placeholder {
  color: var(--secondary-text-color, rgba(255, 255, 255, 0.3));
}

.right-buttons {
  display: flex;
  gap: 8px;
  margin-right: 12px;
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
</style>
