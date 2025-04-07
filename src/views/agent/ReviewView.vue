<template>
  <div class="review-view">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="t('home.agentReview')"
      @click-left="onBack"
    />
    <div class="review-view__content">
      <van-tabs
        class="review-view__tabs"
        v-model:active="active"
        swipeable
        :line-width="16"
        :line-height="2"
        @change="onTabChange"
      >
        <van-tab
          v-for="(titleSouce, index) in titleList"
          :key="index"
          :title="titleSouce.title"
        >
          <ul class="review-view__content-table">
            <li class="review-view__content-table-row th-row">
              <div class="review-view__content-table-col th-col col-1">
                {{ t('reviewPage.No') }}
              </div>
              <div class="review-view__content-table-col th-col col-2">
                {{ t('reviewPage.UserID') }}
              </div>
              <div class="review-view__content-table-col th-col col-3">
                {{ t('applyPage.RealName') }}
              </div>
              <div class="review-view__content-table-col th-col col-4">
                {{ t('reviewPage.Operation') }}
              </div>
            </li>
            <!-- <van-pull-refresh v-model="loading" @refresh="onRefresh">

            </van-pull-refresh> -->
            <li
              v-for="(applyItem, userIndex) in titleSouce.sourceList"
              :key="`${index}_${userIndex}`"
              class="review-view__content-table-row td-row"
            >
              <div class="review-view__content-table-col td-col col-1">
                {{ userIndex + 1 }}
              </div>
              <div class="review-view__content-table-col td-col col-2">
                {{ applyItem.user_id }}
              </div>
              <div class="review-view__content-table-col td-col col-3">
                <TextEllipsis :content="applyItem.real_name" />
              </div>
              <div
                class="review-view__content-table-col td-col col-4"
                @click="() => gotoApplicationDetail(applyItem)"
              >
                {{ t('reviewPage.Info') }}
                <van-icon name="arrow" />
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { agentApplyList, type AgentApplyItem } from '@/services/agent'

import { showFailToast, showToast, TextEllipsis } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const loading = ref(false)
const titleList = ref([
  {
    title: t('reviewPage.Reviewing'),
    sourceList: [] as AgentApplyItem[],
  },
  {
    title: t('reviewPage.Approved'),
    sourceList: [] as AgentApplyItem[],
  },
  {
    title: t('reviewPage.Rejected'),
    sourceList: [] as AgentApplyItem[],
  },
  {
    title: t('reviewPage.Frozen'),
    sourceList: [] as AgentApplyItem[],
  },
])

onMounted(() => {
  onTabChange(0)
  onTabChange(1)
  onTabChange(2)
  onTabChange(3)
})

const active = ref(0)

const gotoApplicationDetail = (item: AgentApplyItem) => {
  const data = JSON.stringify(item)
  router.push({
    name: 'ApplicationDetails',
    query: { data },
  })
}

const onBack = () => router.back()

function onTabChange(index: number) {
  let status = 'pending_review'
  if (index === 0) {
    status = 'pending_review'
  } else if (index === 1) {
    status = 'approved'
  } else if (index === 2) {
    status = 'rejected'
  } else if (index === 3) {
    status = 'frozen'
  }
  agentApplyList(status).then(res => {
    if (res.code != 0) {
      showFailToast(res.msg ?? '')
      return
    }

    titleList.value[index].sourceList = res.data.items
  })
}

const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功')
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
.review-view {
  height: 100%;
  .review-view__content {
    position: relative;
    height: calc(100% - 46px);
    padding: 12px 16px;
    .review-view__tabs {
      margin-bottom: 12px;
    }
    .review-view__content-table {
      .review-view__content-table-row {
        display: flex;
        &.th-row {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .review-view__content-table-col {
          text-align: center;
          &.th-col {
            padding: 12px 0;
            font-weight: 500;
            font-size: 14px;
          }
          &.td-col {
            padding: 15px 0;
            &.col-4 {
              color: #2893ff;
            }
          }
          &.col-1 {
            width: 40px;
          }
          &.col-2 {
            width: 80px;
          }
          &.col-3 {
            flex: 1;
          }
          &.col-4 {
            width: 100px;
          }
        }
      }
    }
  }
}
</style>
