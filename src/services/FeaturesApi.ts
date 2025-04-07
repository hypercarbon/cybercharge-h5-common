import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'
import type { S } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
import { type AgentUserInfo } from '@/services/agent'
export interface GetListProps {
  page: number
  limit: number
}

export interface CommissionConfigBean {
  id: number
  level: number
  commission_rate: number
  created_at: string
  updated_at: string
}

export interface AgentUserBean {
  id: number
  real_name: string
  telegram: string
  level: number
  phoneCode: string
  phone: string
  user_id: number
  status: string
  commission_rate: number
  is_deposit_paid: number
  deposit_payment_id: number
  deleted_at: string
  country_id: number
  zone_id: number
  zone: string
  city_id: number
  city: string
  zipcode: string
  address_1: string
  address_2: string
}

/**
 * 获取佣金设置数据
 * @returns
 */
export const getCommissionConfig = (): Promise<
  Result<CommissionConfigBean[]>
> => axiosInstance.post('/api/agent/manage/getCommissionConfig')

/**
 * 设置佣金
 * @param commission_rate
 * @param level
 * @returns
 */
export const setCommissionConfig = (
  commission_rate: number,
  level: number,
): Promise<Result<object>> =>
  axiosInstance.post('/api/agent/manage/setCommissionConfig', {
    commission_rate,
    level,
  })

/**
 * 获取代理商个人信息
 * @returns
 */
export const getAgentUser = (): Promise<Result<AgentUserInfo>> =>
  axiosInstance.post('/api/agent/manage/getAgentUser')

/**
 * 修改代理商个人信息
 * @param params
 * @returns
 */
export const updateAgentUser = (params: {}): Promise<Result<object>> =>
  axiosInstance.post('/api/agent/manage/update', params)
