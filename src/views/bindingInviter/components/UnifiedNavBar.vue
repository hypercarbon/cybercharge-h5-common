<template>
  <div :class="['customNavBar']">
    <div class="customNavBarBackBtn" @click="handleBack">
      <BackIcon
        :color="navBarTheme === 'black' ? '#000' : '#fff'"
        class="backIcon"
      />
    </div>
    <span
      class="title"
      :style="{ color: navBarTheme === 'black' ? '#000' : '#fff' }"
      >{{ title }}</span
    >
    <div
      v-if="extra"
      :style="{
        color: navBarTheme === 'black' ? '#000' : 'rgba(255, 255, 255, 0.7)',
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
const props = defineProps<{
  title: string
  extra?: string
  channel?: ChannelType
}>()

type NavBarTheme = 'black' | 'white'

const navBarThemeMap: Record<ChannelType, NavBarTheme> = {
  '1': 'white',
  '2': 'white',
  '3': 'black',
}

const navBarTheme = computed(() => {
  if (props.channel) {
    return navBarThemeMap[props.channel]
  } else {
    return navBarThemeMap['1']
  }
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
