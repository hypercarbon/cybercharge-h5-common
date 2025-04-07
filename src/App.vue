<script setup lang="ts">
import { computed, onBeforeMount, onMounted, reactive, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useUserInfoStore, type RouterQuery } from './stores/userInfo'

const router = useRoute()
const userInfoStore = useUserInfoStore()

import Start from './views/StartView/index.vue'

// 获取路由中的标题
const title = computed(() => router.meta.title || '')

onBeforeMount(() => {
  const queryParams = reactive(getQueryParams())

  watch(
    () => queryParams,
    routerQueryVal => {
      console.log('app.vue watch')
      console.log('routerQueryVal = ', routerQueryVal)
      if (routerQueryVal) {
        userInfoStore.setRouterQuery(routerQueryVal)
      }
    },
    { deep: true, immediate: true },
  )
})

onMounted(() => {
  // const queryParams = reactive(getQueryParams())
  // watch(
  //   () => queryParams,
  //   routerQueryVal => {
  //     console.log('app.vue watch')
  //     console.log('routerQueryVal = ', routerQueryVal)
  //     if (routerQueryVal && routerQueryVal.token) {
  //       userInfoStore.setRouterQuery(routerQueryVal)
  //     }
  //   },
  //   { deep: true, immediate: true },
  // )
})

// watch(
//   () => router.query as unknown as RouterQuery,
//   (routerQueryVal: RouterQuery) => {
//     if (routerQueryVal && routerQueryVal.token) {
//       userInfoStore.setRouterQuery(routerQueryVal)
//     }
//   },
//   { deep: true },
// )

function getQueryParams() {
  const searchParams = new URLSearchParams(window.location.search)
  const query = {}
  for (const [key, value] of searchParams.entries()) {
    query[key] = value
  }
  return query
}
console.log('app.vue')
// const queryParams = location.search
// window.location.replace(`${location.pathname}/#/start${queryParams}`)
</script>

<template>
  <!-- <div v-if="!userInfoStore.routerQuery" class="login-page">
    <van-loading type="spinner" />
  </div>

  <template v-else>
    <RouterView />
  </template> -->

  <RouterView />
  <!-- <Start /> -->
</template>

<style scoped>
.login-page {
  height: 100vh;
  width: 100%;
  padding-top: 240px;
  text-align: center;
  font-size: 24px;
}
</style>
