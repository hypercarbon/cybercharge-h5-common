FROM nginx:latest

EXPOSE 80

# 设置工作目录
# WORKDIR /var/www/html/gameboxplayweb

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /user/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]