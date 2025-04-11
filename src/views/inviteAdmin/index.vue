<template>
  <div
    class="invite-admin-page"
    :style="{
      paddingTop: userInfoStore.safeTop + 'px',
    }"
  >
    <CustomNavBar
      class="invite-admin-page-navbar"
      @back="handleBack"
      :title="t('inviteAdmin.Title')"
      extra="规则"
      @extra-click="handleRuleClick"
    />
    <UserInfo :user-info="userInfo" />
    <GameTabs
      :channel-list="channelList"
      :active-channel-tab="activeChannelTab"
      @update:active-channel-tab="handleClickChannel"
    />
    <div class="game-tabs-content">
      <van-tabs
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
          <div class="info-card">
            <div class="content">
              <div class="assets-title">
                <img :src="GemImg" alt="" />
                <span class="assets-value">GEM</span>
              </div>
              <div class="assets-th assets-row">
                <span class="assets-col">{{
                  t('inviteAdmin.TotalEarnings')
                }}</span>
                <span class="assets-col">{{
                  t('inviteAdmin.WeeklyEarnings')
                }}</span>
              </div>
              <div class="assets-tb assets-row">
                <span class="assets-col">{{
                  rewardDetail?.totalAmount || 0
                }}</span>
                <span class="assets-col">{{
                  rewardDetail?.weekAmount || 0
                }}</span>
              </div>
            </div>
          </div>
          <van-tabs
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
              <div class="other-level-info" v-else>
                <div class="other-level-info-item">
                  <span class="label">{{
                    t('inviteAdmin.TotalContribution')
                  }}</span>
                  <div class="value">
                    <img :src="GemImg" alt="" />
                    <span>{{ levelItem.details.totalAmount }}</span>
                  </div>
                </div>
                <div class="other-level-info-item">
                  <span class="label">{{
                    t('inviteAdmin.WeeklyContribution')
                  }}</span>
                  <div class="value">
                    <img :src="GemImg" alt="" />
                    <span>{{ levelItem.details.weekAmount }}</span>
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CustomNavBar from './components/CustomNavBar.vue'
import UserItem from './components/UserItem.vue'
import UserInfo from './components/UserInfo.vue'
import GameTabs from './components/GameTabs.vue'
import GemImg from './images/img_assets.png'
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

const handleRuleClick = () => {
  console.log('Rule button clicked')
  // 在这里添加规则按钮的点击处理逻辑
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

  console.log('tabs', tabs)

  return tabs
})

const handleClickChannel = (channelId: number) => {
  activeChannelTab.value = channelId
  _getRewardDetail()
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
  background-size: cover;
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
      .info-card {
        position: relative;
        width: 100%;
        height: 134px;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('./images/assets_bg.png');
          background-size: cover;
          background-position: center;
          z-index: -1;
        }
        &::after {
          content: '';
          position: absolute;
          width: 319px;
          height: 78px;
          left: 50%;
          transform: translate(-50%);
          bottom: -20px;
          background-image: url('./images/assets_bg_shadow.png');
          background-size: cover;
          background-position: bottom;
          z-index: -2;
        }
        .content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 16px 12px 24px;
          height: 100%;
          width: 100%;
          .assets-title {
            display: flex;
            gap: 4px;
            align-items: center;
            img {
              width: 24px;
              height: 24px;
            }
            .assets-value {
              font-weight: 700;
              font-size: 14px;
            }
          }
          .assets-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .assets-th {
            margin-top: 24px;
            margin-bottom: 8px;
            color: #333;
            font-size: 12px;
          }
          .assets-tb {
            color: #000;
            font-size: 24px;
            font-weight: 700;
          }
        }
      }
      .level-tabs-container {
        .van-tabs__nav {
        }
        .other-level-info {
          .other-level-info-item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 16px;
            .label {
              font-size: 14px;
              font-weight: 500;
            }
            .value {
              display: flex;
              align-items: center;
              gap: 2px;
              font-size: 16px;
              font-weight: 700;
              img {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
