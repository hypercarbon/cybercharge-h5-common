import type { MockMethod, MockConfig } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/api/testList',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [
          {
            name: '24523243@qq.com',
            id: '10021',
            orderNumber: '123123',
            orderTime: '2024/12/02 09:00:00',
            productInfo: 'Charging component set *3',
            orderAmount: '888U or $888',
          },
          {
            name: '24523243@qq.com',
            id: '10022',
            orderNumber: '123123',
            orderTime: '2024/12/02 09:00:00',
            productInfo: 'Charging component set *3',
            orderAmount: '888U or $888',
          },
          {
            name: '24523243@qq.com',
            id: '10023',
            orderNumber: '123123',
            orderTime: '2024/12/02 09:00:00',
            productInfo: 'Charging component set *3',
            orderAmount: '888U or $888',
          },
          {
            name: '24523243@qq.com',
            id: '10024',
            orderNumber: '123123',
            orderTime: '2024/12/02 09:00:00',
            productInfo: 'Charging component set *3',
            orderAmount: '888U or $888',
          },
        ],
      }
    },
  },
] as MockMethod[]
