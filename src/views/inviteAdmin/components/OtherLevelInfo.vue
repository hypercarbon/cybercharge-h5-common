<template>
  <div class="other-level-info">
    <div class="other-level-info-item">
      <span class="label">{{ t('inviteAdmin.TotalContribution') }}</span>
      <div class="value">
        <img :src="GemImg" alt="" />
        <span>{{ totalAmount }}</span>
      </div>
    </div>
    <div class="other-level-info-item">
      <span class="label">{{ t('inviteAdmin.WeeklyContribution') }}</span>
      <div class="value">
        <img :src="GemImg" alt="" />
        <span>{{ weekAmount }}</span>
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
  totalAmount: number
  weekAmount: number
}>()
</script>

<style scoped>
.other-level-info {
  .other-level-info-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 16px;
    .label {
      font-size: 14px;
      font-weight: 500;
    }
    .value {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 16px;
      font-weight: 700;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
