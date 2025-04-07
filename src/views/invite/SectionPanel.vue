<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import ArrowIcon from './Icon/icon_arrow.vue'

interface SectionPanelProps {
  title: string
  className: string
  height: number
  bgImgSource: string
  contentImgSource: string
  titleIcon: string
  extraText?: string
}

const props = defineProps<SectionPanelProps>()

const imgSize = ref({ width: 1, height: 1 })

onMounted(() => {
  const img = new Image()
  img.src = props.contentImgSource
  img.onload = () => {
    imgSize.value = { width: img.width, height: img.height }
  }
})
</script>

<template>
  <!-- <div
    v-if="imgSize.height > 1"
    class="section"
    :style="{ height: `${height}px`, backgroundImage: `url(${bgImgSource})` }"
  > -->
  <div
    :class="['section', className]"
    :style="{
      // height: `${height}px`,
      backgroundImage: `url(${bgImgSource})`,
    }"
  >
    <div class="content">
      <div class="title-wrapper">
        <img :src="titleIcon" class="title-icon" alt="icon" />
        <p class="title-text">{{ title }}</p>
        <div v-if="extraText" class="title-extra" @click="$emit('click-extra')">
          <p class="title-extra-text">{{ extraText }}</p>
          <ArrowIcon />
        </div>
      </div>

      <div
        class="content-img"
        :style="{
          backgroundImage: `url(${contentImgSource})`,
          // aspectRatio: imgSize.width / imgSize.height,
        }"
      >
        <div class="content-container">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-top: 12px;
  width: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.section2 {
  height: 469px;
  .content-img {
    height: 392px;
  }
}

.section3 {
  height: 550px;
  .content-img {
    height: 473px;
  }
}

.section4 {
  height: 287px;
  .content-img {
    height: 210px;
  }
}

.content {
  width: 100%;
  height: 100%;
  padding: 13px 12px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.title-icon {
  width: 38px;
  height: 38px;
  margin-right: 9px;
}

.title-text {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.title-extra {
  display: flex;
  align-items: center;
  gap: 2px;
}

.title-extra-text {
  font-size: 14px;
  font-weight: 400;
  color: #fff;
}

.content-img {
  width: 100%;
  background-size: cover;
  background-position: center;
}

.content-container {
  padding: 12px 14px;
  height: 100%;
}
</style>
