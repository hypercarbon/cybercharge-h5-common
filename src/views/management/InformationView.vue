<template>
  <div class="information-view">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="t('teamInfoPage.Teaminformation')"
      @click-left="onBack"
    />

    <div class="information-view__content">
      <div class="information-view__btn-groups">
        <van-button
          v-if="userInfoStore.agentInfo?.is_agent_admin"
          size="small"
          :color="
            activeAgentKey === AgentRole.TOP
              ? btnBackgroundActiveColor
              : btnBackgroundDefaultColor
          "
          class="information-view__btn btn-top"
          @click="handleClickBtn(AgentRole.TOP)"
          >{{ t('teamInfoPage.Topagent') }}({{ topCount }})</van-button
        >
        <van-button
          v-if="
            userInfoStore?.agentInfo?.is_agent_admin ||
            userInfoStore?.agentUser?.level <= AgentRole.TOP
          "
          size="small"
          :color="
            activeAgentKey === AgentRole.LEVEL1
              ? btnBackgroundActiveColor
              : btnBackgroundDefaultColor
          "
          class="information-view__btn btn-level btn-level-active"
          @click="handleClickBtn(AgentRole.LEVEL1)"
          >{{ t('teamInfoPage.Level1agent') }}({{ level1Count }})</van-button
        >
        <van-button
          v-if="
            userInfoStore?.agentInfo?.is_agent_admin ||
            userInfoStore?.agentUser?.level <= AgentRole.LEVEL1
          "
          size="small"
          :color="
            activeAgentKey === AgentRole.LEVEL2
              ? btnBackgroundActiveColor
              : btnBackgroundDefaultColor
          "
          class="information-view__btn btn-level"
          @click="handleClickBtn(AgentRole.LEVEL2)"
          >{{ t('teamInfoPage.Level2agent') }}({{ level2Count }})</van-button
        >
      </div>
      <div class="information-view__top-tool">
        <span class="information-view__top-tool-title"
          >{{
            activeAgentKey === AgentRole.TOP
              ? t('teamInfoPage.topAgentOrders')
              : activeAgentKey === AgentRole.LEVEL1
                ? t('teamInfoPage.Level1agentorders')
                : t('teamInfoPage.Level2agentorders')
          }}
        </span>
        <div class="information-view__top-tool-btns">
          <!-- <div class="information-view__top-tool-export">
            <IconExcel />
            <span class="information-view__top-tool-export-text">XLS</span>
          </div> -->
          <!-- <div class="information-view__top-tool-export">
            <IconSearch />
            <span class="information-view__top-tool-export-text">Search</span>
          </div> -->
        </div>
      </div>
      <div class="information-view__date-bar" @click="show = true">
        <span class="information-view__date-bar-title">{{
          t('orderPage.Date')
        }}</span>
        <span class="information-view__date-bar-date">
          {{ currentDate.join('/') }} - {{ endDate.join('/') }}
        </span>
        <van-icon
          class="information-view__date-bar-icon"
          color="#969799"
          name="arrow"
        />
      </div>
      <div class="information-view__data-info">
        <div class="information-view__data-info-item">
          <p class="information-view__data-info-item-num">
            {{ orderData.quantity ?? 0 }}
          </p>
          <p class="information-view__data-info-item-label">
            {{ t('orderPage.Orderquantity') }}
          </p>
        </div>
        <div class="information-view__data-info-item">
          <p class="information-view__data-info-item-num">
            {{ orderData.amount ?? 0 }}
          </p>
          <p class="information-view__data-info-item-label">
            {{ t('orderPage.Orderamount') }}
          </p>
        </div>
      </div>
      <div class="information-view__user-info-container">
        <InfoCard
          v-for="user in users"
          :key="user.user_id"
          :name="user.real_name"
          :id="user.user_id.toString()"
          avatar-url=""
        >
          <template #info>
            <InfoLabel :label="`${t('teamInfoPage.realName')}: `">
              <template #value>
                {{ user.real_name }}
              </template>
            </InfoLabel>
            <InfoLabel :label="`${t('teamInfoPage.quantity')}: `">
              <template #value>
                {{ user.quantity }}
              </template>
            </InfoLabel>
            <InfoLabel :label="`${t('teamInfoPage.amount')}: `">
              <template #value> {{ user.total }} </template>
            </InfoLabel>
            <InfoLabel :label="`${t('teamInfoPage.commission')}: `">
              <template #value>
                {{ user.commission }}
              </template>
            </InfoLabel>
          </template>
        </InfoCard>
      </div>
    </div>
    <van-action-sheet v-model:show="show">
      <van-picker-group
        :title="t('orderPage.Date')"
        :tabs="[t('orderPage.Starttime'), t('orderPage.Endtime')]"
        :next-step-text="t('common.next')"
        :cancel-button-text="t('orderPage.Cancel')"
        :confirm-button-text="t('orderPage.Done')"
        @confirm="onConfirm"
        @cancel="onCancel"
      >
        <van-date-picker v-model="currentDate" />
        <van-date-picker v-model="endDate" />
      </van-picker-group>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import IconExcel from '@/components/icons/IconExcel.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import InfoCard from '@/components/InfoCard.vue'
import InfoLabel from '@/components/InfoLabel.vue'
import { AgentRole, getMetrics, type MetricsUser } from '@/services/agent'
import { useUserInfoStore } from '@/stores/userInfo'

import { showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userInfoStore = useUserInfoStore()

const show = ref(false)

const activeAgentKey = ref<AgentRole>(
  userInfoStore.agentUser?.level || AgentRole.TOP,
)

console.log(userInfoStore.agentUser?.level)

const topCount = ref<number>(0)
const level1Count = ref<number>(0)
const level2Count = ref<number>(0)

const orderData = ref<{ quantity: number; amount: string }>({
  quantity: 0,
  amount: '0',
})

// 计算当前日期和一个月前的日期
const getFormattedDate = (date: Date): string[] => {
  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return [year, month, day]
}

const currentDate = ref(getFormattedDate(new Date())) // 当前日期
const endDate = ref(getFormattedDate(new Date())) // 默认也是当前日期

const users = ref<MetricsUser[]>()

const btnBackgroundDefaultColor = '#999'

onMounted(() => {
  const now = new Date()
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1))
  currentDate.value = getFormattedDate(oneMonthAgo) // 设置为一个月前
  initAgentLevel()
})

const initAgentLevel = () => {
  if (userInfoStore.agentInfo?.is_agent_admin) {
    activeAgentKey.value = AgentRole.TOP
  } else {
    activeAgentKey.value = userInfoStore.agentUser?.level + 1
  }
  _getMetrics()
}

const btnBackgroundActiveColor = computed(() =>
  activeAgentKey.value === AgentRole.TOP
    ? 'linear-gradient(0deg, #96f 0%, #50f 100%)'
    : 'linear-gradient(0deg, #737373 0%, #000 100%)',
)

const _getMetrics = async () => {
  const res = await getMetrics(
    activeAgentKey.value,
    currentDate.value.join('/'),
    endDate.value.join('/'),
  )

  if (res.code !== 0) return
  res.data.levels.forEach(item => {
    if (item.level === AgentRole.TOP) topCount.value = item.count
    if (item.level === AgentRole.LEVEL1) level1Count.value = item.count
    if (item.level === AgentRole.LEVEL2) level2Count.value = item.count
  })
  users.value = res.data.list
  orderData.value.amount = res.data.statistics.total
  orderData.value.quantity = res.data.statistics.quantity
}

const handleClickBtn = (role: AgentRole) => {
  activeAgentKey.value = role
  _getMetrics()
}
const onConfirm = () => {
  if (compareDates(currentDate.value, endDate.value)) {
    showToast('Start time cannot be later than end time.')
    return
  }
  show.value = false
  _getMetrics()
  // showToast(`${currentDate.value.join('/')} ${endDate.value.join('/')}`)
}

// 比较两个日期的函数，确保 currentDate 不大于 endDate
const compareDates = (start: string[], end: string[]) => {
  const startDate = new Date(start.join('/'))
  const endDate = new Date(end.join('/'))
  return startDate > endDate
}

const onCancel = () => {
  show.value = false
}
const onBack = () => history.back()
</script>

<style scoped>
.information-view {
  .information-view__content {
    height: calc(100vh - 46px);
    padding: 12px 16px;
    overflow: auto;
    .information-view__btn-groups {
      padding-bottom: 14px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px 12px;
      .information-view__btn {
        color: #fff;
        height: 35px;
        padding-left: 16px;
        padding-right: 16px;
        border: none;
        &.btn-top {
        }
        &.btn-level {
        }
      }
    }
    .information-view__top-tool {
      padding: 16px 0;
      display: flex;
      justify-content: space-between;

      .information-view__top-tool-title {
        font-weight: 700;
        font-size: 16px;
      }
      .information-view__top-tool-btns {
        display: flex;
        align-items: center;
        gap: 16px;
        .information-view__top-tool-export {
          display: flex;
          align-items: center;
          gap: 2px;
          .information-view__top-tool-export-text {
            font-size: 12px;
          }
        }
      }
    }
    .information-view__date-bar {
      padding: 10px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ebedf0;
      .information-view__date-bar-title {
        color: #000;
        font-size: 14px;
        font-weight: 500;
      }
      .information-view__date-bar-date {
        color: #333;
        font-size: 14px;
      }
    }
    .information-view__data-info {
      padding: 32px 0px;
      display: flex;
      justify-content: center;
      gap: 74px;
      .information-view__data-info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .information-view__data-info-item-num {
          font-size: 24px;
          font-weight: 700;
        }
        .information-view__data-info-item-label {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
    .information-view__user-info-container {
      padding: 12px 0;
    }
  }
}
</style>
