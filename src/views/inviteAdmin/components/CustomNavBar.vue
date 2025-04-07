<template>
  <div :class="['customNavBar']">
    <div class="customNavBarBackBtn">
      <BackIcon class="backIcon" />
    </div>
    <span class="title">My Invitations</span>
  </div>
</template>

<script setup lang="ts">
import BackIcon from '../Icon/icon_back.vue'
</script>

<style scoped>
.customNavBar {
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;
  .customNavBarBackBtn {
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    bottom: 0;
    padding-left: 16px;
    .backIcon {
      width: 24px;
      height: 24px;
    }
  }
  .title {
    color: #fff;
    margin: 0 auto;
  }
}
</style>
