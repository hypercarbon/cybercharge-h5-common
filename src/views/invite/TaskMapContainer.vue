<template>
  <div class="task-map-container">
    <van-tabs v-model:active="active" shrink @click-tab="handleClickTab">
      <van-tab
        v-for="(item, index) in inviterTaskInfo.items"
        :title="item.name"
      >
        <TaskItem
          v-if="item.configs.length"
          :inviterTaskItemConfig="item.configs"
      /></van-tab>
    </van-tabs>

    <div class="btn-wrapper">
      <CustomButton title="One-click claim" @click="handleCheckIt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskItem from './components/TaskMap.vue'
import CustomButton from './CustomButton.vue'
import { getInviterTasks, type InviterTaskInfo } from '@/services/invite'

const active = ref(0)

const emit = defineEmits(['changeTab'])

const props = defineProps<{
  inviterTaskInfo: InviterTaskInfo
}>()

const handleCheckIt = () => {
  console.log('check it')
}

const handleClickTab = (data: {
  name: string | number
  title: string
  event: MouseEvent
  disabled: boolean
}) => {
  console.log('click tab', data)
  emit('changeTab', data.name)
  // active.value = index
}

onMounted(() => {})
</script>

<style scoped>
.task-map-container {
  /* padding: 20px 22px; */
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
}

.task-map-row {
  display: flex;
  justify-content: space-between;
}

.task-map-even {
  justify-content: space-evenly;
}

.btn-wrapper {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
