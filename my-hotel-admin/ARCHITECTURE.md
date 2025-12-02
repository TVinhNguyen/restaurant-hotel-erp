# 🏨 My Hotel Admin - Kiến trúc & Phân quyền

## 📋 Tổng quan dự án

**My Hotel Admin** là ứng dụng quản trị khách sạn được xây dựng trên nền tảng [Refine](https://refine.dev/) - một React framework mạnh mẽ dành cho các ứng dụng CRUD và quản trị.

### Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 19.1.0 | UI Library |
| Refine | 5.0.0 | Admin Framework |
| Ant Design | 5.23.0 | UI Components |
| React Router | 7.0.2 | Routing |
| Vite | 6.3.5 | Build Tool |
| TypeScript | 5.8.3 | Type Safety |

---

## 📁 Cấu trúc thư mục

```
src/
├── App.tsx                    # Entry point, cấu hình Refine & Routes
├── index.tsx                  # ReactDOM render
├── authProvider.ts            # Xử lý xác thực (login, logout, check)
├── accessControlProvider.ts   # Kiểm soát quyền truy cập (RBAC)
├── vite-env.d.ts
│
├── components/               # Components dùng chung
│   ├── header/               # Header component
│   └── layout/               # Layout component (Title, Sider)
│
├── contexts/                 # React Contexts
│   └── color-mode/           # Theme dark/light mode
│
├── language/                 # Đa ngôn ngữ
│   └── language-map.ts
│
├── pages/                    # Các trang chức năng
│   ├── dashboards/           # Dashboard theo role
│   │   ├── admin.tsx         # Dashboard cho Admin
│   │   └── front-desk.tsx    # Dashboard cho Front Desk
│   ├── dat-phong/            # Quản lý đặt phòng (CRUD)
│   ├── khach-hang/           # Quản lý khách hàng (CRUD)
│   ├── check-in/             # Xử lý check-in
│   ├── check-out/            # Xử lý check-out
│   ├── phong/                # Quản lý phòng
│   ├── thanh-toan/           # Quản lý thanh toán
│   ├── login/                # Trang đăng nhập
│   ├── register/             # Trang đăng ký
│   ├── forgotPassword/       # Quên mật khẩu
│   ├── profile/              # Thông tin cá nhân
│   └── property/             # Thông tin cơ sở
│
├── providers/                # Data providers
│   └── dataProvider.ts       # Kết nối API backend
│
├── types/                    # TypeScript types
│   └── auth.ts               # Types cho auth & user
│
└── utils/                    # Utilities
    ├── api.ts                # API helper functions
    ├── permissions.ts        # Permission constants
    └── resources.tsx         # Resource definitions
```

---

## 🔐 Hệ thống phân quyền (RBAC)

### Luồng xác thực và phân quyền

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────┐    ┌───────────────┐    ┌─────────────────────────────────┐   │
│   │  User   │───▶│ Login Page    │───▶│ authProvider.login()            │   │
│   │         │    │ (email/pass)  │    │                                 │   │
│   └─────────┘    └───────────────┘    │ 1. Call /auth/login             │   │
│                                       │ 2. Save access_token            │   │
│                                       │ 3. Call /auth/me                │   │
│                                       │ 4. Fetch employee by userId     │   │
│                                       │ 5. Fetch employee roles         │   │
│                                       │ 6. Fetch role permissions       │   │
│                                       │ 7. Save user + permissions      │   │
│                                       └─────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHORIZATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌────────────────────────┐    ┌──────────────────────┐ │
│   │ User tries  │───▶│ accessControlProvider  │───▶│ Check permission     │ │
│   │ to access   │    │ .can(resource, action) │    │ from localStorage    │ │
│   │ resource    │    └────────────────────────┘    └──────────────────────┘ │
│   └─────────────┘                                           │               │
│                                                             ▼               │
│                                       ┌─────────────────────────────────┐   │
│                                       │ Permission Mapping:             │   │
│                                       │ "reservation.view" → dat-phong  │   │
│                                       │ "reservation.create" → create   │   │
│                                       │ ...                             │   │
│                                       └─────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chuỗi lấy quyền từ API

```
User ──▶ Employee ──▶ EmployeeRole ──▶ Role ──▶ RolePermission ──▶ Permission
```

**API Endpoints sử dụng:**
1. `GET /employees/get-employee-by-user-id/{userId}` - Lấy Employee từ User
2. `GET /employee-roles?employeeId={employeeId}` - Lấy các role của Employee  
3. `GET /roles/{roleId}/permissions` - Lấy permissions của từng Role

---

## 📊 Danh sách Permissions

### Định dạng Permission Slug
```
{module}.{action}
```

### Bảng ánh xạ Permission → Resource

| Permission Slug | Resource (Vietnamese) | Actions |
|-----------------|----------------------|---------|
| **FrontDesk - Reservations** |||
| `reservation.view` | `dat-phong` | list, show |
| `reservation.create` | `dat-phong` | create |
| `reservation.edit` | `dat-phong` | edit |
| `reservation.cancel` | `dat-phong` | delete |
| `reservation.checkin` | `check-in` | list, create |
| `reservation.checkout` | `check-out` | list, create |
| **FrontDesk - Guests** |||
| `guest.view` | `khach-hang` | list, show |
| `guest.edit` | `khach-hang` | create, edit |
| **FrontDesk - Rooms** |||
| `room.view` | `phong` | list, show |
| `room.edit` | `phong` | edit |
| `roomtype.manage` | `loai-phong` | list, create, edit, show, delete |
| **FrontDesk - Payments** |||
| `payment.view` | `thanh-toan` | list, show |
| `payment.process` | `thanh-toan` | create, edit |
| `payment.refund` | `thanh-toan` | delete |
| **FrontDesk - Properties** |||
| `property.view` | `co-so` | list, show |
| `property.edit` | `co-so` | edit |
| **F&B** |||
| `restaurant.view` | `nha-hang` | list, show |
| `restaurant.manage` | `nha-hang` | create, edit, delete |
| `tablebooking.view` | `dat-ban` | list, show |
| `tablebooking.create` | `dat-ban` | create |
| `tablebooking.edit` | `dat-ban` | edit |
| **Housekeeping** |||
| `housekeeping.view` | `phong-buong` | list, show |
| `housekeeping.update` | `phong-buong` | edit |
| **HR** |||
| `employee.view` | `nhan-vien` | list, show |
| `employee.manage` | `nhan-vien` | create, edit, delete |
| `attendance.view` | `diem-danh` | list, show |
| `attendance.manage` | `diem-danh` | create, edit |
| `leave.view` | `nghi-phep` | list, show |
| `leave.approve` | `nghi-phep` | edit |
| `payroll.view` | `luong` | list, show |
| `payroll.process` | `luong` | create, edit |
| **Reports** |||
| `report.revenue` | `bao-cao-doanh-thu` | list, show |
| `report.occupancy` | `bao-cao-lap-day` | list, show |
| `report.guest` | `bao-cao-khach-hang` | list, show |
| `report.staff` | `bao-cao-nhan-vien` | list, show |
| **System** |||
| `user.view` | `nguoi-dung` | list, show |
| `user.create` | `nguoi-dung` | create |
| `user.edit` | `nguoi-dung` | edit |
| `user.delete` | `nguoi-dung` | delete |
| `role.view` | `vai-tro` | list, show |
| `role.manage` | `vai-tro` | create, edit, delete |
| `permission.assign` | `phan-quyen` | edit |

---

## 👥 Các Role mặc định

```typescript
export const ROLES = {
  ADMIN: 'Admin',           // Quản trị toàn bộ hệ thống
  FRONT_DESK: 'Front Desk', // Lễ tân - đặt phòng, check-in/out
  HOUSEKEEPING: 'Housekeeping', // Phòng buồng - dọn dẹp
  HR: 'HR',                 // Nhân sự
  FB: 'F&B',                // Nhà hàng - ẩm thực
};
```

### Gợi ý phân permissions theo Role

| Role | Permissions nên có |
|------|-------------------|
| **Admin** | Tất cả permissions |
| **Front Desk** | `reservation.*`, `guest.*`, `room.view`, `payment.*`, `property.view` |
| **Housekeeping** | `housekeeping.*`, `room.view` |
| **HR** | `employee.*`, `attendance.*`, `leave.*`, `payroll.*`, `report.staff` |
| **F&B** | `restaurant.*`, `tablebooking.*` |

---

## 🎨 Dynamic Dashboard

Dashboard được hiển thị dựa vào role và permissions của user:

```typescript
const getDashboardComponent = () => {
    // Admin → DashboardAdmin
    if (userRoles.includes("Admin")) {
        return <DashboardAdmin />;
    }
    // Front Desk permissions → DashboardFrontDesk
    if (userPermissions.some(p => 
        p.startsWith("reservation.") || p.startsWith("guest.")
    )) {
        return <DashboardFrontDesk />;
    }
    // Default welcome message
    return <div>Chào mừng bạn đến với hệ thống quản lý khách sạn</div>;
};
```

---

## 🔗 Dynamic Resources (Menu)

Menu sidebar được tạo động dựa vào permissions:

```typescript
// src/utils/resources.tsx
export const getResourcesByPermissions = (permissions: string[]): ResourceProps[] => {
    const resources: ResourceProps[] = [];
    const accessibleResources = new Set(getAccessibleResources());

    // Dashboard - luôn hiển thị
    resources.push({
        name: "dashboard",
        list: "/",
        meta: { label: "Tổng quan", icon: <BarChartOutlined /> },
    });

    // Đặt phòng - chỉ hiển thị nếu có permission
    if (accessibleResources.has("dat-phong")) {
        resources.push({
            name: "dat-phong",
            list: "/dat-phong",
            create: permissions.includes("reservation.create") 
                ? "/dat-phong/tao-moi" : undefined,
            edit: permissions.includes("reservation.edit") 
                ? "/dat-phong/chinh-sua/:id" : undefined,
            // ...
        });
    }
    
    // Tương tự cho các resources khác...
    return resources;
};
```

---

## 🛡️ Access Control trong Components

### Sử dụng hook `useCan`

```typescript
import { useCan } from "@refinedev/core";

const MyComponent = () => {
    const { data: canEdit } = useCan({
        resource: "dat-phong",
        action: "edit",
    });

    const { data: canDelete } = useCan({
        resource: "dat-phong",
        action: "delete",
    });

    return (
        <Space>
            {canEdit?.can && (
                <Button onClick={() => edit(...)}>Sửa</Button>
            )}
            {canDelete?.can && (
                <Button danger onClick={() => delete(...)}>Xóa</Button>
            )}
        </Space>
    );
};
```

### Sử dụng helper functions

```typescript
import { checkPermission, hasModuleAccess } from "../accessControlProvider";

// Kiểm tra permission cụ thể
if (checkPermission("dat-phong", "edit")) {
    // Cho phép chỉnh sửa
}

// Kiểm tra có quyền với module
if (hasModuleAccess("report")) {
    // Hiển thị menu báo cáo
}
```

---

## 💾 Lưu trữ dữ liệu Auth

### LocalStorage Keys

| Key | Giá trị |
|-----|---------|
| `refine-auth` | Access token JWT |
| `refine-user` | User object với permissions |

### Cấu trúc User object

```typescript
interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    employee?: Employee;
    roles?: string[];        // Tên các role: ["Admin", "Front Desk"]
    permissions?: string[];  // Permission slugs: ["reservation.view", "guest.edit"]
}
```

---

## 📡 Data Provider

Data Provider kết nối với backend API:

```typescript
// Base URL từ env
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mapping Refine actions → HTTP methods
getList:   GET    /{resource}?page=1&limit=10&filters...
getOne:    GET    /{resource}/{id}
create:    POST   /{resource}
update:    PUT    /{resource}/{id}
deleteOne: DELETE /{resource}/{id}
```

---

## 🚀 Quick Start

### 1. Cấu hình environment

```bash
# .env
VITE_API_URL=http://localhost:3000
```

### 2. Chạy development server

```bash
npm install
npm run dev
```

### 3. Build production

```bash
npm run build
```

---

## 📝 Lưu ý quan trọng

1. **Permissions luôn được cache** trong localStorage sau khi login
2. **Dashboard tự động thay đổi** theo role của user
3. **Menu sidebar ẩn/hiện** dựa trên permissions
4. **Buttons (Create/Edit/Delete)** tự động ẩn nếu không có quyền
5. **Profile & Property** luôn cho phép truy cập với mọi user đã đăng nhập

---

## 🔄 Luồng hoạt động chi tiết

### Login Flow
```
1. User nhập email/password
2. POST /auth/login → nhận access_token
3. GET /auth/me → lấy thông tin user
4. GET /employees/get-employee-by-user-id/{userId} → lấy Employee
5. GET /employee-roles?employeeId={employeeId} → lấy danh sách roles
6. Loop each roleId:
   GET /roles/{roleId}/permissions → lấy permissions
7. Merge all permissions → lưu vào localStorage
8. Redirect to Dashboard
```

### Access Check Flow
```
1. User navigate đến /dat-phong
2. accessControlProvider.can({ resource: "dat-phong", action: "list" })
3. Đọc permissions từ localStorage
4. Kiểm tra "reservation.view" → actions: ["list", "show"]
5. Return { can: true } hoặc { can: false, reason: "..." }
6. Nếu false → hiển thị error hoặc redirect
```
