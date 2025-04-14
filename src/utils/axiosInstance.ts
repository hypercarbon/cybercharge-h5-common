// import useMessage from '@/components/GMessage/useMessage'
import { API_BASE_URL, USER_TOKEN, APP_LANGUAGE } from '@/config/constants'
import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'
import qs from 'qs'
import i18n from '@/lang/i18n'
import { errValidateHandler } from './errorCodeHandler'
import { showFailToast, showToast } from 'vant'
import nativeEvent, { ToastType } from './nativeEvent'
import type { ApiError } from '@/types/utils'

// const message = useMessage()

const axiosConfig: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,
  timeout: 60000,
  paramsSerializer: {
    serialize: params => {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    },
  },
}

const instance: AxiosInstance = axios.create(axiosConfig)

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem(USER_TOKEN)
    const language = localStorage.getItem(APP_LANGUAGE)

    // 有token传token，没有传空，否则后端报未知异常
    config.headers['Authorization'] = token ? `Bearer ${token}` : ''
    config.headers['locale'] = language ? language : 'en'
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

const { t } = i18n.global
instance.interceptors.response.use(
  response => {
    const { code, msg } = response.data
    const config: any = response.config

    // 如果 code !== 0 并且没有禁用默认的 Toast 提示
    if (code !== 0 && config?.showToast !== false) {
      // nativeEvent.showToast({
      //   type: ToastType.FAILURE,
      //   message: msg || t('errCode.commonErr'),
      // })
    }

    // 业务自行处理错误
    if (code !== 0) {
      return Promise.reject(response.data)
    }

    return response.data
  },
  (error: unknown) => {
    // showFailToast(t('errCode.commonErr'))
    // http 错误码处理 error.response && error.response.status
    nativeEvent.showToast({
      type: ToastType.FAILURE,
      message: t('errCode.commonErr'),
    })
    return Promise.reject(error)
  },
)

export default instance
