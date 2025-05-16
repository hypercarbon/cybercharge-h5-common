<template>
  <div class="binding-inviter-page" :style="backgroundStyle">
    <CustomNavBar
      :channel="channel"
      @back="handleBack"
      :title="t('bindingInviter.MyInviter')"
      :extra="t('bindingInviter.Details')"
      @extra-click="handleClickExtra"
    />
    <div class="binding-inviter-content">
      <!-- 骨架屏 -->
      <UnifiedSkeleton v-if="loading" :channel="channel" />

      <!-- 实际内容 -->
      <template v-else>
        <div class="info-content" v-if="inviterInfo">
          <img :src="userInfoById?.avatar || defaultAvatar" alt="avatar" />
          <p class="inviter-name">{{ userInfoById?.username }}</p>
          <!-- <div class="desc">{{ desc }}</div> -->
        </div>
        <UnifiedInput
          v-model="inputCode"
          :placeholder="t('bindingInviter.Placeholder')"
          :disabled="inviterInfo !== null || !userInfo"
          :channel="channel"
          :show-clear-button="true"
          :show-copy-button="inviterInfo !== null"
          @keyup.enter="handleBindInviter"
        />

        <UnifiedButton
          style="margin-top: 24px"
          v-if="!inviterInfo"
          :channel="channel"
          :loading="findUserLoading"
          @click="handleBindInviter"
        >
          {{ t('bindingInviter.BindNow') }}
        </UnifiedButton>
      </template>
    </div>

    <ConfirmDialog
      v-if="showConfirmDialog"
      @close="showConfirmDialog = false"
      @confirm="handleConfirm"
    >
      <div class="dialog-content">
        <img
          :src="userInfoById?.avatar || defaultAvatar"
          alt="avatar"
          class="dialog-avatar"
        />
        <div class="dialog-title">{{ userInfoById?.username }}</div>
        <div class="dialog-desc">ID: {{ userInfoById?.user_id }}</div>
      </div>
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomNavBar from './components/CustomNavBar.vue'
import UnifiedInput from './components/UnifiedInput.vue'
import UnifiedButton from './components/UnifiedButton.vue'
import UnifiedSkeleton from './components/UnifiedSkeleton.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { showToast } from 'vant'
import nativeEvent from '@/utils/nativeEvent'
import { useUserInfoStore } from '@/stores/userInfo'
import {
  bindChannelInviter,
  getInviterInfo,
  getUserInfo,
  type UserInfo,
  type InviterInfo,
  getDetailsUrl,
  getUserInfoById,
  type UserInfoById,
} from '@/services/bindingInviter'
import bg1 from './images/1/bg.png'
import bg2 from './images/2/bg.png'
import defaultAvatar from './images/default-avatar.png'
import { useI18n } from 'vue-i18n'
import type { ChannelType } from './type/channel'

type ApiError = {
  msg: string
}

const { t } = useI18n()

const route = useRoute()
const userInfoStore = useUserInfoStore()
// const desc = ref(t('bindingInviter.Welcome'))
const userInfoById = ref<UserInfoById>()
const findUserLoading = ref(false)

// 背景配置接口
interface BackgroundConfig {
  backgroundImage: string
  backgroundColor: string
}

// 背景配置映射
const backgroundConfigMap: Record<ChannelType, BackgroundConfig> = {
  '1': {
    backgroundImage: `url(${bg1})`,
    backgroundColor: 'transparent',
  },
  '2': {
    backgroundImage: `url(${bg2})`,
    backgroundColor: 'transparent',
  },
  '3': {
    backgroundImage: 'none',
    backgroundColor: '#fff',
  },
}

// 背景样式计算属性
const backgroundStyle = computed(() => {
  const config = backgroundConfigMap[channel.value]
  return {
    backgroundImage: config.backgroundImage,
    backgroundColor: config.backgroundColor,
    paddingTop: userInfoStore.safeTop + 'px',
  }
})

// 渠道相关
const channel = ref<ChannelType>('1')
const userInfo = ref<UserInfo>()
const inviterInfo = ref<InviterInfo>(null)
// 邀请码相关
const inputCode = ref('')
// 添加加载状态
const loading = ref(true)
// 详情页地址
const detailsUrl = ref('')
const showConfirmDialog = ref(false)

// 获取渠道参数
const getChannelFromUrl = () => {
  // 优先从路由参数获取
  const routeChannel = route.query.channelId as ChannelType
  // console.log('routeChannel', routeChannel)
  if (routeChannel) {
    // 如果channelId是数组，取第一个值
    channel.value = Array.isArray(routeChannel) ? routeChannel[0] : routeChannel
    return
  }

  // 从URL参数获取
  const urlParams = new URLSearchParams(window.location.search)
  const urlChannel = urlParams.get('channelId') as ChannelType
  if (urlChannel) {
    channel.value = urlChannel
  } else {
    channel.value = '1'
  }
}

const handleClickExtra = () => {
  if (detailsUrl.value) {
    nativeEvent.openUrl({
      url: detailsUrl.value,
      pageSetting: {
        isBarHide: true,
      },
    })
  }
}

const handleBack = () => {
  nativeEvent.close()
}

const handleBindInviter = async () => {
  if (!inputCode.value) {
    showToast(t('bindingInviter.PleaseEnterInviteCode'))
    return
  }

  // 验证是否为6位数字
  const reg = /^\d{6}$/
  if (!reg.test(inputCode.value)) {
    showToast(t('bindingInviter.PleaseEnterCorrectUserId'))
    return
  }
  await _getUserInfoById(true)
}

const handleConfirm = async () => {
  await _bindChannelInviter()
}

onMounted(async () => {
  try {
    getChannelFromUrl()
    console.log('当前渠道：', channel.value)
    _getDetailsUrl() // 获取详情页地址
    await _getUserInfo() // 用户信息
    await _getInviterInfo() // 邀请人信息
    if (inviterInfo.value) {
      await _getUserInfoById(false) // 获取详细邀请信息
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'msg' in error) {
      showToast((error as ApiError).msg)
    } else {
      console.error('未知错误:', error)
    }
  } finally {
    loading.value = false
  }
})

const _getUserInfo = async () => {
  const res = await getUserInfo()
  if (res.code === 0) {
    userInfo.value = res.data
  }
  console.log('res', res)
}

const _getInviterInfo = async () => {
  // 再获取邀请人信息
  if (userInfo.value && userInfo.value.user.id) {
    const res = await getInviterInfo({
      channelId: channel.value,
      userId: userInfo.value?.user.id,
    })
    if (res.code === 0) {
      inviterInfo.value = res.data
      if (res.data) {
        inputCode.value = String(res.data)
      }
      console.log('inviterInfo', inviterInfo.value)
    }
  }
}

// 根据用户ID获取用户信息
const _getUserInfoById = async (ifBinding = false) => {
  try {
    findUserLoading.value = true
    const res = await getUserInfoById(inputCode.value)

    userInfoById.value = res.data
    if (ifBinding) {
      showConfirmDialog.value = true
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'msg' in error) {
      showToast((error as ApiError).msg)
    } else {
      console.error('未知错误:', error)
    }
  } finally {
    findUserLoading.value = false
  }
}

const _bindChannelInviter = async () => {
  try {
    const res = await bindChannelInviter({
      channel_id: channel.value,
      inviter_id: inputCode.value,
    })
    if (res.code === 0) {
      _getInviterInfo()
      showToast(t('bindingInviter.ConfirmBindSuccess'))
      showConfirmDialog.value = false
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'msg' in error) {
      console.log('errData', error)
      showToast((error as ApiError).msg)
    } else {
      console.error('未知错误:', error)
    }
  }
}

const _getDetailsUrl = async () => {
  const res = await getDetailsUrl(channel.value)
  if (res.code === 0) {
    console.log('res', res)
    detailsUrl.value = res.data.detailUrl
  }
}
</script>

<style scoped>
.binding-inviter-page {
  height: 100vh;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.95);
}

.binding-inviter-content {
  margin-top: 45px;
  padding: 0 24px;
}

.info-content {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #e8e8e840;
  }

  .inviter-name {
    margin-top: 12px;
    font-size: 20px;
    color: #fff;
    text-align: center;
    font-weight: 700;
    max-width: 100%;
    word-break: break-all;
    white-space: normal;
    overflow-wrap: break-word;
  }
}

.desc {
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 18px;
  text-align: center;
  max-width: 100%;
  word-break: break-all;
  white-space: normal;
  overflow-wrap: break-word;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.dialog-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #666;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-desc {
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.5;
}
</style>
