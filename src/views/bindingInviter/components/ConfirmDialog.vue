<template>
  <div class="confirm-dialog">
    <div class="dialog-content">
      <div class="dialog-header">
        {{ t('bindingInviter.ConfirmBindHeader') }}
      </div>
      <div class="close-btn" @click="handleClose">
        <van-icon class="icon-close" size="24" name="cross" />
      </div>

      <div class="dialog-body">
        <slot></slot>
      </div>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="handleClose">
          {{ t('bindingInviter.Cancel') }}
        </button>
        <button class="confirm-btn" @click="handleConfirm">
          {{ t('bindingInviter.Confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['close', 'confirm'])

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  width: 311px;
  /* height: 323px; */
  /* background-color: #fff; */
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #e2d4ff 0%, #fff 17.97%);
  .dialog-header {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    color: #333;
    padding: 16px 0;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  .icon-close {
    color: #737373;
  }
}

.dialog-body {
  flex: 1;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialog-footer {
  padding: 16px 24px;
  display: flex;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 48px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f2f2f2;
  color: #000;
}

.confirm-btn {
  background-color: #9059ff;
  color: #fff;
}
</style>
