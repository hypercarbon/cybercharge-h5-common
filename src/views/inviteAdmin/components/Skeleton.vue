<template>
  <div class="skeleton" :style="{ width, height, borderRadius }"></div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  width?: string
  height?: string
  borderRadius?: string
}>()
</script>

<style scoped>
.skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.25) 25%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.25) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
