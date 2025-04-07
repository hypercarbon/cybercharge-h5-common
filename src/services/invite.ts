import en from '@/lang/en'
import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

export interface InviterTasksParams {}
export interface TaskCompletionRecordsParams {
  task_id: number
  task_item_id: number
}
export interface OneClickClaimParams {}

export enum TaskStatus {
  PROGRESS = 'progress', // 进行中
  PENDING = 'pending', // 用户待领取
  RECEIVED = 'received', // 用户已领取
  APPROVED = 'approved', // 审核通过
  REJECTED = 'rejected', // 审核拒绝
}

export interface InviterTaskInfo {
  end_time: number
  id: number
  name: string
  remark: string
  start_time: number
  task_type: string
  items: InviterTaskItem[]
}

export interface InviterTaskItem {
  id: number
  name: string
  rule: string // 富文本
  task_id: number
  type: string
  configs: InviterTaskItemConfig[]
}

export interface InviterTaskItemConfig {
  amount: string
  asset_uuid: string
  goods: null
  icon_url: string
  level: number
  num: string
  reward_type: string
  status: TaskStatus
}

export interface TaskCompletionRecords {
  amount: string
  created_at: string
  from_user_avatar: string
  from_user_id: number
  from_user_username: string
  user_id: number
}

export interface StatTaskInfo {
  inviter_reward_amount: string
  task_rewoard_gem_total: string
  total_reward: string
}

export const getInviterTasks = (): Promise<Result<InviterTaskInfo>> =>
  axiosInstance.post('/api/task/getInviterTasks')

export const getTaskCompletionRecords = (
  param: TaskCompletionRecordsParams,
): Promise<Result<TaskCompletionRecords[]>> =>
  axiosInstance.post('/api/task/getTaskCompletionRecords', param)

export const oneClickClaim = (
  param: OneClickClaimParams,
): Promise<Result<any>> => axiosInstance.post('/api/task/oneClickClaim', param)

export const getStatTask = (): Promise<Result<StatTaskInfo>> =>
  axiosInstance.post('/api/task/getStatTask')
