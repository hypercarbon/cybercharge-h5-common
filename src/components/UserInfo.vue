<template>
  <div class="user-info">
    <van-image class="user-info__avatar" round :src="avatar" />
    <div class="user-info__information">
      <p class="user-info__information-name">{{ name }}</p>
      <div
        v-if="showLevel"
        :class="[
          'user-info__information-tag',
          level == 0 ? 'topLevel' : 'otherLevel',
        ]"
      >
        <span>{{
          level == 0
            ? t('teamInfoPage.Topagent')
            : level == 1
              ? t('teamInfoPage.Level1agent')
              : t('teamInfoPage.Level2agent')
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps<{
  name: string
  avatar: string
  level: number
  showLevel: boolean
  onClick?: () => void
}>()
</script>

<style scoped>
.user-info {
  display: flex;
  gap: 8px;
  .user-info__avatar {
    width: 48px;
    height: 48px;
  }
  .user-info__information {
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    .user-info__information-name {
      font-size: 16px;
      font-weight: 700;
    }
    .user-info__information-tag {
      width: 74px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      background-size: contain;
    }
    .topLevel {
      background-image: url('@/assets/icon_agent_tag_purple.png');
    }
    .otherLevel {
      background-image: url('@/assets/icon_agent_tag_gray.png');
    }
  }
}
</style>
