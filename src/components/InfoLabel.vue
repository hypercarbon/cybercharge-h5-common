<template>
  <div class="info-label">
    <div class="info-label__label-text">{{ label }}</div>
    <div class="info-label__value-text">
      <slot name="value"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<style scoped>
.info-label {
  font-size: 14px;
  display: flex;
  gap: 4px;
  .info-label__label-text {
    color: #999;
  }
  .info-label__value-text {
    color: #333;
  }
}
.info-label + .info-label {
  margin-top: 8px;
}
</style>
