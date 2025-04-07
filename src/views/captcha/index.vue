<template>
  <div class="captcha-container" @click.stop="handleClose">
    <div id="captcha-button">点击弹出验证码A</div>
    <div id="captcha-element"></div>
  </div>
</template>

<script setup lang="ts">
import { APP_LANGUAGE } from '@/config/constants'
import { sendEmailCode } from '@/services/captcha'
import nativeEvent, {
  type AliyunCaptcha,
  type CaptchaVerifyCallbackParams,
} from '@/utils/nativeEvent'
import { url } from 'inspector'
import {
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'

const captcha = ref(null)
const captchaButton = ref<HTMLElement | null>(null)
const language = ref('en')

const callbackParams = reactive<CaptchaVerifyCallbackParams>({
  url: '',
  params: '',
})

let observer: MutationObserver | null = null

onBeforeMount(() => {
  // getLang()
})

onMounted(() => {
  getLang()
  captchaButton.value = document.getElementById('captcha-button')

  // @ts-ignore
  window.initAliyunCaptcha({
    // 2fhzez7dn   19grhgsaa   1c64xzdyh 随机
    SceneId: getRandomString(), // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
    prefix: 't1ojkjd', // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
    mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
    element: '#captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
    button: '#captcha-button', // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
    captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
    onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数，无需修改
    getInstance: getInstance, // 绑定验证码实例函数，无需修改
    slideStyle: {
      width: 320,
      height: 40,
    }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
    language: language.value, // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
  })

  // 监听 DOM 变化，判断验证码是否已加载
  observeCaptchaInit()
})

onBeforeUnmount(() => {
  destroyAliyunCaptcha()
  stopObserving()
})

const handleClose = () => {
  close()
  destroyAliyunCaptcha()
  stopObserving()
}

const getRandomString = () => {
  // 拼图 '10ligh4jm', 滑块 '1pxe7a5rv', 图形 '15hf4pung'
  const strings = ['10ligh4jm', '1pxe7a5rv', '15hf4pung']
  return strings[Math.floor(Math.random() * strings.length)]
}

// 监听 `body` 变化，检测 `#aliyunCaptcha-mask` 是否加载
const observeCaptchaInit = () => {
  if (!window.MutationObserver) return

  observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const captchaMask = document.getElementById('aliyunCaptcha-mask')
        const captchaPopup = document.getElementById(
          'aliyunCaptcha-window-popup',
        )

        if (captchaMask && captchaPopup) {
          console.log('验证码已初始化，自动触发弹出')
          // @ts-ignore
          captcha.value?.show()
          // captchaButton.value?.click()
          stopObserving()
          break
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

// 停止监听 DOM 变化
const stopObserving = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

const getInstance = (instance: any) => {
  captcha.value = instance

  // nextTick(() => {
  //   setTimeout(() => {
  //     const closeButton = document.getElementById('aliyunCaptcha-btn-close')
  //     const mask = document.getElementById('aliyunCaptcha-mask')

  //     if (closeButton && mask) {
  //       closeButton.addEventListener('click', handleClose, true)
  //       mask.addEventListener('click', handleClose, true)
  //     }

  //     // if (mask) {
  //     //   mask.addEventListener('click', handleClose, true)
  //     // }
  //   }, 500) // 确保 DOM 元素已渲染
  // })

  nextTick(() => {
    // 使用MutationObserver替代setTimeout
    const observer = new MutationObserver(() => {
      const closeButton = document.getElementById('aliyunCaptcha-btn-close')
      const mask = document.getElementById('aliyunCaptcha-mask')

      if (closeButton) {
        closeButton.addEventListener('click', handleClose)
        observer.disconnect()
      }

      if (mask) {
        mask.addEventListener('click', handleClose)
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // 安全起见，设置超时作为后备
    setTimeout(() => {
      observer.disconnect()
    }, 1000)
  })
}

const captchaVerifyCallback = async (captchaVerifyParam: string) => {
  // console.log(captchaVerifyParam)
  try {
    const params: CaptchaVerifyCallbackParams = await new Promise(
      (resolve, reject) => {
        nativeEvent.getVerifyParams((p: CaptchaVerifyCallbackParams) => {
          if (p) resolve(p)
          else reject(new Error('getVerifyParams error'))
        })
      },
    )

    callbackParams.url = params.url
    callbackParams.params = params.params

    const res = await sendEmailCode({
      ...params,
      captchaVerifyParam: captchaVerifyParam,
    })
    // // 20011
    console.log(res)
    // 验证通过
    getVerifyResult({
      url: params.url,
      // result: JSON.stringify(res),
      result: res,
    })
    return {
      captchaResult: true,
      bizResult: true,
    }
  } catch (error) {
    // console.log('error = ', error)
    // console.log(callbackParams)
    // getVerifyResult({
    //   url: callbackParams.url,
    //   result: error,
    // })
    return {
      captchaResult: false,
      bizResult: false,
    }
  }
}
// 验证通过后调用
const onBizResultCallback = async () => {
  close()
  destroyAliyunCaptcha()
  stopObserving()
  console.log('onBizResultCallback')
}

const destroyAliyunCaptcha = () => {
  captchaButton.value = null

  // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
  document.getElementById('aliyunCaptcha-mask')?.remove()
  document.getElementById('aliyunCaptcha-window-popup')?.remove()
}

const getLang = () => {
  let lang

  if (localStorage.getItem(APP_LANGUAGE)) {
    lang = localStorage.getItem(APP_LANGUAGE)
    if (lang === 'zh-Hant') {
      language.value = 'tw'
    } else {
      language.value = 'en'
    }
  } else {
    language.value = 'en'
  }

  return lang
}

const getVerifyResult = (param: any) => {
  // @ts-ignore
  if (typeof AndroidInterface !== 'undefined') {
    // Android 原生接口
    // @ts-ignore
    AndroidInterface.getVerifyResult(JSON.stringify(param))
  } else if (
    typeof (window as any).webkit !== 'undefined' &&
    (window as any).webkit.messageHandlers['getVerifyResult']
  ) {
    // iOS 原生接口
    // @ts-ignore
    window.webkit.messageHandlers['getVerifyResult'].postMessage(
      JSON.stringify(param),
    )
  } else {
    console.warn(`Native interface for getVerifyResult not available.`)
  }
}

const close = () => {
  // @ts-ignore
  if (typeof AndroidInterface !== 'undefined') {
    // Android 原生接口
    // @ts-ignore
    AndroidInterface.close()
  } else if (
    typeof (window as any).webkit !== 'undefined' &&
    (window as any).webkit.messageHandlers['close']
  ) {
    // iOS 原生接口
    // @ts-ignore
    window.webkit.messageHandlers['close'].postMessage({})
  } else {
    console.warn(`Native interface for close not available.`)
  }
}
</script>

<style scoped>
.captcha-container {
  height: 100vh;
  padding-top: 250px;
}
#captcha-button {
  margin: 0 auto;
  z-index: 99;
  width: 150px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  background-color: hsla(160, 100%, 37%, 1);
  color: #fff;
  padding: 8px 0;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  opacity: 0;
}
</style>

<style>
#aliyunCaptcha-sliding-slider {
  /* background-color: #9059ff !important; */
}
</style>
