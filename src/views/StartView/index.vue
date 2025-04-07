<template>
  <div class="start-view">
    <van-dialog
      class="init-dialog"
      :showConfirmButton="false"
      v-model:show="initModalShow"
    >
      <div class="start-modal">
        <img class="img-header" :src="HeaderImg" alt="" />
        <p class="title main-title">{{ activity?.sign_activity_title }}</p>
        <p class="title sub-title">
          {{ activity?.sign_activity_description }}
        </p>
        <div class="card-list">
          <div
            :class="{
              'card-item': true,
              signed: item.sign_reward_is_signed,
              active: activeId === item.sign_reward_id,
            }"
            v-for="(item, index) in list"
          >
            <div class="card-content">
              <p class="card-text-day">Day {{ item.sign_reward_day }}</p>
              <p class="card-text-benifit">
                {{
                  item.sign_reward_type === SignRewardType.ASSET
                    ? `${item.sign_reward_asset.amount} ${item.sign_reward_asset.symbol}`
                    : item.sign_reward_right.title
                }}
              </p>
            </div>
            <img
              class="card-img"
              :src="
                item.sign_reward_type === SignRewardType.ASSET
                  ? item.sign_reward_asset.icon
                  : item.sign_reward_right.image_url
              "
              alt=""
            />
            <img class="icon-check" :src="IconCheck" alt="" />
            <div class="signed-mask"></div>
          </div>
        </div>
        <button
          class="main-btn"
          :disabled="!isTodyCanSign || isFinishSign"
          @click="handleCheckIn"
        >
          <span v-if="isFinishSign">
            {{ t('checkIn.rewardsClaimed') }}
          </span>
          <template v-else>
            <span v-if="isTodyCanSign">{{ t('checkIn.checkInNow') }}</span>
            <span v-else> {{ t('checkIn.comeBack') }}</span>
          </template>
        </button>
        <img class="btn-close" @click="handleClose" :src="IconClose" alt="" />
      </div>
    </van-dialog>
    <van-dialog
      class="succ-dialog"
      :showConfirmButton="false"
      v-model:show="succModalShow"
    >
      <span class="title">{{ t('checkIn.checkInSucc') }}</span>
      <div class="assets-content">
        <img
          :src="
            signSuccReward?.sign_reward_type === SignRewardType.ASSET
              ? signSuccReward?.sign_reward_asset.icon
              : signSuccReward?.sign_reward_right.image_url
          "
          alt=""
        />
      </div>
      <span class="asset-num">{{
        signSuccReward?.sign_reward_type === SignRewardType.ASSET
          ? `${signSuccReward.sign_reward_asset.amount} ${signSuccReward.sign_reward_asset.symbol}`
          : signSuccReward?.sign_reward_right.title
      }}</span>
      <button class="main-btn" @click="handleGoToUse">
        {{ t('checkIn.goToUse') }}
      </button>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import HeaderImg from '@/assets/start/img_header.png'
import IconClose from '@/assets/start/icon_close.png'
import IconCheck from '@/assets/start/icon_check.png'
import {
  getActiveInfo,
  SignTag,
  type SignActivityReward,
  SignRewardType,
  sign,
  type SignActiveInfo,
} from '@/services/signApi'
import nativeEvent, { ToastType } from '@/utils/nativeEvent'
import { ACTIVE_INFO } from '@/config/constants'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const activeId = ref(-1)

const initModalShow = ref(false)
const succModalShow = ref(false)

const activity = ref<SignActiveInfo | null>(null)
const list = ref<SignActivityReward[]>([])

const signSuccReward = ref<SignActivityReward | null>(null)

onMounted(() => {
  _getActiveInfoFromUrl()
})

const isTodyCanSign = computed(() => {
  return activity.value?.sign_activity_today_can_sign
})

const isFinishSign = computed(() => {
  return list.value.every(item => item.sign_reward_is_signed)
})

const handleClose = () => {
  console.log('close')
  nativeEvent.close()
}

const handleCheckIn = () => {
  if (activeId.value === -1) return
  const item = list.value.find(item => item.sign_reward_id === activeId.value)
  if (item) {
    _sign(item)
  }

  let mockSign =
    list.value.find(item => item.sign_reward_id === activeId.value) || null
  signSuccReward.value = mockSign
}

const handleGoToUse = () => {
  succModalShow.value = false
  let isFirst =
    list.value.findIndex(
      (item, index) =>
        signSuccReward.value?.sign_reward_id === item.sign_reward_id,
    ) === 0
  if (isFirst) {
    showGameGuide()
    handleClose()
    return
  } else {
    if (signSuccReward.value?.sign_reward_route_path) {
      nativeEvent.openUrl({
        url: signSuccReward.value?.sign_reward_route_path,
      })
    }
    handleClose()
  }
}

const _getActiveInfoFromUrl = () => {
  const activeInfoJson = localStorage.getItem(ACTIVE_INFO)
  if (
    activeInfoJson &&
    activeInfoJson !== 'undefined' &&
    activeInfoJson !== 'null'
  ) {
    const activeInfo = JSON.parse(activeInfoJson)
    console.log(activeInfo)
    list.value = activeInfo.sign_activity_rewards
    activity.value = activeInfo
    initModalShow.value = true
    if (activity.value?.sign_activity_today_can_sign) {
      for (let i = 0; i < list.value.length; i++) {
        if (
          !list.value[i].sign_reward_is_signed &&
          list.value[i].sign_reward_can_sign
        ) {
          activeId.value = list.value[i].sign_reward_id
          console.log(activeId.value)
          break
        }
      }
    }
  }
}

const _getActiveInfo = async () => {
  const res = await getActiveInfo(SignTag.NEWBIE)
  if (res.code === 0) {
    list.value = res.data.sign_activity_rewards
    activity.value = res.data
    initModalShow.value = true
  }
}

const _sign = async (item: SignActivityReward) => {
  if (!activity.value) return
  const res = await sign({
    sign_activity_id: activity.value?.sign_activity_id,
    sign_reward_id: item.sign_reward_id,
  })
  if (res.code === 0) {
    _getActiveInfo()
    signSuccReward.value = item
    succModalShow.value = true
  }
}

const showGameGuide = () => {
  // @ts-ignore
  if (typeof AndroidInterface !== 'undefined') {
    // Android 原生接口
    // @ts-ignore
    AndroidInterface['showGameGuide']()
  } else if (
    typeof (window as any).webkit !== 'undefined' &&
    (window as any).webkit.messageHandlers['showGameGuide']
  ) {
    // iOS 原生接口
    // @ts-ignore
    window.webkit.messageHandlers['showGameGuide'].postMessage({})
  } else {
    console.warn(`Native interface for ${showGameGuide} not available.`)
  }
}
</script>

<style>
.start-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: rgba(0, 0, 0, 0.6); */
  /* background: transparent; */
  .init-dialog {
    background-color: #eaf1fd;
    background-image: url('@/assets/start/bg_modal_header.png');
    background-size: contain;
    background-repeat: no-repeat;
    padding: 20px 24px 24px 24px;
    width: 311px;
    /* height: 406px; */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    overflow: visible !important;
    .van-dialog__content {
      .start-modal {
        .title {
          width: 180px;
        }
        .main-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .sub-title {
          font-size: 12px;
          font-weight: 400px;
          color: #333;
        }
        .img-header {
          position: absolute;
          right: 0px;
          top: -38px;
          width: 162px;
        }
        .btn-close {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -64px;
          width: 40px;
        }
        .card-list {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .card-item {
            position: relative;
            display: flex;
            width: 128px;
            height: 50px;
            margin-bottom: 6px;
            border-radius: 4px;
            background-color: #fff;
            border: 2px solid #fff;
            transition: 0.2s all;
            &.active {
              border: 2px solid #9059ff;
            }
            &.signed {
              .icon-check,
              .signed-mask {
                display: block;
              }
            }
            .card-content {
              padding: 8px 0 8px 10px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              overflow: hidden;
              .card-text-day {
                font-size: 10px;
                color: #999;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .card-text-benifit {
                font-size: 12px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .card-img {
              height: 100%;
              flex-shrink: 0; /* 防止缩小 */
            }
            .signed-mask {
              display: none;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(255, 255, 255, 0.539);
              border-radius: 4px;
            }
            .icon-check {
              display: none;
              position: absolute;
              right: -2px;
              bottom: -2px;
              width: 16px;
              z-index: 1;
            }
          }
        }
        .main-btn {
          margin-top: 24px;
          border: none;
          width: 263px;
          height: 44px;
          border-radius: 4px;
          background: #9059ff;
          box-shadow: 0px -3px 0px 0px rgba(0, 0, 0, 0.2) inset;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
          line-height: 44px;
          transition: 0.1s all;
          &:active {
            background: #563599;
          }
          &:disabled {
            background: #66666699;
          }
        }
      }
    }
  }
}
</style>

<style>
.succ-dialog {
  padding: 24px;
  border-radius: 8px;
  width: 311px;
  /* height: 313px; */
  background-color: #eaf1fd;
  background-image: url('@/assets/start/bg_modal_header_succ.png');
  background-size: contain;
  background-repeat: no-repeat;
  .van-dialog__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      color: #000;
      font-size: 20px;
      font-weight: 700;
    }
    .assets-content {
      width: 110px;
      height: 110px;
      background-image: url('@/assets/start/bg_succ_assets.png');
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 29px;
      img {
        width: 100%;
        /* height: 70px; */
      }
    }
    .asset-num {
      margin-top: 8px;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }
    .main-btn {
      margin-top: 33px;
      border: none;
      width: 263px;
      height: 44px;
      border-radius: 4px;
      background: #9059ff;
      box-shadow: 0px -3px 0px 0px rgba(0, 0, 0, 0.2) inset;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      line-height: 44px;
      transition: 0.1s all;
      &:active {
        background: #563599;
      }
      &:disabled {
        background: #66666699;
      }
    }
  }
}
</style>
