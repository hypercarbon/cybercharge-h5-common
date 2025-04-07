<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const handleSwitchLang = (langCode: string) => {
  localStorage.setItem('langCode', langCode)
  location.reload()
}
</script>

<template>
  <main>
    <p style="text-align: center; font-size: 26px">{{ t('home.greet') }}</p>
    <van-button type="primary" @click="handleSwitchLang('en')">英语</van-button>
    <van-button type="primary" @click="handleSwitchLang('zh-CN')"
      >中文</van-button
    >
    <van-button type="primary" @click="handleSwitchLang('vi')"
      >越南文</van-button
    >
  </main>
</template>
