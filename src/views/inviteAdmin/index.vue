<template>
  <div
    class="invite-admin-page"
    :style="{
      paddingTop: userInfoStore.safeTop + 'px',
    }"
  >
    <CustomNavBar class="invite-admin-page-navbar" @back="handleBack" />
    <div class="user-info">
      <img class="avatar" :src="userInfo?.user.avatar || AvatarImg" alt="" />
      <div class="info-wrapper" v-if="userInfo">
        <p class="username">{{ userInfo?.user.username }}</p>
        <p class="user-id">ID {{ userInfo?.user.id }}</p>
      </div>
    </div>
    <div class="game-tabs">
      <div
        :class="[
          'game-item',
          activeChannelTab === channel.channelId ? 'active' : null,
        ]"
        v-for="channel in channelList"
        :key="channel.channelId"
        @click="handleClickChannel(channel.channelId)"
      >
        <img :src="channel.icon" alt="" />
        <span class="game-name">
          {{ channel.channelName }}
        </span>
      </div>
    </div>
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
            swipeable
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
                <li
                  class="user-item"
                  v-for="user in levelItem.details"
                  :key="user.userId"
                >
                  <img
                    class="avatar"
                    :src="user.user.avatar || UserAvatar"
                    alt=""
                  />
                  <div class="user-info-card">
                    <p class="name">{{ user.userId }}</p>
                    <p class="id">ID:{{ user.userId }}</p>

                    <div class="assets-row">
                      <span class="assets-label">{{
                        t('inviteAdmin.WeeklyContribution')
                      }}</span>
                      <img :src="GemImg" alt="" />
                      <span class="assets-num">{{ user.totalAmount }}</span>
                    </div>
                    <p class="time">
                      {{ formatTimestamp(user.invitationTime) }}
                      {{ t('inviteAdmin.Joined') }}
                    </p>
                  </div>
                  <div class="total-info">
                    <div class="assets-info">
                      <img :src="GemImg" alt="" />
                      <span class="assets-total-num">{{
                        user.weekAmount
                      }}</span>
                    </div>
                    <span class="info-text">{{
                      t('inviteAdmin.TotalContribution')
                    }}</span>
                  </div>
                </li>
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
import AvatarImg from './images/avatar.png'
import GemImg from './images/img_assets.png'
import UserAvatar from './images/user_avatar.png'
import { formatTimestamp } from '@/utils/utils'
import {
  getUserInfo,
  type UserInfo,
  getChannelList,
  type Channel,
  getRewardDetail,
  type RewardDetail,
} from '@/services/bindingInviter'
import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore()
import { useI18n } from 'vue-i18n'
import nativeEvent from '@/utils/nativeEvent'

const { t } = useI18n()

const activeChannelTab = ref(0)
const activeAsstesTab = ref(0)
const activeInviteTab = ref(0)

const userInfo = ref<UserInfo>()
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
      details: rewardDetail.value?.oneLevels,
    })
  }
  if (rewardDetail.value?.twoLevels) {
    tabs.push({
      id: 2,
      name: t('inviteAdmin.Indirect'),
      num: rewardDetail.value?.twoLevels.length,
      details: rewardDetail.value?.twoLevels,
    })
  }
  if (rewardDetail.value?.otherLevels) {
    tabs.push({
      id: 3,
      name: t('inviteAdmin.More'),
      num: 0,
      details: rewardDetail.value?.otherLevels,
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

  // channelList.value = [
  //   {
  //     channelId: 1,
  //     channelCode: 'CH001',
  //     channelName: '官方渠道',
  //     icon: 'https://cybercharge-admin.s3.ap-southeast-1.amazonaws.com/distribution/20250403-162653.png',
  //   },
  //   {
  //     channelId: 2,
  //     channelCode: 'CH002',
  //     channelName: 'TG渠道',
  //     icon: 'https://cybercharge-admin.s3.ap-southeast-1.amazonaws.com/distribution/20250403-162725.png',
  //   },
  // ]
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
  .user-info {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 12px 14px 24px;
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .info-wrapper {
      margin-left: 12px;
      .username {
        color: #fff;
        font-size: 16px;
        font-weight: 700;
      }
      .user-id {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
  .game-tabs {
    min-height: 56px;
    flex-shrink: 0;
    display: flex;
    gap: 12px;
    flex-wrap: nowrap;
    overflow: auto;
    padding: 0 14px 20px;
    .game-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 16px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.15);
      &::before {
        position: absolute;
        content: '';
        width: 0px;
        height: 0px;
        border-width: 8px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
        left: 50%;
        transform: translateX(-50%);
        bottom: -15px;
        display: none;
      }
      img {
        width: 24px;
        height: 24px;
      }
      .game-name {
        font-size: 15px;
        color: #fff;
        font-weight: 500;
        white-space: nowrap;
      }
      &.active {
        background: #fff;
        &::before {
          display: block;
        }
        .game-name {
          color: #000;
        }
      }
    }
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
        /* margin-left: 8px; */
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
        padding-top: 38.84%; /* 设置卡片的高度，比例是16:9，56.25% = 9/16 */
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
          z-index: -1; /* 确保背景图在内容下面 */
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
          z-index: -2; /* 确保背景图在内容下面 */
        }
        .content {
          position: absolute;
          top: 50%; /* 内容垂直居中 */
          left: 50%; /* 内容水平居中 */
          transform: translate(-50%, -50%); /* 精确地将内容居中 */
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
          /* padding-bottom: 0 !important; */
        }
        .users-list {
          display: flex;
          flex-direction: column;
          .user-item {
            position: relative;
            padding: 24px 0 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: flex-start;
            &::after {
              position: absolute;
              bottom: 0;
              right: -20px;
              content: '';
              height: 1px;
              width: 100%;
              background: #f2f2f2;
            }
            .avatar {
              height: 38px;
              width: 38px;
              border-radius: 50%;
              margin-right: 8px;
            }
            .user-info-card {
              flex: 1;
              .name {
                font-size: 15px;
                font-weight: 700;
              }
              .id {
                margin-top: 4px;

                color: #737373;
                font-weight: 400;
              }
              .assets-row {
                margin-top: 8px;

                display: flex;
                align-items: center;
                .assets-label {
                  font-size: 12px;
                  font-weight: 400;
                  color: #737373;
                }
                img {
                  margin: 0 2px 0 4px;
                  height: 14px;
                  width: 14px;
                }
                .assets-num {
                  font-size: 14px;
                  font-weight: 700;
                  color: #333;
                }
              }
              .time {
                margin-top: 16px;
                color: #999;
                font-size: 12px;
              }
            }
            .total-info {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 4px;
              .assets-info {
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 4px;
                img {
                  width: 16px;
                  height: 16px;
                }
                .assets-total-num {
                  font-size: 16px;
                  font-weight: 700;
                  color: #000;
                }
              }
              .info-text {
                font-size: 12px;
                font-weight: 400;
                color: #737373;
              }
            }
            &:nth-of-type(1) {
              padding-top: 6px !important;
            }
          }
          .bottom-line {
            width: 100%;
            padding: 24px 0 18px;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: #999;
          }
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
