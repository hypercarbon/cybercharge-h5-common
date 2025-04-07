import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'

export enum SignTag {
  NEWBIE = 'newbie',
}

export enum SignRewardType {
  RIGHT = 'right',
  ASSET = 'asset',
}

export enum ActicityType {
  CUMULATIVE = 'cumulative', // 累计签到
  DATE = 'date', // 日期签到
}

export interface SignActiveInfo {
  sign_activity_days: number
  sign_activity_id: number
  sign_activity_tag: SignTag
  sign_activity_title: string
  sign_activity_description: string
  sign_activity_type: ActicityType
  sign_activity_rewards: SignActivityReward[]
  sign_activity_today_can_sign: boolean
}

export interface SignActivityRewardBase {
  sign_reward_day: number
  sign_reward_id: number
  sign_reward_is_signed: boolean // 用户是否签到
  sign_reward_can_sign: boolean // 是否可以签到
  sign_reward_route_path: string // 跳转app原生路由
  sign_reward_privilege: {}
}

export interface SignRewardRight {
  content: string
  entity_type: string
  image_url: string
  name: string
  rights_type: string
  title: string
  validity_period: number
}

export interface SignRewardAsset {
  amount: string
  icon: string
  symbol: string
  uuid: string
}

// 根据 sign_reward_type 来区分 asset 和 right 类型
export type SignActivityReward =
  | (SignActivityRewardBase & {
      sign_reward_type: SignRewardType.RIGHT
      sign_reward_right: SignRewardRight
      sign_reward_asset: {}
    })
  | (SignActivityRewardBase & {
      sign_reward_type: SignRewardType.ASSET
      sign_reward_right: {}
      sign_reward_asset: SignRewardAsset
    })

export const getActiveInfo = (tag: SignTag): Promise<Result<SignActiveInfo>> =>
  axiosInstance.get(`/api/signActivity/activeInfo?tag=${tag}`)

export const sign = (params: {
  sign_activity_id: number
  sign_reward_id: number
}): Promise<Result> => axiosInstance.post('/api/signActivity/sign', params)
