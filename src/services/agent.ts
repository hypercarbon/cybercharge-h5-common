import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

export enum AgentApplyStatus {
  PENDING_REVIEW = 'pending_review', //待审核
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected', // 已拒绝
  ADDED = 'added', // 已添加
}

export enum AgentRole {
  TOP = 0,
  LEVEL1 = 1,
  LEVEL2 = 2,
}

export interface UserInfo {
  id: number
  username: string
  avatar: string
  email: string
}

export interface AgentInfo {
  is_agent_admin: number
  is_agent: 0 | 1 // 0 不是代理商 1 是代理商
  is_agent_apply: 0 | 1
  is_pioneer_agent?: 0 | 1 // 0 不是先锋代理商 1 是先锋代理商
}

export interface AgentUserInfo {
  id: number
  real_name: string
  telegram: string
  level: AgentRole // 0: 国家代理商, 1: 1级代理商, 2: 2级代理商
  phone: string
  phone_code: string
  user_id: number
  status: AgentApplyStatus
  commission_rate: number
  is_deposit_paid: 0 | 1 // 0: 未缴纳, 1: 已缴纳
  deposit_payment_id: number
  country_id: number
  zone_id: number
  zone: string
  city_id: number
  city: string
  zipcode: string
  address_1: string
  address_2: string
  apply: ApplyInfo
  user: UserInfo
}

export interface ApplyInfo {
  id: number
  user_id: number
  agent_id: number
  phone_code: string
  phone: string
  telegram: string
  real_name: string
  country_id: number
  zone_id: number
  zone: string
  city_id: number
  city: string
  zipcode: string
  address_1: string
  address_2: string
  apply_country_id: number
  apply_zone_id: number
  apply_zone: string
  apply_city_id: number
  apply_city: string
  apply_zipcode: string
  apply_address_1: string
  apply_address_2: string
  status: AgentApplyStatus
  instruction: string
  qualifying_documents: string
  id_photos: {
    front: string
    back: string
  }
}
export interface Agent {
  id: number

  real_name: string

  telegram: string

  /// 代理商级别 0-国家代理商 1-1级代理商 2-2级代理商
  level: number

  phone: string

  user_id: number

  // 状态 pending_review-待审核 approved-已通过 rejected-已拒绝 added-刚被添加
  status: string

  commission_rate: number

  // 是否已缴纳押金 0-未缴纳 1-已缴纳
  is_deposit_paid: number

  deposit_payment_id: number

  deleted_at: string

  // 地址相关
  country_id: number
  zone_id: number
  zone: string
  city_id: number
  city: string
  zipcode: number
  address_1: string
  address_2: string

  // 用户信息
  user: AgentUser
}

export interface AgentUser {
  avatar: string
  email: string
  id: number
  username: string
}

// 获取用户信息
export const getAgentMessage = (): Promise<Result<AgentUserInfo>> =>
  axiosInstance.post('/api/agent/manage/getAgentUser')

export interface AgentStatus {
  is_agent_admin: number
  is_agent: number
  is_agent_apply: number
}
export const isAgent = (): Promise<Result<AgentInfo>> =>
  axiosInstance.post('/api/agent/manage/isAgent')

// 查询用户是否代理商
export interface checkAgentUser {
  username: string
  avatar: string
}
export const checkAgentUser = (
  userId: number,
): Promise<Result<checkAgentUser>> =>
  axiosInstance.post('/api/agent/manage/checkUser', { to_user_id: userId })

// 添加代理商
export const addAgent = (userId: number): Promise<Result> =>
  axiosInstance.post('/api/agent/manage/addAgent', { to_user_id: userId })

// 代理商申请列表
export interface AgentApplyResult {
  items: AgentApplyItem[]
}
export interface AgentApplyItem {
  id: number
  user_id: number
  status: string
  country_id: number
  zone_id: number
  zone: string
  city_id: number
  city: string
  zipcode: string
  address_1: string
  address_2: string
  phone: string
  phone_code: string
  real_name: string
  telegram: string

  apply_country_id: number
  apply_zone_id: number
  apply_zone: string
  apply_city_id: number
  apply_city: string
  apply_zipcode: string
  // 证件照
  id_photos: { front: string; back: string }

  // 说明
  instruction: string

  // 资格证明
  qualifying_documents: string
}
export const agentApplyList = (
  status: string,
): Promise<Result<AgentApplyResult>> =>
  axiosInstance.post('/api/agent/manage/applyItems', { status })
export interface AgentApplyProps {
  phone_code: string
  agent_id: number
  phone: string
  country_id: number // 国家id
  zone_id: number // 地区id
  zone: string
  city: string
  zipcode?: string
  address_1?: string
  address_2?: string
  apply_country_id: number
  apply_zone_id: number
  apply_zone: string
  apply_city: string
  apply_zipcode?: string
  apply_address_1?: string
  apply_address_2?: string
  telegram: string
  real_name: string
  id_photos: {
    front: string
    back: string
  }
  instruction?: string
  qualifying_documents?: string
}

export const agentApply = (params: AgentApplyProps): Promise<Result> =>
  axiosInstance.post('/api/agent/manage/agentApply', params)

export interface MetricsUser {
  user_id: number
  quantity: number
  total: string
  real_name: string
  commission: number
  level: AgentRole
}

export interface MetricsResult {
  list: MetricsUser[]
  levels: {
    level: AgentRole
    count: number
  }[]
  statistics: {
    quantity: number
    total: string
  }
}

export const getMetrics = (
  level: AgentRole,
  start_time: string,
  end_time: string,
): Promise<Result<MetricsResult>> =>
  axiosInstance.post('/api/agent/manage/metrics', {
    level,
    start_time,
    end_time,
  })
// 代理商申请审核(同意or拒绝)
export const agentApplyCommit = (
  status: string,
  to_user_id: number,
): Promise<Result> =>
  axiosInstance.post('/api/agent/manage/review', { status, to_user_id })

// 冻结代理商
export const frozenAgent = (to_user_id: number): Promise<Result> =>
  axiosInstance.post('/api/agent/manage/freezeAgent', { to_user_id })

// 解冻代理商
export const unfrozenAgent = (to_user_id: number): Promise<Result> =>
  axiosInstance.post('/api/agent/manage/unfreezeAgent', { to_user_id })

// 我的下级代理商
export const mySubAgentsList = (): Promise<Result<AgentUserInfo[]>> =>
  axiosInstance.post('/api/agent/manage/mySubAgents')

// 修改代理商分佣比例
export const setAgentCommissionRate = (
  to_user_id: string,
  commission_rate: string,
): Promise<Result<AgentUserInfo[]>> =>
  axiosInstance.post('/api/agent/manage/setAgentCommissionRate', {
    to_user_id,
    commission_rate,
  })
