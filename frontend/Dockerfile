# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve via nginx, and proxy /api to backend through edge-nginx (or directly to license-app)
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
# nginx that serves SPA + proxies /api to license-app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

