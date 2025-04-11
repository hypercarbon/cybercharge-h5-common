<template>
  <li class="user-item">
    <img class="avatar" :src="user.user.avatar || UserAvatar" alt="" />
    <div class="user-info-card">
      <p class="name">{{ user.userId }}</p>
      <p class="id">ID:{{ user.userId }}</p>

      <div class="assets-row">
        <span class="assets-label">{{
          t('inviteAdmin.WeeklyContribution')
        }}</span>
        <img :src="GemImg" alt="" />
        <span class="assets-num">{{ user.totalAmount }}</span>
      </div>
      <p class="time">
        {{ formatTimestamp(user.invitationTime) }}
        {{ t('inviteAdmin.Joined') }}
      </p>
    </div>
    <div class="total-info">
      <div class="assets-info">
        <img :src="GemImg" alt="" />
        <span class="assets-total-num">{{ user.weekAmount }}</span>
      </div>
      <span class="info-text">{{ t('inviteAdmin.TotalContribution') }}</span>
    </div>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatTimestamp } from '@/utils/utils'
import GemImg from '../images/img_assets.png'
import UserAvatar from '../images/user_avatar.png'
import { type LevelUser } from '@/services/bindingInviter'

const { t } = useI18n()

defineProps<{
  user: LevelUser
}>()
</script>

<style scoped>
.user-item {
  position: relative;
  padding: 24px 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: flex-start;
}

.user-item::after {
  position: absolute;
  bottom: 0;
  content: '';
  height: 1px;
  width: 100%;
  background: #f2f2f2;
}

.avatar {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  margin-right: 8px;
}

.user-info-card {
  flex: 1;
}

.name {
  font-size: 15px;
  font-weight: 700;
}

.id {
  margin-top: 4px;
  color: #737373;
  font-weight: 400;
}

.assets-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.assets-label {
  font-size: 12px;
  font-weight: 400;
  color: #737373;
}

.assets-row img {
  margin: 0 2px 0 4px;
  height: 14px;
  width: 14px;
}

.assets-num {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.time {
  margin-top: 16px;
  color: #999;
  font-size: 12px;
}

.total-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.assets-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.assets-info img {
  width: 16px;
  height: 16px;
}

.assets-total-num {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}

.info-text {
  font-size: 12px;
  font-weight: 400;
  color: #737373;
}
</style>
