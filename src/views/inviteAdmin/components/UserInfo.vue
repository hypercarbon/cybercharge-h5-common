<template>
  <div class="user-info">
    <img class="avatar" :src="userInfo?.user.avatar || AvatarImg" alt="" />
    <div class="info-wrapper">
      <skeleton v-if="!userInfo" width="180px" height="20px" />
      <p v-else class="username">{{ userInfo?.user.username }}</p>

      <skeleton
        style="margin-top: 4px"
        v-if="!userInfo"
        width="100px"
        height="20px"
      />
      <p v-else class="user-id">ID {{ userInfo?.user.id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import AvatarImg from '../images/avatar.png'
import { type UserInfo } from '@/services/bindingInviter'
import Skeleton from './Skeleton.vue'

defineProps<{
  userInfo?: UserInfo
}>()
</script>

<style scoped>
.user-info {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 14px 24px;
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  .info-wrapper {
    margin-left: 12px;

    .username {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
    }
    .user-id {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>
