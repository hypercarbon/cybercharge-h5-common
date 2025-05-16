<template>
  <div :class="['customNavBar']">
    <div class="customNavBarBackBtn" @click="handleBack">
      <BackIcon :color="navBarConfig.backIconColor" class="backIcon" />
    </div>
    <span class="title" :style="{ color: navBarConfig.titleColor }">{{
      title
    }}</span>
    <div
      v-if="extra"
      :style="{
        color: navBarConfig.extraColor,
      }"
      class="extra-button"
      @click="handleExtraClick"
    >
      {{ extra }}
    </div>
  </div>
</template>

<script setup lang="ts">
import BackIcon from '../Icon/icon_back.vue'
import type { ChannelType } from '../type/channel'
import { computed } from 'vue'
import { getThemeConfig } from '../model/theme'

const props = defineProps<{
  title: string
  extra?: string
  channel?: ChannelType
}>()

const navBarConfig = computed(() => {
  return getThemeConfig(props.channel || '1').navBar
})

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
    margin: 0 auto;
  }
  .extra-button {
    position: absolute;
    right: 26px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
  }
}
</style>
