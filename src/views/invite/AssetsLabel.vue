<script setup lang="ts">
import { defineProps } from 'vue'
import gemImg from '@/assets/invite/img_gem.png'

interface AssetsLabelProps {
  title: string
  value: string
}

defineProps<AssetsLabelProps>()
</script>

<template>
  <div class="assets-label">
    <p class="assets-label-text">{{ title }}</p>
    <div class="assets-num-wrapper">
      <img :src="gemImg" class="assets-img" alt="gem" />
      <p class="assets-num-val">{{ value || '0' }}</p>
    </div>
  </div>
</template>

<style scoped>
.assets-label {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assets-label-text {
  color: #fff;
  opacity: 0.65;
  font-size: 14px;
  font-weight: 400;
}

.assets-num-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.assets-img {
  width: 18px;
  height: 18px;
}

.assets-num-val {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
</style>
