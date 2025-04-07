<template>
  <main class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      title="Team information"
      @click-left="onBack"
    />
    <div class="content">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="Enter name or ID to filter."
        @search="onSearch"
      >
        <template #action>
          <div class="searchBtn" @click="onSearch">Search</div>
        </template>
      </van-search>

      <div class="users">
        <InfoCard
          v-for="user in users"
          :key="user.id"
          :name="user.name"
          :id="user.id"
        >
          <template #info>
            <InfoLabel label="Order number: ">
              <template #value>
                {{ user.orderNumber }}
              </template>
            </InfoLabel>
            <InfoLabel label="Order time: ">
              <template #value>
                {{ user.orderTime }}
              </template>
            </InfoLabel>
            <InfoLabel label="Product information: ">
              <template #value>
                {{ user.productInfo }}
              </template>
            </InfoLabel>
            <InfoLabel label="Order amount: ">
              <template #value>
                {{ user.orderAmount }}
              </template>
            </InfoLabel>
          </template>
        </InfoCard>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import router from '@/router'
import { ref } from 'vue'
import InfoCard from '@/components/InfoCard.vue'
import InfoLabel from '@/components/InfoLabel.vue'
export default {
    components: {
        InfoCard,
        InfoLabel,
    },
  setup() {
    const searchValue = ref('')
    const users = ref<typeof usersData>([])
    const usersData = [
      {
        name: 'aaaaa@qq.com',
        id: '10021',
        realName: 'aaaaa',
        ratio: 10,
        orderNumber: '123123',
    orderTime: '2024/12/02 09:00:00',
    productInfo: 'Charging component set *3',
    orderAmount: '888U or $888',
      },
      {
        name: 'bbbbb@qq.com',
        id: '10022',
        realName: 'bbbbb',
        ratio: 10,
        orderNumber: '123123',
    orderTime: '2024/12/02 09:00:00',
    productInfo: 'Charging component set *3',
    orderAmount: '888U or $888',
      },
      {
        name: 'ccccc@qq.com',
        id: '10023',
        realName: 'ccccc',
        ratio: 10,
        orderNumber: '123123',
    orderTime: '2024/12/02 09:00:00',
    productInfo: 'Charging component set *3',
    orderAmount: '888U or $888',
      },
    ]
    const onBack = () => {
      router.go(-1)
    }

    const onSearch = () => {
      users.value = usersData.filter(
        u =>
          u.name.includes(searchValue.value) ||
          u.id.includes(searchValue.value),
      )
    }
    return {
      onBack,
      onSearch,
      searchValue,
      users
    }
  },
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
.content {
    padding: 0 16px;
  .searchBtn {
    font-size: 14px;
    font-weight: 400;
    color: #9059ff;
  }
  .users {
    margin-top: 18px;
  }
}
</style>
