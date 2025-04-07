import { createI18n } from 'vue-i18n'
import en from './en'
import vi from './vi'
import id from './id'
import ko from './ko'
import ru from './ru'
import es from './es'
import ja from './ja'
import th from './th'
import zhHant from './zh-Hant'

// 获取 URL 中的语言参数
const urlParams = new URLSearchParams(window.location.search)
const languageParam = urlParams.get('language')

// 如果 language 参数存在，设置到 localStorage 中
if (languageParam) {
  localStorage.setItem('language', languageParam)
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    vi,
    ru,
    ko,
    id,
    es,
    ja,
    th,
    'zh-hant': zhHant,
    'zh-Hant': zhHant,
  },
})

export default i18n
