<template>
  <div class="icon-button" @click="onClick">
    <div class="icon-button__icon-wrapper">
      <slot name="icon"></slot>
    </div>
    <p class="icon-button__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  onClick?: () => void
}>()
</script>

<style scoped>
.icon-button {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon-button__icon-wrapper {
    margin-bottom: 12px;
    width: 32px;
    height: 32px;
  }
  .icon-button__text {
    font-size: 14px;
    color: #000;
    text-align: center;
  }
}
</style>
