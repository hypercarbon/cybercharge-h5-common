export enum ToastType {
  SUCCESS = 'success',
  FAILURE = 'FAILURE',
}

export interface AliyunCaptcha {
  sceneId: string
  certifyId: string
  deviceToken: string
}
export interface NativeUploadResult {
  path: Array<string>
  error: string
}
export interface CaptchaVerifyCallbackParams {
  url: string // 请求地址
  params: string | object // 参数的JSON字符串
}

interface NativeEventInterface {
  openUrl: (params: Record<string, any>) => void
  close: () => void
  showToast: ({ type, message }: { type: ToastType; message: string }) => void
  showGameGuide: () => void
  getVerifyResult: ({ sceneId, certifyId, deviceToken }: any) => void
  getVerifyParams: (
    callback: (params: CaptchaVerifyCallbackParams) => void,
  ) => void
  uploadImageFromAlbum: (
    callbackName: string,
    callback: (uploadUrl: NativeUploadResult) => void,
  ) => void
  // 可以继续添加其他方法
}

// 通用的原生调用函数
function invokeNativeMethod(methodName: string, params: any = null) {
  // @ts-ignore
  if (typeof AndroidInterface !== 'undefined') {
    // Android 原生接口
    // @ts-ignore
    AndroidInterface[methodName](JSON.stringify(params))
  } else if (
    typeof (window as any).webkit !== 'undefined' &&
    (window as any).webkit.messageHandlers[methodName]
  ) {
    // iOS 原生接口
    // @ts-ignore
    window.webkit.messageHandlers[methodName].postMessage(params)
  } else {
    console.warn(`Native interface for ${methodName} not available.`)
  }
}

// 生成回调 ID
function generateCallbackId(callbackName: string) {
  return (
    `callback_${callbackName}` + '_' + Math.random().toString(36).substring(2)
  )
}

// 封装后的调用接口
const nativeEvent: NativeEventInterface = {
  openUrl(params) {
    invokeNativeMethod('openUrl', params)
  },

  getVerifyResult(params) {
    invokeNativeMethod('getVerifyResult', JSON.stringify(params))
  },

  close() {
    invokeNativeMethod('close')
  },

  showToast({ type, message }) {
    invokeNativeMethod('showToast', { type, message })
  },

  showGameGuide() {
    invokeNativeMethod('showGameGuide')
  },

  // 获取验证码参数
  getVerifyParams(callback: (params: CaptchaVerifyCallbackParams) => void) {
    const callbackId = generateCallbackId('getVerifyParams')

    ;(window as any).APP = (window as any).APP || {}

    // 将回调函数注册到 window 对象上
    ;(window as any).APP[callbackId] = (
      callbackResult: CaptchaVerifyCallbackParams,
    ) => {
      let params
      typeof callbackResult.params === 'string'
        ? (params = JSON.parse(callbackResult.params))
        : (params = callbackResult.params)

      console.log({ ...callbackResult, ...params })
      console.log(callbackResult)

      // 调用回调函数
      // callback({ ...callbackResult, ...params })
      callback({ url: callbackResult.url, params: params })
      // 清理回调函数
      delete (window as any)[callbackId]
    }

    // 调用原生方法，并传递回调名称
    invokeNativeMethod('getVerifyParams', { callBack: callbackId })
  },

  // 修改上传方法，接受回调函数
  uploadImageFromAlbum(callbackName: string, callback: (data: any) => void) {
    const callbackId = generateCallbackId(callbackName)

    ;(window as any).APP = (window as any).APP || {}

    // 将回调函数注册到 window 对象上
    ;(window as any).APP[callbackId] = (callbackResult: NativeUploadResult) => {
      // 调用回调函数
      callback(callbackResult)
      // 清理回调函数
      delete (window as any)[callbackId]
    }

    // 调用原生方法，并传递回调名称
    invokeNativeMethod(callbackName, { callBack: callbackId })
  },

  // 如果有其他原生方法，可以继续添加
}

export default nativeEvent
