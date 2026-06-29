FROM node:22-alpine AS builder
WORKDIR /app
COPY arco-design-pro-vite/package*.json ./
RUN npm install --ignore-scripts
COPY arco-design-pro-vite/ .
RUN npx vite build --config ./config/vite.config.docker.ts

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
