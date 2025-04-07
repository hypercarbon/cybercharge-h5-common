<template>
  <div
    class="step-tips-item"
    :style="{ aspectRatio: bgSize.width / bgSize.height }"
  >
    <div
      class="step-tips-item-icon"
      :style="{ aspectRatio: iconSize.width / iconSize.height }"
    >
      <span class="step-tips-index">{{ props.id }}</span>
    </div>
    <div class="step-tips-content">
      <span>{{ props.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  id: number
  text: string
}>()

const bgSize = ref({ width: 1, height: 1 })
const iconSize = ref({ width: 1, height: 1 })

onMounted(() => {
  const bgImg = new Image()
  bgImg.src = new URL('@/assets/invite/step/img_bg.png', import.meta.url).href
  bgImg.onload = () => {
    bgSize.value = { width: bgImg.width, height: bgImg.height }
  }

  const iconImg = new Image()
  iconImg.src = new URL(
    '@/assets/invite/step/icon_leading.png',
    import.meta.url,
  ).href
  iconImg.onload = () => {
    iconSize.value = { width: iconImg.width, height: iconImg.height }
  }
})
</script>

<style scoped>
.step-tips-item {
  display: flex;
  align-items: center;
  gap: 6.5px;
  padding-left: 6.5px;
  padding-right: 25px;
  background-image: url('@/assets/invite/step/img_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.step-tips-item-icon {
  width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/invite/step/icon_leading.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.step-tips-index {
  font-size: 18px;
  font-weight: 800;
}

.step-tips-content {
  flex: 1;
}

.step-tips-item + .step-tips-item {
  margin-top: 10px;
}
</style>
