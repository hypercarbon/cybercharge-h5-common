<template>
  <div class="custom-table">
    <div class="row custom-table-header">
      <div class="column column-1">
        <div class="cell left-align">Friend Id</div>
      </div>
      <div class="column column-2">
        <div class="cell center-align">Referral tier</div>
      </div>
      <div class="column column-3">
        <div class="cell right-align">Earn rewards</div>
      </div>
    </div>
    <div class="scroll-view">
      <div v-for="item in displayData" :key="item.from_user_id" class="row">
        <div class="column column-1">
          <div class="cell user-info-cell">
            <img class="avatar" src="@/assets/invite/icon_avatar.png" />
            <div class="user-info">
              <div class="username">{{ item.from_user_username }}</div>
              <div class="user-id">ID: {{ item.from_user_id }}</div>
            </div>
          </div>
        </div>
        <div class="column column-2">
          <div class="cell center-align">{{ item.user_id }}</div>
        </div>
        <div class="column column-3">
          <div class="cell assets-cell">
            <img class="assets-img" src="@/assets/invite/img_gem.png" />
            <div class="assets-num">{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskCompletionRecords } from '@/services/invite'
import { ref, onMounted, nextTick, computed } from 'vue'

const props = defineProps<{
  data: TaskCompletionRecords[]
}>()

const displayData = computed(() => {
  return props.data.map(item => ({
    ...item,
    amount: Number(item.amount).toFixed(4),
  }))
})

onMounted(() => {})
</script>

<style scoped>
.custom-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  flex-direction: row;
  color: #737373;
  width: 100%;
}
.custom-table-header {
  /* height: 48px; */
}
.column {
  /* flex: 1; */
}
.column-1 {
  width: 120px;
}
.column-2 {
  width: 100px;
}
.column-3 {
  flex: 1;
  min-width: 0;
}
.cell {
  padding: 12px 0;
}
.left-align {
  text-align: left;
}
.center-align {
  text-align: center;
}
.right-align {
  text-align: right;
}
.scroll-view {
  overflow-y: auto;
  height: calc(100% - 48px);
}
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.username {
  font-size: 14px;
  font-weight: 500;
  color: #000;
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Show ellipsis when text overflows */
  width: 80px; /* Set a maximum width (adjust as needed) */
}
.user-id {
  font-size: 11px;
  color: #888;
}
.assets-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 100%;
}
.assets-img {
  width: 16px;
  height: 16px;
}
.assets-num {
  /* width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  */
  font-size: 16px;
  font-weight: bold;
  color: #000;
}
</style>
