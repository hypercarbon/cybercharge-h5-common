<template>
  <div class="info-card">
    <div class="content">
      <div class="assets-title">
        <img :src="GemImg" alt="" />
        <span class="assets-value">GEM</span>
        <span class="assets-tip">{{ t('inviteAdmin.AssetsTip') }} </span>
      </div>
      <div class="assets-th assets-row">
        <span class="assets-col">{{ t('inviteAdmin.TotalEarnings') }}</span>
        <span class="assets-col">{{ t('inviteAdmin.WeeklyEarnings') }}</span>
      </div>
      <div class="assets-tb assets-row">
        <span v-if="rewardDetail" class="assets-col">{{
          rewardDetail.totalAmount || 0
        }}</span>
        <skeleton v-else width="100px" height="24px" />

        <span v-if="rewardDetail" class="assets-col">{{
          rewardDetail.weekAmount || 0
        }}</span>
        <skeleton v-else width="100px" height="24px" />
      </div>
    </div>
    <img class="shadow-img" :src="ShadowImg" alt="" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import GemImg from '../images/img_assets.png'
import ShadowImg from '../images/assets_bg_shadow.png'
import Skeleton from './Skeleton.vue'
import type { RewardDetail } from '@/services/bindingInviter'
const { t } = useI18n()

defineProps<{
  rewardDetail: RewardDetail | undefined
}>()
</script>

<style scoped>
.info-card {
  position: relative;
  width: 100%;
  height: 134px;
  margin: 16px 0 20px;
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
    z-index: 2;
  }
  .shadow-img {
    position: absolute;
    width: 319px;
    height: 78px;
    left: 50%;
    transform: translate(-50%);
    bottom: -16px;
    z-index: 1;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 16px 12px 24px;
    height: 100%;
    width: 100%;
    z-index: 3;
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
        font-size: 15px;
      }
      .assets-tip {
        font-size: 12px;
        margin-left: 4px;
        color: #666;
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
      .skeleton {
        width: 100px;
        padding: 0;
      }
    }
  }
}
</style>
