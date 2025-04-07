<template>
  <div :class="['customNavBar']">
    <div class="customNavBarBackBtn">
      <BackIcon />
    </div>
    <div class="customNavBarExtra">
      <div class="customNavBarExtraItem">
        <FileIcon />
        <span class="customNavBarExtraText">Rule</span>
      </div>
      <div class="customNavBarExtraItem">
        <ShareIcon />
        <span class="customNavBarExtraText">Share</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useSafeAreaInsets } from 'vue-safe-area-context'; // 请确保你已经安装了 vue-safe-area-context
import BackIcon from './Icon/icon_back.vue'
import FileIcon from './Icon/icon_file.vue'
import ShareIcon from './Icon/icon_share.vue'
</script>

<style scoped>
.customNavBar {
  height: 44px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  z-index: 100;
}

.customNavBarBackBtn {
  width: 24px;
  height: 24px;
}

.customNavBarExtra {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 15px;
}

.customNavBarExtraItem {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.customNavBarExtraText {
  color: white;
  font-size: 16px;
  font-weight: 500;
}
</style>
