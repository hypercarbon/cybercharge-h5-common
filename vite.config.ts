import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// @ts-ignore
import postCssPxToViewport from 'postcss-px-to-viewport'
import { viteMockServe } from 'vite-plugin-mock'
import postcssNesting from 'postcss-nesting'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
  server: {
    host: '0.0.0.0',
  },
  build: {
    // sourcemap: true,
    // minify: 'terser',
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        postcssNesting,
        postCssPxToViewport({
          viewportWidth: 375, // 设计稿的视口宽度
          // viewportHeight: 667, // 设计稿的视口高度
          unitPrecision: 5, // 保留小数位数
          viewportUnit: 'vw', // 视口单位
          // selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'], // 不转换的类名
          minPixelValue: 1, // 小于或等于1px的不转换
          mediaQuery: false, // 允许媒体查询中转换
        }),
      ],
    },
  },
})
