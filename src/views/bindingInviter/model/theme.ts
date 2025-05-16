import type { ChannelType } from '../type/channel'
import bg1 from '../images/1/bg.png'
import bg2 from '../images/2/bg.png'
import icon1 from '../images/1/icon_game.png'
import icon2 from '../images/2/icon_game.png'
import inputBg1 from '../images/1/input_bg.png'
import inputBg2 from '../images/2/input_bg.png'
import btnSmall1 from '../images/1/btn_small.png'
import btnSmall2 from '../images/2/btn_small.png'
import btnLarge1 from '../images/1/btn_large.png'
import btnLarge2 from '../images/2/btn_large.png'

// 页面背景配置
export interface PageBackgroundConfig {
  backgroundImage: string
  backgroundColor: string
}

// 导航栏配置
export interface NavBarConfig {
  theme: 'black' | 'white'
  titleColor: string
  extraColor: string
  backIconColor: string
}

// 信息内容配置
export interface InfoContentConfig {
  nameColor: string
  avatarBorderColor: string
}

// 输入框配置
export interface InputConfig {
  backgroundImage?: string
  backgroundColor: string
  showIcon: boolean
  icon?: string
  textColor: string
  placeholderColor: string
  borderColor?: string
  copyButton: {
    backgroundImage?: string
    backgroundColor: string
    textColor: string
  }
}

// 按钮配置
export interface ButtonConfig {
  backgroundImage?: string
  backgroundColor: string
  textColor: string
  loadingColor: string
}

// 骨架屏配置
export interface SkeletonConfig {
  backgroundColor: string
  gradientStart: string
  gradientMiddle: string
  gradientEnd: string
}

// 主题配置
export interface ThemeConfig {
  pageBackground: PageBackgroundConfig
  navBar: NavBarConfig
  infoContent: InfoContentConfig
  input: InputConfig
  button: ButtonConfig
  skeleton: SkeletonConfig
}

// 主题配置映射
export const themeConfigMap: Record<ChannelType, ThemeConfig> = {
  '1': {
    pageBackground: {
      backgroundImage: `url(${bg1})`,
      backgroundColor: 'transparent',
    },
    navBar: {
      theme: 'white',
      titleColor: '#fff',
      extraColor: 'rgba(255, 255, 255, 0.7)',
      backIconColor: '#fff',
    },
    infoContent: {
      nameColor: '#fff',
      avatarBorderColor: '#e8e8e840',
    },
    input: {
      backgroundImage: inputBg1,
      backgroundColor: 'transparent',
      showIcon: true,
      icon: icon1,
      textColor: '#fff',
      placeholderColor: 'rgba(255, 255, 255, 0.3)',
      copyButton: {
        backgroundImage: btnSmall1,
        backgroundColor: 'transparent',
        textColor: '#000',
      },
    },
    button: {
      backgroundImage: btnLarge1,
      backgroundColor: 'transparent',
      textColor: '#000',
      loadingColor: '#000',
    },
    skeleton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      gradientStart: 'rgba(255, 255, 255, 0.1)',
      gradientMiddle: 'rgba(255, 255, 255, 0.2)',
      gradientEnd: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '2': {
    pageBackground: {
      backgroundImage: `url(${bg2})`,
      backgroundColor: 'transparent',
    },
    navBar: {
      theme: 'white',
      titleColor: '#fff',
      extraColor: 'rgba(255, 255, 255, 0.7)',
      backIconColor: '#fff',
    },
    infoContent: {
      nameColor: '#fff',
      avatarBorderColor: '#e8e8e840',
    },
    input: {
      backgroundImage: inputBg2,
      backgroundColor: 'transparent',
      showIcon: true,
      icon: icon2,
      textColor: '#fff',
      placeholderColor: 'rgba(255, 255, 255, 0.3)',
      copyButton: {
        backgroundImage: btnSmall2,
        backgroundColor: 'transparent',
        textColor: '#fff',
      },
    },
    button: {
      backgroundImage: btnLarge2,
      backgroundColor: 'transparent',
      textColor: '#fff',
      loadingColor: '#fff',
    },
    skeleton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      gradientStart: 'rgba(255, 255, 255, 0.1)',
      gradientMiddle: 'rgba(255, 255, 255, 0.2)',
      gradientEnd: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '3': {
    pageBackground: {
      backgroundImage: 'none',
      backgroundColor: '#fff',
    },
    navBar: {
      theme: 'black',
      titleColor: '#000',
      extraColor: '#000',
      backIconColor: '#000',
    },
    infoContent: {
      nameColor: '#000',
      avatarBorderColor: '#e8e8e840',
    },
    input: {
      backgroundColor: '#f5f5f5',
      showIcon: false,
      textColor: '#000',
      placeholderColor: '#bfbfbf',
      borderColor: '#000',
      copyButton: {
        backgroundColor: '#000',
        textColor: '#1aff62',
      },
    },
    button: {
      backgroundColor: '#000',
      textColor: '#1AFF62',
      loadingColor: '#1AFF62',
    },
    skeleton: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      gradientStart: 'rgba(0, 0, 0, 0.1)',
      gradientMiddle: 'rgba(0, 0, 0, 0.2)',
      gradientEnd: 'rgba(0, 0, 0, 0.1)',
    },
  },
}

// 获取主题配置
export const getThemeConfig = (channel: ChannelType): ThemeConfig => {
  return themeConfigMap[channel] || themeConfigMap['1']
}
