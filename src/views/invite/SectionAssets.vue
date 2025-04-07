<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AssetsLabel from './AssetsLabel.vue'

// 图片资源
import bgImgSource from '@/assets/invite/bg/bg_section_1.png'
import assetsImgSource from '@/assets/invite/img_assets_bg.png'
import gemImg from '@/assets/invite/img_gem.png'
import ipImg from '@/assets/invite/img_ip.png'
import type { StatTaskInfo } from '@/services/invite'

const props = defineProps<{
  statTask: StatTaskInfo | null
}>()

// 计算图片尺寸
const bgImgSize = ref({ width: 1, height: 1 })
const assetsImgSize = ref({ width: 1, height: 1 })

// 安全区适配（示例：需要配合 Vue 项目中是否使用类似 `vue-safe-area`）
const safeAreaTop = ref(44) // 假设 44 为默认顶部安全距离

// 获取图片尺寸
const getImageSize = (src: string, targetRef: typeof bgImgSize) => {
  const img = new Image()
  img.src = src
  img.onload = () => {
    targetRef.value = { width: img.width, height: img.height }
  }
  img.onerror = error => {
    console.error('Error loading image size:', error)
  }
}

// 组件挂载时获取图片尺寸
onMounted(() => {
  getImageSize(bgImgSource, bgImgSize)
  getImageSize(assetsImgSource, assetsImgSize)
})

// 计算 aspectRatio
const bgAspectRatio = computed(
  () => bgImgSize.value.width / bgImgSize.value.height,
)
const assetsAspectRatio = computed(
  () => assetsImgSize.value.width / assetsImgSize.value.height,
)

// 格式化数字（假设 utils 中有 formatNumber 方法）
const formatNumber = (num: number): string => num.toLocaleString()
</script>

<template>
  <div
    v-if="bgImgSize.height > 1 && assetsImgSize.height > 1"
    class="image-background"
    :style="{
      backgroundImage: `url(${bgImgSource})`,
      marginTop: `-${safeAreaTop}px`,
      paddingTop: `${safeAreaTop}px`,
      aspectRatio: bgAspectRatio,
    }"
  >
    <div class="info-section">
      <p class="invite-text">Invite friends to earn reward</p>

      <div
        class="img-assets-bg"
        :style="{
          backgroundImage: `url(${assetsImgSource})`,
          aspectRatio: assetsAspectRatio,
        }"
      >
        <p class="assets-title">My invitation</p>
        <img :src="gemImg" class="img-gem" alt="gem" />
        <!-- <p class="assets-num">{{ formatNumber(102108002.345676) }}</p> -->
        <p class="assets-num">
          {{ formatNumber(Number(statTask?.total_reward || '0')) }}
        </p>
        <p class="assets-tips">Invite friends to collect gem rewards</p>
      </div>

      <img :src="ipImg" class="img-ip" alt="ip" />
    </div>

    <div class="assets-label-container">
      <AssetsLabel
        title="Gems earned by referred users so far"
        :value="statTask?.inviter_reward_amount || '0'"
      />
      <AssetsLabel
        title="Gem rebates from referrals"
        :value="statTask?.task_rewoard_gem_total || '0'"
      />
    </div>
  </div>
</template>

<style scoped>
.image-background {
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.info-section {
  position: relative;
  margin-top: 25px;
  width: 100%;
  padding: 0 12px;
}

.invite-text {
  margin-bottom: 34px;
  width: 181px;
  line-height: 29px;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.img-assets-bg {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.img-ip {
  position: absolute;
  right: 0;
  top: -10px;
  width: 189px;
  height: 176px;
  z-index: 2;
}

.assets-title {
  line-height: 28px;
  color: #000;
  font-size: 14px;
  font-weight: 500;
}

.img-gem {
  margin-top: 28px;
  width: 48px;
  height: 48px;
}

.assets-num {
  margin-top: 12px;
  font-size: 24px;
  color: #000;
  font-weight: 700;
}

.assets-tips {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 400;
}

.assets-label-container {
  padding-top: 19px;
  padding-left: 14px;
  padding-right: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
