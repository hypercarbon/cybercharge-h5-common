<template>
  <main class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="t('commissionDetailPage.Commissiondetailssettings')"
      @click-left="onBack"
    />

    <div class="content">
      <div class="header">
        <div class="title">
          {{
            isTop
              ? t('teamInfoPage.Level1agent')
              : t('teamInfoPage.Level2agent')
          }}({{ count }})
        </div>

        <!-- <div class="information-view__top-tool-export" @click="onSearch">
          <IconSearch />
          <span class="information-view__top-tool-export-text">Search</span>
        </div> -->
      </div>

      <div class="cards">
        <InfoCard
          v-for="user in users"
          :key="user.id"
          :name="user.user.username"
          :id="'ID:' + user.id"
          :avatar-url="user.user.avatar.length > 0 ? user.user.avatar : Avatar"
        >
          <template #info>
            <InfoLabel :label="`${t('teamInfoPage.realName')}: `">
              <template #value>
                {{ user.real_name }}
              </template>
            </InfoLabel>
            <InfoLabel
              :label="`${t('commissionDetailPage.Commissionratio')}: `"
            >
              <template #value>
                <span>{{ `${user.commission_rate}%` }}</span>

                <span class="edit" @click="() => onEditShow(user)">{{
                  t('commissionDetailPage.Editratio')
                }}</span>
              </template>
            </InfoLabel>
          </template>
        </InfoCard>
      </div>
    </div>

    <van-popup v-model:show="editShow" class="edit-content">
      <div class="title">
        {{ t('commissionDetailPage.Commissionratesettings') }}
      </div>

      <van-field v-model="inputRadio" type="number" class="radio-input" />

      <van-button
        type="primary"
        color="#9059FF"
        block
        @click="onEditRatioConfirm"
      >
        {{ t('commissionDetailPage.Confirm') }}
      </van-button>
    </van-popup>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import InfoCard from '@/components/InfoCard.vue'
import InfoLabel from '@/components/InfoLabel.vue'

import { onMounted, reactive, ref, watch, watchEffect } from 'vue'
import {
  mySubAgentsList,
  setAgentCommissionRate,
  type AgentUserInfo,
} from '@/services/agent'
import { closeToast, showFailToast, showLoadingToast } from 'vant'
import Avatar from '@/assets/img_avatar.png'
import { useUserInfoStore } from '@/stores/userInfo'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userInfoStore = useUserInfoStore()

const editShow = ref(false)
const isTop = ref(true)
const count = ref(0)
const users = ref<AgentUserInfo[]>([])
const inputRadio = ref('0')
let user = reactive<AgentUserInfo>({})
const onEditShow = (_user: AgentUserInfo) => {
  user = _user
  inputRadio.value = `${user.commission_rate}`
  editShow.value = true
}
const onBack = () => {
  router.go(-1)
}

onMounted(() => {
  if (userInfoStore.agentUser?.level == 0) {
    isTop.value = true
  } else {
    isTop.value = false
  }
  showLoadingToast({
    message: t('common.loading'),
    forbidClick: true,
    loadingType: 'spinner',
  })
  mySubAgentsList().then(res => {
    closeToast()
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }
    users.value = res.data
    count.value = res.data.length ?? 0
  })
})

const onEditRatioConfirm = () => {
  showLoadingToast({
    message: t('common.loading'),
    forbidClick: true,
    loadingType: 'spinner',
  })
  setAgentCommissionRate(`${user.user_id}`, inputRadio.value).then(res => {
    closeToast()
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }
    user.commission_rate = Number(inputRadio.value)
    editShow.value = false
  })
}
const onSearch = () => {
  router.push('/user/search')
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}

.content {
  padding: 24px 16px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.title {
  font-weight: 700;
  font-size: 16px;
}
.information-view__top-tool-export {
  display: flex;
  align-items: center;
  gap: 2px;
  .information-view__top-tool-export-text {
    font-size: 12px;
  }
}
.cards {
  margin-top: 17px;

  .edit {
    margin-left: 8px;
    text-decoration: underline;
  }
}
.edit-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 331px;
  height: 230px;
  padding: 32px 24px;
  border-radius: 8px;
  background: linear-gradient(#e2d4ff 0, #ffffff 20%, #ffffff 100%);

  .title {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 24px;
  }

  .radio-input {
    text-align: center;
    background: #f3f3f3;
    margin-bottom: 24px;
  }
}
.search-popup {
}
</style>
