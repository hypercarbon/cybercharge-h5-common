<template>
  <div class="section-bottom">
    <div class="linear-button">
      <img :src="LightImg" alt="" />
      One-click invite
    </div>
  </div>
</template>

<script setup lang="ts">
import LightImg from '@/assets/invite/bg_main_btn_light.png'
</script>

<style scoped>
.section-bottom {
  margin-top: 12px;
  width: 100%;
  height: 114px;
  background-image: url('@/assets/invite/bg/bg_bottom.png');
  background-size: cover;
  display: flex;
  padding-top: 12px;
  justify-content: center;
  .linear-button {
    position: relative;
    width: 323px;
    height: 56px;
    background-image: url('@/assets/invite/bg_main_btn.png');
    background-size: cover;
    line-height: 56px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    img {
      position: absolute;
      left: 0;
      height: 100%;
      animation: move 1s infinite ease-out;
    }
  }
}

@keyframes move {
  0% {
    left: 0;
  }

  100% {
    left: 85%;
  }
}
</style>
