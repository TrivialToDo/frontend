# Build
FROM node:19.8.1-alpine3.17 AS build

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories \
  && apk --no-cache add curl \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global --registry https://registry.npmjs.org pnpm \
  && pnpm config set registry https://registry.npmjs.org

WORKDIR /opt/trivialtodo

COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install --offline

RUN pnpm build

# Deploy
FROM nginx:1.23.3-alpine-slim

COPY ./nginx/trivialtodo.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/trivialtodo/dist /usr/share/nginx/trivialtodo

EXPOSE 80
