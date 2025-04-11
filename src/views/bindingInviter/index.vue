<template>
  <div
    class="binding-inviter-page"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      paddingTop: userInfoStore.safeTop + 'px',
    }"
  >
    <CustomNavBar @back="handleBack" />
    <div class="binding-inviter-content">
      <!-- 骨架屏 -->
      <div v-if="loading" class="skeleton-container">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-desc"></div>
        <div class="skeleton-input"></div>
        <div class="skeleton-button"></div>
      </div>

      <!-- 实际内容 -->
      <template v-else>
        <div class="info-content" v-if="inviterInfo">
          <img src="./images/default-avatar.png" alt="avatar" />
          <div class="desc">{{ desc }}</div>
        </div>
        <CustomInput
          v-model="inputCode"
          :placeholder="t('bindingInviter.Placeholder')"
          :disabled="inviterInfo !== null || !userInfo"
          :channel="channel"
          :show-clear-button="true"
          :show-copy-button="inviterInfo !== null"
          background-color="rgba(0, 0, 0, 0.25)"
          @keyup.enter="handleBindInviter"
        />

        <button
          v-if="!inviterInfo"
          class="bind-button"
          :style="{
            backgroundImage: `url(${bindButtonImage})`,
            color: channel === '1' ? '#000' : '#fff',
          }"
          @click="handleBindInviter"
        >
          {{ t('bindingInviter.BindNow') }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomNavBar from './components/CustomNavBar.vue'
import CustomInput from './components/CustomInput.vue'
import { showToast } from 'vant'
import nativeEvent from '@/utils/nativeEvent'
import { useUserInfoStore } from '@/stores/userInfo'
import {
  bindChannelInviter,
  getInviterInfo,
  getUserInfo,
  type UserInfo,
  type InviterInfo,
} from '@/services/bindingInviter'
import bg1 from './images/1/bg.png'
import bg2 from './images/2/bg.png'
import btn1 from './images/1/btn_large.png'
import btn2 from './images/2/btn_large.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const userInfoStore = useUserInfoStore()
const desc = ref(t('bindingInviter.Welcome'))

const backgroundImageMap: Record<string, string> = {
  '1': bg1,
  '2': bg2,
}

const btnImageMap: Record<string, string> = {
  '1': btn1,
  '2': btn2,
}

// 渠道相关
const channel = ref('')
const userInfo = ref<UserInfo>()
const inviterInfo = ref<InviterInfo>(null)
// 邀请码相关
const inputCode = ref('')
// 添加加载状态
const loading = ref(true)

// 获取渠道参数
const getChannelFromUrl = () => {
  // 优先从路由参数获取
  const routeChannel = route.query.channelId as string
  // console.log('routeChannel', routeChannel)
  if (routeChannel) {
    // 如果channelId是数组，取第一个值
    channel.value = Array.isArray(routeChannel) ? routeChannel[0] : routeChannel
    return
  }

  // 从URL参数获取
  const urlParams = new URLSearchParams(window.location.search)
  const urlChannel = urlParams.get('channelId')
  if (urlChannel) {
    channel.value = urlChannel
  } else {
    channel.value = '1'
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

  await _bindChannelInviter()
}

// 背景图片计算属性
const backgroundImage = computed(() => {
  let bgImage = ''
  if (channel.value) {
    bgImage = backgroundImageMap[channel.value]
  } else {
    bgImage = backgroundImageMap['1']
  }
  return bgImage
})

const bindButtonImage = computed(() => {
  if (channel.value) {
    return btnImageMap[channel.value]
  } else {
    return btnImageMap['1']
  }
})

onMounted(async () => {
  try {
    getChannelFromUrl()
    console.log('当前渠道：', channel.value)

    // 先获取用户信息
    await _getUserInfo()
    // 再获取邀请人信息
    if (userInfo.value) {
      await _getInviterInfo()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    showToast(t('common.LoadFailed'))
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
  const res = await getInviterInfo({
    channelId: channel.value,
    userId: userInfo.value?.user.id,
  })
  if (res.code === 0) {
    inviterInfo.value = res.data
    if (res.data) {
      inputCode.value = res.data
    }
    console.log('inviterInfo', inviterInfo.value)
  }
}

const _bindChannelInviter = async () => {
  try {
    const res = await bindChannelInviter({
      channel_id: channel.value,
      inviter_id: inputCode.value,
    })
    if (res.code === 0) {
      showToast('绑定成功')
      _getInviterInfo()
    }
  } catch (error) {
    const errData = error.response.data
    showToast(errData.msg)
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
}

.info-content img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.desc {
  margin-top: 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 18px;
  text-align: center;
}

.bind-button {
  width: 100%;
  height: 48px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: none;
  margin-top: 24px;
  background-color: transparent;
  color: #000;
  font-size: 16px;
  font-weight: 600;
}

/* 骨架屏样式 */
.skeleton-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-desc {
  width: 200px;
  height: 18px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-input {
  width: 100%;
  height: 48px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
