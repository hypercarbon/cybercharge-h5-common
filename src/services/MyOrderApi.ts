import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

export interface MyOrderBean {
  order_count: number
  total_amount: number
  data: {
    current_page: number
    data: MyOrderItemBean[]
  }
}

export interface MyOrderItemBean {
  id: number
  order_number: string
  total: number
  user_id: number
  created_at: number
  products: ProductBean[]
  user: UserInfoBean
}

export interface ProductBean {
  order_id: number
  name: string
  quantity: number
}

export interface UserInfoBean {
  id: number
  username: string
  avatar: string
  email: string
}

/**
 * 查询订单信息列表
 * @param page
 * @param start_time
 * @param end_time
 * @returns
 */
export const getMyOrder = (
  page: number,
  start_time: string,
  end_time: string,
): Promise<Result<MyOrderBean>> =>
  axiosInstance.post('/api/agent/manage/myOrders', {
    page,
    start_time,
    end_time,
  })
