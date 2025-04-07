import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  ACTIVE_INFO,
  APP_LANGUAGE,
  SAFE_TOP,
  USER_TOKEN,
} from '@/config/constants'
import type { AgentInfo, AgentUserInfo } from '@/services/agent'

export interface RouterQuery {
  language: string
  token: string
  activeInfo: string
  safeTop: string
}

export const useUserInfoStore = defineStore('userInfo', () => {
  const routerQuery = ref<RouterQuery | null>(null)
  const agentUser = ref<AgentUserInfo | null>(null)
  const agentInfo = ref<AgentInfo | null>(null)
  const safeTop = ref(0)

  onMounted(() => {
    if (
      localStorage.getItem(USER_TOKEN) &&
      localStorage.getItem(APP_LANGUAGE) &&
      sessionStorage.getItem(ACTIVE_INFO) &&
      sessionStorage.getItem(SAFE_TOP)
    ) {
      routerQuery.value = {
        language: localStorage.getItem(APP_LANGUAGE) || 'en',
        token: localStorage.getItem(USER_TOKEN) || '',
        activeInfo: localStorage.getItem(ACTIVE_INFO) || '',
        safeTop: sessionStorage.getItem(SAFE_TOP) || '',
      }
    }
  })

  function setRouterQuery(routerQueryVal: RouterQuery) {
    const { language, token, activeInfo, safeTop } = routerQueryVal
    routerQuery.value = routerQueryVal
    localStorage.setItem(USER_TOKEN, token)
    localStorage.setItem(APP_LANGUAGE, language)
    localStorage.setItem(ACTIVE_INFO, decodeURI(activeInfo))
    sessionStorage.setItem(SAFE_TOP, safeTop)
    setSafeTop(Number(safeTop))
    // console.log('--------- activeInfo ---------')
    // console.log(activeInfo)
    // console.log('---------decode activeInfo ---------')
    // console.log(decodeURI(activeInfo))
  }

  function setAgentUser(agentUserVal: AgentUserInfo) {
    agentUser.value = agentUserVal
  }

  function setAgentInfo(agentInfoVal: AgentInfo) {
    agentInfo.value = agentInfoVal
  }

  function setSafeTop(safeTopVal: number) {
    safeTop.value = safeTopVal
  }

  return {
    routerQuery,
    setRouterQuery,
    agentUser,
    setAgentUser,
    agentInfo,
    setAgentInfo,
    safeTop,
    setSafeTop,
  }
})
