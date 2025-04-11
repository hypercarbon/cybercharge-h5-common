<template>
  <div class="game-tabs">
    <div
      :class="[
        'game-item',
        activeChannelTab === channel.channelId ? 'active' : null,
      ]"
      v-for="channel in channelList"
      :key="channel.channelId"
      @click="handleClickChannel(channel.channelId)"
    >
      <img :src="channel.icon" alt="" />
      <span class="game-name">
        {{ channel.channelName }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { type Channel } from '@/services/bindingInviter'

defineProps<{
  channelList: Channel[]
  activeChannelTab: number
}>()

const emit = defineEmits<{
  (e: 'update:activeChannelTab', value: number): void
}>()

const handleClickChannel = (channelId: number) => {
  emit('update:activeChannelTab', channelId)
}
</script>

<style scoped>
.game-tabs {
  min-height: 56px;
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  overflow: auto;
  padding: 0 14px 20px;
  .game-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 16px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.15);
    &::before {
      position: absolute;
      content: '';
      width: 0px;
      height: 0px;
      border-width: 8px;
      border-style: solid;
      border-color: #fff transparent transparent transparent;
      left: 50%;
      transform: translateX(-50%);
      bottom: -15px;
      display: none;
    }
    img {
      width: 24px;
      height: 24px;
    }
    .game-name {
      font-size: 15px;
      color: #fff;
      font-weight: 500;
      white-space: nowrap;
    }
    &.active {
      background: #fff;
      &::before {
        display: block;
      }
      .game-name {
        color: #000;
      }
    }
  }
}
</style>
