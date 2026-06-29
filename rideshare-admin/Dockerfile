FROM node:22-alpine AS builder
WORKDIR /app
COPY arco-design-pro-vite/package*.json ./
RUN npm ci
COPY arco-design-pro-vite/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
