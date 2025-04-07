<template>
  <div class="search-view">
    <van-nav-bar safe-area-inset-top left-arrow @click-left="onBack" />
    <div class="search-view__content">
      <p class="search-view__content-title">{{ t('home.addAgent') }}</p>
      <van-field
        class="search-view__content-input"
        :placeholder="t('addAgentPage.inpPlaceholder')"
        v-model="value"
        type="digit"
        :maxlength="20"
        :error-message="errorMessages"
        clickable
        clearable
        @click="onTextFieldFocus"
        @clear="handleClear"
      >
        <template #button>
          <van-button
            class="search-view__content-input-btn"
            size="small"
            type="primary"
            :disabled="value.length < 6"
            @click="onQueryUserClick"
            >{{ t('addAgentPage.searchBtn') }}</van-button
          >
        </template>
      </van-field>
      <ul class="search-view__content-users">
        <li
          v-for="(user, index) in USERS"
          :key="index"
          class="search-view__content-user-item"
        >
          <van-image
            class="search-view__content-user-avatar"
            round
            :src="user.avatar"
          />
          <span class="search-view__content-user-name">{{ user.name }}</span>
        </li>
      </ul>

      <van-button
        :class="{
          'search-view__content-btn': true,
        }"
        type="primary"
        block
        :disabled="!USERS.length"
        @click="addUserAgent"
        >{{
          userInfoStore.agentInfo?.is_agent_admin == 1
            ? t('addAgentPage.setTopBtnText')
            : userInfoStore.agentUser?.level == 0
              ? t('addAgentPage.setL1BtnText')
              : t('addAgentPage.setL2BtnText')
        }}</van-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import Avatar from '@/assets/img_avatar.png'
import { addAgent, checkAgentUser } from '@/services/agent'
import {
  closeToast,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
} from 'vant'
import { useI18n } from 'vue-i18n'
import { useUserInfoStore } from '@/stores/userInfo'

const userInfoStore = useUserInfoStore()

const { t } = useI18n()

const USERS = ref(<object[]>[])

const show = ref(false)

const value = ref('')

const errorMessages = ref('')

const onBack = () => router.back()

const handleClear = () => {
  value.value = ''
  errorMessages.value = ''
  USERS.value = []
}

const onQueryUserClick = () => {
  showLoadingToast({
    message: t('common.loading'),
    forbidClick: true,
    loadingType: 'spinner',
  })

  checkAgentUser(Number(value.value))
    .then(result => {
      USERS.value = []
      if (result.code != 0) {
        errorMessages.value = result.msg ?? ''
        return
      }

      USERS.value = [
        {
          avatar: result.data.avatar.length ? result.data.avatar : Avatar,
          name: result.data.username,
        },
      ]
    })
    .catch(err => {})
}

const onTextFieldFocus = () => {
  errorMessages.value = ''
  USERS.value = []
}

const addUserAgent = () => {
  showLoadingToast({
    message: t('common.loading'),
    forbidClick: true,
    loadingType: 'spinner',
  })

  addAgent(Number(value.value)).then(result => {
    closeToast()
    if (result.code != 0) {
      showFailToast(result.msg ?? '')
      return
    }
    errorMessages.value = ''
    USERS.value = []
    value.value = ''
    showSuccessToast('success')
  })
}
</script>

<style scoped>
.search-view {
  height: 100%;
  .search-view__content {
    position: relative;
    height: calc(100% - 46px);
    padding: 24px 16px;
    .search-view__content-title {
      color: #000;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .search-view__content-input {
      background-color: #f5f5f5;

      .search-view__content-input-btn {
        /* color: rgba(144, 89, 255, 0.4); */
        background-color: #f5f5f5;
        border-width: 0;
        color: #9059ff;
        font-size: 14px;
      }
    }
    .search-view__content-users {
      .search-view__content-user-item {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 16px 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .search-view__content-user-avatar {
          width: 32px;
          height: 32px;
        }
        .search-view__content-user-name {
          font-weight: 500;
          font-size: 14px;
        }
      }
    }
    .search-view__content-btn {
      margin-top: 20px;
    }
  }
}
</style>

<style>
.search-view__content-input {
  overflow: visible !important;
  .van-field__error-message {
    position: absolute;
    bottom: -40px;
    left: -12px;
  }
}
</style>
