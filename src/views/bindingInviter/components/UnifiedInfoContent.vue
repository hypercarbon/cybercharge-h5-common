<template>
  <div class="info-content" :class="containerClass">
    <img
      :src="userInfo?.avatar || defaultAvatar"
      alt="avatar"
      :style="avatarStyle"
    />
    <p class="inviter-name" :class="nameClass" :style="nameStyle">
      {{ userInfo?.username }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChannelType } from '../type/channel'
import type { UserInfoById } from '@/services/bindingInviter'
import defaultAvatar from '../images/default-avatar.png'
import { getThemeConfig } from '../model/theme'

const props = defineProps({
  userInfo: {
    type: Object as () => UserInfoById,
    default: null,
  },
  channel: {
    type: String as () => ChannelType,
    default: '1',
  },
})

// 获取当前渠道配置
const currentConfig = computed(() => getThemeConfig(props.channel).infoContent)

// 容器类名
const containerClass = computed(() => ({
  'info-content': true,
  'custom-style': props.channel === '3',
}))

// 名称类名
const nameClass = computed(() => ({
  'inviter-name': true,
  'custom-style': props.channel === '3',
}))

// 名称样式
const nameStyle = computed(() => ({
  color: currentConfig.value.nameColor,
}))

// 头像样式
const avatarStyle = computed(() => ({
  borderColor: currentConfig.value.avatarBorderColor,
}))
</script>

<style scoped>
.info-content {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.info-content img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid;
}

.inviter-name {
  margin-top: 12px;
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  max-width: 100%;
  word-break: break-all;
  white-space: normal;
  overflow-wrap: break-word;
}

/* 自定义样式（channel 3） */
.info-content.custom-style {
  background-color: #fff;
}

.inviter-name.custom-style {
  color: var(--name-color);
}
</style>
