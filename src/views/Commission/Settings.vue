<template>
  <main class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="t('commissionPage.Commissionsettings')"
      @click-left="onBack"
    />

    <!-- <van-field
      v-model="commissionConfigs[0].commission_rate"
      label-align="top"
      label="ountry agent order earnings ratio"
      type="number"
      @blur="handleBlur(0, commissionConfigs[0].commission_rate)"
    >
      <template #button>
        <span>%</span>
      </template>
    </van-field>

    <van-field
      v-model="commissionConfigs[1].commission_rate"
      label-align="top"
      label="Level 1 agent order earnings"
      type="number"
      @blur="handleBlur(1, commissionConfigs[1].commission_rate)"
    >
      <template #button>
        <span>%</span>
      </template>
    </van-field>

    <van-field
      v-model="commissionConfigs[2].commission_rate"
      label-align="top"
      label="Level 2 agent order earnings"
      type="number"
      @blur="handleBlur(2, commissionConfigs[2].commission_rate)"
    >
      <template #button>
        <span>%</span>
      </template>
    </van-field> -->

    <van-field
      v-for="(commissionConfig, index) in commissionConfigs"
      :key="index"
      v-model="commissionConfig.commission_rate"
      label-align="top"
      :label="labels[index]"
      type="number"
      @blur="handleBlur(index, commissionConfig.commission_rate)"
    >
      <template #button>
        <span>%</span>
      </template>
    </van-field>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import { onMounted, reactive, ref, watch, watchEffect } from 'vue'
import {
  getCommissionConfig,
  setCommissionConfig,
  type CommissionConfigBean,
} from '@/services/FeaturesApi'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const commissionConfigs = ref<CommissionConfigBean[]>()

const labels = ref<string[]>([
  t('commissionPage.ountryagentorderearningsratio'),
  t('commissionPage.Level1agentorderearnings'),
  t('commissionPage.Level2agentorderearnings'),
])

onMounted(() => {
  commissionConfigs.value = getDefaultCommissionConfigs()
  _getCommissionConfig()
})

const onBack = () => {
  router.go(-1)
}

const handleBlur = (level: number, commission_rate: number) => {
  console.log('param = ' + level + ' value = ' + commission_rate)
  _setCommissionConfig(commission_rate, level)
}

const _getCommissionConfig = async () => {
  const res = await getCommissionConfig()
  if (res.code === 0) {
    commissionConfigs.value =
      res.data.length > 0 ? res.data : getDefaultCommissionConfigs()
  }
  console.log(res)
}

const _setCommissionConfig = async (commission_rate: number, level: number) => {
  const res = await setCommissionConfig(commission_rate, level)
  if (res.code === 0) {
    console.log('success ...... ')
  }
  showToast(res.msg ?? 'set fail')
  console.log(res)
}

const getDefaultCommissionConfigs = (): CommissionConfigBean[] => {
  return [
    { id: 0, commission_rate: 0, level: 0, created_at: '', updated_at: '' },
    { id: 1, commission_rate: 0, level: 1, created_at: '', updated_at: '' },
    { id: 2, commission_rate: 0, level: 2, created_at: '', updated_at: '' },
  ]
}
</script>

<style lang="css" scoped>
.page {
  :global(.van-field__label) {
    font-weight: bold;
    font-size: 16px;
  }
  :global(.van-field__body) {
    height: 48px;
    padding: 0 12px;
    border-radius: 4px;
    background-color: #f5f5f5;
    font-family: D-DIN-PRO;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
