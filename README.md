# 顺风搭 (ShunFengDa) - 拼车出行平台

## 项目结构

```
├── rideshare-app/          # 前端 H5/Web App (React + Vite + Tailwind)
├── rideshare-backend/      # 后端 API (NestJS + TypeORM + MySQL)
├── rideshare-admin/        # 管理后台 (Arco Design Pro Vue)
├── docker/
│   ├── mysql/init.sql      # 数据库初始化 SQL
│   └── nginx/nginx.conf    # Nginx 配置
├── docker-compose.yml      # 一键部署配置
└── .env                    # 环境变量
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 App | React 18 + TypeScript + Vite + Tailwind CSS 3 + shadcn/ui |
| 后端 API | NestJS 11 + TypeORM + MySQL 8 + JWT + Swagger |
| 管理后台 | Vue 3 + Arco Design Pro + Vite |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 部署 | Docker Compose + Nginx |

## 核心功能

- **注册/登录**：手机号 + 密码，JWT 认证
- **找顺风车**：多条件搜索（出发地/目的地/日期）
- **发布行程**：车主认证后可发布
- **预订行程**：一键预订，自动创建聊天
- **即时聊天**：司乘一对一消息
- **车主认证**：实名 + 车辆信息认证
- **管理后台**：用户/行程/车主管理，数据统计

## 演示账号

| 角色 | 手机号 | 密码 |
|------|--------|------|
| 车主 | 13800138001 | 123456 |
| 乘客 | 13700137003 | 123456 |
| 管理员 | 10000000000 | admin123456 |

## 本地开发

### 启动前端 App
```bash
cd rideshare-app
npm install
npm run dev       # http://localhost:5173
```

### 启动后端 API
```bash
cd rideshare-backend
npm install
# 确保本地 MySQL 已启动，配置 .env
npm run start:dev  # http://localhost:3000
# Swagger 文档: http://localhost:3000/api/docs
```

### 启动管理后台
```bash
cd rideshare-admin/arco-design-pro-vite
npm install --ignore-scripts
npm run dev       # http://localhost:4000
```

## Docker 部署（Coolify / 服务器）

```bash
# 复制环境变量模板
cp .env.example .env
# 修改 .env 中的密码和域名

# 一键启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f backend
```

### 服务端口

| 服务 | 端口 |
|------|------|
| 前端 App | :80 |
| 管理后台 | :4000 |
| 后端 API | :3000 |
| MySQL | :3306 |
| Redis | :6379 |

## API 文档

启动后端后访问：`http://localhost:3000/api/docs`

主要接口：
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/trips/search` - 搜索行程
- `POST /api/trips` - 发布行程
- `POST /api/bookings/:tripId` - 预订
- `GET /api/chats` - 消息列表
- `POST /api/driver/verify` - 车主认证
- `GET /api/admin/dashboard` - 后台统计（需管理员）
