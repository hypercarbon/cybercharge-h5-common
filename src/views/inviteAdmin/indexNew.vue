<template>
  <div
    class="invite-admin-page"
    :style="{
      paddingTop: userInfoStore.safeTop + 'px',
    }"
  >
    <CustomNavBar class="invite-admin-page-navbar" @back="handleBack" />
    <UserInfo :user-info="userInfo" />
    <GameTabs
      :channel-list="channelList"
      :active-channel-tab="activeChannelTab"
      @update:active-channel-tab="handleClickChannel"
    />
    <div class="game-tabs-content">
      <div v-for="levelItem in tokens" :key="levelItem.id" class="assets-name">
        {{ levelItem.name }}
      </div>

      <InfoCard :reward-detail="rewardDetail" />

      <div v-if="rewardDetail" class="level-tab-container">
        <span
          v-for="(levelItem, index) in levelTabs"
          :key="levelItem.id"
          class="level-name"
          :class="{ active: activeInviteTab === index }"
          @click="handleClickLevel(index)"
        >
          {{
            index < 2 ? `${levelItem.name} (${levelItem.num})` : levelItem.name
          }}
        </span>
      </div>

      <div v-if="rewardDetail">
        <ul class="users-list" v-if="activeInviteTab !== 2">
          <UserItem
            v-for="user in levelTabs[activeInviteTab].details"
            :key="user.userId"
            :user="user"
          />
          <li class="bottom-line">
            {{ t('inviteAdmin.BottomLineText') }}
          </li>
        </ul>

        <OtherLevelInfo
          v-else
          :total-amount="levelTabs[activeInviteTab].details.totalAmount"
          :week-amount="levelTabs[activeInviteTab].details.weekAmount"
        />
      </div>

      <!-- <van-tabs
        class="token-tabs-container"
        v-model:active="activeAsstesTab"
        swipeable
        type="card"
        color="#7D71FF"
        lazy-render
      >
        <van-tab
          title-class="token-tab-title"
          class="token-tab-item"
          v-for="item in tokens"
          :title="item.name"
          :key="item.id"
        >
          <InfoCard :reward-detail="rewardDetail" /> -->

      <!-- <span
            v-for="(levelItem) in levelTabs"
            :key="levelItem.id"
            class="game-name"
            @click="handleClickLevel(levelItem.id)"
          >
            {{ levelItem.name }}
          </span>

          <ul class="users-list" v-if="activeInviteTab !== 2">
            <UserItem
              v-for="user in levelTabs[activeInviteTab].details"
              :key="user.userId"
              :user="user"
            />
            <li class="bottom-line">
              {{ t('inviteAdmin.BottomLineText') }}
            </li>
          </ul>
          <OtherLevelInfo
            v-else
            :total-amount="levelItem.details.totalAmount"
            :week-amount="levelItem.details.weekAmount"
          /> -->

      <!-- <van-tabs
            v-if="levelTabs.length > 0"
            class="level-tabs-container"
            v-model:active="activeInviteTab"
          >
            <van-tab
              v-for="(levelItem, index) in levelTabs"
              :title="
                index < 2
                  ? `${levelItem.name} (${levelItem.num})`
                  : levelItem.name
              "
              :key="levelItem.id"
            >
              <ul class="users-list" v-if="index !== 2">
                <UserItem
                  v-for="user in levelItem.details"
                  :key="user.userId"
                  :user="user"
                />
                <li class="bottom-line">
                  {{ t('inviteAdmin.BottomLineText') }}
                </li>
              </ul>
              <OtherLevelInfo
                v-else
                :total-amount="levelItem.details.totalAmount"
                :week-amount="levelItem.details.weekAmount"
              />
            </van-tab>
          </van-tabs> -->
      <!-- </van-tab>
      </van-tabs> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CustomNavBar from './components/CustomNavBar.vue'
import UserItem from './components/UserItem.vue'
import UserInfo from './components/UserInfo.vue'
import GameTabs from './components/GameTabs.vue'
import {
  getUserInfo,
  type UserInfo as UserInfoType,
  getChannelList,
  type Channel,
  getRewardDetail,
  type RewardDetail,
  type LevelUser,
} from '@/services/bindingInviter'
import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore()
import { useI18n } from 'vue-i18n'
import nativeEvent from '@/utils/nativeEvent'
import InfoCard from './components/InfoCard.vue'
import OtherLevelInfo from './components/OtherLevelInfo.vue'

const { t } = useI18n()

const activeChannelTab = ref(0)
const activeAsstesTab = ref(0)
const activeInviteTab = ref(0)

const userInfo = ref<UserInfoType>()
const channelList = ref<Channel[]>([])
const rewardDetail = ref<RewardDetail>()

const tokens = [
  {
    id: 1,
    name: 'GEM',
  },
]

const handleBack = () => {
  nativeEvent.close()
}

const levelTabs = computed(() => {
  const tabs = []

  if (rewardDetail.value?.oneLevels) {
    tabs.push({
      id: 1,
      name: t('inviteAdmin.Direct'),
      num: rewardDetail.value?.oneLevels.length,
      details: rewardDetail.value?.oneLevels as LevelUser[],
    })
  }
  if (rewardDetail.value?.twoLevels) {
    tabs.push({
      id: 2,
      name: t('inviteAdmin.Indirect'),
      num: rewardDetail.value?.twoLevels.length,
      details: rewardDetail.value?.twoLevels as LevelUser[],
    })
  }
  if (rewardDetail.value?.otherLevels) {
    tabs.push({
      id: 3,
      name: t('inviteAdmin.More'),
      num: 0,
      details: rewardDetail.value?.otherLevels as {
        totalAmount: number
        weekAmount: number
      },
    })
  }

  return tabs
})

const handleClickChannel = (channelId: number) => {
  activeChannelTab.value = channelId
  _getRewardDetail()
}

const handleClickLevel = (levelId: number) => {
  activeInviteTab.value = levelId
}

onMounted(async () => {
  await _getUserInfo()
  console.log('userInfo', userInfo)
  await _getChannelList()
  await _getRewardDetail()
})

const _getUserInfo = async () => {
  const res = await getUserInfo()
  if (res.code === 0) {
    userInfo.value = res.data
  }
  console.log('res', res)
}

const _getChannelList = async () => {
  const res = await getChannelList()
  if (res.code === 0) {
    channelList.value = res.data
    activeChannelTab.value = res.data[0].channelId
  }
}

const _getRewardDetail = async () => {
  const res = await getRewardDetail({
    channel_id: activeChannelTab.value.toString(),
  })
  if (res.code === 0) {
    rewardDetail.value = res.data
  }

  console.log('res', res)
}
</script>

<style scoped>
.invite-admin-page {
  height: 100vh;
  background: url('./images/bg.png');
  background-size: contain;
  background-position: top;
  display: flex;
  flex-direction: column;
  .invite-admin-page-navbar {
    flex-shrink: 0;
  }
  .game-tabs-content {
    width: 100%;
    flex-grow: 1;
    background-image: url('./images/game_tab_bg.png');
    background-size: cover;
    padding: 20px 14px;
    overflow: auto;
    min-height: 0;
    .assets-name {
      width: 60px;
      padding: 7px 14px;
      border-radius: 99px;
      background: #7d71ff;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
    }
    .level-tab-container {
      display: flex;
      justify-content: space-between;
      .level-name {
        position: relative;

        color: #333;
        font-size: 14px;
        font-weight: 700;
        padding: 7px 14px;
        &.active {
          &::before {
            display: block;
          }
        }
        &::before {
          content: '';
          width: 24px;
          height: 2px;
          position: absolute;
          background: #000;
          border-radius: 99px;
          bottom: 0;
          left: 50%;
          transform: translate(-50%);
          display: none;
        }
      }
    }
  }
}

.users-list {
  display: flex;
  flex-direction: column;
  .bottom-line {
    width: 100%;
    padding: 24px 0 18px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #999;
  }
}
</style>

<style>
.token-tabs-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .van-tabs__wrap {
    flex-shrink: 0;
    .van-tabs__nav {
      margin: 0;
      border-color: #fff !important;
      gap: 8px !important;
      .token-tab-title {
        flex: 0;
        padding: 0 12px;
        width: 80px !important;
        border: none;
        border-radius: 99px;
        background-color: #f2f2f2;
        color: #737373 !important;
        &.van-tab--active {
          color: #fff !important;
        }
      }
    }
  }
  .van-tabs__content {
    flex-grow: 1;
    min-height: 0;
    .van-swipe-item {
      overflow: auto;
      margin-top: 16px;
      padding-bottom: 12px;
      height: 100% !important;
    }
  }
}
</style>
