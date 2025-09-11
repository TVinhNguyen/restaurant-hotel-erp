# Backend API Endpoints - Hotel PMS System

## 📋 **CURRENT ENDPOINTS** (Implemented)

### **Authentication Endpoints**
```
POST   /auth/register     - User registration
POST   /auth/login        - User login
POST   /auth/logout       - User logout
POST   /auth/refresh      - Refresh JWT token
GET    /auth/me           - Get current user profile
```

### **Health Check**
```
GET    /health            - Health check endpoint
GET    /                  - Root endpoint
```

---

## 🎯 **PROPOSED ENDPOINTS** (Based on Database Schema)

### **1. Properties Management**
```
GET    /properties              - List all properties
GET    /properties/:id          - Get property by ID
POST   /properties              - Create new property
PUT    /properties/:id          - Update property
DELETE /properties/:id          - Delete property
```

### **2. Room Management**
```
GET    /rooms                   - List rooms (with filters)
GET    /rooms/:id               - Get room details
POST   /rooms                   - Create new room
PUT    /rooms/:id               - Update room
DELETE /rooms/:id               - Delete room
GET    /rooms/available         - Get available rooms
PUT    /rooms/:id/status        - Update room status
```

### **3. Room Types Management**
```
GET    /room-types              - List room types
GET    /room-types/:id          - Get room type details
POST   /room-types              - Create room type
PUT    /room-types/:id          - Update room type
DELETE /room-types/:id          - Delete room type
```

### **4. Reservations Management**
```
GET    /reservations            - List reservations (with filters)
GET    /reservations/:id        - Get reservation details
POST   /reservations            - Create new reservation
PUT    /reservations/:id        - Update reservation
DELETE /reservations/:id        - Cancel reservation
POST   /reservations/:id/checkin  - Check-in guest
POST   /reservations/:id/checkout - Check-out guest
PUT    /reservations/:id/room   - Assign room to reservation
```

### **5. Rate & Availability Management**
```
GET    /rate-plans              - List rate plans
GET    /rate-plans/:id          - Get rate plan details
POST   /rate-plans              - Create rate plan
PUT    /rate-plans/:id          - Update rate plan
DELETE /rate-plans/:id          - Delete rate plan

GET    /daily-rates             - List daily rates
POST   /daily-rates             - Set daily rates
PUT    /daily-rates/:id         - Update daily rate
```

### **6. Guest Management**
```
GET    /guests                  - List guests
GET    /guests/:id              - Get guest details
POST   /guests                  - Create guest profile
PUT    /guests/:id              - Update guest
DELETE /guests/:id              - Delete guest
```

### **7. Payment Management**
```
GET    /payments                - List payments
GET    /payments/:id            - Get payment details
POST   /payments                - Create payment
PUT    /payments/:id            - Update payment status
POST   /payments/:id/refund     - Process refund
```

### **8. Services Management**
```
GET    /services                - List available services
GET    /services/:id            - Get service details
POST   /services                - Create service
PUT    /services/:id            - Update service

GET    /reservation-services    - List reservation services
POST   /reservation-services    - Add service to reservation
PUT    /reservation-services/:id - Update reservation service
```

### **9. Employee Management (HR)**
```
GET    /employees               - List employees
GET    /employees/:id           - Get employee details
POST   /employees               - Create employee
PUT    /employees/:id           - Update employee
DELETE /employees/:id           - Delete employee

GET    /working-shifts          - List working shifts
POST   /working-shifts          - Create working shift
PUT    /working-shifts/:id      - Update working shift

GET    /attendance              - List attendance records
POST   /attendance              - Record attendance
PUT    /attendance/:id          - Update attendance

GET    /leaves                  - List leave requests
POST   /leaves                  - Create leave request
PUT    /leaves/:id              - Approve/Reject leave

GET    /payrolls                - List payroll records
POST   /payrolls                - Create payroll
PUT    /payrolls/:id            - Update payroll
```

### **10. Restaurant Management**
```
GET    /restaurants             - List restaurants
GET    /restaurants/:id         - Get restaurant details
POST   /restaurants             - Create restaurant
PUT    /restaurants/:id         - Update restaurant

GET    /tables                  - List tables
GET    /tables/:id              - Get table details
POST   /tables                  - Create table
PUT    /tables/:id              - Update table status

GET    /table-bookings          - List table bookings
GET    /table-bookings/:id      - Get booking details
POST   /table-bookings          - Create table booking
PUT    /table-bookings/:id      - Update booking status
```

### **11. Promotions & Taxes**
```
GET    /promotions              - List promotions
GET    /promotions/:id          - Get promotion details
POST   /promotions              - Create promotion
PUT    /promotions/:id          - Update promotion
DELETE /promotions/:id          - Delete promotion

GET    /tax-rules               - List tax rules
GET    /tax-rules/:id           - Get tax rule details
POST   /tax-rules               - Create tax rule
PUT    /tax-rules/:id           - Update tax rule
DELETE /tax-rules/:id           - Delete tax rule
```

---

## 🔧 **TECHNICAL SPECIFICATIONS**

### **Authentication**
- JWT Bearer Token required for protected endpoints
- Role-based access control (RBAC)
- Refresh token mechanism

### **Response Format**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "pagination": { ... } // for list endpoints
}
```

### **Error Format**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### **Common Query Parameters**
- `page`, `limit` - Pagination
- `sort`, `order` - Sorting
- `search` - Text search
- `filters` - Advanced filtering
- `include` - Related data inclusion

---

## 📊 **DATABASE SCHEMAS**

Based on `pms_init.sql`:
- **6 main schemas**: auth, core, inventory, reservation, restaurant, hr
- **25+ tables** with proper relationships
- **UUID primary keys** throughout
- **Proper foreign key constraints**
- **Indexes** for performance optimization

---

## 🚀 **IMPLEMENTATION STATUS**

✅ **Implemented:**
- Authentication system
- Basic NestJS setup
- Database schema
- Health check endpoint

⏳ **To be implemented:**
- All CRUD operations for entities
- Business logic validation
- File upload handling
- Real-time notifications
- API documentation (Swagger)
- Rate limiting & security
- Caching layer
- Background jobs

---

## 🛠 **TECHNOLOGY STACK**

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Caching**: Redis (planned)
- **Message Queue**: RabbitMQ (planned)