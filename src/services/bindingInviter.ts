import { DEV_URL } from '@/config/constants'
import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

type BindChannelInviterParams = {
  inviter_id: 'string'
  channel_id: 'string'
}

type CommonParams = {
  userId: string
  channelId: string
}

type InviterInfo = {}

export type Channel = {
  channelCode: string
  channelId: number
  channelName: string
  icon: string
}

export type RewardDetail = {
  userId: number
  channelId: number
  totalAmount: number
  weekAmount: number
  oneLevels: {
    totalAmount: number
    userId: number
    weekAmount: number
  }[]
  twoLevels: {
    totalAmount: number
    userId: number
    weekAmount: number
  }[]
  otherLevels: {
    userId: 0
    totalAmount: 0
    weekAmount: 0
  }
}

export type UserInfo = {
  user: {
    id: number
    username: string
    email: string
    avatar: string
  }
  isSetPassword: boolean
}

export const getUserInfo = (): Promise<Result<UserInfo>> =>
  axiosInstance.get('/api/user')

/**
 * 获取邀请人信息
 * @param params
 * @returns
 */
export const getInviterInfo = (
  params: CommonParams,
): Promise<Result<InviterInfo>> =>
  axiosInstance.get(DEV_URL + '/gateway/invite-service/api/v1/invite/get', {
    params,
  })

/**
 * 获取邀请人奖励详情
 * @param params
 * @returns
 */
export const getRewardDetail = (
  params: CommonParams,
): Promise<Result<RewardDetail>> =>
  axiosInstance.get(DEV_URL + '/gateway/invite-service/api/v1/reward/get', {
    params,
  })

/**
 * 获取渠道列表
 * @returns
 */
export const getChannelList = (): Promise<Result<Channel[]>> =>
  axiosInstance.get(DEV_URL + '/gateway/invite-service/api/v1/channel/list')

/**
 * 绑定渠道邀请人
 * @param param
 * @returns
 */
export const bindChannelInviter = (
  params: BindChannelInviterParams,
): Promise<Result> =>
  axiosInstance.post('/api/user/inviter/bindChannelInviter', params)
