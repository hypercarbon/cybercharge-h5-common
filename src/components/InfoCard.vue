<template>
  <div class="info-card">
    <div class="user-info">
      <van-image class="user-info__avatar" round :src="avatarUrl" />
      <div class="user-info__information">
        <p class="user-info__information-name">{{ name }}</p>
        <p class="user-info__information-id">{{ id }}</p>
      </div>
    </div>
    <slot name="info"></slot>
  </div>
</template>

<script setup lang="ts">
// import Avatar from '@/assets/img_avatar.png'

defineProps<{
  name: string
  id: string
  avatarUrl: string
}>()
</script>

<style scoped>
.info-card {
  width: 100%;
  padding: 24px 16px;
  border-radius: 8px;
  border: 1px solid #fff;
  background: linear-gradient(180deg, #e5e5e5 0%, #f5f5f5 49.47%);
  .user-info {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    .user-info__avatar {
      width: 32px;
      height: 32px;
      border: 1px solid #fff;
    }
    .user-info__information {
      display: flex;
      flex-direction: column;
      gap: 2px;
      justify-content: center;
      .user-info__information-name {
        font-size: 14px;
        font-weight: 700;
      }
      .user-info__information-id {
        font-size: 12px;
        font-weight: 500;
        color: #737373;
      }
    }
  }
}
.info-card + .info-card {
  margin-top: 8px;
}
</style>
