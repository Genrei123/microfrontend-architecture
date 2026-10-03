ARG APP

FROM node:24-alpine AS build

ARG APP
WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

WORKDIR /workspace/apps/${APP}

COPY apps/${APP}/package.json apps/${APP}/package-lock.json ./
RUN npm ci

COPY apps/${APP}/ ./
RUN /workspace/node_modules/.bin/tailwindcss -i src/tailwind.input.css -o src/tailwind.generated.css \
  && npm run build

FROM nginx:1.29-alpine

ARG APP

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/${APP}/dist /usr/share/nginx/html

EXPOSE 80
