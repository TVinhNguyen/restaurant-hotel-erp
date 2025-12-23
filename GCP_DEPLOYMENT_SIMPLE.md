# 🚀 Deploy trên Google Cloud - Compute Engine + Docker

**Ngày tạo:** December 22, 2025  
**Phương pháp:** 1 VM Instance (Ubuntu) + Docker Compose  
**Ước tính chi phí:** ~$45/tháng

---

## 📋 Tổng quan

### 🏗️ Kiến trúc

```
┌─────────────────────────────────────┐
│    Google Cloud Compute Engine       │
│          (Ubuntu 22 LTS)             │
├─────────────────────────────────────┤
│                                      │
│  Docker Compose Services:            │
│  ├─ Backend (NestJS)  → :4000        │
│  ├─ Frontend (Next)   → :3001        │
│  ├─ Admin (Vite)      → :3000        │
│  ├─ PostgreSQL        → :5432        │
│  └─ Redis             → :6379        │
│                                      │
│  Persistent Storage:                 │
│  ├─ Database volumes                 │
│  └─ Config files                     │
│                                      │
└─────────────────────────────────────┘
```

### ✅ Ưu điểm

- ✔️ **Đơn giản**: Tất cả trong 1 VM, dùng docker-compose.prod.yml
- ✔️ **Rẻ**: ~$45/tháng (cạnh tranh với VPS thường)
- ✔️ **Quen thuộc**: Giống như deploy trên Ubuntu Server
- ✔️ **Mềm dẻo**: Full control, có thể SSH vào tuỳ chỉnh
- ✔️ **Scaling**: Có thể nâng cấp VM khi cần

---

## 🔧 Step 1: Setup GCP Project

### 1.1 Tạo Project

1. Truy cập [console.cloud.google.com](https://console.cloud.google.com)
2. Click "Select Project" → "NEW PROJECT"
3. Tên: `restaurant-hotel-erp`
4. Click "CREATE" (chờ ~1 phút)

### 1.2 Bật APIs

Vào **APIs & Services → Enable APIs and Services**, search & enable:

```
✅ Compute Engine API
✅ Cloud Logging API
✅ Cloud Monitoring API
```

### 1.3 Cài Google Cloud CLI

**Windows:**
```powershell
# Download từ:
# https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

# Sau khi cài, restart PowerShell
gcloud --version
```

**Linux/Mac:**
```bash
curl https://sdk.cloud.google.com | bash
```

### 1.4 Authenticate

```bash
# Login
gcloud auth login

# Set project
gcloud config set project restaurant-hotel-erp

# Kiểm tra
gcloud config list
```

---

## 🖥️ Step 2: Tạo VM Instance

### 2.1 Tạo VM

```bash
gcloud compute instances create restaurant-hotel-vm \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-medium \
  --zone=asia-southeast1-a \
  --boot-disk-size=30GB
```

**Hoặc từ Console:**
- Compute Engine → Instances → Create Instance
- Machine Type: `e2-medium` (2 vCPU, 4GB RAM)
- Boot Disk: Ubuntu 22.04 LTS, 30GB
- Firewall: Allow HTTP & HTTPS

### 2.2 Reserve Static IP

```bash
# Tạo static IP
gcloud compute addresses create restaurant-hotel-ip \
  --region=asia-southeast1

# Xem IP
gcloud compute addresses describe restaurant-hotel-ip \
  --region=asia-southeast1

# Kết quả: ghi lại IP này, dùng sau
# Ví dụ: 34.101.234.123
```

### 2.3 Firewall Rules

```bash
# HTTP
gcloud compute firewall-rules create allow-http \
  --allow=tcp:80 \
  --source-ranges=0.0.0.0/0

# HTTPS
gcloud compute firewall-rules create allow-https \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0

# SSH (tự động có, không cần)
```

---

## 🔐 Step 3: SSH vào VM

```bash
# Cách 1: Qua gcloud CLI (recommended)
gcloud compute ssh restaurant-hotel-vm \
  --zone=asia-southeast1-a

# Cách 2: Qua Console
# - Compute Engine → Instances
# - Click VM name → SSH button
```

---

## 📦 Step 4: Cài Docker & Clone Code

**Chạy trên VM:**

```bash
# ===== SETUP DOCKER =====
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg git

# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group
sudo usermod -aG docker $USER
newgrp docker

# Kiểm tra
docker --version
docker compose version

# ===== CLONE CODE =====
git clone https://github.com/TVinhNguyen/restaurant-hotel-erp.git
cd restaurant-hotel-erp

# Checkout dev/main branch
git checkout dev
```

---

## ⚙️ Step 5: Setup Environment Variables

**Trên VM, tạo file `.env`:**

```bash
cat > .env << 'EOF'
# ===== DATABASE =====
DB_USERNAME=app
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DB_NAME=erp

# ===== JWT =====
JWT_SECRET=your_very_secure_jwt_secret_key_minimum_32_characters_change_this
JWT_EXPIRATION=1d

# ===== NEXTAUTH =====
NEXTAUTH_SECRET=your_nextauth_secret_key_minimum_32_characters_change_this
NEXTAUTH_URL=http://34.101.234.123:3000

# ===== API URLs =====
NEXT_PUBLIC_API_BASE=http://34.101.234.123:4000/api
NEXT_PUBLIC_API_URL=http://34.101.234.123:4000/api

# ===== NODE ENV =====
NODE_ENV=production
EOF
```

**⚠️ Thay:**
- `YOUR_SECURE_PASSWORD_HERE` → Mật khẩu ngẫu nhiên mạnh
- `34.101.234.123` → Static IP của bạn

---

## 🚀 Step 6: Chạy Docker Compose

**Trên VM:**

```bash
# Chạy services
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra trạng thái
docker-compose ps

# Xem logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Dừng (nếu cần)
docker-compose down
```

**Output thành công:**
```
CONTAINER ID   STATUS              PORTS
xxx            Up 2 minutes        postgres
xxx            Up 2 minutes        redis
xxx            Up 1 minute         0.0.0.0:4000->4000/tcp    backend
xxx            Up 1 minute         0.0.0.0:3001->3000/tcp    frontend
xxx            Up 1 minute         0.0.0.0:3000->3000/tcp    admin
```

---

## ✅ Step 7: Test Services

### Test từ Local Machine

```bash
# Backend API
curl http://34.101.234.123:4000/health/ping

# Frontend
# Truy cập browser: http://34.101.234.123:3001

# Admin Panel
# Truy cập browser: http://34.101.234.123:3000
```

### Test từ VM

```bash
gcloud compute ssh restaurant-hotel-vm --zone=asia-southeast1-a

# Kiểm tra containers
docker ps

# Check network
docker exec restaurant-hotel-backend curl http://localhost:4000/health/ping

# Check database
docker exec restaurant-hotel-postgres psql -U app -d erp -c "SELECT version();"
```

---

## 🔄 Step 8: Auto-Restart (Important!)

Nếu VM restart, containers sẽ stop. Setup tự động restart:

**Trên VM:**

```bash
# Tạo systemd service
sudo tee /etc/systemd/system/docker-compose.service > /dev/null <<'EOF'
[Unit]
Description=Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
WorkingDirectory=/home/$USER/restaurant-hotel-erp
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

# Enable & start
sudo systemctl daemon-reload
sudo systemctl enable docker-compose.service
sudo systemctl start docker-compose.service

# Kiểm tra status
sudo systemctl status docker-compose.service
```

---

## 📝 Step 9: Deploy Updates (Manual)

Khi có code mới trên GitHub:

```bash
# SSH vào VM
gcloud compute ssh restaurant-hotel-vm --zone=asia-southeast1-a

# Vào folder project
cd restaurant-hotel-erp

# Pull latest code
git pull origin dev

# Rebuild & restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra
docker-compose logs backend
```

---

## 📊 Monitoring & Logs

### View Logs từ GCP Console

```
Cloud Logging → Logs → resource.type=gce_instance
```

### View Logs từ VM

```bash
# Real-time backend logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail 100 backend

# Show timestamps
docker-compose logs -f --timestamps backend
```

### Monitor Resources

```bash
# Docker stats
docker stats

# VM resources (từ VM)
top
df -h
```

---

## 💾 Backup & Recovery

### Backup Database

```bash
# Từ VM
docker-compose exec postgres pg_dump -U app erp > backup-$(date +%Y%m%d).sql

# Upload to Cloud Storage
gsutil cp backup-*.sql gs://your-bucket/backups/
```

### Restore from Backup

```bash
# Từ VM
cat backup-20231222.sql | docker-compose exec -T postgres psql -U app erp
```

---

## 🛠️ Troubleshooting

### Container bị crash

```bash
# Xem logs chi tiết
docker-compose logs backend

# Restart service
docker-compose restart backend

# Full rebuild
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

### Database connection error

```bash
# Check PostgreSQL running
docker ps | grep postgres

# Test connection từ VM
docker-compose exec backend psql -h postgres -U app -d erp -c "SELECT 1"
```

### Port already in use

```bash
# Change port in docker-compose.prod.yml
# Hoặc kill process:
sudo lsof -i :4000
sudo kill -9 PID
```

### Insufficient disk space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Resize boot disk từ GCP Console
```

---

## 💰 Chi phí hàng tháng

| Item | Cost |
|------|------|
| Compute Engine (e2-medium) | $30 |
| Persistent Disk (30GB) | $1 |
| Network egress (100GB) | $12 |
| Static IP | $3 |
| **TOTAL** | **~$46** |

### Tiết kiệm chi phí

1. **Downsize** e2-medium → e2-small: Giảm 50%
2. **Stop VM** khi không dùng: Chỉ trả storage
3. **Cleanup**: Xóa snapshots, images cũ
4. **Committed Use**: 1 năm discount 25%, 3 năm discount 50%

---

## 📋 Checklist

- [ ] GCP Project created
- [ ] VM Instance created
- [ ] Static IP reserved
- [ ] Firewall rules setup
- [ ] Docker & Docker Compose installed
- [ ] Code cloned & .env setup
- [ ] docker-compose.prod.yml running
- [ ] All 5 services healthy
- [ ] Test APIs working
- [ ] Auto-restart configured
- [ ] Monitoring setup
- [ ] Backup strategy ready

---

## 🔗 Tài liệu tham khảo

- [GCP Compute Engine](https://cloud.google.com/compute/docs)
- [GCP Pricing](https://cloud.google.com/pricing/compute)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 💡 Tips

```bash
# Tiện lợi: Alias SSH
echo 'alias gcp-vm="gcloud compute ssh restaurant-hotel-vm --zone=asia-southeast1-a"' >> ~/.bashrc

# Sau đó: gcp-vm để login nhanh

# Monitor realtime
watch -n 2 'docker-compose ps'

# Backup tự động hàng ngày
crontab -e
# 0 2 * * * cd ~/restaurant-hotel-erp && docker-compose exec -T postgres pg_dump -U app erp > backup-$(date +\%Y\%m\%d).sql
```

---

**End of Guide**
