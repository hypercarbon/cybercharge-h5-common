<template>
  <div :class="['customNavBar']">
    <div class="customNavBarBackBtn" @click="handleBack">
      <BackIcon class="backIcon" />
    </div>
    <span class="title">{{ title }}</span>
    <div v-if="extra" class="extra-button" @click="handleExtraClick">
      {{ extra }}
    </div>
  </div>
</template>

<script setup lang="ts">
import BackIcon from '../Icon/icon_back.vue'

defineProps<{
  title: string
  extra?: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'extra-click'): void
}>()

const handleBack = () => {
  emit('back')
}

const handleExtraClick = () => {
  emit('extra-click')
}
</script>

<style scoped>
.customNavBar {
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;
  .customNavBarBackBtn {
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    bottom: 0;
    padding-left: 16px;
    .backIcon {
      width: 24px;
      height: 24px;
    }
  }
  .title {
    color: #fff;
    margin: 0 auto;
  }
  .extra-button {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
  }
}
</style>
