<template>
  <section class="home-page__menu-container" v-if="agentMenu.length > 0">
    <p class="home-page__menu-title">{{ t('home.agentFunc') }}</p>
    <van-row>
      <van-col v-for="icon in agentMenu" :key="icon.text" span="8">
        <IconButton :text="icon.text" :onClick="() => handleClickIcon(icon)">
          <template #icon>
            <component :is="icon.icon" />
          </template>
        </IconButton>
      </van-col>
    </van-row>
  </section>

  <section class="home-page__menu-container" v-if="managementMenu.length > 0">
    <p class="home-page__menu-title">{{ t('home.mgmtFunc') }}</p>
    <van-row>
      <van-col v-for="icon in managementMenu" :key="icon.text" span="8">
        <IconButton :text="icon.text" :onClick="() => handleClickIcon(icon)">
          <template #icon>
            <component :is="icon.icon" />
          </template>
        </IconButton>
      </van-col>
    </van-row>
  </section>

  <section class="unlock_div" v-else>
    {{ t('home.addedIntroText') }}
  </section>
</template>

<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import IconApplication from '@/components/icons/IconApplication.vue'
import IconCommission from '@/components/icons/IconCommission.vue'
import IconDeposit from '@/components/icons/IconDeposit.vue'
import IconLevel1 from '@/components/icons/IconLevel1.vue'
import IconLevel2 from '@/components/icons/IconLevel2.vue'
import IconOrder from '@/components/icons/IconOrder.vue'
import IconProfile from '@/components/icons/IconProfile.vue'
import IconReview from '@/components/icons/IconReview.vue'
import IconTeam from '@/components/icons/IconTeam.vue'
import IconCountryAgent from '@/components/icons/iconCountryAgent.vue'

import { type AgentInfo, type AgentUserInfo } from '@/services/agent'
import { useUserInfoStore } from '@/stores/userInfo'
import { computed, ref, type Component } from 'vue'
import { useI18n } from 'vue-i18n'

const userInfoStore = useUserInfoStore()

const { t } = useI18n()

const props = defineProps<{
  agentInfo: AgentInfo
  agentUserInfo: AgentUserInfo
}>()

const emit = defineEmits(['clickIcon'])

const handleClickIcon = (icon: MenuItem) => {
  emit('clickIcon', icon)
}

export interface MenuItem {
  icon: Component
  text: string
  path: string
  nativePath?: boolean
}

const agentMenu = computed(() => {
  const { is_agent_admin, is_agent_apply, is_agent } = props.agentInfo
  const level = props.agentUserInfo.level
  const isPaid = props.agentUserInfo.is_deposit_paid

  if (is_agent_admin) {
    return [
      {
        icon: IconCountryAgent,
        text: t('home.addTopAgent'),
        path: '/agent/search',
      },
      { icon: IconReview, text: t('home.agentReview'), path: '/agent/review' },
      // { icon: IconDeposit, text: 'Deposit Submit', path: '/agent/deposit' }, // 管理员复核，暂无功能
    ]
  } else if (is_agent) {
    return [
      {
        icon: IconApplication,
        text: t('home.agentApplication'),
        path: '/application/materials',
      },
      level === 0 && {
        icon: IconLevel1,
        text: t('home.addL1Agent'),
        path: '/agent/search',
      },
      level === 1 && {
        icon: IconLevel2,
        text: t('home.addL2Agent'),
        path: '/agent/search',
      },
      level !== 2 && {
        icon: IconReview,
        text: t('home.agentReview'),
        path: '/agent/review',
      },
      !isPaid && {
        icon: IconDeposit,
        text: t('home.submitDeposit'),
        path: `native://pay?payId=${userInfoStore.agentUser?.id}&payType=agent_deposit`,
        nativePath: true,
      },
    ].filter(Boolean) as MenuItem[]
  } else {
    return [
      {
        icon: IconApplication,
        text: t('home.agentApplication'),
        path: '/application/materials',
      },
      {
        icon: IconDeposit,
        text: t('home.submitDeposit'),
        path: `native://pay?payId=${userInfoStore.agentUser?.id}&payType=agent_deposit`,
        nativePath: true,
      },
    ]
  }
})

const managementMenu = computed(() => {
  const { is_agent_admin, is_agent } = props.agentInfo
  const level = props.agentUserInfo.level

  if (is_agent_admin) {
    return [
      { icon: IconOrder, text: t('home.myOrders'), path: '/management/orders' },
      {
        icon: IconTeam,
        text: t('home.teamSum'),
        path: '/management/information',
      },
      {
        icon: IconCommission,
        text: t('home.comSettings'),
        path: '/commission/settings', // details ?
      },
    ]
  } else if (is_agent) {
    if (!props.agentUserInfo.is_deposit_paid) return []
    return [
      { icon: IconOrder, text: t('home.myOrders'), path: '/management/orders' },
      level !== 2 && {
        icon: IconTeam,
        text: t('home.teamSum'),
        path: '/management/information',
      },
      level === 0 && {
        icon: IconCommission,
        text: t('home.comSettings'),
        path: '/commission/details',
      },
      { icon: IconProfile, text: t('home.personalInfo'), path: '/profile' },
    ].filter(Boolean) as MenuItem[]
  }
  return []
})
</script>

<style scoped>
.home-page__menu-container {
  margin-top: 32px;
  .home-page__menu-title {
    color: #000;
    font-size: 16px;
    font-weight: 700;
  }
}
.unlock_div {
  width: 240px;
  margin: 86px auto;
  color: #b3b3b3;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  line-height: 28px;
}
</style>
