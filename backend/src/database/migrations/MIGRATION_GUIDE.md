# Database Migration Guide

## Overview

Chúng tôi đã chuyển đổi từ các SQL files thô sang TypeORM Migrations để quản lý database schema một cách có kiểm soát và có thể tracking.

## Migration Files

Các migration được tạo theo thứ tự hợp lý:

### 1. **InitialSchema** (1701700000000)
- Tạo tất cả schemas: `auth`, `core`, `inventory`, `reservation`, `restaurant`, `hr`
- Tạo tất cả bảng cơ bản với Foreign Keys và Constraints
- Bao gồm indexes ban đầu từ `pms_init.sql`
- **Thứ tự bảng**: Auth → Core → Inventory → Reservation → Restaurant → HR

### 2. **AddConstraints** (1701700001000)
- Thêm Foreign Key còn thiếu cho `employee_roles.property_id`
- Thêm cột `booked_by_user_id` cho `table_bookings`
- Thêm constraints logic: check dates, unique values, etc.
- Thêm indexes bổ sung cho performance

### 3. **AlterProperties** (1701700002000)
- Xóa các cột `check_in_time` và `check_out_time` từ `properties`
- Đơn giản hóa schema properties

### 4. **UpdateEmployeeStructure** (1701700003000)
- Thêm cột `position` cho employees
- Cập nhật enum `department`:
  - Cũ: `Front Desk`, `Housekeeping`, `HR`, `F&B`
  - Mới: `IT Department`, `Human Resources`, `Marketing`, `Finances`, `Sales`
- Mapping dữ liệu cũ sang mới (có thể tùy chỉnh)

### 5. **AddComprehensiveIndexes** (1701700004000)
- Tạo tất cả indexes còn lại từ `add_indexes.sql`
- 60+ indexes cho performance optimization
- Composite indexes cho common queries

## Cách sử dụng

### 1. Lần đầu triển khai (Database mới)

```bash
cd backend

# Chạy tất cả migrations
npm run migration:run

# Kiểm tra status
npm run migration:show
```

### 2. Nếu database đã có dữ liệu (Database cũ)

**Lựa chọn A: Backup và migrate**

```bash
# Backup database trước
pg_dump -U hotel_user_v2 -d hotel_pms_v2 > backup_$(date +%Y%m%d_%H%M%S).sql

# Chạy migrations
npm run migration:run

# Nếu có lỗi, hoàn tác
npm run migration:revert
```

**Lựa chọn B: Sync từ schema hiện tại**

```bash
# Tạo migration mới để đồng bộ schema hiện tại
npm run migration:generate -- src/database/migrations/SyncExistingSchema

# Review file migration vừa tạo
# Chạy
npm run migration:run
```

### 3. Phát triển (Thêm/sửa schema)

```bash
# Sau khi sửa entities, tạo migration tự động
npm run migration:generate -- src/database/migrations/YourMigrationName

# Hoặc tạo migration trống để viết SQL custom
npm run migration:create -- src/database/migrations/YourMigrationName

# Chạy migration
npm run migration:run
```

## Các lệnh thông dụng

```bash
# Chạy tất cả migrations pending
npm run migration:run

# Hoàn tác migration cuối cùng
npm run migration:revert

# Xem tất cả migrations (executed + pending)
npm run migration:show

# Chạy migration cụ thể
npm run typeorm -- migration:run -t <migration-name>

# Hoàn tác migration cụ thể
npm run typeorm -- migration:revert -t <migration-name>
```

## Troubleshooting

### Migration failed
```bash
# Hoàn tác
npm run migration:revert

# Fix SQL/code
# Chạy lại
npm run migration:run
```

### Kiểm tra migrations đã chạy
```bash
psql -U hotel_user_v2 -d hotel_pms_v2 -c "SELECT * FROM typeorm_migrations ORDER BY timestamp DESC;"
```

### Rollback toàn bộ (Restore từ backup)
```bash
psql -U hotel_user_v2 -d hotel_pms_v2 < backup_file.sql
```

## Production Deployment

1. **Backup database**
   ```bash
   pg_dump -U hotel_user_v2 -d hotel_pms_v2 > backup_prod_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Kiểm tra migrations pending**
   ```bash
   npm run migration:show
   ```

3. **Chạy migrations**
   ```bash
   npm run migration:run
   ```

4. **Verify application**
   ```bash
   npm run start:prod
   ```

## Chuyển đổi từ cách cũ

### Cách cũ (Không dùng nữa)
```bash
psql -U hotel_user_v2 -d hotel_pms_v2 -f backend/db/pms_init.sql
psql -U hotel_user_v2 -d hotel_pms_v2 -f backend/db/update_db.sql
psql -U hotel_user_v2 -d hotel_pms_v2 -f backend/db/add_indexes.sql
```

### Cách mới (Dùng)
```bash
cd backend
npm run migration:run
```

## Lợi ích của TypeORM Migrations

✅ **Version Control** - Tracking tất cả database changes  
✅ **Atomic** - Tất cả changes trong migration là atomic (tất cả thành công hoặc tất cả thất bại)  
✅ **Reversible** - Có thể rollback nếu có lỗi  
✅ **Repeatable** - Có thể deploy trên multiple environments  
✅ **CI/CD Ready** - Dễ integrate vào deployment pipeline  
✅ **Self-Documenting** - Migration files là tài liệu của schema changes  

## Migration Naming Convention

Khi tạo migrations mới, sử dụng format:
```
AddXxxFeature
CreateXxxTable
UpdateXxxColumn
RemoveXxxConstraint
AlterXxxTable
```

Ví dụ:
```bash
npm run migration:generate -- src/database/migrations/AddUserPasswordReset
npm run migration:generate -- src/database/migrations/CreateAuditTable
npm run migration:generate -- src/database/migrations/UpdateReservationStatus
```

---

**Tác giả**: Restaurant-Hotel ERP Team  
**Cập nhật**: November 16, 2025
