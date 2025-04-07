<template>
  <div class="step-tips-container">
    <StepTipsItem
      v-for="tip in TIPS"
      :key="tip.id"
      :id="tip.id"
      :text="tip.text"
    />
  </div>
</template>

<script setup lang="ts">
import StepTipsItem from './components/StepTipsItem.vue'

interface StepTipsItemProps {
  id: number
  text: string
}

const TIPS = [
  {
    id: 1,
    text: "Click 'Invite Now' to share with friends",
  },
  {
    id: 2,
    text: 'Your friends register and log in through the link you shared',
  },
  {
    id: 3,
    text: 'Priority reward frequency for member purchases',
  },
]
</script>

<style scoped>
.step-tips-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
