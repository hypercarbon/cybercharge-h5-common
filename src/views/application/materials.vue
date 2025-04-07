<template>
  <main class="apply-page">
    <van-nav-bar
      left-arrow
      safe-area-inset-top
      :title="t('applyPage.ApplicationMaterials')"
      @click-left="onBack"
    />
    <section class="apply-page__content">
      <van-form :disabled="isReadOnly" @submit="onSubmit">
        <section class="page__content">
          <p class="column-title">{{ t('applyPage.ContactInformation') }}</p>
        </section>
        <van-field
          class="field"
          v-model="formValues.phone"
          required
          name="phone"
          :label="t('applyPage.Phone')"
          label-width="25vw"
          :placeholder="t('profile.Pleaseenter')"
          :rules="[
            {
              required: true,
              message: 'Please fill in your mobile phone number',
            },
          ]"
        >
          <template #input>
            <div class="area_code" @click="handleSelectPhoneCode">
              <template v-if="formValues.phoneCode">
                +{{ formValues.phoneCode }}</template
              >
            </div>
            <van-field
              v-model="formValues.phone"
              type="tel"
              placeholder="000000"
            />
          </template>
        </van-field>
        <van-field
          required
          class="field"
          v-model="formValues.telegram"
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
          v-model="formValues.realName"
          name="realName"
          :label="t('applyPage.RealName')"
          label-width="25vw"
          :placeholder="t('profile.Pleaseenter')"
          :rules="[
            {
              required: true,
              message: 'Please fill in your real name',
            },
          ]"
        />
        <van-field
          required
          class="field"
          v-model="formValues.currentArea"
          right-icon="arrow-down"
          placeholder="Please select"
          readonly
          name="currentArea"
          :label="t('applyPage.CurrentArea')"
          label-width="25vw"
          @click="handleShowSelectCurrentArea"
          :rules="[
            {
              required: true,
              message: 'Please fill in your current area',
            },
          ]"
        />
        <van-field
          required
          class="field"
          v-model="formValues.currentCity"
          name="city"
          :label="t('applyPage.currentCity')"
          label-width="25vw"
          :placeholder="t('profile.Pleaseenter')"
          :rules="[
            {
              required: true,
              message: 'Please fill in your current city',
            },
          ]"
        />
        <van-field
          required
          class="field"
          v-model="formValues.agentArea"
          right-icon="arrow-down"
          placeholder="Please select"
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
          v-model="formValues.agentCity"
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
        <section class="page__content file__content">
          <p class="column-title">{{ t('applyPage.fileInfo') }}</p>
          <p class="column-subtitle">
            {{ t('applyPage.uploadLimitText') }}
          </p>
        </section>

        <van-field
          class="field uploader-field"
          name="document"
          :label="t('applyPage.DocumentFrontandBack')"
          label-align="top"
          required
          readonly
          @click="uploadDocument"
        >
          <template #input>
            <van-uploader
              class="uploader"
              v-model="formValues.document"
              :max-count="2"
              :max-size="5 * 1024 * 1024"
              multiple
              readonly
              :deletable="!isReadOnly"
            >
            </van-uploader>
          </template>
        </van-field>

        <van-field
          class="field uploader-field"
          name="instructions"
          :label="t('applyPage.ApplicationInstructions')"
          label-align="top"
          required
          @click="uploadInstruction"
        >
          <template #input>
            <van-uploader
              class="uploader"
              v-model="formValues.instructions"
              readonly
              :max-count="1"
              multiple
              :deletable="!isReadOnly"
            />
          </template>
        </van-field>

        <van-field
          class="field uploader-field"
          name="qualification"
          :label="t('applyPage.otherSupportText')"
          label-align="top"
          required
          @click="uploadQualifying"
        >
          <template #input>
            <van-uploader
              class="uploader"
              v-model="formValues.qualification"
              readonly
              :max-count="1"
              multiple
              :deletable="!isReadOnly"
            />
          </template>
        </van-field>

        <div class="submit">
          <van-button
            :disabled="isReadOnly"
            block
            type="primary"
            native-type="submit"
          >
            {{ t('applyPage.SubmitApplication') }}
          </van-button>
        </div>
      </van-form>
    </section>
  </main>

  <AreaCode
    :show="areaCodeShow"
    :onClick="onAreaCodeSelect"
    :onClose="() => (areaCodeShow = false)"
  />

  <van-popup v-model:show="currAreaShow" round position="bottom">
    <van-cascader
      v-model="currAreaValue"
      active-color="#000"
      :title="t('common.selectAreaTitle')"
      :field-names="fieldNames"
      :options="regionList"
      @close="currAreaShow = false"
      @finish="onSelectCurrArea"
    />
  </van-popup>

  <van-popup v-model:show="agentAreaShow" round position="bottom">
    <van-cascader
      v-model="agentAreaValue"
      active-color="#000"
      :title="t('common.selectAreaTitle')"
      :field-names="fieldNames"
      :options="regionList"
      @close="agentAreaShow = false"
      @finish="onSelectAgentArea"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import regionList from '@/assets/data_region.json'
import AreaCode from '@/components/AreaCode.vue'
import {
  agentApply,
  AgentApplyStatus,
  getAgentMessage,
  isAgent,
} from '@/services/agent'
import { useUserInfoStore } from '@/stores/userInfo'
import nativeEvent, { type NativeUploadResult } from '@/utils/nativeEvent'
import { getCountryAndZone } from '@/utils/getCountryAndZoneName'
import { showToast, Toast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userInfoStore = useUserInfoStore()

const currAreaValue = ref('')
const agentAreaValue = ref('')

const currAreaShow = ref(false)
const agentAreaShow = ref(false)

const areaCodeShow = ref(false)

const fieldNames = {
  text: 'name',
  value: 'id',
  children: 'zones',
}

const formValues = reactive({
  phoneCode: '86',
  phone: '',
  telegram: '',
  realName: '',
  currentArea: '',
  currentAreaCountryCode: 0,
  currentAreaCode: 0,
  currentCity: '',
  agentArea: '',
  agentAreaCountryCode: 0,
  agentAreaCode: 0,
  agentCity: '',
  document: [] as any[],
  instructions: [] as any[],
  qualification: [] as any[],
  status: 0,
})

const isReadOnly = computed(() => {
  return (
    userInfoStore?.agentUser?.status === AgentApplyStatus.PENDING_REVIEW ||
    userInfoStore?.agentUser?.status === AgentApplyStatus.APPROVED
  )
})

onMounted(() => {
  initAgentApplyInfo()
})

const handleShowSelectCurrentArea = () => {
  if (isReadOnly.value) return
  currAreaShow.value = true
}

const handleShowSelectAgentArea = () => {
  if (isReadOnly.value) return
  agentAreaShow.value = true
}

const handleSelectPhoneCode = () => {
  if (isReadOnly.value) return
  areaCodeShow.value = true
}

const uploadDocument = () => {
  if (isReadOnly.value) return
  nativeEvent.uploadImageFromAlbum(
    'uploadImageFormAlbum',
    ({ path, error }: NativeUploadResult) => {
      formValues.document.push({ url: path[0], status: '' })
    },
  )
}

const uploadInstruction = () => {
  if (isReadOnly.value) return
  nativeEvent.uploadImageFromAlbum(
    'uploadImageFormAlbum',
    ({ path, error }: NativeUploadResult) => {
      formValues.instructions[0] = { url: path[0], status: '' }
    },
  )
}

const uploadQualifying = () => {
  if (isReadOnly.value) return
  nativeEvent.uploadImageFromAlbum(
    'uploadImageFormAlbum',
    ({ path, error }: NativeUploadResult) => {
      formValues.qualification[0] = { url: path[0], status: '' }
    },
  )
}

const initAgentApplyInfo = () => {
  const apply = userInfoStore.agentUser?.apply

  if (userInfoStore.agentUser?.status !== AgentApplyStatus.ADDED && apply) {
    const {
      phone_code,
      phone,
      telegram,
      real_name,
      country_id,
      zone_id,
      city,
      apply_zone_id,
      apply_country_id,
      agent_id,
      apply_city,
      id_photos,
      instruction,
      qualifying_documents,
    } = apply

    formValues.phoneCode = phone_code || ''
    formValues.phone = phone || ''
    formValues.telegram = telegram || ''
    formValues.realName = real_name || ''
    formValues.currentArea = getCountryAndZone(country_id, zone_id) || ''
    formValues.currentAreaCountryCode = country_id || -1
    formValues.currentAreaCode = zone_id || -1
    formValues.currentCity = city || ''
    formValues.agentArea =
      getCountryAndZone(apply_country_id, apply_zone_id) || ''
    formValues.agentAreaCountryCode = apply_country_id || -1
    formValues.agentAreaCode = agent_id || -1
    formValues.agentCity = apply_city || ''

    formValues.document = [{ url: id_photos?.front }, { url: id_photos?.back }]
    formValues.instructions = [{ url: instruction }]
    formValues.qualification = [{ url: qualifying_documents }]
  }
}
const onBack = () => {
  history.go(-1)
}

const onSubmit = async (values: typeof formValues) => {
  // TODO: 表单提交
  console.log(userInfoStore.agentUser)
  const res = await agentApply({
    phone_code: formValues.phoneCode,
    agent_id: userInfoStore.agentUser?.id as number,
    phone: formValues.phone,
    country_id: formValues.currentAreaCountryCode, // 国家id
    zone_id: formValues.currentAreaCode, // 地区id
    zone: formValues.agentArea,
    city: formValues.currentCity,
    apply_country_id: formValues.agentAreaCountryCode,
    apply_zone_id: formValues.agentAreaCode,
    apply_zone: formValues.agentArea,
    apply_city: formValues.agentCity,
    telegram: formValues.telegram,
    real_name: formValues.realName,
    id_photos: {
      front: formValues.document?.[0]?.url,
      back: formValues.document?.[1]?.url,
    },
    instruction: formValues.instructions?.[0]?.url ?? '',
    qualifying_documents: formValues.qualification?.[0]?.url ?? '',
  })
  showToast('提交成功！')
  getUserInfo()
}

const onSelectCurrArea = ({ value, selectedOptions }: any) => {
  console.log(value)
  currAreaShow.value = false
  currAreaValue.value = value

  formValues.currentAreaCountryCode = selectedOptions?.[0].id
  formValues.currentAreaCode = selectedOptions?.[1].id
  formValues.currentArea = selectedOptions
    .map((item: any) => item.name)
    .join(', ')
}

const onSelectAgentArea = ({ value, selectedOptions }: any) => {
  agentAreaShow.value = false
  agentAreaValue.value = value

  formValues.agentAreaCountryCode = selectedOptions?.[0].id
  formValues.agentAreaCode = selectedOptions?.[1].id
  formValues.agentArea = selectedOptions
    .map((item: any) => item.name)
    .join(', ')
}

const onAreaCodeSelect = (item: {
  name: string
  domain: string
  code: string
  x: string
  y: string
}) => {
  formValues.phoneCode = item.code
  areaCodeShow.value = false
}

const getUserInfo = () => {
  // if (!userInfoStore.agentInfo && !userInfoStore.agentUser) {
  getAgentMessage().then(result => {
    if (result.code != 0) return

    userInfoStore.setAgentUser(result.data)
  })

  isAgent().then(result => {
    if (result.code != 0) return

    userInfoStore.setAgentInfo(result.data)
  })
}
</script>

<style scoped>
.apply-page {
  /* height: 100%;
  overflow: scroll; */
}
.apply-page__content {
  height: calc(100vh - 46px);
  /* overflow: scroll; */
}
.page__content {
  padding: 16px;
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
