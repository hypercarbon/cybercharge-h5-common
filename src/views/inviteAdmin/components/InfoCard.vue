<template>
  <div class="info-card">
    <div class="content">
      <div class="assets-title">
        <img :src="GemImg" alt="" />
        <span class="assets-value">GEM</span>
      </div>
      <div class="assets-th assets-row">
        <span class="assets-col">{{ t('inviteAdmin.TotalEarnings') }}</span>
        <span class="assets-col">{{ t('inviteAdmin.WeeklyEarnings') }}</span>
      </div>
      <div class="assets-tb assets-row">
        <span class="assets-col">{{ totalAmount || 0 }}</span>
        <span class="assets-col">{{ weekAmount || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import GemImg from '../images/img_assets.png'

const { t } = useI18n()

defineProps<{
  totalAmount?: number
  weekAmount?: number
}>()
</script>

<style scoped>
.info-card {
  position: relative;
  width: 100%;
  height: 134px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../images/assets_bg.png');
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
  &::after {
    content: '';
    position: absolute;
    width: 319px;
    height: 78px;
    left: 50%;
    transform: translate(-50%);
    bottom: -20px;
    background-image: url('../images/assets_bg_shadow.png');
    background-size: cover;
    background-position: bottom;
    z-index: -2;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 16px 12px 24px;
    height: 100%;
    width: 100%;
    .assets-title {
      display: flex;
      gap: 4px;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
      }
      .assets-value {
        font-weight: 700;
        font-size: 14px;
      }
    }
    .assets-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .assets-th {
      margin-top: 24px;
      margin-bottom: 8px;
      color: #333;
      font-size: 12px;
    }
    .assets-tb {
      color: #000;
      font-size: 24px;
      font-weight: 700;
    }
  }
}
</style>
