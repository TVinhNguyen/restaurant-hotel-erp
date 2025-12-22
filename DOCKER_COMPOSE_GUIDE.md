# 🐳 Docker Compose - Hướng dẫn sử dụng

## 📋 Các file Docker Compose có sẵn

- **`docker-compose.yml`** - File mặc định cho development (đơn giản)
- **`docker-compose.dev.yml`** - File development đầy đủ với hot-reload
- **`docker-compose.prod.yml`** - File production với optimizations

## 🚀 Cách chạy

### 1. Chạy tất cả services (Development)

```bash
# Sử dụng file mặc định
docker-compose up -d

# Hoặc chỉ định file cụ thể
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Xem logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. Dừng services

```bash
# Dừng nhưng giữ lại containers
docker-compose stop

# Dừng và xóa containers
docker-compose down

# Dừng và xóa cả volumes (cẩn thận: mất data!)
docker-compose down -v
```

### 4. Rebuild services

```bash
# Rebuild tất cả
docker-compose build

# Rebuild service cụ thể
docker-compose build backend

# Rebuild và restart
docker-compose up -d --build
```

## 🌐 Ports được sử dụng

| Service         | Port  | URL                      |
|-----------------|-------|--------------------------|
| Backend         | 4000  | http://localhost:4000    |
| Frontend        | 3001  | http://localhost:3001    |
| My Hotel Admin  | 3000  | http://localhost:3000    |
| PostgreSQL      | 5432  | localhost:5432           |
| Redis           | 6379  | localhost:6379           |

## 📦 Services bao gồm

1. **postgres** - PostgreSQL 16 database
2. **redis** - Redis 7 cache/session store
3. **backend** - NestJS API server
4. **frontend** - Next.js customer frontend
5. **my-hotel-admin** - Admin management panel

## 🔧 Cấu hình

Đảm bảo file `backend/.env` tồn tại với các biến môi trường cần thiết:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=app
DB_PASSWORD=app
DB_NAME=erp
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_secret_key
```

## 💡 Tips

### Chạy lệnh trong container

```bash
# Vào shell của backend
docker-compose exec backend sh

# Chạy migration
docker-compose exec backend npm run migration:run

# Chạy seed data
docker-compose exec backend npm run seed
```

### Xem trạng thái services

```bash
docker-compose ps
```

### Restart service cụ thể

```bash
docker-compose restart backend
```

### Xóa và tạo lại từ đầu

```bash
# Dừng và xóa tất cả
docker-compose down -v

# Xóa images (optional)
docker-compose down --rmi all

# Chạy lại từ đầu
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Port đã được sử dụng

Nếu port bị conflict, có thể thay đổi trong file `docker-compose.yml`:

```yaml
ports:
  - "4001:4000"  # Đổi 4000 -> 4001
```

### Container không start

```bash
# Xem logs chi tiết
docker-compose logs backend

# Kiểm tra health check
docker-compose ps
```

### Rebuild khi thay đổi package.json

```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

## 🔄 So sánh với cách chạy cũ

### Cách cũ (chạy từng thư mục)

```bash
# Terminal 1
cd infra
docker-compose up

# Terminal 2
cd backend
docker-compose up

# Terminal 3
cd frontend
npm run dev
```

### Cách mới (chạy tất cả từ root)

```bash
# Chỉ 1 lệnh
docker-compose up -d
```

## 📝 Lưu ý

- Lần đầu chạy sẽ lâu vì phải build images và download dependencies
- Data của PostgreSQL được lưu trong volume `postgres_data`
- Hot-reload được enable cho backend và frontend trong dev mode
- Sử dụng `docker-compose.prod.yml` cho production deployment
