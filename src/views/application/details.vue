<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="t('reviewDetail.Applicationdetails')"
      @click-left="onBack"
    />
    <section class="page__content">
      <p class="column-title">{{ t('reviewDetail.userinformation') }}</p>
    </section>
    <van-form>
      <van-field
        class="field"
        v-model="details.user_id"
        :label="t('reviewPage.UserID')"
        readonly
      />
      <van-field
        class="field"
        v-model="details.phone"
        :label="t('applyPage.Phone')"
        readonly
      >
        <template #input>
          <div class="area_code">+{{ details.phone_code }}</div>
          <div class="phone_code">
            {{ details.phone }}
          </div>
        </template>
      </van-field>

      <van-field
        class="field"
        v-model="details.telegram"
        :label="t('applyPage.Telegram')"
        readonly
      />
      <van-field
        class="field"
        v-model="details.real_name"
        :label="t('applyPage.RealName')"
        readonly
      />
      <van-field
        class="field"
        type="textarea"
        v-model="formValues.currentArea"
        :label="t('applyPage.CurrentArea')"
        readonly
      />
      <van-field
        class="field"
        type="textarea"
        v-model="details.city"
        :label="t('applyPage.currentCity')"
        readonly
      />
      <van-field
        class="field"
        type="textarea"
        v-model="formValues.agentArea"
        :label="t('applyPage.AgentArea')"
        readonly
      />
      <van-field
        class="field"
        type="textarea"
        v-model="details.apply_city"
        :label="t('applyPage.agentCity')"
        readonly
      />
      <van-field
        class="field status"
        v-model="status"
        :label="t('reviewDetail.applicationstatus')"
        readonly
      />
      <div class="actions">
        <van-button
          class="btn danger-btn"
          v-if="details.status === 'approved'"
          @click="onUnspendAgency"
        >
          {{ t('reviewDetail.Uspendagency') }}
        </van-button>

        <van-button
          class="btn"
          v-if="details.status === 'pending_review'"
          @click="onApproveAgency"
        >
          {{ t('reviewDetail.Approve') }}
        </van-button>

        <van-button
          class="btn danger-btn"
          v-if="details.status === 'pending_review'"
          @click="onRejectAgency"
        >
          {{ t('reviewDetail.Reject') }}
        </van-button>
        <van-button
          class="btn"
          v-if="details.status === 'frozen'"
          @click="reinstateAgencyStatus"
        >
          {{ t('reviewDetail.reinstateagencystatus') }}
        </van-button>
      </div>

      <section class="page__content">
        <p class="column-title">{{ t('reviewDetail.userinformation') }}</p>
        <p class="column-subtitle">{{ t('reviewDetail.reviewFileText') }}</p>
      </section>

      <div class="box">
        <van-uploader
          readonly
          :deletable="false"
          :show-upload="false"
          class="uploader"
          v-model="id_photos"
        >
          <template #preview-cover>
            <div class="preview-cover">
              <div class="preview-cover__text">
                {{ t('reviewDetail.View') }}
              </div>
            </div>
          </template>
        </van-uploader>
      </div>

      <section class="page__content">
        <p class="column-subtitle">Application Instructions</p>
      </section>

      <div class="box">
        <van-uploader
          readonly
          :deletable="false"
          :show-upload="false"
          class="uploader"
          v-model="instruction"
        >
          <template #preview-cover>
            <div class="preview-cover">
              <div class="preview-cover__text">
                {{ t('reviewDetail.View') }}
              </div>
            </div>
          </template>
        </van-uploader>
      </div>

      <section class="page__content">
        <p class="column-subtitle">Additional Qualification Documents</p>
      </section>

      <div class="box">
        <van-uploader
          readonly
          :deletable="false"
          :show-upload="false"
          class="uploader"
          v-model="qualifying_documents"
        >
          <template #preview-cover>
            <div class="preview-cover">
              <div class="preview-cover__text">
                {{ t('reviewDetail.View') }}
              </div>
            </div>
          </template>
        </van-uploader>
      </div>
    </van-form>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import {
  closeToast,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
} from 'vant'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  agentApplyCommit,
  frozenAgent,
  unfrozenAgent,
  type AgentApplyItem,
} from '@/services/agent'
import { getCountryAndZone } from '@/utils/getCountryAndZoneName'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formValues = reactive({
  id: '123123',
  phone: '13599999999',
  areaCode: '86',
  telegram: 'xxxxxxx',
  realName: 'xxxxxx',
  currentArea: 'Panyu District, Guangzhou, GuangdongProvince',
  agentArea: 'Panyu District, Guangzhou, GuangdongProvince',
  status: 1,
  document: [
    {
      url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg',
    },
  ],
})

// eslint-disable-next-line vue/return-in-computed-property
const status = computed(() => {
  if (details.value.status === 'pending_review') {
    return 'Request in progress'
  }
  if (details.value.status === 'approved') {
    return 'Approved'
  }

  if (details.value.status === 'frozen') {
    return 'Request approved'
  }
})

const id_photos = ref<Array<{ url: string }>>([])
const instruction = ref<Array<{ url: string }>>([])
const qualifying_documents = ref<Array<{ url: string }>>([])
const route = useRoute()
const details = ref<AgentApplyItem>(JSON.parse(route.query.data || '{}'))
id_photos.value = [
  { url: details.value.id_photos.front },
  { url: details.value.id_photos.back },
]
instruction.value = [{ url: details.value.instruction }]
qualifying_documents.value = [{ url: details.value.qualifying_documents }]

formValues.currentArea =
  getCountryAndZone(details.value.country_id, details.value.zone_id) || ''
formValues.agentArea =
  getCountryAndZone(details.value.country_id, details.value.zone_id) || ''

const onBack = () => {
  router.go(-1)
}
// 冻结代理
const onUnspendAgency = () => {
  showLoadingToast({
    message: t('common.loading'),
    forbidClick: true,
    loadingType: 'spinner',
  })
  frozenAgent(details.value?.user_id ?? 0).then(res => {
    closeToast()
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }
    details.value.status = 'frozen'
    showSuccessToast('success')
    onBack()
  })
}
// 同意代理
const onApproveAgency = () => {
  showLoadingToast({
    message: t('common.loading'),
    forbidClick: true,
    loadingType: 'spinner',
  })
  agentApplyCommit('approved', details.value.user_id).then(res => {
    closeToast()
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }
    details.value.status = 'approved'
    showSuccessToast('success')
    onBack()
  })
}
const onRejectAgency = () => {
  showLoadingToast({
    message: t('common.loading'),

    forbidClick: true,
    loadingType: 'spinner',
  })
  agentApplyCommit('rejected', details.value.user_id).then(res => {
    closeToast()
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }
    details.value.status = 'rejected'
    showSuccessToast('success')
    onBack()
  })
}

const reinstateAgencyStatus = () => {
  console.log('reinstateAgencyStatus')
  showLoadingToast({
    message: t('common.loading'),

    forbidClick: true,
    loadingType: 'spinner',
  })
  unfrozenAgent(details.value.user_id).then(res => {
    closeToast()
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }
    details.value.status = 'approved'
    showSuccessToast('success')
    onBack()
  })
}
</script>

<style scoped>
.page__content {
  padding: 16px;
}
.column-title {
  font-weight: 700;
  font-size: 16px;
  color: #000000;
}
.box {
  padding-left: 16px;
  padding-right: 16px;
}
.area_code {
  height: 24px;
  padding: 0 12px 0px 0px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.phone_code {
  padding-left: 12px;
}
.field {
  font-size: 14px;
  font-weight: 400;
  --van-field-text-area-min-height: 0px;

  :global(.van-field__label) {
    font-size: 14px;
    font-weight: 500;
    width: 115px;
  }
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
.status {
  --van-field-input-text-color: #0f993b;
}
.actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 48px;
  gap: 12px;
}
.btn {
  height: 35px;
  background-color: #ebebeb;
  color: #9966ff;
  font-weight: 500;
  --van-button-border-width: 0px;
  --van-button-default-border-color: #ebebeb;
}
.danger-btn {
  color: #ff3344;
}
.column-subtitle {
  margin-top: 10px;
  line-height: 24px;
}

.uploader {
}

.page {
  padding-bottom: 30px;
}

.preview-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
}
.preview-cover__text {
  font-size: 14px;
  color: #ffffff;
}
</style>
