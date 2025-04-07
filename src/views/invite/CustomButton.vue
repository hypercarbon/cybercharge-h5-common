<template>
  <button class="custom-button" @click="onClick">
    <span class="button-text">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  onClick: () => void
  title: string
}>()
</script>

<style scoped>
.custom-button {
  width: 263px;
  height: 44px;
  border-radius: 4px;
  background-color: #9059ff;
  box-shadow: inset 0px -3px 0px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  outline: none;
  transition: opacity 0.2s;
}

.custom-button:hover {
  opacity: 0.8;
}

.button-text {
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  line-height: 44px;
}
</style>
