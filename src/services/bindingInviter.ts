import { INVITE_URL } from '@/config/constants'
import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

type BindChannelInviterParams = {
  inviter_id: string
  channel_id: string
}

type CommonParams = {
  userId: string | number
  channelId: string
}

export type InviterInfo = null | string

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
  oneLevels: LevelUser[]
  twoLevels: LevelUser[]
  otherLevels: {
    userId: 0
    totalAmount: 0
    weekAmount: 0
  }
}

export type LevelUser = {
  totalAmount: number
  userId: number
  weekAmount: number
  invitationTime: number
  user: {
    id: number
    username: string
    avatar: string
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

export type ChannelDetails = {
  channelCode: string
  channelId: number
  channelName: string
  detailUrl: string
  icon: string
  inviteUrl: string
}

export const getUserInfo = (): Promise<Result<UserInfo>> =>
  axiosInstance.get('/api/user')

/**
 * 获取邀请人奖励详情
 * @param params
 * @returns
 */
export const getRewardDetail = (params: {
  channel_id: string
}): Promise<Result<RewardDetail>> =>
  axiosInstance.post('/api/user/inviter/getRewardList', params)

/**
 * 获取渠道列表
 * @returns
 */
export const getChannelList = (): Promise<Result<Channel[]>> =>
  axiosInstance.get(INVITE_URL + '/gateway/invite-service/api/v1/channel/list')

/**
 * 获取邀请人信息
 * @param params
 * @returns
 */
export const getInviterInfo = (
  params: CommonParams,
): Promise<Result<InviterInfo>> =>
  axiosInstance.get(INVITE_URL + '/gateway/invite-service/api/v1/invite/get', {
    params,
  })

/**
 * 绑定渠道邀请人
 * @param param
 * @returns
 */
export const bindChannelInviter = (
  params: BindChannelInviterParams,
): Promise<Result> =>
  axiosInstance.post('/api/user/inviter/bindChannelInviter', params)

/**
 * 获取渠道详情
 * @param channelId
 * @returns
 */
export const getDetailsUrl = (
  channelId: string,
): Promise<Result<ChannelDetails>> =>
  axiosInstance.get(INVITE_URL + '/gateway/invite-service/api/v1/channel/get', {
    params: {
      channelId,
    },
  })
