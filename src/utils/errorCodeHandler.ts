import { showToast } from 'vant'
import i18n from '@/lang/i18n'

const { t } = i18n.global

export enum ErrShowType {
  ERROR = 1,
  WARNING = 2,
}

export const errValidateHandler = (code: string) => {
  if (isReqErr(code)) {
    onErrorAction(ErrShowType.WARNING, t('errCode.reqErr'))
    return false
  }

  return true
}

const isReqErr = (code: string) => code === '400000'

export const onErrorAction = (showType: ErrShowType, content: string) => {
  if (showType === ErrShowType.ERROR) {
    showToast(content)
  } else if (showType === ErrShowType.WARNING) {
    // TODO: WARNING 样式待补充
    showToast(content)
  }
}
