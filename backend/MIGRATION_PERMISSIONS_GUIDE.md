# Hướng dẫn chạy Migration cho Permission & Role Permission

## 📋 Tổng quan
Migration này tạo bảng `permissions` và `role_permissions` để quản lý hệ thống phân quyền chi tiết.

## 🐳 Chạy Migration với Docker

### Bước 1: Khởi động services
```bash
cd /home/thahvinh/Desktop/Project_S/restaurant-hotel-erp

# Khởi động tất cả services (nếu chưa chạy)
docker-compose up -d
```

### Bước 2: Chạy migration
```bash
# Chạy migration
docker-compose exec backend pnpm run migration:run

# Hoặc nếu dùng production compose
docker-compose -f docker-compose.prod.yml exec backend pnpm run migration:run
```

### Bước 3: Kiểm tra kết quả
```bash
# Vào PostgreSQL để kiểm tra
docker-compose exec db psql -U hotel_user_v2 -d hotel_pms_v2

# Kiểm tra bảng permissions
\dt auth.*

# Xem dữ liệu permissions
SELECT slug, name, module FROM auth.permissions ORDER BY module, slug;

# Xem role permissions đã được gán
SELECT r.name as role, p.slug as permission 
FROM auth.role_permissions rp
JOIN auth.roles r ON r.id = rp.role_id
JOIN auth.permissions p ON p.id = rp.permission_id
ORDER BY r.name, p.module, p.slug;

# Thoát
\q
```

## 💻 Chạy Migration Local (không dùng Docker)

### Bước 1: Cài đặt dependencies
```bash
cd backend
pnpm install
```

### Bước 2: Cấu hình database
Đảm bảo file `.env` có đúng thông tin database:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=hotel_user_v2
DB_PASSWORD=123456
DB_NAME=hotel_pms_v2
```

### Bước 3: Chạy migration
```bash
pnpm run migration:run
```

## 🔄 Các lệnh Migration khác

### Xem trạng thái migrations
```bash
docker-compose exec backend pnpm run migration:show
```

### Revert migration (rollback)
```bash
# Rollback migration gần nhất
docker-compose exec backend pnpm run migration:revert
```

### Tạo migration mới (nếu cần)
```bash
# Tự động generate migration từ entity changes
docker-compose exec backend pnpm run migration:generate -- -n MigrationName

# Tạo migration trống
docker-compose exec backend pnpm run migration:create -- -n MigrationName
```

## 📊 Dữ liệu mẫu được tạo

Migration này tự động tạo **43 permissions** được phân loại theo modules:

### System (7 permissions)
- user.view, user.create, user.edit, user.delete
- role.view, role.manage
- permission.assign

### FrontDesk (15 permissions)
- property.*, room.*, roomtype.*, reservation.*, payment.*, guest.*

### Housekeeping (2 permissions)
- housekeeping.view, housekeeping.update

### F&B (5 permissions)
- restaurant.*, tablebooking.*

### HR (8 permissions)
- employee.*, attendance.*, leave.*, payroll.*

### Reports (4 permissions)
- report.occupancy, report.revenue, report.guest, report.staff

### Phân quyền mặc định cho Roles:
- **Chain Admin**: Tất cả permissions
- **Property Manager**: Hầu hết permissions (trừ system admin)
- **Receptionist**: Chỉ front desk operations

## ✅ Kiểm tra API sau khi chạy migration

```bash
# Lấy access token (login)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Export token
export TOKEN="<your_access_token>"

# Test Permissions API
curl http://localhost:3000/permissions \
  -H "Authorization: Bearer $TOKEN"

# Test Roles API
curl http://localhost:3000/roles \
  -H "Authorization: Bearer $TOKEN"

# Test Role Permissions API
curl http://localhost:3000/roles/<role_id>/permissions \
  -H "Authorization: Bearer $TOKEN"
```

## 🚨 Troubleshooting

### Lỗi: "relation already exists"
Migration đã chạy rồi. Kiểm tra:
```bash
docker-compose exec backend pnpm run migration:show
```

### Lỗi: "Cannot find module"
Rebuild Docker image:
```bash
docker-compose down
docker-compose build backend
docker-compose up -d
```

### Lỗi: Database connection
Kiểm tra database đã chạy:
```bash
docker-compose ps
docker-compose logs db
```

## 🌱 Chạy Seed Data (Dữ liệu mẫu)

Seed sẽ tạo dữ liệu mẫu bao gồm: roles, users, properties, rooms, reservations, employees, restaurants, etc.

### ⚠️ Lưu ý: Seed sẽ XÓA toàn bộ dữ liệu hiện có!

### Chạy Seed với Docker:
```bash
# Chạy seed
docker-compose exec backend pnpm run seed

# Hoặc với production
docker-compose -f docker-compose.prod.yml exec backend pnpm run seed
```

### Chạy Seed Local:
```bash
cd backend
pnpm run seed
```

### Kiểm tra dữ liệu sau khi seed:
```bash
# Vào database
docker-compose exec db psql -U hotel_user_v2 -d hotel_pms_v2

# Kiểm tra số lượng records
SELECT 'users' as table_name, COUNT(*) FROM auth.users
UNION ALL
SELECT 'roles', COUNT(*) FROM auth.roles
UNION ALL
SELECT 'permissions', COUNT(*) FROM auth.permissions
UNION ALL
SELECT 'properties', COUNT(*) FROM core.properties
UNION ALL
SELECT 'employees', COUNT(*) FROM core.employees
UNION ALL
SELECT 'guests', COUNT(*) FROM core.guests
UNION ALL
SELECT 'rooms', COUNT(*) FROM inventory.rooms
UNION ALL
SELECT 'reservations', COUNT(*) FROM reservation.reservations;

# Xem admin user để login
SELECT email, name FROM auth.users WHERE email = 'admin@example.com';
-- Password: password123
```

### Verify dữ liệu seed:
```bash
# Script verify có sẵn
docker-compose exec backend ts-node src/database/seeds/verify.ts
```

### Inspect dữ liệu:
```bash
# Script inspect để xem chi tiết
docker-compose exec backend ts-node src/database/seeds/inspect.ts
```

## 🔄 Quy trình đầy đủ (Setup từ đầu)

```bash
# 1. Khởi động services
docker-compose up -d

# 2. Chạy migrations (tạo schema)
docker-compose exec backend pnpm run migration:run

# 3. Chạy seed (tạo dữ liệu mẫu)
docker-compose exec backend pnpm run seed

# 4. Kiểm tra
docker-compose exec backend pnpm run migration:show

# 5. Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## 📝 Lưu ý quan trọng

1. **Backup trước khi chạy migration** (production):
   ```bash
   docker-compose exec db pg_dump -U hotel_user_v2 hotel_pms_v2 > backup_$(date +%Y%m%d).sql
   ```

2. **Migration là một chiều**: Chỉ rollback khi thực sự cần thiết

3. **Kiểm tra kỹ trước khi deploy production**

4. **Seed data chỉ dùng cho development**: KHÔNG chạy seed trên production!

5. **Thứ tự quan trọng**: 
   - Chạy migration trước
   - Chạy seed sau (nếu cần dữ liệu mẫu)

6. **Default admin credentials** (sau khi seed):
   - Email: `admin@example.com`
   - Password: `password123`
