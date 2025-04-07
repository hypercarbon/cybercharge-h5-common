<template>
  <div
    :class="{
      'payment-card': true,
      'payment-card--active': isActive,
    }"
    @click="click"
  >
    <div class="payment-card__left-container">
      <div class="payment-card__icon-wrapper">
        <slot name="icon"></slot>
      </div>
      <span class="payment-card__text">{{ text }}</span>
    </div>
    <div class="payment-card__right-container">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  isActive: boolean
}>()

const emit = defineEmits(['click'])

const click = () => {
  emit('click')
}
</script>

<style scoped>
.payment-card {
  width: 100%;
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  &.payment-card--active {
    border: 1px solid #000;
  }
  .payment-card__left-container {
    display: flex;
    align-items: center;
    gap: 8px;
    .payment-card__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
    .payment-card__text {
      font-size: 16px;
    }
  }
  .payment-card__right-container {
  }
}
.payment-card + .payment-card {
  margin-top: 8px;
}
</style>
