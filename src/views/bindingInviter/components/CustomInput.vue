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
      :disabled="isBind"
    />
    <div class="right-buttons">
      <button
        v-if="isBind"
        class="copy-button"
        :style="{ backgroundImage: `url(${bindButtonImage})` }"
        size="small"
        @click="handleCopy"
      >
        {{ t('Copy') }}
      </button>
      <van-icon
        v-else-if="!isBind && modelValue"
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
  type: {
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
  isBind: {
    type: Boolean,
    default: false,
  },
})

const icon = computed(() => {
  if (props.type) {
    return `src/views/bindingInviter/images/${props.type}/icon_game.png`
  }
  return `src/views/bindingInviter/images/1/icon_game.png`
})

const backgroundImage = computed(() => {
  if (props.type) {
    return `src/views/bindingInviter/images/${props.type}/input_bg.png`
  }
  return `src/views/bindingInviter/images/1/input_bg.png`
})

const bindButtonImage = computed(() => {
  if (props.type) {
    return `src/views/bindingInviter/images/${props.type}/btn_small.png`
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

const handleCopy = async () => {
  try {
    // 安卓不支持，需实现原生方法
    await navigator.clipboard.writeText(props.modelValue)
    showToast(t('Copied successfully'))
  } catch (err) {
    console.log('err', err)
    showToast(t('Copy failed'))
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
