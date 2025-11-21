# 🚀 Deployment Guide - Ubuntu Server

Hướng dẫn deploy Restaurant-Hotel ERP lên Ubuntu Server bằng Docker Compose.

---

## 📋 Yêu Cầu Server

- **OS**: Ubuntu 20.04 / 22.04 / 24.04 LTS
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **CPU**: 2 cores trở lên
- **Disk**: 20GB trống
- **Port mở**: 4000 (API), 3000 (Admin), 3001 (Frontend)

---

## 🔧 Bước 1: Cài Đặt Docker & Docker Compose

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt các gói cần thiết
sudo apt install -y ca-certificates curl gnupg lsb-release git

# Thêm Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Thêm Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Kiểm tra cài đặt
docker --version
docker compose version

# Thêm user vào docker group (không cần sudo mỗi lần)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📥 Bước 2: Clone Repository

```bash
# Clone code từ GitHub
git clone https://github.com/TVinhNguyen/restaurant-hotel-erp.git
cd restaurant-hotel-erp

# Checkout nhánh dev (hoặc main)
git checkout dev
```

---

## ⚙️ Bước 3: Cấu Hình Environment

```bash
# Tạo file .env
nano .env
```

Nhập nội dung sau (thay đổi các giá trị bí mật):

```env
# Database
DB_USERNAME=app
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
DB_NAME=erp

# JWT (đổi sang chuỗi ngẫu nhiên dài ít nhất 32 ký tự)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_change_in_production
JWT_EXPIRATION=1d

# CORS (để trống = cho phép tất cả nguồn)
CORS_ORIGINS=

# NextAuth
NEXTAUTH_SECRET=another_secret_key_for_nextauth_minimum_32_chars
NEXTAUTH_URL=http://YOUR_SERVER_IP:3000

# API URLs
API_BASE=http://YOUR_SERVER_IP:4000/api
```

**Lưu file:** `Ctrl + O`, `Enter`, `Ctrl + X`

---

## 🐳 Bước 4: Deploy với Docker Compose

```bash
# Build và khởi động tất cả services
docker compose -f docker-compose.prod.yml up -d --build

# Xem trạng thái containers
docker compose -f docker-compose.prod.yml ps

# Theo dõi logs
docker compose -f docker-compose.prod.yml logs -f
```

Đợi khoảng 2-3 phút để tất cả services khởi động.

---

## 🔍 Bước 5: Kiểm Tra

```bash
# Test backend health
curl http://localhost:4000/health/ping
# Kết quả: {"message":"Pong","status":"ok"}

# Kiểm tra tất cả containers
docker ps
# Tất cả phải có status "Up (healthy)"
```

**Truy cập từ browser:**
- Backend API: `http://YOUR_SERVER_IP:4000/api`
- Swagger Docs: `http://YOUR_SERVER_IP:4000/api/docs`
- Admin Panel: `http://YOUR_SERVER_IP:3000`
- Frontend: `http://YOUR_SERVER_IP:3001`

---

## 🌐 Bước 6: Mở Firewall

```bash
# Mở các ports cần thiết
sudo ufw allow 4000/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

# Kiểm tra firewall
sudo ufw status
```

---

## 👤 Bước 7: Tạo Admin User

### Cách 1: Qua Swagger UI

1. Mở `http://YOUR_SERVER_IP:4000/api/docs`
2. Tìm `POST /api/v1/auth/register`
3. Click **Try it out**, nhập:
   ```json
   {
     "email": "admin@example.com",
     "password": "Admin@123456",
     "fullName": "System Admin"
   }
   ```
4. Click **Execute**

### Cách 2: Qua Database

```bash
# Truy cập PostgreSQL
docker exec -it hotel-pms-db psql -U app -d erp

# Tạo user (password: Admin@123456)
INSERT INTO auth.users (id, email, password, full_name, role, is_active)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
  'System Admin',
  'admin',
  true
);

# Thoát
\q
```

---

## 🔄 Quản Lý Services

```bash
# Dừng tất cả services
docker compose -f docker-compose.prod.yml down

# Khởi động lại
docker compose -f docker-compose.prod.yml up -d

# Restart một service
docker compose -f docker-compose.prod.yml restart backend

# Xem logs
docker compose -f docker-compose.prod.yml logs -f backend

# Xem resource usage
docker stats
```

---

## 🔄 Update Code Mới

```bash
# Pull code mới
git pull origin dev

# Rebuild và restart
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 💾 Backup Database

```bash
# Tạo thư mục backup
mkdir -p ~/backups

# Backup database
docker exec hotel-pms-db pg_dump -U app erp | gzip > ~/backups/erp_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore database
gunzip -c ~/backups/erp_YYYYMMDD_HHMMSS.sql.gz | docker exec -i hotel-pms-db psql -U app erp
```

### Backup Tự Động (Cron Job)

```bash
# Tạo script backup
cat > /usr/local/bin/erp-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/erp"
mkdir -p $BACKUP_DIR
docker exec hotel-pms-db pg_dump -U app erp | gzip > $BACKUP_DIR/db_$(date +%Y%m%d_%H%M%S).sql.gz
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
EOF

# Cấp quyền
sudo chmod +x /usr/local/bin/erp-backup.sh

# Setup cron (chạy mỗi ngày 2:00 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/erp-backup.sh") | crontab -
```

---

## 🔐 Security Checklist

- [ ] Đã đổi `JWT_SECRET` trong `.env`
- [ ] Đã đổi `NEXTAUTH_SECRET` trong `.env`  
- [ ] Đã đổi `DB_PASSWORD` thành mật khẩu mạnh
- [ ] Đã cấu hình firewall (ufw)
- [ ] Đã setup backup tự động
- [ ] Đã tạo admin user
- [ ] Đã test API qua Swagger

---

## 🐛 Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker compose -f docker-compose.prod.yml logs backend

# Rebuild từ đầu
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build
```

### Database connection error

```bash
# Kiểm tra PostgreSQL
docker compose -f docker-compose.prod.yml ps postgres

# Test kết nối
docker exec -it hotel-pms-db psql -U app -d erp -c "SELECT 1;"
```

### Port đã được sử dụng

```bash
# Tìm process đang dùng port
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>
```

---

## 📞 Support

GitHub Issues: https://github.com/TVinhNguyen/restaurant-hotel-erp/issues

---

**Last Updated:** November 20, 2025

**Last Updated:** November 20, 2025
