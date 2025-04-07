<template>
  <div class="order-view">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="t('orderPage.Myorder')"
      @click-left="onBack"
    />

    <div class="order-view__content">
      <!-- <div class="order-view__top-tool"> -->
      <!-- <span class="order-view__top-tool-title">{{
          t('orderPage.order')
        }}</span> -->
      <!-- <div class="order-view__top-tool-export">
          <IconExcel />
          <span class="order-view__top-tool-export-text">XLS</span>
        </div> -->
      <!-- </div> -->
      <div class="order-view__date-bar" @click="handleShowPicker">
        <span class="order-view__date-bar-title">{{
          t('orderPage.Date')
        }}</span>
        <span
          class="order-view__date-bar-date"
          v-if="currentDate.some(date => date) && endDate.some(date => date)"
        >
          {{ currentDate.join('/') }} - {{ endDate.join('/') }}
        </span>
        <van-icon
          class="order-view__date-bar-icon"
          color="#969799"
          name="arrow"
        />
      </div>
      <div class="order-view__data-info">
        <div class="order-view__data-info-item">
          <p class="order-view__data-info-item-num">
            {{ mMyOrderBean?.order_count ?? 0 }}
          </p>
          <p class="order-view__data-info-item-label">
            {{ t('orderPage.Orderquantity') }}
          </p>
        </div>
        <div class="order-view__data-info-item">
          <p class="order-view__data-info-item-num">
            {{ mMyOrderBean?.total_amount ?? 0 }}u
          </p>
          <p class="order-view__data-info-item-label">
            {{ t('orderPage.Orderamount') }}
          </p>
        </div>
      </div>
      <div class="order-view__user-info-container">
        <template v-if="mMyOrderBean">
          <InfoCard
            v-for="myOrder in mMyOrderBean?.data.data"
            :key="myOrder.id"
            :name="myOrder.user.username"
            :id="myOrder.user_id.toString()"
            :avatar-url="
              myOrder.user.avatar.length > 0 ? myOrder.user.avatar : Avatar
            "
          >
            <template #info>
              <InfoLabel :label="`${t('orderPage.number')}: `">
                <template #value>
                  {{ myOrder.order_number }}
                </template>
              </InfoLabel>
              <InfoLabel :label="`${t('orderPage.time')}: `">
                <template #value>
                  {{ getDateTime(myOrder.created_at) }}
                </template>
              </InfoLabel>
              <InfoLabel :label="`${t('orderPage.productInfo')}: `">
                <template #value>
                  {{ myOrder.products?.[0].name }} *
                  {{ myOrder.products?.[0].quantity }}
                </template>
              </InfoLabel>
              <InfoLabel :label="`${t('orderPage.amount')}: `">
                <template #value>
                  {{ myOrder.total }}
                </template>
              </InfoLabel>
            </template>
          </InfoCard>
        </template>
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
import InfoCard from '@/components/InfoCard.vue'
import InfoLabel from '@/components/InfoLabel.vue'
import Avatar from '@/assets/img_avatar.png'
import { getMyOrder, type MyOrderBean } from '@/services/MyOrderApi'

import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const minDate = new Date(2024, 8, 1)
const maxDate = new Date()

const show = ref(false)

const currentDate = ref(['', '', ''])
const endDate = ref(['', '', ''])

// const currentDate = ref(['2025', '2', '1'])
// const endDate = ref(['2025', '2', '29'])

const mMyOrderBean = ref<MyOrderBean | undefined>(undefined)

onMounted(() => {
  // 获取今天往前一周的时间

  _getMyOrder(1, '', '')
})

const _getMyOrder = async (
  page: number,
  start_time: string,
  end_time: string,
) => {
  const res = await getMyOrder(page, start_time, end_time)
  if (res.code === 0) {
    mMyOrderBean.value = res.data
  }
  console.log(res)
}

watch(
  () => {
    return [currentDate.value, endDate.value]
  },
  (val, newVal) => {
    console.log(val, newVal)
  },
)

const handleShowPicker = () => {
  // currentDate.value = ['', '', '']
  // endDate.value = ['', '', '']
  setTimeout(() => {
    show.value = true
  }, 0)
  // show.value = true
}

const onConfirm = () => {
  //showToast(`${currentDate.value.join('/')} ${endDate.value.join('/')}`)
  show.value = false
  const startTime = currentDate.value.join('/')
  const endTime = endDate.value.join('/')
  console.log('startTime = ' + startTime + '  endTime = ' + endTime)
  _getMyOrder(1, startTime, endTime)
}

const onCancel = () => {
  show.value = false
}
const onBack = () => history.back()

const getDateTime = (timestamp: number | string): string => {
  const timestampNumber =
    typeof timestamp === 'string' ? Number(timestamp) : timestamp

  const date = new Date(timestampNumber * 1000)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}
</script>

<style scoped>
.order-view {
  .order-view__content {
    height: calc(100vh - 88px);
    padding: 0px 16px;
    overflow: auto;
    .order-view__top-tool {
      padding: 16px 0;
      display: flex;
      justify-content: space-between;

      .order-view__top-tool-title {
        font-weight: 700;
        font-size: 16px;
      }
      .order-view__top-tool-export {
        display: flex;
        align-items: center;
        gap: 2px;
        .order-view__top-tool-export-text {
          font-size: 12px;
        }
      }
    }
    .order-view__date-bar {
      padding: 10px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ebedf0;
      .order-view__date-bar-title {
        color: #000;
        font-size: 14px;
        font-weight: 500;
      }
      .order-view__date-bar-date {
        color: #333;
        font-size: 14px;
      }
    }
    .order-view__data-info {
      padding: 32px 0px;
      display: flex;
      justify-content: center;
      gap: 74px;
      .order-view__data-info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .order-view__data-info-item-num {
          font-size: 24px;
          font-weight: 700;
        }
        .order-view__data-info-item-label {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
    .order-view__user-info-container {
      padding: 12px 0;
    }
  }
}
</style>
