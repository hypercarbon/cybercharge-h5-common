<script setup lang="ts">
import StaticRoute, { type MenuItem } from './StaticRoute.vue'
import UserInfo from '@/components/UserInfo.vue'
import router from '@/router'
import { onMounted, ref, type Component } from 'vue'
import nativeEvent from '@/utils/nativeEvent'
import { getAgentMessage, isAgent, type Agent } from '@/services/agent'
import Avatar from '@/assets/img_avatar.png'
import type { AgentInfo, AgentUserInfo } from '@/services/agent'
import { useUserInfoStore } from '@/stores/userInfo'
import { showFailToast } from 'vant'

const userInfoStore = useUserInfoStore()

const isLoading = ref(false)

const handleClickIcon = (icon: MenuItem) => {
  if (icon.nativePath) {
    nativeEvent.openUrl({
      url: icon.path,
    })
  } else {
    router.push(icon.path)
  }
}

const onBack = () => {
  nativeEvent.close()
}

const agentInfo = ref<AgentInfo>()
const agentUserInfo = ref<AgentUserInfo>()

onMounted(() => {
  getUserInfo()
})

const getUserInfo = () => {
  // if (!userInfoStore.agentInfo && !userInfoStore.agentUser) {
  isLoading.value = true
  getAgentMessage()
    .then(result => {
      if (result.code != 0) return

      console.log('agent = ', result)
      agentUserInfo.value = result.data
      userInfoStore.setAgentUser(result.data)
    })
    .finally(() => {
      isLoading.value = false
    })

  isAgent()
    .then(result => {
      console.log('isAgent = ', result.data)
      if (result.code != 0) return

      // if (result.data.is_pioneer_agent === 1) {
      //   showFailToast('您当前未获取该资格，请联系管理员。')
      //   setTimeout(() => {
      //     nativeEvent.close()
      //   }, 1000)
      //   return
      // }

      agentInfo.value = result.data
      userInfoStore.setAgentInfo(result.data)
    })
    .finally(() => {
      isLoading.value = false
    })
  // } else {
  //   agentUserInfo.value = userInfoStore.agentUser
  //     ? userInfoStore.agentUser
  //     : undefined
  //   agentInfo.value = userInfoStore.agentInfo
  //     ? userInfoStore.agentInfo
  //     : undefined
  // }
}
</script>

<template>
  <main class="home-page">
    <van-nav-bar safe-area-inset-top left-arrow @click-left="onBack" />
    <div class="home-page__content">
      <UserInfo
        :name="agentUserInfo?.user.username ?? ''"
        :level="agentUserInfo?.level ?? -1"
        :avatar="
          (agentUserInfo?.user.avatar.length ?? 0 > 0)
            ? (agentUserInfo?.user.avatar ?? '')
            : Avatar
        "
        :show-level="!!agentInfo?.is_agent"
        v-if="agentUserInfo?.id && !agentInfo?.is_agent_admin"
      />
      <template v-if="!agentInfo?.is_agent_admin">
        <van-skeleton v-if="isLoading" avatar avatar-size="55" :row="2">
        </van-skeleton
      ></template>

      <StaticRoute
        v-if="agentInfo && agentUserInfo && !isLoading"
        :agent-user-info="agentUserInfo"
        :agent-info="agentInfo"
        @click-icon="handleClickIcon"
      />
      <template v-else>
        <van-skeleton style="margin-top: 80px" title :row="3" />
        <van-skeleton style="margin-top: 100px" title :row="3"
      /></template>
    </div>
  </main>
</template>

<style lang="css" scoped>
.home-page {
  .home-page__content {
    padding: 24px 16px;
  }
}
</style>
