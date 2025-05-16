# 主题配置系统

## 概述

主题配置系统是一个集中管理不同渠道（Channel）UI 样式的解决方案。通过统一的配置管理，可以轻松实现不同渠道的样式切换，并确保良好的可扩展性。

## 配置结构

### 1. 页面背景配置 (PageBackgroundConfig)

```typescript
interface PageBackgroundConfig {
  backgroundImage: string // 背景图片
  backgroundColor: string // 背景颜色
}
```

### 2. 导航栏配置 (NavBarConfig)

```typescript
interface NavBarConfig {
  theme: 'black' | 'white' // 主题类型
  titleColor: string // 标题颜色
  extraColor: string // 额外按钮颜色
  backIconColor: string // 返回图标颜色
}
```

### 3. 信息内容配置 (InfoContentConfig)

```typescript
interface InfoContentConfig {
  nameColor: string // 名称颜色
  avatarBorderColor: string // 头像边框颜色
}
```

### 4. 输入框配置 (InputConfig)

```typescript
interface InputConfig {
  backgroundImage?: string // 背景图片
  backgroundColor: string // 背景颜色
  showIcon: boolean // 是否显示图标
  icon?: string // 图标路径
  textColor: string // 文本颜色
  placeholderColor: string // 占位符颜色
  borderColor?: string // 边框颜色
  copyButton: {
    backgroundImage?: string // 复制按钮背景图片
    backgroundColor: string // 复制按钮背景颜色
    textColor: string // 复制按钮文本颜色
  }
}
```

### 5. 按钮配置 (ButtonConfig)

```typescript
interface ButtonConfig {
  backgroundImage?: string // 背景图片
  backgroundColor: string // 背景颜色
  textColor: string // 文本颜色
  loadingColor: string // 加载图标颜色
}
```

### 6. 骨架屏配置 (SkeletonConfig)

```typescript
interface SkeletonConfig {
  backgroundColor: string // 背景颜色
  gradientStart: string // 渐变起始颜色
  gradientMiddle: string // 渐变中间颜色
  gradientEnd: string // 渐变结束颜色
}
```

## 使用方式

### 1. 获取主题配置

```typescript
import { getThemeConfig } from './model/theme'

// 获取指定渠道的完整主题配置
const themeConfig = getThemeConfig(channel)

// 获取特定组件的配置
const navBarConfig = themeConfig.navBar
const inputConfig = themeConfig.input
```

### 2. 在组件中使用

```typescript
// 在组件中获取配置
const currentConfig = computed(
  () => getThemeConfig(props.channel).componentName,
)

// 使用配置
const style = computed(() => ({
  color: currentConfig.value.textColor,
  backgroundColor: currentConfig.value.backgroundColor,
}))
```

## 添加新渠道

要添加新的渠道，只需在 `themeConfigMap` 中添加新的配置：

```typescript
export const themeConfigMap: Record<ChannelType, ThemeConfig> = {
  '1': {
    /* 现有配置 */
  },
  '2': {
    /* 现有配置 */
  },
  '3': {
    /* 现有配置 */
  },
  '4': {
    // 新渠道配置
    pageBackground: {
      backgroundImage: 'url(新背景图片)',
      backgroundColor: '新背景颜色',
    },
    navBar: {
      // ... 其他配置
    },
    // ... 其他组件配置
  },
}
```

## 注意事项

1. 所有颜色值应使用有效的 CSS 颜色格式
2. 图片路径应使用相对路径或完整的 URL
3. 确保所有必需的配置项都已提供
4. 使用 TypeScript 类型检查确保配置的完整性

## 最佳实践

1. 保持配置结构的一致性
2. 使用有意义的颜色变量
3. 确保配置的可维护性
4. 遵循 DRY（Don't Repeat Yourself）原则
5. 使用 TypeScript 类型系统确保类型安全
