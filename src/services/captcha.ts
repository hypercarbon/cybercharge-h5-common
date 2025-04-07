import type { Result } from '@/types/utils'
import axiosInstance from '@/utils/axiosInstance'
import type { CaptchaVerifyCallbackParams } from '@/utils/nativeEvent'

interface CaptchaRequestParams {
  captchaVerifyParam: string
}

export const sendEmailCode = (
  params: CaptchaVerifyCallbackParams & CaptchaRequestParams,
): Promise<Result> => {
  console.log(params)
  const reqParams = Object.assign({}, params.params, {
    captchaVerifyParam: params.captchaVerifyParam,
  })
  return axiosInstance.post(params.url, reqParams)
}

export const sendCode = (params: {
  email: string
  captchaVerifyParam: string
}): Promise<
  Result<{
    verificationCode: string
  }>
> => {
  return axiosInstance.post('/api/user/sendEmailVerificationCode', params)
}
