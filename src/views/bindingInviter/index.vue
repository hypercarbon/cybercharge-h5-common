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
      <div class="info-content">
        <img src="./images/default-avatar.png" alt="avatar" />
        <div class="user-name">{{ userName }}</div>
        <div class="desc">{{ desc }}</div>
      </div>
      <CustomInput
        v-model="inputCode"
        placeholder="Enter invite code"
        :is-bind="isBind"
        :type="channel"
        :show-clear-button="true"
        background-color="rgba(0, 0, 0, 0.25)"
        @keyup.enter="handleBindInviter"
      />

      <button
        class="bind-button"
        :style="{ backgroundImage: `url(${bindButtonImage})` }"
      >
        Bind Now
      </button>
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
const route = useRoute()
const userInfoStore = useUserInfoStore()
const userName = ref('Taylor')
const desc = ref(
  'I am delighted to have you join my charging team. If you encounter any difficulties during the charging process, please feel free to contact me. I may be able to help find a solution or offer some advice.',
)

// 是否绑定
const isBind = ref(true)
// 渠道相关
const channel = ref('')

// 获取渠道参数
const getChannelFromUrl = () => {
  // 优先从路由参数获取
  const routeChannel = route.query.channel as string
  if (routeChannel) {
    channel.value = routeChannel
    return
  }

  // 从URL参数获取
  const urlParams = new URLSearchParams(window.location.search)
  const urlChannel = urlParams.get('channel')
  if (urlChannel) {
    channel.value = urlChannel
  } else {
    channel.value = '2'
  }
}

const handleBack = () => {
  nativeEvent.close()
}

// 邀请码相关
const inputCode = ref('123123')

const handleBindInviter = async () => {
  if (!inputCode.value) {
    showToast('请输入邀请码')
    return
  }
}

// 背景图片计算属性
const backgroundImage = computed(() => {
  let bgImage = ''
  if (channel.value) {
    bgImage = `src/views/bindingInviter/images/${channel.value}/bg.png`
  } else {
    bgImage = 'src/views/bindingInviter/images/1/bg.png'
  }
  return bgImage
})

const bindButtonImage = computed(() => {
  if (channel.value) {
    return `src/views/bindingInviter/images/${channel.value}/btn_large.png`
  } else {
    return 'src/views/bindingInviter/images/1/btn_large.png'
  }
})

onMounted(() => {
  getChannelFromUrl()
  console.log('当前渠道：', channel.value)
})
</script>

<style scoped>
.binding-inviter-page {
  height: 100vh;
  background-size: 100% 100%;
  background-repeat: no-repeat;
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

.user-name {
  margin-top: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.desc {
  margin-top: 12px;
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
</style>
