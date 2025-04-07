<template>
  <div class="deposit-view">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      title="Pledged deposit"
      @click-left="onBack"
    />
    <div class="deposit-view__content">
      <div class="deposit-view__data-info">
        <p class="deposit-view__data-info-amount">${{ money }}</p>
        <p class="deposit-view__data-info-label">Deposit amount</p>
        <p class="deposit-view__data-info-desc">
          Only supports receiving <span style="color: #000">cToken</span> assets
        </p>
      </div>
      <div class="deposit-view__payment-title">Payment Method</div>
      <PaymentCard
        class="deposit-view__payment-card--ctoken"
        text="cToken"
        :is-active="false"
        @click="show = true"
      >
        <template #icon>
          <IconCToken />
        </template>
        <template #right>
          <div class="deposit-view__payment-card-radio"></div>
        </template>
      </PaymentCard>

      <van-button
        :class="{
          'deposit-view__pay-btn': true,
        }"
        type="primary"
        color="#9059FF"
        >Proceed to payment</van-button
      >
    </div>
    <van-action-sheet v-model:show="show" title="Choose Token for Payment">
      <div class="deposit-view__choose-content">
        <p class="deposit-view__choose-content-title">My cToken</p>
        <PaymentCard
          class="deposit-view__payment-card--usdc"
          text="USDC"
          :is-active="false"
          @click=""
        >
          <template #icon>
            <IconUsdc />
          </template>
          <template #right>
            <div class="deposit-view__payment-card-info">
              <p class="deposit-view__payment-card-info-label">1.5419</p>
              <p class="deposit-view__payment-card-info-value">≈$1068.49</p>
            </div>
          </template>
        </PaymentCard>
        <PaymentCard
          class="deposit-view__payment-card--usdt"
          text="USDT"
          :is-active="true"
          @click=""
        >
          <template #icon>
            <IconUsdt />
          </template>
          <template #right>
            <div class="deposit-view__payment-card-info">
              <p class="deposit-view__payment-card-info-label">1.5419</p>
              <p class="deposit-view__payment-card-info-value">≈$1068.49</p>
            </div>
          </template>
        </PaymentCard>
        <div class="deposit-view__choose-content-btns">
          <van-button type="primary" color="#9059FF" block
            >Pay immediatoly</van-button
          >
          <van-button type="primary" color="#9059FF" plain block
            >Get cToken</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import IconCToken from '@/components/icons/IconCToken.vue'
import IconUsdc from '@/components/icons/IconUsdc.vue'
import IconUsdt from '@/components/icons/IconUsdt.vue'
import PaymentCard from '@/components/PaymentCard.vue'
import { onMounted, ref } from 'vue'

const show = ref(false)

const money = ref<number>(0)
const onBack = () => history.back()

onMounted(() => {
  testReq()
})

const testReq = () => {
  money.value = 1000
}
</script>

<style scoped>
.deposit-view {
  .deposit-view__content {
    position: relative;
    height: calc(100vh - 46px);
    padding: 12px 16px;
    overflow: auto;
    .deposit-view__data-info {
      padding: 24px 0 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .deposit-view__data-info-amount {
        margin-bottom: 13px;
        font-size: 40px;
        font-weight: 600;
      }
      .deposit-view__data-info-label {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 500;
      }
      .deposit-view__data-info-desc {
        font-size: 12px;
        color: #737373;
      }
    }
    .deposit-view__payment-title {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 700;
    }
    .deposit-view__payment-card--ctoken {
      .deposit-view__payment-card-radio {
        width: 20px;
        height: 20px;
        border: 2px solid #ebebeb;
        border-radius: 50%;
      }
    }
    .deposit-view__pay-btn {
      position: absolute;
      bottom: 12px;
      left: 16px;
      right: 16px;
    }
  }

  .deposit-view__choose-content {
    padding: 24px 16px;
    .deposit-view__choose-content-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .deposit-view__payment-card--usdc,
    .deposit-view__payment-card--usdt {
      .deposit-view__payment-card-info {
        display: flex;
        flex-direction: column;

        gap: 8px;
        p {
          text-align: right;
        }
        .deposit-view__payment-card-info-label {
          font-size: 18px;
          font-weight: 700;
        }
        .deposit-view__payment-card-info-value {
          font-size: 14px;
          color: #737373;
        }
      }
    }
    .deposit-view__choose-content-btns {
      margin-top: 130px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>
