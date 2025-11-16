# 🔧 Danh Sách Cải Thiện Cần Thiết Cho Dự Án Restaurant-Hotel ERP

**Ngày đánh giá:** 14 Tháng 11, 2025  
**Branch:** dev  
**Tổng số vấn đề:** 28  

---

## 📌 MỤC LỤC

1. [Critical Issues (Ưu tiên cao nhất)](#critical-issues)
2. [High Priority (Hiệu năng & Bảo mật)](#high-priority)
3. [Medium Priority (Chất lượng code)](#medium-priority)
4. [Low Priority (DevOps & Tooling)](#low-priority)
5. [Roadmap Triển Khai](#roadmap)

---

## 🔴 CRITICAL ISSUES (Ưu tiên cao nhất) {#critical-issues}

### ❌ Issue #1: API Endpoint Mismatch - Frontend Auth Fails
**Mức độ:** CRITICAL  
**Ảnh hưởng:** Frontend authentication 100% fail với 404 errors

**Chi tiết:**
- **Backend:** `main.ts` line 24 đặt global prefix `/api`
  ```typescript
  app.setGlobalPrefix('api');
  ```
  → Tất cả routes tại `http://localhost:4000/api/*`

- **Frontend:** `src/lib/auth.ts` line 29, 53, 77 gọi:
  ```typescript
  const API_BASE = 'http://localhost:4000'
  fetch(`${API_BASE}/auth/login`) // → http://localhost:4000/auth/login (404!)
  ```

**Cách fix:**
```typescript
// Option 1: Fix frontend
const API_BASE = 'http://localhost:4000/api'

// Option 2: Add env variable
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'
```

**Files cần sửa:**
- `frontend/src/lib/auth.ts`
- Tạo `frontend/.env.example` với `NEXT_PUBLIC_API_BASE`

---

### ❌ Issue #2: localStorage SSR Crash
**Mức độ:** CRITICAL  
**Ảnh hưởng:** Admin app crash khi SSR/Edge rendering

**Chi tiết:**
Admin sử dụng `localStorage` trực tiếp trong code có thể chạy server-side:
- `admin/src/providers/data-provider/dataProvider.ts` line 9
- `admin/src/providers/auth-provider/authProvider.ts` (6 lần)
- `admin/src/components/header/index.tsx` (5 lần)

**Error khi deploy:**
```
ReferenceError: localStorage is not defined
```

**Cách fix:**
```typescript
// Thêm runtime guard
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Hoặc wrap trong useEffect/client component
httpClient.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

**Files cần sửa:**
- `admin/src/providers/data-provider/dataProvider.ts`
- `admin/src/providers/auth-provider/authProvider.ts`
- `admin/src/components/header/index.tsx`

**Alternative:** Chuyển sang cookies với `httpOnly` flag (secure hơn)

---

### ❌ Issue #3: Hardcoded JWT Secret Fallback
**Mức độ:** CRITICAL  
**Ảnh hưởng:** Security breach nếu production không set JWT_SECRET

**Chi tiết:**
```typescript
// backend/src/auth/auth.module.ts line 18
secret: configService.get<string>('JWT_SECRET') || 'fallback-secret-key-for-development'

// backend/src/auth/strategies/jwt.strategy.ts line 16
secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key-for-development'
```

Nếu deploy mà quên set `JWT_SECRET`, app sẽ dùng secret dễ đoán → attacker có thể forge tokens.

**Cách fix:**
```typescript
// Option 1: Throw error nếu không có secret
const jwtSecret = configService.get<string>('JWT_SECRET');
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required in environment variables');
}

// Option 2: Validate trong ConfigModule
import * as Joi from 'joi';

ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('24h'),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    // ... other env vars
  }),
})
```

**Files cần sửa:**
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/strategies/jwt.strategy.ts`
- Tạo `backend/.env.example`
- Thêm env validation vào `backend/src/app.module.ts`

---

## 🟠 HIGH PRIORITY (Hiệu năng & Bảo mật) {#high-priority}

### ⚠️ Issue #4: No Caching Layer
**Mức độ:** HIGH  
**Ảnh hưởng:** Mọi request hit database, slow response times, high DB load

**Chi tiết:**
- Dependencies đã cài: `ioredis: ^5.7.0`, `@nestjs/cache-manager: ^3.0.1`
- Grep search: **0 usage** trong toàn bộ `backend/src/`
- `infra/compose.yaml`: Redis service bị comment out

**Cách fix:**
```typescript
// 1. Uncomment Redis trong compose.yaml
redis:
  image: redis:7
  ports: ["6379:6379"]
  networks: [devnet]

// 2. Configure CacheModule trong app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          ttl: 60 * 5, // 5 minutes default
        }),
      }),
    }),
    // ... other modules
  ],
})

// 3. Use caching trong services
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class PropertiesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cacheKey = 'properties:all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const properties = await this.propertyRepository.find();
    await this.cacheManager.set(cacheKey, properties, 300); // 5 min TTL
    return properties;
  }
}
```

**Files cần sửa:**
- `backend/src/app.module.ts`
- `infra/compose.yaml`
- Services: `properties`, `room-types`, `rate-plans` (data ít thay đổi)

**Impact khi fix:** Response time giảm 50-90% cho cached requests

---

### ⚠️ Issue #5: No Rate Limiting
**Mức độ:** HIGH  
**Ảnh hưởng:** Vulnerable to DoS/brute-force attacks

**Chi tiết:**
- Không có `@nestjs/throttler` package
- Auth endpoints (`/api/auth/login`) không có protection
- Attacker có thể spam requests unlimited

**Cách fix:**
```bash
# 1. Install package
npm install --save @nestjs/throttler
```

```typescript
// 2. Configure trong app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10,  // 10 requests per minute
    }]),
    // ... other modules
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply globally
    },
  ],
})

// 3. Override cho auth endpoints (stricter)
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  async login() { ... }
}
```

**Files cần sửa:**
- `backend/package.json` (add dependency)
- `backend/src/app.module.ts`
- `backend/src/auth/auth.controller.ts`

---

### ⚠️ Issue #6: N+1 Query Problems
**Mức độ:** HIGH  
**Ảnh hưởng:** Slow queries, memory spikes với large datasets

**Chi tiết:**
Multiple services load unnecessary relations:
```typescript
// backend/src/reservations/reservations.service.ts line 75
const reservation = await this.reservationRepository.findOne({
  where: { id },
  relations: ['property', 'guest', 'roomType', 'assignedRoom', 'ratePlan', 'payments'],
});
```
Mỗi relation là 1 JOIN → 6 JOINs mỗi query!

**Cách fix:**
```typescript
// Option 1: Chỉ load relations khi cần
async findOne(id: string, includeRelations = false) {
  const options: FindOneOptions<Reservation> = { where: { id } };
  
  if (includeRelations) {
    options.relations = ['property', 'guest', 'roomType'];
  }
  
  return await this.reservationRepository.findOne(options);
}

// Option 2: Use query builder với select fields cụ thể
const reservation = await this.reservationRepository
  .createQueryBuilder('res')
  .leftJoinAndSelect('res.guest', 'guest')
  .select([
    'res.id', 'res.checkIn', 'res.checkOut',
    'guest.id', 'guest.name', 'guest.email' // Chỉ lấy fields cần
  ])
  .where('res.id = :id', { id })
  .getOne();

// Option 3: Implement DTOs với projections
class ReservationSummaryDto {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  // Không load full guest object
}
```

**Files cần sửa:**
- `backend/src/reservations/reservations.service.ts`
- `backend/src/working-shifts/working-shifts.service.ts`
- `backend/src/tax-rules/tax-rules.service.ts`
- Tất cả services có `leftJoinAndSelect`

---

### ⚠️ Issue #7: Missing Critical Database Indexes
**Mức độ:** HIGH  
**Ảnh hưởng:** Full table scans, query time tăng exponential

**Chi tiết:**
Toàn bộ schema chỉ có **6 indexes** (trong 381 lines SQL). Thiếu indexes cho:
- `auth.users.email` (dùng trong mọi login query)
- `reservation.reservations.guest_id`
- `inventory.rooms.room_type_id`
- Foreign keys không được index

**Cách fix:**
```sql
-- Thêm vào backend/db/add_indexes.sql
-- Auth indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth.users(created_at);

-- Guest indexes
CREATE INDEX IF NOT EXISTS idx_guests_email ON core.guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON core.guests(phone);

-- Reservation indexes
CREATE INDEX IF NOT EXISTS idx_reservations_guest_id ON reservation.reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservation.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_confirmation_code ON reservation.reservations(confirmation_code);

-- Room indexes
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON inventory.rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_property_id_status ON inventory.rooms(property_id, operational_status);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_guest_id ON reservation.payments(guest_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON reservation.payments(payment_status);

-- Employee indexes
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON core.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON core.employees(status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reservations_property_status_dates 
  ON reservation.reservations(property_id, status, check_in, check_out);

CREATE INDEX IF NOT EXISTS idx_rooms_property_type_status 
  ON inventory.rooms(property_id, room_type_id, operational_status);
```

**Files cần tạo:**
- `backend/db/add_indexes.sql`

**Chạy migration:**
```bash
psql -U hotel_user_v2 -d hotel_pms_v2 -f backend/db/add_indexes.sql
```

**Impact:** Query time giảm 10-100x cho filtered queries

---

### ⚠️ Issue #8: Image Optimization Disabled
**Mức độ:** HIGH  
**Ảnh hưởng:** Slow page loads, wasted bandwidth (mất 60-80% savings)

**Chi tiết:**
```typescript
// frontend/next.config.ts
const nextConfig = {
  images: {
    unoptimized: true, // ❌ Disables optimization
  },
}
```

Grep search: 20+ `<img>` tags, **0** usage của `next/image`.

**Cách fix:**
```typescript
// 1. Enable optimization trong next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains, hoặc specify domains
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: false, // ⬅️ Cũng fix luôn issue #15
  },
  typescript: {
    ignoreBuildErrors: false, // ⬅️ Cũng fix luôn issue #15
  },
}

// 2. Replace <img> tags với next/image
// Before:
<img
  src="/luxury-hotel-room.jpg"
  alt="Hotel Room"
  className="w-full h-full object-cover"
/>

// After:
import Image from 'next/image'

<Image
  src="/luxury-hotel-room.jpg"
  alt="Hotel Room"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Files cần sửa:**
- `frontend/next.config.ts`
- `frontend/src/app/page.tsx` (18 img tags)
- `frontend/src/app/search/page.tsx`
- `frontend/src/app/property/[id]/page.tsx`
- `frontend/src/app/restaurant/[id]/page.tsx`

---

### ⚠️ Issue #9: Unused Prisma ORM (Wasted Build Time)
**Mức độ:** HIGH  
**Ảnh hưởng:** ~5-10s thêm vào mỗi build, +10MB disk

**Chi tiết:**
- `backend/package.json`: `@prisma/client: ^6.13.0`, `prisma: ^6.13.0`
- `backend/prisma/schema.prisma`: Exists nhưng **empty** (no models)
- Backend code: **0 imports** của PrismaClient
- CI pipeline: `npx prisma generate` vẫn chạy mỗi build

**Cách fix:**
```bash
# Option 1: Remove Prisma hoàn toàn
cd backend
npm uninstall @prisma/client prisma
rm -rf prisma/
rm -rf generated/prisma/

# Update CI workflow
# .github/workflows/ci.yml - remove line:
# - run: npx prisma generate

# Option 2: Commit vào Prisma và migrate từ TypeORM (big effort)
# Not recommended ngay bây giờ
```

**Files cần sửa:**
- `backend/package.json`
- `.github/workflows/ci.yml` (line 14: remove prisma generate)
- Delete `backend/prisma/` folder
- Update `.gitignore` (remove `/generated/prisma`)

---

## 🟡 MEDIUM PRIORITY (Chất lượng code) {#medium-priority}

### ⚠️ Issue #10: No API Documentation
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Frontend/Admin phải đoán API contracts

**Cách fix:**
```bash
# 1. Install Swagger
npm install --save @nestjs/swagger
```

```typescript
// 2. Configure trong main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Restaurant-Hotel ERP API')
    .setDescription('API documentation for PMS/Restaurant/HR system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // ... rest of bootstrap
}

// 3. Annotate controllers
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('reservations')
@ApiTags('reservations')
export class ReservationsController {
  @Get()
  @ApiOperation({ summary: 'Get all reservations with pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated reservations' })
  async findAll() { ... }
}

// 4. Annotate DTOs
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-here', description: 'Property ID' })
  @IsUUID()
  propertyId: string;
}
```

**Access docs:** `http://localhost:4000/api/docs`

---

### ⚠️ Issue #11: Inconsistent Error Handling
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Khó debug production issues

**Chi tiết:**
- `auth.service.ts`: Có try-catch + structured logging ✅
- `rooms.service.ts`, `guests.service.ts`: Không có error handling ❌

**Cách fix:**
```typescript
// Create base service class
export abstract class BaseService {
  protected abstract logger: Logger;

  protected async executeWithErrorHandling<T>(
    operation: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.logger.error(`${operation} failed`, error.stack);
      throw error;
    }
  }
}

// Use trong services
@Injectable()
export class RoomsService extends BaseService {
  protected logger = new Logger(RoomsService.name);

  async findOne(id: string) {
    return this.executeWithErrorHandling(
      `Find room ${id}`,
      async () => {
        const room = await this.roomRepository.findOne({ where: { id } });
        if (!room) {
          throw new NotFoundException(`Room ${id} not found`);
        }
        return room;
      }
    );
  }
}
```

**Status (15 Nov 2025):** ✅ `.env.example` committed for backend, frontend, and admin (with RabbitMQ defaults added for backend) to guide local setup.

---

### ⚠️ Issue #12: No Request Logging/Monitoring
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Khó debug distributed issues

**Cách fix:**
```typescript
// Create request logging middleware
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    req['requestId'] = requestId;
    
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      
      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`
      );
    });
    
    next();
  }
}

// Register trong app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
```

---

### ⚠️ Issue #13: No Pagination Guards
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Memory exhaustion attacks

**Cách fix:**
```typescript
// Create pagination pipe
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
    const limit = parseInt(value.limit) || 10;
    const page = parseInt(value.page) || 1;
    
    // Guards
    if (limit > 100) {
      throw new BadRequestException('Limit cannot exceed 100');
    }
    if (limit < 1) {
      throw new BadRequestException('Limit must be at least 1');
    }
    if (page < 1) {
      throw new BadRequestException('Page must be at least 1');
    }
    
    return { limit, page, skip: (page - 1) * limit };
  }
}

// Use trong controller
@Get()
async findAll(@Query(PaginationPipe) pagination: PaginationDto) {
  return this.service.findAll(pagination);
}
```

---

### ⚠️ Issue #14: No API Versioning
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Breaking changes sẽ break clients

**Cách fix:**
```typescript
// main.ts
app.setGlobalPrefix('api/v1'); // Instead of just 'api'

// Or use built-in versioning
import { VersioningType } from '@nestjs/common';

app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});

// Then trong controllers
@Controller({ path: 'reservations', version: '1' })
export class ReservationsController { ... }

// Routes sẽ là: /v1/reservations
```

---

### ⚠️ Issue #15: TypeScript/ESLint Disabled
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Type errors bypass vào production

**Đã cover trong Issue #8** - Cùng fix trong `next.config.ts`

---

### ⚠️ Issue #16: No Shared Types
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Type drift giữa frontend/backend

**Cách fix:**
```bash
# Create shared package
mkdir -p packages/shared-types

# Setup package.json
cat > packages/shared-types/package.json << 'EOF'
{
  "name": "@erp/shared-types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  }
}
EOF

# Create tsconfig
cat > packages/shared-types/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist"
  }
}
EOF

# Export types
cat > packages/shared-types/src/index.ts << 'EOF'
export interface Reservation {
  id: string;
  propertyId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out';
}

export interface CreateReservationDto {
  propertyId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
}
// ... more types
EOF
```

**Alternative:** Generate types từ Swagger spec bằng `openapi-typescript`

---

### ⚠️ Issue #17: Empty Placeholder Files
**Mức độ:** MEDIUM  
**Ảnh hưởng:** Code clutter, confusion

**Cách fix:**
```bash
# Option 1: Delete nếu không dùng
rm backend/src/infra.messaging.ts

# Option 2: Add TODO comment
cat > backend/src/infra.messaging.ts << 'EOF'
/**
 * RabbitMQ Messaging Infrastructure
 * 
 * TODO: Implement messaging layer for:
 * - Reservation confirmations
 * - Email notifications
 * - Async job processing
 * 
 * Dependencies already installed:
 * - amqplib: ^0.10.8
 * 
 * Related: Issue #24 (RabbitMQ integration)
 */

// Implementation pending
export {};
EOF
```

---

## 🟢 LOW PRIORITY (DevOps & Tooling) {#low-priority}

### ℹ️ Issue #18: No Workspace Management
**Mức độ:** LOW  
**Ảnh hưởng:** Duplicate deps, slow installs

**Cách fix:**
```bash
# Option 1: pnpm workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'admin'
  - 'frontend'
  - 'backend'
  - 'packages/*'
EOF

cat > package.json << 'EOF'
{
  "name": "restaurant-hotel-erp",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "test": "pnpm -r run test"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "prettier": "^3.4.2"
  }
}
EOF

# Option 2: Turborepo (recommended for monorepo)
npx create-turbo@latest --example basic
```

**Status (15 Nov 2025):** ✅ Implemented root-level `pnpm-workspace.yaml` and shared `package.json` scripts so all apps install/build from a single command.

---

### ℹ️ Issue #19: Incomplete CI Pipeline
**Mức độ:** LOW  
**Ảnh hưởng:** Admin có thể break mà CI không phát hiện

**Cách fix:**
```yaml
# .github/workflows/ci.yml - Add admin job
  admin:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: admin
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: admin/package-lock.json
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm run build --if-present

  # Add integration tests
  e2e:
    runs-on: ubuntu-latest
    needs: [backend, frontend, admin]
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Run E2E tests
        run: |
          # Setup and run e2e tests here
```

---

### ℹ️ Issue #20: No Environment Templates
**Cách fix:**
```bash
# backend/.env.example
cat > backend/.env.example << 'EOF'
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=hotel_user_v2
DB_PASSWORD=your_secure_password
DB_NAME=hotel_pms_v2

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=24h

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ (optional)
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=myuser
RABBITMQ_PASS=mypass

# CORS
FRONTEND_URL=http://localhost:3001
ADMIN_URL=http://localhost:3000

# Server
PORT=4000
NODE_ENV=development
EOF

# frontend/.env.example
cat > frontend/.env.example << 'EOF'
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3001
EOF

# admin/.env.example  
cat > admin/.env.example << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
EOF
```

---

### ℹ️ Issue #21-28: (Các issues còn lại)

**Issue #21:** Health Checks - Thêm DB/Redis connection checks  
**Issue #22:** Database Migrations - Setup TypeORM migrations hoặc Prisma  
**Issue #23:** Incomplete Docker - Fix Dockerfiles  
**Issue #24:** Redis/RabbitMQ Integration - Uncomment services, wire vào app  
> ✅ 15/11/2025: RabbitMQ messaging module implemented with resilient connection handling, wired into `AppModule`, surfaced in health checks, and emitting reservation events.

**Issue #25:** Minimal Test Coverage - Add unit + integration tests  
> ✅ 15/11/2025: Added health endpoint e2e tests (Supertest + Nest) and wired them into `npm run test:e2e` for CI coverage.
**Issue #26:** Documentation Placeholder - Update READMEs  
**Issue #27:** No Security Headers - Add helmet + CSRF  
**Issue #28:** CORS Hardcoded - Move to env variables  

*(Chi tiết đầy đủ cho từng issue có thể thêm khi cần)*

---

## 🎯 ROADMAP TRIỂN KHAI {#roadmap}

### **Phase 1: Make it Work (Week 1) - CRITICAL FIXES**
**Mục tiêu:** Ứng dụng hoạt động đúng trong production

- [ ] **Day 1-2:** Fix API endpoint mismatch (#1)
  - Update frontend API_BASE URL
  - Add .env.example files
  - Test auth flow end-to-end

- [ ] **Day 3-4:** Fix localStorage SSR issues (#2)
  - Add runtime guards cho tất cả localStorage calls
  - Test admin SSR/build production

- [ ] **Day 5-7:** Remove hardcoded JWT secret (#3)
  - Add env validation với Joi
  - Update deployment docs
  - Test với missing env vars

**Success Criteria:**
- ✅ Frontend auth works
- ✅ Admin builds without SSR errors
- ✅ App refuses to start without JWT_SECRET

---

### **Phase 2: Make it Secure (Week 2) - SECURITY FIXES**
**Mục tiêu:** Bảo vệ khỏi common attacks

- [ ] **Day 1-2:** Add rate limiting (#5)
  - Install @nestjs/throttler
  - Configure global + auth-specific limits
  - Test với load testing tool

- [ ] **Day 3-4:** Add security headers (#27)
  - Install helmet
  - Configure CORS từ env vars (#28)
  - Add CSRF protection

- [ ] **Day 5-7:** Audit & fix security issues
  - Run npm audit fix
  - Review all env variable usage
  - Add security tests

**Success Criteria:**
- ✅ Rate limiting blocks spam requests
- ✅ Security headers pass OWASP checks
- ✅ No hardcoded secrets trong code

---

### **Phase 3: Make it Fast (Week 3) - PERFORMANCE FIXES**
**Mục tiêu:** Cải thiện response times 50-90%

- [ ] **Day 1-3:** Add Redis caching (#4)
  - Setup Redis trong docker-compose
  - Implement caching cho read-heavy endpoints
  - Monitor cache hit rates

- [ ] **Day 4-5:** Add database indexes (#7)
  - Run add_indexes.sql script
  - Analyze slow queries với EXPLAIN
  - Measure query time improvements

- [ ] **Day 6-7:** Fix N+1 queries (#6) + Image optimization (#8)
  - Refactor services với selective loading
  - Replace <img> với next/image
  - Run Lighthouse audits

**Success Criteria:**
- ✅ Cache hit rate > 60%
- ✅ Query times < 100ms for indexed lookups
- ✅ Page load times < 2s

---

### **Phase 4: Make it Maintainable (Week 4) - CODE QUALITY**
**Mục tiêu:** Developer experience và long-term maintenance

- [ ] **Day 1-2:** Setup workspace (#18)
  - Configure pnpm workspace hoặc Turborepo
  - Centralize dependencies
  - Add root-level scripts

- [ ] **Day 3-4:** Add API docs (#10) + Shared types (#16)
  - Setup Swagger
  - Create shared-types package
  - Document all endpoints

- [ ] **Day 5-7:** Complete CI/CD (#19) + Tests (#25)
  - Add admin to CI pipeline
  - Add E2E test suite
  - Setup test coverage reports

**Success Criteria:**
- ✅ Single `pnpm install` setup từ root
- ✅ API docs accessible tại /api/docs
- ✅ CI passes với >70% coverage

---

## 📊 PROGRESS TRACKING

```
[█░░░░░░░░░] 10% - Documentation created
[░░░░░░░░░░]  0% - Fixes implemented

Critical Issues:  0/3 fixed
High Priority:    0/6 fixed
Medium Priority:  0/11 fixed
Low Priority:     0/8 fixed

Total Progress:   0/28 (0%)
```

---

## 📝 NOTES

### Ước tính thời gian
- **Critical fixes:** 1 week (full-time)
- **High priority:** 1 week (full-time)
- **Medium priority:** 1 week (full-time)
- **Low priority:** 1 week (part-time)

**Total:** ~3.5 weeks full-time effort

### Rủi ro
- Breaking changes có thể ảnh hưởng existing features
- Database migrations cần test kỹ trước production
- CI/CD changes có thể block deploys tạm thời

### Khuyến nghị
1. **Setup staging environment** trước khi fix
2. **Fix theo thứ tự priority** (Critical → High → Medium → Low)
3. **Test thoroughly** sau mỗi fix
4. **Update docs** đồng thời với code changes
5. **Code review** tất cả security-related fixes

---

**Last Updated:** November 14, 2025  
**Next Review:** After Phase 1 completion  
