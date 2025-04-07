import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'
import type internal from 'stream'

export interface UserInfo {
  playerBalance: number
  playerID: string
  playerName: string
  token: string
}

export interface GetListProps {
  page: number
  limit: number
}

export interface Item {
  name: string
  id: string
  orderNumber: string
  orderTime: string
  productInfo: string
  orderAmount: string
}

// 登录
export const inviteLogin = (params: {
  email: string
  code: string
  inviter_code: string
}): Promise<Result<UserInfo>> => {
  return axiosInstance.post('/api/user/registerWithEmail', params)
}

export const getTestList = (params: GetListProps): Promise<Result<Item[]>> =>
  axiosInstance.get('/mock/api/testList', { params })
