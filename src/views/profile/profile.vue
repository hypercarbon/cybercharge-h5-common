<template>
  <main class="page">
    <van-nav-bar
      safe-area-inset-top
      :title="t('profile.Profile')"
      left-arrow
      @click-left="onBack"
    />

    <div class="content">
      <div class="warning">
        <van-icon name="warning-o" size="0.875rem" />
        {{ t('profile.profileConfirmText') }}
      </div>
      <van-form>
        <section class="page__content">
          <p class="column-title">{{ t('profile.ContactInformation') }}</p>
        </section>
        <van-field
          class="field"
          v-model="mAgentUserBean.phone"
          required
          name="phone"
          :label="t('applyPage.Phone')"
          :placeholder="t('profile.Pleaseenter')"
          :rules="[
            {
              required: true,
              message: 'Please fill in your mobile phone number',
            },
          ]"
        >
          <template #input>
            <div class="area_code" @click="onAreaCodeShow">
              +{{ mAgentUserBean.phone_code }}
            </div>
            <van-field
              v-model="mAgentUserBean.phone"
              type="tel"
              placeholder="000000"
            />
          </template>
        </van-field>

        <van-field
          required
          class="field"
          v-model="mAgentUserBean.telegram"
          name="telegram"
          :label="t('applyPage.Telegram')"
          label-width="25vw"
          :placeholder="t('profile.Pleaseenter')"
          :rules="[
            {
              required: true,
              message: 'Please fill in your telegram',
            },
          ]"
        />

        <van-field
          required
          class="field"
          v-model="mAgentUserBean.agent_area"
          right-icon="arrow-down"
          :placeholder="t('common.selectTabText')"
          readonly
          name="agentArea"
          :label="t('applyPage.AgentArea')"
          label-width="25vw"
          @click="handleShowSelectAgentArea"
          :rules="[
            {
              required: true,
              message: 'Please fill in your agent area',
            },
          ]"
        />
        <van-field
          required
          class="field"
          v-model="mAgentUserBean.agent_city"
          name="city"
          :label="t('applyPage.agentCity')"
          label-width="25vw"
          :placeholder="t('profile.Pleaseenter')"
          :rules="[
            {
              required: true,
              message: 'Please fill in your agent city',
            },
          ]"
        />

        <AreaCode
          :show="areaCodeShow"
          :onClick="onAreaCodeSelect"
          :onClose="onAreaCodeClose"
        />

        <div class="action">
          <van-button type="primary" color="#9059FF" @click="saveAgentUser">
            {{ t('profile.Save') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </main>

  <van-popup v-model:show="agentAreaShow" round position="bottom">
    <van-cascader
      v-model="currentArea"
      active-color="#000"
      :placeholder="t('common.selectTabText')"
      :title="t('common.selectAreaTitle')"
      :field-names="fieldNames"
      :options="regionList"
      @close="agentAreaShow = false"
      @finish="onSelectAgentArea"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AreaCode from '@/components/AreaCode.vue'
import regionList from '@/assets/data_region.json'
import { getAgentUser, updateAgentUser } from '@/services/FeaturesApi'
import { showToast } from 'vant'
import { getCountryAndZone } from '@/utils/getCountryAndZoneName'
import { useI18n } from 'vue-i18n'
import { useUserInfoStore } from '@/stores/userInfo'
const { t } = useI18n()

const fieldNames = {
  text: 'name',
  value: 'id',
  children: 'zones',
}

const userInfoStore = useUserInfoStore()

const agentAreaShow = ref(false)

const mAgentUserBean = ref({
  phone_code: '',
  phone: '',
  telegram: '',
  agent_area: '',
  agent_city: '',
  country_id: 0,
  zone_id: 0,
})

const currentArea = ref(0)
const areaCodeShow = ref(false)

const onBack = () => {
  history.go(-1)
}

onMounted(() => {
  _getAgentUser()
})

const onAreaCodeSelect = (item: {
  name: string
  domain: string
  code: string
  x: string
  y: string
}) => {
  if (!mAgentUserBean?.value) return
  mAgentUserBean.value.phone_code = item.code
  areaCodeShow.value = false
}
const onAreaCodeShow = () => {
  areaCodeShow.value = true
}
const onAreaCodeClose = () => {
  areaCodeShow.value = false
}

const _getAgentUser = async () => {
  const apply = userInfoStore.agentUser

  if (apply) {
    const { phone_code, phone, telegram, country_id, zone_id, city } = apply
    mAgentUserBean.value.phone = phone || ''
    mAgentUserBean.value.telegram = telegram || ''
    mAgentUserBean.value.phone_code = phone_code || ''
    mAgentUserBean.value.agent_city = city || ''
    mAgentUserBean.value.country_id = country_id || 0
    mAgentUserBean.value.zone_id = zone_id || 0
    mAgentUserBean.value.agent_area =
      getCountryAndZone(country_id, zone_id) || ''
    currentArea.value = zone_id || 0
  }
}

const saveAgentUser = () => {
  if (!mAgentUserBean.value) return
  _updateAgentUser({
    phone: mAgentUserBean.value.phone,
    phone_code: mAgentUserBean.value.phone_code,
    telegram: mAgentUserBean.value.telegram,
    country_id: mAgentUserBean.value.country_id,
    zone_id: mAgentUserBean.value.zone_id,
    city: mAgentUserBean.value.agent_city,
  })
}

const _updateAgentUser = async (params: {
  phone: string
  phone_code: string
  telegram: string
  country_id: number
  zone_id: number
  city: string
}) => {
  const res = await updateAgentUser(params)
  if (res.code !== 0) return
  const userRes = await getAgentUser()
  userInfoStore.setAgentUser(userRes.data)

  _getAgentUser()

  showToast(res.msg ?? '')
}

const onSelectAgentArea = ({ value, selectedOptions }: any) => {
  currentArea.value = value
  agentAreaShow.value = false

  mAgentUserBean.value.country_id = selectedOptions?.[0].id
  mAgentUserBean.value.zone_id = selectedOptions?.[1].id
  mAgentUserBean.value.agent_area = selectedOptions
    .map((item: any) => item.name)
    .join(', ')
}

const handleShowSelectAgentArea = () => {
  agentAreaShow.value = true
}
</script>

<style lang="css" scoped>
.page {
  width: 100%;
  height: 100%;
}
.area_code {
  /* width: 50px; */
  height: 24px;
  padding: 0 16px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 46px);
  padding: 16px 16px;
}
.warning {
  display: flex;
  margin-bottom: 16px;
  padding: 8px 10px;
  background: rgba(244, 142, 47, 0.15);
  font-size: 14px;
  font-weight: 400;
  line-height: 16.8px;
  color: rgba(244, 142, 47, 1);
  gap: 4px;

  :global(.van-icon-warning-o) {
    line-height: 16.8px;
  }
}

.title {
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 16px;
}

.field {
  width: 100%;
  height: 60px;
  padding: 0 16px 0 0;
  padding-top: 16px;
  align-items: center;

  font-size: 14px;
  font-weight: 500;

  /* :global(.van-field__label--required) {
      white-space: nowrap;
    }
    :global(.van-field__label--required:before) {
      display: none;
      content: none;
    }

    :global(.van-field__label--required::after) {
      color: var(--van-field-required-mark-color);
      content: '*';
    } */
}

.action {
  margin-top: 100px;
  width: 100%;

  button {
    width: 100%;
  }
}

.page__content {
  padding: 0px;
}
.file__content {
  padding-top: 48px;
}

.column-title {
  font-weight: 700;
  font-size: 16px;
  color: #000000;
}
.column-subtitle {
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.8px;
  color: #b3b3b3;
}
.field {
  width: 100%;
  height: 60px;
  /* padding: 0 16px;
  padding-top: 16px; */
  align-items: center;

  font-size: 14px;
  font-weight: 500;

  :global(.van-field__label--required:before) {
    display: none;
    content: none;
  }

  :global(.van-field__label--required::after) {
    color: var(--van-field-required-mark-color);
    content: '*';
  }
}
.field:first-child {
  margin-top: 0;
}
.field::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: var(--van-padding-md);
  bottom: 0;
  border-bottom: 1px solid var(--van-cell-border-color);
  transform: scaleY(0.5);
  width: 343px;
  left: 16px;
}
.uploader-field {
  height: 136px;

  padding-bottom: 17px;
}
.uploader-field:first-child {
  margin-top: 0;
}
.uploader {
  --van-uploader-size: 80px;
}
.submit {
  margin: 0 16px;
  margin-top: 51px;
  padding-bottom: 12px;
}

.area_code {
  height: 24px;
  padding: 0 12px 0px 0px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.phone_code {
  padding-left: 12px;
}
</style>
