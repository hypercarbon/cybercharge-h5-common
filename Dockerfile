# 第一阶段：构建应用
FROM node:20.14.0 AS build
WORKDIR /build-app

# 将代码复制到容器中
COPY . .

# 安装 pnpm 并安装依赖
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 构建应用
RUN pnpm run build-only --mode production

# 第二阶段：部署到 nginx
FROM nginx:latest
EXPOSE 80

# 复制自定义 nginx 配置文件
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到 nginx html 目录
COPY --from=build /build-app/dist /usr/share/nginx/html

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]